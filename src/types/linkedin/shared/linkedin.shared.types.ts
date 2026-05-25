export type LinkedinDatesMonths =
	| "Jan"
	| "Feb"
	| "Mar"
	| "Apr"
	| "May"
	| "Jun"
	| "Jul"
	| "Aug"
	| "Sep"
	| "Oct"
	| "Nov"
	| "Dec";

export interface LinkedinDates {
	Month: LinkedinDatesMonths;
	Year: number;
}