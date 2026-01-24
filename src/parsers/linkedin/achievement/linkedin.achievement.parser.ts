import {CsvParseError} from "../../../errors/index.js";

import {inferSchema, initParser} from "udsv";
import {LinkedinAchievementDomain, LinkedinAchievementParsed} from "./linkedin.achievement.types.js";
import {GupyAchievementTypes} from "../../../services/gupy/gupy.achievement.raw.types.js";
import {readCsv} from "../../../shared/csv/readCsv.js";

function parseRawAchievements(csv: string): LinkedinAchievementParsed[] {
    const schema = inferSchema(csv);
    const parser = initParser(schema);

    return parser.typedObjs(csv) as unknown as LinkedinAchievementParsed[];
}

function normalizeAchievement(row: LinkedinAchievementParsed): LinkedinAchievementDomain {
    if (!row.Name?.trim()) {
        throw new CsvParseError(
            'Linha do CSV inválida: coluna "Name" ausente ou vazia'
        );
    }

    if (!row.Authority?.trim()) {
        throw new CsvParseError(
            `Linha do CSV inválida: coluna "Authority" ausente ou vazia para o achievement "${row.Name}"`
        );
    }

    const descriptionParts: string[] = [];

    if (row.Url) descriptionParts.push(row.Url);
    if (row.Authority) {
        descriptionParts.push(`Emitido por: ${row.Authority}`);
    }

    return {
        Type: GupyAchievementTypes.course,
        Name: row.Name.trim(),
        Description: descriptionParts.join(' | ')
    };
}

export function parseLinkedinAchievementsCSV(csvPath: string): LinkedinAchievementDomain[] {
    const csvContent = readCsv(csvPath)

    const rawRows = parseRawAchievements(csvContent);

    return rawRows.map(normalizeAchievement);
}

