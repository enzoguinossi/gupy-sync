import { CsvParseError } from "@/errors/index.js";
import { inferSchema, initParser } from "udsv";
import { LinkedinAchievementParsed, LinkedinAchievementRaw } from "@/types/linkedin/achievement/linkedin.achievement.types.js";
import { readCsv } from "@/shared/csv/readCsv.js";
import { mapLinkedinMonthToNumber, parseLinkedinDate } from "@/parsers/linkedin/shared/linkedin.date.parser.js";
import { AchievementEntity, AchievementType } from "@/domain/entities/achievement.entity.js";

function parseRawAchievements(csv: string): LinkedinAchievementRaw[] {
	const schema = inferSchema(csv);
	const parser = initParser(schema);
	return parser.typedObjs(csv) as unknown as LinkedinAchievementRaw[];
}

function parseAchievements(rawRows: LinkedinAchievementRaw[]): LinkedinAchievementParsed[] {
	return rawRows.map((row) => ({
		Name: row.Name,
		Url: row.Url,
		Authority: row.Authority,
		Started_On: parseLinkedinDate(row["Started On"]),
		Finished_On: parseLinkedinDate(row["Finished On"]),
		License_Number: row["License Number"],
	}));
}

function toDomain(row: LinkedinAchievementParsed): AchievementEntity {
	if (!row.Name?.trim()) {
		throw new CsvParseError('Linha do CSV inválida: coluna "Name" ausente ou vazia');
	}

	if (!row.Authority?.trim()) {
		throw new CsvParseError(
			`Linha do CSV inválida: coluna "Authority" ausente ou vazia para o achievement "${row.Name}"`,
		);
	}

	const issueMonth = row.Started_On ? mapLinkedinMonthToNumber(row.Started_On.Month) : undefined;
	const expirationMonth = row.Finished_On
		? mapLinkedinMonthToNumber(row.Finished_On.Month)
		: undefined;

	return {
		name: row.Name.trim(),
		type: AchievementType.Certification,
		issuer: row.Authority,
		url: row.Url,
		credentialId: row.License_Number,
		issueDate:
			row.Started_On && issueMonth
				? {
						month: issueMonth,
						year: row.Started_On.Year,
					}
				: undefined,
		expirationDate:
			row.Finished_On && expirationMonth
				? {
						month: expirationMonth,
						year: row.Finished_On.Year,
					}
				: undefined,
	};
}

export function parseLinkedinAchievementsCSV(csvPath: string): AchievementEntity[] {
	const csvContent = readCsv(csvPath);
	const rawRows = parseRawAchievements(csvContent);
	const parsedRows = parseAchievements(rawRows);
	return parsedRows.map(toDomain);
}
