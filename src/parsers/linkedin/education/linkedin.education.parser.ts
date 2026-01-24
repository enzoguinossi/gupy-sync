import {inferSchema, initParser} from "udsv";
import "./linkedin.education.types.js";
import {readCsv} from "../../../shared/csv/readCsv.js";
import {
    LinkedinDatesMonths,
    LinkedinEducationDomain,
    LinkedinEducationParsed,
    LinkedinEducationRaw,
    NormalizedEducationRow
} from "./linkedin.education.types.js";
import {
    GupyEducationConclusionStatus,
    GupyEducationTypes,
    GupyUnderGraduationTypes
} from "../../../services/gupy/gupy.education.input.types.js";
import {CsvParseError} from "../../../errors/index.js";
import { normalizeDegreeText} from "../../../shared/util/normalizeDegreeText.js";

function parseRawEducation(csv: string): LinkedinEducationRaw[] {
    const schema = inferSchema(csv);
    const parser = initParser(schema);

    return parser.typedObjs(csv) as unknown as LinkedinEducationRaw[];
}

function adaptEducationRow(
    raw: LinkedinEducationRaw
): LinkedinEducationParsed {
    if (!raw['School Name']?.trim()) {
        throw new CsvParseError(
            'Linha do CSV inválida: coluna "School Name" ausente ou vazia'
        );
    }

    if (!raw['Start Date'] || !raw['End Date']) {
        throw new CsvParseError(
            `Datas inválidas para a instituição "${raw['School Name']}"`
        );
    }

    const parseLinkedinDate = (value: string, context: string) => {
        const [month, year] = value.split(' ');

        if (!month || !year || isNaN(Number(year))) {
            throw new CsvParseError(
                `Data inválida "${value}" em ${context}`
            );
        }

        return {
            Month: month as LinkedinDatesMonths,
            Year: Number(year),
        };
    };

    return {
        School_Name: raw['School Name'].trim(),
        Start_Date: parseLinkedinDate(
            raw['Start Date'],
            raw['School Name']
        ),
        End_Date: parseLinkedinDate(
            raw['End Date'],
            raw['School Name']
        ),
        Degree_Name: raw['Degree Name'] ?? undefined,
    };
}


function detectEducationLevel(
    degreeName: string,
    notes?:string
) : GupyEducationTypes | GupyUnderGraduationTypes | 'unknown' {
        const normalized = normalizeDegreeText(
            `${degreeName ?? ''} ${notes ?? ''}`
        );

        if (/ensino\s+medio/.test(normalized)) {
            return GupyUnderGraduationTypes.high_school;
        }

        if (/fundamental/.test(normalized)) {
            return GupyUnderGraduationTypes.fundamental;
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

        return 'unknown';
}

function resolveConclusionStatus(
    endMonth: LinkedinDatesMonths,
    endYear: number,
    context: string) : GupyEducationConclusionStatus {
    const now = new Date()
    const endMonthNumber = mapLinkedinMonthToNumber(endMonth, context)
    const endDate = new Date(endYear, endMonthNumber, 1)
    return endDate < now
        ? GupyEducationConclusionStatus.education_complete
        : GupyEducationConclusionStatus.education_in_progress;
}

function resolveUnderGraduationDegree(
    hasHighSchool: boolean,
    hasFundamental: boolean,
    hasAnyFormation: boolean): GupyUnderGraduationTypes | undefined {

    if (hasHighSchool) {
        return GupyUnderGraduationTypes.high_school;
    }

    if (hasFundamental) {
        return GupyUnderGraduationTypes.fundamental;
    }

    if (hasAnyFormation) {
        // Inferência pelo padrão da Gupy
        return GupyUnderGraduationTypes.high_school;
    }

    return undefined;
}

const LINKEDIN_MONTH_MAP: Record<LinkedinDatesMonths, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
};

function mapLinkedinMonthToNumber(
    month: LinkedinDatesMonths,
    context: string
): number {
    const value = LINKEDIN_MONTH_MAP[month];

    if (!value) {
        throw new CsvParseError(
            `Mês inválido "${month}" encontrado em ${context}`
        );
    }

    return value;
}

function normalizeEducation(
    row: LinkedinEducationParsed
): NormalizedEducationRow {
    if (!row.School_Name?.trim()) {
        console.error('ROW INVÁLIDA DETECTADA', {
            rawRow: row,
            schoolName: row.School_Name,
            startDate: row.Start_Date,
            endDate: row.End_Date
        });

        throw new CsvParseError(
            'Linha do CSV inválida: coluna "School Name" ausente ou vazia'
        );
    }
    if (!row.School_Name?.trim()) {
        throw new CsvParseError(
            'Linha do CSV inválida: coluna "School Name" ausente ou vazia'
        );
    }

    if (!row.Start_Date || !row.End_Date) {
        throw new CsvParseError(
            `Datas inválidas para a instituição "${row.School_Name}"`
        );
    }

    const level = detectEducationLevel(
        row.Degree_Name ?? '',
        undefined
    );

    if (
        level === GupyUnderGraduationTypes.fundamental ||
        level === GupyUnderGraduationTypes.high_school
    ) {
        return {
            kind: 'underGraduation',
            value: level,
        };
    }

    return {
        kind: 'formation',
        value: {
            formation: level,
            conclusionStatus: resolveConclusionStatus(
                row.End_Date.Month,
                row.End_Date.Year,
                row.School_Name
            ),
            course: undefined, // CLI resolve depois
            institution: row.School_Name.trim(),
            startDateMonth: mapLinkedinMonthToNumber(
                row.Start_Date.Month,
                row.School_Name
            ),
            startDateYear: row.Start_Date.Year,
            endDateMonth: mapLinkedinMonthToNumber(
                row.End_Date.Month,
                row.School_Name
            ),
            endDateYear: row.End_Date.Year,
        },
    }
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

        if (normalized.kind == 'underGraduation') {
            if (normalized.value === GupyUnderGraduationTypes.high_school) {
                hasHighSchool = true;
            }

            if (normalized.value === GupyUnderGraduationTypes.fundamental) {
                hasFundamental = true;
            }

            continue;
        }

        formations.push(normalized.value);
    }

    const underGraduationDegree = resolveUnderGraduationDegree(
        hasHighSchool,
        hasFundamental,
        formations.length > 0
    );

    return {
        formations,
        underGraduationDegree
    };
}



