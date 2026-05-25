import { parseLinkedinEducationCSV } from "@/parsers/linkedin/education/linkedin.education.parser.js";

export async function getLinkedInFormation(csvPath: string) {
	return parseLinkedinEducationCSV(csvPath);
}
