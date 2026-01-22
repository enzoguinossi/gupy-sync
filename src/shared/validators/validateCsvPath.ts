import fs from 'fs';
import path from 'path';

export function validateCsvPath(csvPath: string): string {
    const resolved = path.resolve(csvPath);
    
    if (!fs.existsSync(resolved)) {
        throw new Error(`Arquivo CSV não encontrado: ${resolved}`);
    }

    if (!fs.statSync(resolved).isFile()) {
        throw new Error(`Caminho não é um arquivo: ${resolved}`);
    }

    if(!path.extname(resolved).toLowerCase().endsWith('.csv')) {
        throw new Error(`Arquivo não é um CSV: ${resolved}`);
    }

    return resolved;
}