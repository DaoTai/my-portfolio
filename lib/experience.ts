/** Year the professional career started. Experience is counted from here to the current year. */
export const CAREER_START_YEAR = 2022;

/** Whole years of experience since `CAREER_START_YEAR`, e.g. 4 in 2026. */
export const getYearsExperience = (now: Date = new Date()): number =>
  now.getFullYear() - CAREER_START_YEAR;

export const YEARS_EXPERIENCE = getYearsExperience();
