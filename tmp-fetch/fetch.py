# TEMPORARY (branch claude/challenge-fetch-tmp, deleted when the close-up
# challenge PR is final). Runs in GitHub Actions because the authoring
# container cannot reach Wikimedia or the source sites.
#
# 1. Downloads the full-resolution Commons originals listed in config.json
#    into originals/ (cached between runs, never committed).
# 2. Writes measuring copies (long side 3000 px) to tmp-fetch/out/measure/.
# 3. Cuts crops from config["crops"] (normalized x, y, w, h on the original)
#    to their "dest" path at <= 1200 px on the long side, no upscaling, JPEG,
#    under ~400 KB; plus inspection crops (config["inspect"]) at up to 2400 px.
# 4. Fetches the source pages in config["sources"], extracts text, and
#    commits them only as an archive encrypted to tmp-fetch/recipient.pem.

import hashlib
import io
import json
import os
import re
import subprocess
import sys
import tarfile
import time
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None

ROOT = os.getcwd()
HERE = os.path.join(ROOT, "tmp-fetch")
OUT = os.path.join(HERE, "out")
ORIG = os.path.join(ROOT, "originals")
cfg = json.load(open(os.path.join(HERE, "config.json"), encoding="utf8"))

UA = "LouvreBeforeYouGo-ChallengeFetch/1.0 (https://github.com/LeslyLou0457/louvre-before-you-go; GitHub Actions)"
BROWSER_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


def get(url, ua=UA, tries=3, timeout=120):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": ua, "Accept-Language": "en,fr;q=0.8"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read(), r.geturl()
        except urllib.error.HTTPError as e:
            last = e
            if e.code in (403, 404, 410):
                return e.code, "", e.read() if hasattr(e, "read") else b"", url
        except Exception as e:  # noqa: BLE001
            last = e
        time.sleep(5 * (i + 1))
    return 0, "", str(last).encode(), url


def commons_info(title):
    params = {
        "action": "query", "format": "json", "formatversion": "2", "titles": title, "redirects": "1",
        "prop": "imageinfo", "iiprop": "url|size|mime|sha1|extmetadata",
        "iiextmetadatafilter": "Artist|LicenseShortName|Credit|DateTimeOriginal",
    }
    status, _, body, _ = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params))
    page = json.loads(body)["query"]["pages"][0]
    ii = page["imageinfo"][0]
    m = ii.get("extmetadata", {})
    strip = lambda s: re.sub(r"\s+", " ", re.sub(r"<[^>]*>", " ", s or "")).strip()
    return {
        "title": page["title"], "width": ii["width"], "height": ii["height"], "bytes": ii["size"],
        "mime": ii["mime"], "sha1": ii["sha1"], "url": ii["url"], "page": ii["descriptionurl"],
        "author": strip(m.get("Artist", {}).get("value")), "licence": strip(m.get("LicenseShortName", {}).get("value")),
        "credit": strip(m.get("Credit", {}).get("value")), "date": strip(m.get("DateTimeOriginal", {}).get("value")),
    }


def save_jpeg(img, dest, icc, max_bytes=400_000, start_q=88):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    q = start_q
    while True:
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=q, optimize=True, progressive=True, icc_profile=icc)
        if buf.tell() <= max_bytes or q <= 70:
            break
        q -= 3
    with open(dest, "wb") as f:
        f.write(buf.getvalue())
    return q, buf.tell()


def resized(img, long_side):
    w, h = img.size
    s = min(1.0, long_side / max(w, h))
    if s >= 1.0:
        return img
    return img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)


