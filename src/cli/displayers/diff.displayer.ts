import { AchievementEntity } from "@/domain/entities/achievement.entity.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { DiffResult, DiffStatus } from "@/domain/services/diff.types.js";

const achievementTypeMap: Record<string, string> = {
	COURSE: "Curso",
	CERTIFICATION: "Certificação",
	LICENSE: "Licença",
	AWARD: "Prêmio",
	ACKNOWLEDGEMENT: "Reconhecimento",
	VOLUNTEERWORK: "Voluntariado",
};

const educationLevelMap: Record<EducationLevel, string> = {
	[EducationLevel.Elementary]: "Ensino Fundamental",
	[EducationLevel.HighSchool]: "Ensino Médio",
	[EducationLevel.Technical]: "Técnico",
	[EducationLevel.Technologist]: "Tecnólogo",
	[EducationLevel.Bachelor]: "Bacharelado",
	[EducationLevel.PostGraduate]: "Pós-Graduação",
	[EducationLevel.Master]: "Mestrado",
	[EducationLevel.Doctorate]: "Doutorado",
	[EducationLevel.PostDoctorate]: "Pós-Doutorado",
	[EducationLevel.Unknown]: "Desconhecido",
};

const STATUS_LABEL: Record<DiffStatus, string> = {
	[DiffStatus.Add]: "+",
	[DiffStatus.Remove]: "-",
	[DiffStatus.Keep]: "~",
};

const STATUS_COLOR: Record<DiffStatus, string> = {
	[DiffStatus.Add]: "\x1b[32m",
	[DiffStatus.Remove]: "\x1b[31m",
	[DiffStatus.Keep]: "\x1b[90m",
};

const RESET = "\x1b[0m";

function formatLine(tag: string, label: string, value: string): string {
	const padded = value.padEnd(35).slice(0, 35);
	return ` ${tag} ${label}: ${padded}`;
}

export function displayAchievementDiff(result: DiffResult<AchievementEntity>): void {
	console.log(`\n  ${STATUS_COLOR[DiffStatus.Add]}${STATUS_LABEL[DiffStatus.Add]}${RESET} adicionar  ${STATUS_COLOR[DiffStatus.Remove]}${STATUS_LABEL[DiffStatus.Remove]}${RESET} remover  ${STATUS_COLOR[DiffStatus.Keep]}${STATUS_LABEL[DiffStatus.Keep]}${RESET} inalterado\n`);

	for (const item of result.items) {
		const tag = `${STATUS_COLOR[item.status]}${STATUS_LABEL[item.status]}${RESET}`;
		const type = achievementTypeMap[item.entity.type] || item.entity.type;
		console.log(formatLine(tag, type, item.entity.name));
	}

	console.log(
		`\nResumo: ${result.added.length} para adicionar, ${result.removed.length} para remover, ${result.kept.length} inalterados`,
	);
}

export function displayEducationDiff(result: DiffResult<EducationEntity>): void {
	console.log(`\n  ${STATUS_COLOR[DiffStatus.Add]}${STATUS_LABEL[DiffStatus.Add]}${RESET} adicionar  ${STATUS_COLOR[DiffStatus.Remove]}${STATUS_LABEL[DiffStatus.Remove]}${RESET} remover  ${STATUS_COLOR[DiffStatus.Keep]}${STATUS_LABEL[DiffStatus.Keep]}${RESET} inalterado\n`);

	for (const item of result.items) {
		const tag = `${STATUS_COLOR[item.status]}${STATUS_LABEL[item.status]}${RESET}`;
		const level = educationLevelMap[item.entity.level] || item.entity.level;
		const name = item.entity.course || item.entity.institution;
		console.log(formatLine(tag, level, name));
	}

	console.log(
		`\nResumo: ${result.added.length} para adicionar, ${result.removed.length} para remover, ${result.kept.length} inalterados`,
	);
}