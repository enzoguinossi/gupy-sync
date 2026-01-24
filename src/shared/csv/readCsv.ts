import fs from "fs";
import {CsvParseError} from "../../errors/index.js";

export function readCsv(csvPath: string): string {
    try {
        return fs.readFileSync(csvPath, 'utf-8');
    } catch {
        throw new CsvParseError(`Não foi possível ler o arquivo CSV: ${csvPath}`)
    }
}