def images():
    os.makedirs(ORIG, exist_ok=True)
    info = {}
    opened = {}
    for item in cfg["images"]:
        meta = commons_info(item["file"])
        path = os.path.join(ORIG, item["id"] + os.path.splitext(meta["url"])[1].lower())
        ok = os.path.exists(path) and hashlib.sha1(open(path, "rb").read()).hexdigest() == meta["sha1"]
        if not ok:
            status, _, body, _ = get(meta["url"])
            if status != 200:
                raise SystemExit(f"download failed {item['id']}: {status}")
            open(path, "wb").write(body)
        img = Image.open(path)
        icc = img.info.get("icc_profile")
        exif_orientation = img.getexif().get(0x0112)
        img = ImageOps.exif_transpose(img).convert("RGB")
        meta["exifOrientation"] = exif_orientation
        meta["orientedSize"] = list(img.size)
        meta["hasIcc"] = bool(icc)
        info[item["id"]] = meta
        opened[item["id"]] = (img, icc)
        if cfg.get("measure", True):
            m = resized(img, 3000)
            save_jpeg(m, os.path.join(OUT, "measure", item["id"] + ".jpg"), icc, max_bytes=3_000_000, start_q=85)
        print(item["id"], meta["width"], meta["height"], meta["licence"], meta["author"], flush=True)

    report = []
    for c in cfg.get("crops", []) + cfg.get("inspect", []):
        img, icc = opened[c["image"]]
        W, H = img.size
        x0, y0 = round(c["x"] * W), round(c["y"] * H)
        x1, y1 = round((c["x"] + c["w"]) * W), round((c["y"] + c["h"]) * H)
        crop = img.crop((max(0, x0), max(0, y0), min(W, x1), min(H, y1)))
        long_side = c.get("long", 1200)
        out = resized(crop, long_side)
        q, size = save_jpeg(out, os.path.join(ROOT, c["dest"]), icc, max_bytes=c.get("maxBytes", 400_000))
        report.append({"dest": c["dest"], "srcPx": [x0, y0, x1 - x0, y1 - y0], "outPx": list(out.size), "quality": q, "bytes": size})
    json.dump({"images": info, "crops": report}, open(os.path.join(OUT, "info.json"), "w"), indent=1, ensure_ascii=False)


def html_text(raw):
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(raw, "html.parser")
    for t in soup(["script", "style", "noscript"]):
        t.decompose()
    text = soup.get_text("\n")
    return re.sub(r"\n\s*\n+", "\n\n", text)


def pdf_text(raw, name):
    p = f"/tmp/{name}.pdf"
    open(p, "wb").write(raw)
    r = subprocess.run(["pdftotext", "-layout", p, "-"], capture_output=True)
    if r.returncode == 0 and r.stdout.strip():
        return r.stdout.decode("utf8", "replace")
    from pdfminer.high_level import extract_text

    return extract_text(p)


def sources():
    d = "/tmp/sources"
    os.makedirs(d, exist_ok=True)
    status_list = []
    for s in cfg.get("sources", []):
        status, ctype, body, final = get(s["url"], ua=BROWSER_UA, tries=2, timeout=25)
        name = s["name"]
        entry = {"name": name, "url": s["url"], "final": final, "status": status, "type": ctype, "bytes": len(body)}
        try:
            if status == 200:
                open(os.path.join(d, name + (".pdf" if "pdf" in ctype else ".raw")), "wb").write(body)
                if "pdf" in ctype or body[:4] == b"%PDF":
                    text = pdf_text(body, name)
                elif "json" in ctype:
                    text = json.dumps(json.loads(body), indent=1, ensure_ascii=False)
                else:
                    text = html_text(body.decode("utf8", "replace"))
                open(os.path.join(d, name + ".txt"), "w", encoding="utf8").write(text)
                entry["textChars"] = len(text)
        except Exception as e:  # noqa: BLE001
            entry["error"] = str(e)
        status_list.append(entry)
        print(json.dumps(entry), flush=True)
        time.sleep(1)
    tgz = "/tmp/sources.tgz"
    with tarfile.open(tgz, "w:gz") as t:
        t.add(d, arcname="sources")
    os.makedirs(OUT, exist_ok=True)
    subprocess.run(
        ["openssl", "cms", "-encrypt", "-binary", "-aes256", "-in", tgz, "-outform", "DER",
         "-out", os.path.join(OUT, "sources.cms"), os.path.join(HERE, "recipient.pem")],
        check=True,
    )
    json.dump(status_list, open(os.path.join(OUT, "sources-status.json"), "w"), indent=1)


if __name__ == "__main__":
    what = sys.argv[1:] or ["images", "sources"]
    if "images" in what and cfg.get("images"):
        images()
    if "sources" in what and cfg.get("sources"):
        sources()
