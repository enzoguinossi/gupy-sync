import {
	GupyFormationRaw,
	GupyFormationsRaw,
} from "@/types/gupy/education/raw/gupy.education.raw.types.js";
import {
	GupyEducationConclusionStatus,
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "@/types/gupy/education/enum/gupy.education.enum.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";

function mapGupyLevelToDomain(
	level: GupyEducationTypes | GupyUnderGraduationTypes | string,
): EducationLevel {
	switch (level) {
		case GupyUnderGraduationTypes.completedElementarySchool:
		case GupyUnderGraduationTypes.inProgressFundamental:
		case GupyUnderGraduationTypes.incompleteElementarySchool:
			return EducationLevel.Elementary;
		case GupyUnderGraduationTypes.completedHighSchool:
		case GupyUnderGraduationTypes.inProgressHighSchool:
		case GupyUnderGraduationTypes.incompleteHighSchool:
			return EducationLevel.HighSchool;
		case GupyEducationTypes.technical_course:
			return EducationLevel.Technical;
		case GupyEducationTypes.technological:
			return EducationLevel.Technologist;
		case GupyEducationTypes.graduation:
			return EducationLevel.Bachelor;
		case GupyEducationTypes.post_graduate:
			return EducationLevel.PostGraduate;
		case GupyEducationTypes.master_degree:
			return EducationLevel.Master;
		case GupyEducationTypes.phd:
			return EducationLevel.Doctorate;
		default:
			return EducationLevel.Unknown;
	}
}

function mapGupyStatusToDomain(status: string): EducationStatus {
	switch (status) {
		case GupyEducationConclusionStatus.education_complete:
			return EducationStatus.Completed;
		case GupyEducationConclusionStatus.education_in_progress:
			return EducationStatus.InProgress;
		case GupyEducationConclusionStatus.education_incomplete:
			return EducationStatus.Incomplete;
		default:
			return EducationStatus.Incomplete;
	}
}

function parseFormation(raw: GupyFormationRaw): EducationEntity {
	return {
		institution: raw.institution,
		course: raw.course,
		level: mapGupyLevelToDomain(raw.formation),
		status: mapGupyStatusToDomain(raw.conclusionStatus),
		startDate: {
			month: raw.startDateMonth,
			year: raw.startDateYear,
		},
		endDate: {
			month: raw.endDateMonth,
			year: raw.endDateYear,
		},
	};
}

export function parseGupyEducation(raw: GupyFormationsRaw): EducationEntity[] {
	const formations = raw.academicFormation.map(parseFormation);

	// Se houver formação básica (ensino médio/fundamental) retornada separadamente,
	// podemos criar uma entidade para ela também, se desejado.
	// A Gupy retorna 'underGraduationDegree' como um campo separado.
	if (raw.underGraduationDegree) {
		const level = mapGupyLevelToDomain(raw.underGraduationDegree);
		// Como não temos detalhes de instituição/datas para o ensino básico nesse campo,
		// podemos criar uma entrada genérica ou ignorar.
		// Para manter consistência com a lista de entidades, vamos adicionar se for relevante.
		// Porém, geralmente o foco é nas formações superiores listadas em 'academicFormation'.
		// Vou adicionar uma entrada genérica para representar o nível básico se não houver outras formações,
		// ou apenas retornar as formações detalhadas.
		// Dado que o parser anterior retornava ambos, vamos focar nas formações detalhadas
		// e adicionar o nível básico como uma formação "genérica" se a lista estiver vazia ou para constar.

		// Decisão: Adicionar como uma formação com dados mínimos
		formations.push({
			institution: "Ensino Básico (Gupy)",
			course: "Formação Geral",
			level: level,
			status: EducationStatus.Completed, // Assume completo se está no campo de grau obtido
			startDate: { month: 1, year: 1900 }, // Data fictícia
			endDate: { month: 1, year: 1900 },
		});
	}

	return formations;
}
