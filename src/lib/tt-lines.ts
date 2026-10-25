// TT's line under the countdown sign (PRODUCT.md "Visit countdown and baguette
// progress"): short, warm encouragement for each state of the countdown, with
// no art facts. With a day set, the line turns over with the count, so a
// returning player sees a new one most days.

export type CountdownState = "none" | "days" | "today" | "passed";

export const TT_LINES: Record<CountdownState, readonly string[]> = {
  none: ["Pick a day and I'll count down with you!", "My paws are ready to hold the sign. Just tell me when!"],
  days: [
    "One level a day, and you'll walk in among old friends.",
    "Every story you learn brings the Louvre a little closer.",
    "I'm counting on my paws. You're doing great!",
    "A small story today, a big trip soon.",
    "Come back tomorrow and I'll flip the sign for you.",
  ],
  today: ["Today's the day! Go say hello to your new old friends.", "Have the best day. I'll wait right here!"],
  passed: ["Welcome back! I hope it was wonderful.", "I missed you! Where shall we count down to next?"],
};

export function ttLine(state: CountdownState, days = 0): string {
  const pool = TT_LINES[state];
  return pool[Math.abs(days) % pool.length];
}
