import { inferSchema, initParser } from "udsv";
import { readCsv } from "@/shared/csv/readCsv.js";
import { LinkedinEducationParsed, LinkedinEducationRaw } from "@/types/linkedin/education/linkedin.education.types.js";
import { CsvParseError } from "@/errors/index.js";
import { parseLinkedinDate, mapLinkedinMonthToNumber } from "@/parsers/linkedin/shared/linkedin.date.parser.js";
import { LinkedinDatesMonths } from "@/types/linkedin/shared/linkedin.shared.types.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";
import { detectEducationLevel } from "@/parsers/shared/detectEducationLevel.js";

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
		Notes: raw.Notes ?? undefined,
	};
}

function resolveConclusionStatus(
	endMonth: LinkedinDatesMonths,
	endYear: number,
	context: string,
	now: Date = new Date(),
): EducationStatus {
	const endMonthNumber = mapLinkedinMonthToNumber(endMonth);

	if (!endMonthNumber) {
		throw new CsvParseError(`Mês inválido "${endMonth}" encontrado em ${context}`);
	}

	const endDate = new Date(endYear, endMonthNumber, 1);
	return endDate < now ? EducationStatus.Completed : EducationStatus.InProgress;
}

function toDomain(row: LinkedinEducationParsed, now: Date): EducationEntity {
	if (!row.School_Name?.trim()) {
		throw new CsvParseError('Linha do CSV inválida: coluna "School Name" ausente ou vazia');
	}

	if (!row.Start_Date || !row.End_Date) {
		throw new CsvParseError(`Datas inválidas para a instituição "${row.School_Name}"`);
	}

	const level = detectEducationLevel(row.Degree_Name ?? "", row.Notes);

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
		institution: row.School_Name.trim(),
		course: row.Degree_Name ? row.Degree_Name.trim() : undefined,
		level: level,
		status: resolveConclusionStatus(row.End_Date.Month, row.End_Date.Year, row.School_Name, now),
		startDate: {
			month: startDateMonth,
			year: row.Start_Date.Year,
		},
		endDate: {
			month: endDateMonth,
			year: row.End_Date.Year,
		},
	};
}

export function parseLinkedinEducationCSV(
	csvPath: string,
	now: Date = new Date(),
): EducationEntity[] {
	const csvContent = readCsv(csvPath);

	const rawRows = parseRawEducation(csvContent);
	const parsedRows = rawRows.map(adaptEducationRow);

	return parsedRows.map((row) => toDomain(row, now));
}