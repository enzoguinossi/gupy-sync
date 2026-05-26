import { describe, it, expect } from "vitest";
import { parseLinkedinEducationCSV } from "@/parsers/linkedin/education/linkedin.education.parser.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";

const MOCK_PATH = "src/__tests__/mocks/Education.csv";
const EDGE_PATH = "src/__tests__/mocks/EdgeCases.csv";
const NOW = new Date("2026-05-01");

describe("parseLinkedinEducationCSV", () => {
	it("parses all rows", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result).toHaveLength(8);
	});

	it("parses institution name correctly", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[0].institution).toBe("Centro Universitário Serra dos Órgãos - UNIFESO");
	});

	it("parses start and end dates", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[0].startDate).toEqual({ month: 1, year: 2026 });
		expect(result[0].endDate).toEqual({ month: 8, year: 2028 });
	});

	it("detects Technologist level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[0].level).toBe(EducationLevel.Technologist);
	});

	it("detects Technical level from notes", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[1].level).toBe(EducationLevel.Technical);
	});

	it("detects High School level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[2].level).toBe(EducationLevel.HighSchool);
	});

	it("detects Bachelor level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[3].level).toBe(EducationLevel.Bachelor);
	});

	it("detects Master level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[4].level).toBe(EducationLevel.Master);
	});

	it("detects Postgraduate level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[5].level).toBe(EducationLevel.PostGraduate);
	});

	it("detects Doctorate level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[6].level).toBe(EducationLevel.Doctorate);
	});

	it("detects Elementary level", () => {
		const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
		expect(result[7].level).toBe(EducationLevel.Elementary);
	});

	describe("conclusion status", () => {
		it("marks future end dates as InProgress", () => {
			const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
			expect(result[0].endDate!.year).toBe(2028);
			expect(result[0].status).toBe(EducationStatus.InProgress);
		});

		it("marks past end dates as Completed", () => {
			const result = parseLinkedinEducationCSV(MOCK_PATH, NOW);
			expect(result[3].endDate!.year).toBe(2022);
			expect(result[3].status).toBe(EducationStatus.Completed);
		});
	});
});

describe("parseLinkedinEducationCSV — edge cases", () => {
	it("detects Technical from detailed notes", () => {
		const result = parseLinkedinEducationCSV(EDGE_PATH, NOW);
		expect(result[0].level).toBe(EducationLevel.Technical);
	});

	it("detects High School from degree name", () => {
		const result = parseLinkedinEducationCSV(EDGE_PATH, NOW);
		expect(result[1].level).toBe(EducationLevel.HighSchool);
	});
});