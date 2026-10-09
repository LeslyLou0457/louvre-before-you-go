// Where each artwork photo should come from, for photos not yet in
// public/images/. Wikimedia Commons could not be reached from the build
// environment, so these pages are unverified: open each one, check the
// licence, download the file to the path in the content JSON, and the
// placeholder disappears on the next build. No code change needed.
//
// The credit shown on the site always comes from the content JSON
// (artwork.imageCredit); this file only records the intended source.

export const INTENDED_IMAGE_SOURCE: Record<string, string> = {
  "mona-lisa":
    "https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
  "liberty-leading-the-people":
    "https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg",
  "raft-of-the-medusa":
    "https://commons.wikimedia.org/wiki/File:JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_(Museo_del_Louvre,_2004-05).jpg",
  // Sculptures: a photo is the photographer's work, so it must be marked
  // Public Domain or CC0. Not found yet: TBD.
  "venus-de-milo": "TBD",
  "winged-victory": "TBD",
};
