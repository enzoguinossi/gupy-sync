import fs from 'fs'
import { inferSchema, initParser } from "udsv";
import { Achievement, AchievementTypes } from '../../services/gupy/gupy.types';
import { LinkedinAchievementCSV } from "./linkedin.types";

export function parseLinkedinCSV(csvPath: string): Achievement[] {
    const raw = fs.readFileSync(csvPath, 'utf-8')

    const schema = inferSchema(raw) 
    const parser = initParser(schema)

    const rows = parser.typedObjs(raw) as LinkedinAchievementCSV[];

    return rows
        .filter(row => row.Name) // segurança
        .map(row => {
        const descriptionParts: string[] = [];

        if (row.Url) {
            descriptionParts.push(row.Url);
        }

        if (row.Authority) {
            descriptionParts.push(`Emitido por: ${row.Authority}`);
        }

        return {
            type: AchievementTypes.courses,
            name: row.Name.trim(),
            description: descriptionParts.join(' | ') || undefined,
        };
        });
}
