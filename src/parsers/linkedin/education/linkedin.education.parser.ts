import { inferSchema, initParser } from "udsv";
import "./linkedin.education.types.js";
import { readCsv } from "../../../shared/csv/readCsv.js";
import {
	LinkedinEducationDomain,
	LinkedinEducationParsed,
	LinkedinEducationRaw,
	NormalizedEducationRow,
} from "./linkedin.education.types.js";
import { CsvParseError } from "../../../errors/index.js";
import { normalizeDegreeText } from "../../../shared/util/normalizeDegreeText.js";
import { parseLinkedinDate, mapLinkedinMonthToNumber } from "../shared/linkedin.date.parser.js";
import { LinkedinDatesMonths } from "../shared/linkedin.shared.types.js";
import {
	GupyEducationConclusionStatus,
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "../../gupy/education/gupy.education.types.js";

function parseRawEducation(csv: string): LinkedinEducationRaw[] {
	const schema = inferSchema(csv);
	const parser = initParser(schema);

	return parser.typedObjs(csv) as unknown as LinkedinEducationRaw[];
}

function adaptEducationRow(raw: LinkedinEducationRaw): LinkedinEducationParsed {
	if (!raw["School Name"]?.trim()) {
		throw new CsvParseError('Linha do CSV inválida: coluna "School Name" ausente ou vazia');
	}

	if (!raw["Start Date"] || !raw["End Date"]) {
		throw new CsvParseError(`Datas inválidas para a instituição "${raw["School Name"]}"`);
	}

	const startDate = parseLinkedinDate(raw["Start Date"]);
	const endDate = parseLinkedinDate(raw["End Date"]);

	if (!startDate) {
		throw new CsvParseError(
			`Data de início inválida "${raw["Start Date"]}" para a instituição "${raw["School Name"]}"`,
		);
	}

	if (!endDate) {
		throw new CsvParseError(
			`Data de término inválida "${raw["End Date"]}" para a instituição "${raw["School Name"]}"`,
		);
	}

	return {
		School_Name: raw["School Name"].trim(),
		Start_Date: startDate,
		End_Date: endDate,
		Degree_Name: raw["Degree Name"] ?? undefined,
	};
}

function detectEducationLevel(
	degreeName: string,
	notes?: string,
): GupyEducationTypes | GupyUnderGraduationTypes | "unknown" {
	const normalized = normalizeDegreeText(`${degreeName ?? ""} ${notes ?? ""}`);

	if (/ensino\s+medio/.test(normalized)) {
		return GupyUnderGraduationTypes.completedHighSchool;
	}

	if (/fundamental/.test(normalized)) {
		return GupyUnderGraduationTypes.completedElementarySchool;
	}

	if (/tecnico|ensino\s+tecnico/.test(normalized)) {
		return GupyEducationTypes.technical_course;
	}

	if (/tecnologo/.test(normalized)) {
		return GupyEducationTypes.technological;
	}

	if (/graduacao|bacharel|licenciatura/.test(normalized)) {
		return GupyEducationTypes.graduation;
	}

	return "unknown";
}

function resolveConclusionStatus(
	endMonth: LinkedinDatesMonths,
	endYear: number,
	context: string,
): GupyEducationConclusionStatus {
	const now = new Date();
	const endMonthNumber = mapLinkedinMonthToNumber(endMonth);

	if (!endMonthNumber) {
		throw new CsvParseError(`Mês inválido "${endMonth}" encontrado em ${context}`);
	}

	const endDate = new Date(endYear, endMonthNumber, 1);
	return endDate < now
		? GupyEducationConclusionStatus.education_complete
		: GupyEducationConclusionStatus.education_in_progress;
}

function resolveUnderGraduationDegree(
	hasHighSchool: boolean,
	hasFundamental: boolean,
): GupyUnderGraduationTypes | undefined {
	if (hasHighSchool) {
		return GupyUnderGraduationTypes.completedHighSchool;
	}

	if (hasFundamental) {
		return GupyUnderGraduationTypes.completedElementarySchool;
	}
	return undefined;
}

function normalizeEducation(row: LinkedinEducationParsed): NormalizedEducationRow {
	if (!row.School_Name?.trim()) {
		throw new CsvParseError('Linha do CSV inválida: coluna "School Name" ausente ou vazia');
	}

	if (!row.Start_Date || !row.End_Date) {
		throw new CsvParseError(`Datas inválidas para a instituição "${row.School_Name}"`);
	}

	const level = detectEducationLevel(row.Degree_Name ?? "", undefined);

	if (Object.values(GupyUnderGraduationTypes).includes(level as GupyUnderGraduationTypes)) {
		return {
			kind: "underGraduation",
			value: level as GupyUnderGraduationTypes,
		};
	}

	const startDateMonth = mapLinkedinMonthToNumber(row.Start_Date.Month);
	if (!startDateMonth) {
		throw new CsvParseError(
			`Mês de início inválido "${row.Start_Date.Month}" para a instituição "${row.School_Name}"`,
		);
	}

	const endDateMonth = mapLinkedinMonthToNumber(row.End_Date.Month);
	if (!endDateMonth) {
		throw new CsvParseError(
			`Mês de término inválido "${row.End_Date.Month}" para a instituição "${row.School_Name}"`,
		);
	}

	return {
		kind: "formation",
		value: {
			formation: level as GupyEducationTypes | "unknown",
			conclusionStatus: resolveConclusionStatus(
				row.End_Date.Month,
				row.End_Date.Year,
				row.School_Name,
			),
			course: undefined, // CLI resolve depois
			institution: row.School_Name.trim(),
			startDateMonth: startDateMonth,
			startDateYear: row.Start_Date.Year,
			endDateMonth: endDateMonth,
			endDateYear: row.End_Date.Year,
		},
	};
}

export function parseLinkedinEducationCSV(csvPath: string): {
	formations: LinkedinEducationDomain[];
	underGraduationDegree?: GupyUnderGraduationTypes;
} {
	const csvContent = readCsv(csvPath);

	const rawRows = parseRawEducation(csvContent);
	const parsedRows = rawRows.map(adaptEducationRow);

	const formations: LinkedinEducationDomain[] = [];

	let hasHighSchool = false;
	let hasFundamental = false;

	for (const row of parsedRows) {
		const normalized = normalizeEducation(row);

		if (normalized.kind == "underGraduation") {
			if (normalized.value === GupyUnderGraduationTypes.completedHighSchool) {
				hasHighSchool = true;
			}

			if (normalized.value === GupyUnderGraduationTypes.completedElementarySchool) {
				hasFundamental = true;
			}

			continue;
		}

		formations.push(normalized.value);
	}

	const underGraduationDegree = resolveUnderGraduationDegree(hasHighSchool, hasFundamental);

	return {
		formations,
		underGraduationDegree,
	};
}

export function getParsedLinkedinEducationCSV(csvPath: string): LinkedinEducationParsed[] {
	const csvContent = readCsv(csvPath);
	const rawRows = parseRawEducation(csvContent);
	return rawRows.map(adaptEducationRow);
}
