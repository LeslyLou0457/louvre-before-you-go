"use client";

// The visit countdown on the cover (PRODUCT.md "Visit countdown"): the
// grey-and-white kitten holds up a sign, "N days to the Louvre", counting down
// to the visit day the player picked. The picker only takes a future date.
// No day yet: the sign asks for one. The day itself: "Louvre day!". A day
// that has passed: a gentle line and the picker, to choose the next visit.
// Stored only in localStorage (lib/visit); nothing renders until it is read.

import { useEffect, useId, useState } from "react";
import { SignKitten } from "@/doodles/cats";
import { daysUntil, formatVisit, getVisit, setVisit, tomorrowIso } from "@/lib/visit";

type State = { visit: string | null; editing: boolean };

export default function VisitCountdown() {
  const [state, setState] = useState<State | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(false);
  const inputId = useId();

  useEffect(() => {
    setState({ visit: getVisit(), editing: false });
  }, []);

  if (!state) return <div className="mt-5 min-h-[188px]" aria-hidden="true" />;

  const days = state.visit ? daysUntil(state.visit) : null;
  const passed = days !== null && days < 0;
  const picking = state.visit === null || passed || state.editing;
  const min = tomorrowIso();

  let sign: string;
  if (days === null) sign = "When's your Louvre day?";
  else if (passed) sign = "Hope the Louvre was lovely!";
  else if (days === 0) sign = "Louvre day is today!";
  else sign = `${days} ${days === 1 ? "day" : "days"} to the Louvre`;

  function save() {
    if (!draft || !setVisit(draft)) {
      setError(true);
      return;
    }
    setError(false);
    setState({ visit: draft, editing: false });
  }

  return (
    <section aria-label="Visit countdown" className="mt-5 flex flex-col items-center">
      <p
        aria-live="polite"
        className="wobbly relative z-10 min-w-[220px] max-w-full rotate-[-1.5deg] border-[2.5px] border-ink bg-mat px-5 py-2.5 text-center font-hand text-[1.7rem] font-bold leading-tight"
      >
        {sign}
      </p>
      <SignKitten className="relative z-20 -mt-4 h-auto w-[104px]" />

      <div className="mt-2 w-full text-center">
        {!picking && state.visit && (
          <p className="text-[15px] text-muted">
            {days === 0 ? "Enjoy every room." : <>Your visit: {formatVisit(state.visit)}. One level a day gets you ready.</>}{" "}
            <button
              type="button"
              onClick={() => {
                setDraft(state.visit ?? "");
                setState({ ...state, editing: true });
              }}
              className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline"
            >
              Change date
            </button>
          </p>
        )}

        {picking && (
          <div className="flex flex-col items-center gap-2">
            <label htmlFor={inputId} className="text-[15px] text-muted">
              {passed
                ? "That visit day has passed. Planning another trip? Pick your next day."
                : "Pick the day you'll visit, and start getting ready now."}
            </label>
            <div className="flex w-full flex-wrap items-center justify-center gap-2">
              <input
                id={inputId}
                type="date"
                min={min}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError(false);
                }}
                className="wobbly min-h-12 border-2 border-ink bg-mat px-3 font-read text-base"
              />
              <button type="button" onClick={save} className="btn-primary">
                Set my day
              </button>
              {state.editing && !passed && (
                <button
                  type="button"
                  onClick={() => setState({ ...state, editing: false })}
                  className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline"
                >
                  Cancel
                </button>
              )}
            </div>
            {error && <p className="font-hand text-lg text-ultramarine">Pick a day after today, please.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
