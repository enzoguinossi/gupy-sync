import {GupyAchievementInput} from "./gupy.achievement.input.types.js";
import {GupyEducationPayload} from "./gupy.education.input.types.js";

export function buildAchievementsPayload(achievements: GupyAchievementInput[]) {
  return {
    achievements,
  };
}

export function buildEducationPayload(input: GupyEducationPayload) {
  const payload: any = {
    formations: input.formations.map(f => ({
      formation: f.formation,
      conclusionStatus: f.conclusionStatus,
      course: f.course,
      institution: f.institution,
      startDateMonth: f.startDateMonth,
      startDateYear: f.startDateYear,
      endDateMonth: f.endDateMonth,
      endDateYear: f.endDateYear,
    })),
  };

  if (input.underGraduationDegree) {
    payload.underGraduationDegree = input.underGraduationDegree;
  }

  return payload;
}
