export type StoryEvent = {
  age: number;
  altitude: number; // 0–100 subjective life-high
  label: string;
  deep?: boolean;
  slug?: string;
};

// Altitudes are intentionally exaggerated placeholders — real numbers TBD.
export const EVENTS: StoryEvent[] = [
  { age: 6,    altitude: 70, label: "Started elementary school in Beijing" },
  { age: 8,    altitude: 95, label: "First in city math olympiad", deep: true, slug: "math-olympiad" },
  { age: 10,   altitude: 62, label: "Watched the Beijing Olympics on a hotel TV" },
  { age: 12,   altitude: 32, label: "Started middle school" },
  { age: 14,   altitude: 88, label: "Math League first prize as an 8th grader" },
  { age: 15,   altitude: 18, label: "First time questioning the competitions" },
  { age: 16,   altitude: 68, label: "Physics finally felt like a real interest" },
  { age: 17,   altitude: 96, label: "Provincial Physics Olympiad team" },
  { age: 18,   altitude: 80, label: "Entered Peking University, mechanics" },
  { age: 19.5, altitude: 48, label: "Found a research advisor" },
  { age: 21,   altitude: 58, label: "First research paper draft" },
  { age: 22,   altitude: 90, label: "Outstanding Graduate at PKU" },
  { age: 23,   altitude: 64, label: "Master's at UPenn — first taste of CV" },
  { age: 24,   altitude: 42, label: "Robotics lab, late-night experiments" },
  { age: 25,   altitude: 12, label: "Began UMD PhD, then stepped away", deep: true, slug: "phd-pause" },
  { age: 26,   altitude: 6,  label: "Lowest stretch — searching, not finding" },
  { age: 26.5, altitude: 48, label: "Built an E36 M3 race car from a frame", deep: true, slug: "race-car" },
  { age: 27,   altitude: 30, label: "Trading: −60% then +50% in three weeks" },
  { age: 27.5, altitude: 72, label: "Realizing experience > optimization" },
  { age: 28,   altitude: 88, label: "Back in motion — clearer than ever" },
];

export const MIN_AGE = 5;
export const MAX_AGE = 28.5;
