import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { normalizeDegreeText } from "@/shared/util/normalizeDegreeText.js";

export function detectEducationLevel(degreeName: string, notes?: string): EducationLevel {
	const normalized = normalizeDegreeText(`${degreeName ?? ""} ${notes ?? ""}`);

	const EDUCATION_MAP: Array<[RegExp, EducationLevel]> = [
		[/\b(pos\s*graduacao|postgraduate|especializacao|mba)\b/, EducationLevel.PostGraduate],
		[/\b(pos\s*doutorado|post\s*doctorate)\b/, EducationLevel.PostDoctorate],
		[/\b(ensino\s+medio|high\s*school)\b/, EducationLevel.HighSchool],
		[/\b(fundamental|elementary\s+school)\b/, EducationLevel.Elementary],
		[/\b(tecnico|technical\s+course)\b/, EducationLevel.Technical],
		[/\b(tecnologo|technologist|associate\s+degree)\b/, EducationLevel.Technologist],
		[
			/\b(graduacao|bacharelado?|bachelor|undergraduate|college|licenciatura)\b/,
			EducationLevel.Bachelor,
		],
		[/\b(mestrado|master|msc)\b/, EducationLevel.Master],
		[/\b(doutorado|phd|doctorate)\b/, EducationLevel.Doctorate],
	];

	for (const [regex, type] of EDUCATION_MAP) {
		if (regex.test(normalized)) return type;
	}

	return EducationLevel.Unknown;
}