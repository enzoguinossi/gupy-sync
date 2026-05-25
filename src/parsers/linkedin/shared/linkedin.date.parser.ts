import { LinkedinDates, LinkedinDatesMonths } from "@/types/linkedin/shared/linkedin.shared.types.js";

export const MONTHS_MAP: Record<LinkedinDatesMonths, number> = {
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

export function mapLinkedinMonthToNumber(month: LinkedinDatesMonths): number | undefined {
	return MONTHS_MAP[month];
}

export function parseLinkedinDate(date?: string): LinkedinDates | undefined {
	if (!date) return undefined;

	const [Month, Year] = date.split(" ");
	if (!Month || !Year) return undefined;

	return { Month: Month as LinkedinDatesMonths, Year: parseInt(Year, 10) };
}
