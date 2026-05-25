import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";
import {
	GupyEducationConclusionStatus,
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "@/types/gupy/education/enum/gupy.education.enum.js";
import { GupyEducationInput } from "@/types/gupy/education/input/gupy.education.input.types.js";

export function mapEducationLevelToGupy(
	level: EducationLevel,
): GupyEducationTypes | GupyUnderGraduationTypes | "unknown" {
	switch (level) {
		case EducationLevel.Elementary:
			return GupyUnderGraduationTypes.completedElementarySchool;
		case EducationLevel.HighSchool:
			return GupyUnderGraduationTypes.completedHighSchool;
		case EducationLevel.Technical:
			return GupyEducationTypes.technical_course;
		case EducationLevel.Technologist:
			return GupyEducationTypes.technological;
		case EducationLevel.Bachelor:
			return GupyEducationTypes.graduation;
		case EducationLevel.PostGraduate:
			return GupyEducationTypes.post_graduate;
		case EducationLevel.Master:
			return GupyEducationTypes.master_degree;
		case EducationLevel.Doctorate:
			return GupyEducationTypes.phd;
		case EducationLevel.PostDoctorate:
			return GupyEducationTypes.phd;
		default:
			return "unknown";
	}
}

export function mapEducationStatusToGupy(status: EducationStatus): GupyEducationConclusionStatus {
	switch (status) {
		case EducationStatus.Completed:
			return GupyEducationConclusionStatus.education_complete;
		case EducationStatus.InProgress:
			return GupyEducationConclusionStatus.education_in_progress;
		case EducationStatus.Incomplete:
			return GupyEducationConclusionStatus.education_incomplete;
		default:
			return GupyEducationConclusionStatus.education_incomplete;
	}
}

export function mapToGupyEducationInput(
	entity: EducationEntity,
	gupyType: GupyEducationTypes,
): GupyEducationInput {
	return {
		formation: gupyType,
		course: entity.course || "Curso não especificado",
		institution: entity.institution,
		conclusionStatus: mapEducationStatusToGupy(entity.status),
		startDateMonth: entity.startDate.month,
		startDateYear: String(entity.startDate.year),
		endDateMonth: entity.endDate?.month || 12,
		endDateYear: entity.endDate ? String(entity.endDate.year) : String(new Date().getFullYear()),
	};
}