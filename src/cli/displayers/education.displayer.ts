import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";
import { truncateText } from "@/shared/util/truncateText.js";

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

const educationStatusMap: Record<EducationStatus, string> = {
	[EducationStatus.Completed]: "Completo",
	[EducationStatus.InProgress]: "Em Andamento",
	[EducationStatus.Incomplete]: "Incompleto",
};

export function displayEducation(educationList: EducationEntity[]) {
	if (educationList.length === 0) {
		console.log("Nenhuma formação encontrada.");
		return;
	}

	const tableData = educationList.map((item) => ({
		Instituicao: truncateText(item.institution, 30),
		Curso: item.course ? truncateText(item.course, 30) : "-",
		Nivel: educationLevelMap[item.level] || item.level,
		Status: educationStatusMap[item.status] || item.status,
		Inicio: `${item.startDate.month}/${item.startDate.year}`,
		Fim: item.endDate ? `${item.endDate.month}/${item.endDate.year}` : "Atualmente",
	}));

	console.table(tableData);
}