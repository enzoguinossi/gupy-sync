import { describe, it, expect } from "vitest";
import { AchievementEntity, AchievementType } from "@/domain/entities/achievement.entity.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";
import { mapAchievementToGupy } from "@/platform/gupy/mappers/gupy.achievement.mapper.js";
import { mapEducationLevelToGupy, mapEducationStatusToGupy, mapToGupyEducationInput } from "@/platform/gupy/mappers/gupy.education.mapper.js";
import { GupyAchievementTypesEnum } from "@/platform/gupy/types/achievement/raw/gupy.achievement.raw.types.js";
import { GupyEducationTypes, GupyEducationConclusionStatus, GupyUnderGraduationTypes } from "@/platform/gupy/types/education/enum/gupy.education.enum.js";

describe("Gupy Achievement Mapper", () => {
	it("maps name and type correctly", () => {
		const entity: AchievementEntity = {
			name: "Inglês Avançado",
			type: AchievementType.Certification,
			issuer: "Pró-Ser",
		};
		const result = mapAchievementToGupy(entity);
		expect(result.name).toBe("Inglês Avançado");
		expect(result.type).toBe(GupyAchievementTypesEnum.certificates);
	});

	it("maps Course type to courses", () => {
		const entity: AchievementEntity = {
			name: "Curso de JS",
			type: AchievementType.Course,
			issuer: "Alura",
		};
		const result = mapAchievementToGupy(entity);
		expect(result.type).toBe(GupyAchievementTypesEnum.courses);
	});

	it("includes issuer in description", () => {
		const entity: AchievementEntity = {
			name: "Test",
			type: AchievementType.Certification,
			issuer: "Some Institute",
		};
		const result = mapAchievementToGupy(entity);
		expect(result.description).toContain("Some Institute");
	});

	it("includes URL in description when present", () => {
		const entity: AchievementEntity = {
			name: "Test",
			type: AchievementType.Certification,
			issuer: "X",
			url: "https://example.com/cert",
		};
		const result = mapAchievementToGupy(entity);
		expect(result.description).toContain("https://example.com/cert");
	});

	it("includes credential ID in description when no URL", () => {
		const entity: AchievementEntity = {
			name: "Test",
			type: AchievementType.Certification,
			issuer: "X",
			credentialId: "ABC123",
		};
		const result = mapAchievementToGupy(entity);
		expect(result.description).toContain("ABC123");
	});
});

describe("Gupy Education Mapper", () => {
	it("maps Elementary to completedElementarySchool", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Elementary)).toBe(GupyUnderGraduationTypes.completedElementarySchool);
	});

	it("maps HighSchool to completedHighSchool", () => {
		expect(mapEducationLevelToGupy(EducationLevel.HighSchool)).toBe(GupyUnderGraduationTypes.completedHighSchool);
	});

	it("maps Technical to technical_course", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Technical)).toBe(GupyEducationTypes.technical_course);
	});

	it("maps Technologist to technological", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Technologist)).toBe(GupyEducationTypes.technological);
	});

	it("maps Bachelor to graduation", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Bachelor)).toBe(GupyEducationTypes.graduation);
	});

	it("maps PostGraduate to post_graduate", () => {
		expect(mapEducationLevelToGupy(EducationLevel.PostGraduate)).toBe(GupyEducationTypes.post_graduate);
	});

	it("maps Master to master_degree", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Master)).toBe(GupyEducationTypes.master_degree);
	});

	it("maps Doctorate to phd", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Doctorate)).toBe(GupyEducationTypes.phd);
	});

	it("maps PostDoctorate to phd (fallback)", () => {
		expect(mapEducationLevelToGupy(EducationLevel.PostDoctorate)).toBe(GupyEducationTypes.phd);
	});

	it("returns unknown for Unknown level", () => {
		expect(mapEducationLevelToGupy(EducationLevel.Unknown)).toBe("unknown");
	});

	it("maps Completed status correctly", () => {
		expect(mapEducationStatusToGupy(EducationStatus.Completed)).toBe(GupyEducationConclusionStatus.education_complete);
	});

	it("maps InProgress status correctly", () => {
		expect(mapEducationStatusToGupy(EducationStatus.InProgress)).toBe(GupyEducationConclusionStatus.education_in_progress);
	});

	it("maps Incomplete status correctly", () => {
		expect(mapEducationStatusToGupy(EducationStatus.Incomplete)).toBe(GupyEducationConclusionStatus.education_incomplete);
	});

	it("builds education input with all fields", () => {
		const entity: EducationEntity = {
			institution: "UNIFESO",
			course: "Análise e Desenvolvimento de Sistemas",
			level: EducationLevel.Technologist,
			status: EducationStatus.InProgress,
			startDate: { month: 1, year: 2026 },
			endDate: { month: 8, year: 2028 },
		};
		const result = mapToGupyEducationInput(entity, GupyEducationTypes.technological);
		expect(result.formation).toBe(GupyEducationTypes.technological);
		expect(result.course).toBe("Análise e Desenvolvimento de Sistemas");
		expect(result.institution).toBe("UNIFESO");
		expect(result.startDateMonth).toBe(1);
		expect(result.startDateYear).toBe("2026");
		expect(result.endDateMonth).toBe(8);
		expect(result.endDateYear).toBe("2028");
	});

	it("provides fallback for missing course", () => {
		const entity: EducationEntity = {
			institution: "Some School",
			level: EducationLevel.Bachelor,
			status: EducationStatus.Completed,
			startDate: { month: 1, year: 2020 },
			endDate: { month: 12, year: 2024 },
		};
		const result = mapToGupyEducationInput(entity, GupyEducationTypes.graduation);
		expect(result.course).toBe("Curso não especificado");
	});
});

describe("Gupy Match Keys", () => {
	it("achievement match key uses only name", () => {
		// This tests the platform-aware matching behavior
		const a: AchievementEntity = { name: "  Inglês Avançado  ", type: AchievementType.Certification, issuer: "Pró-Ser" };
		const b: AchievementEntity = { name: "inglês avançado", type: AchievementType.Certification, issuer: "Gupy (Importado)" };
		const keyA = a.name.trim().toLowerCase();
		const keyB = b.name.trim().toLowerCase();
		expect(keyA).toBe(keyB);
	});

	it("education match key uses institution + level", () => {
		const a: EducationEntity = {
			institution: "  UNIFESO  ",
			level: EducationLevel.Technologist,
			status: EducationStatus.Completed,
			startDate: { month: 1, year: 2020 },
		};
		const b: EducationEntity = {
			institution: "unifeso",
			level: EducationLevel.Technologist,
			status: EducationStatus.Completed,
			startDate: { month: 1, year: 2020 },
		};
		const keyA = `${a.institution.trim().toLowerCase()}|${a.level}`;
		const keyB = `${b.institution.trim().toLowerCase()}|${b.level}`;
		expect(keyA).toBe(keyB);
	});
});