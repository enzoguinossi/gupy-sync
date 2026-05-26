import { describe, it, expect } from "vitest";
import { parseLinkedinAchievementsCSV } from "@/parsers/linkedin/achievement/linkedin.achievement.parser.js";
import { AchievementType } from "@/domain/entities/achievement.entity.js";

const MOCK_PATH = "src/__tests__/mocks/Certifications.csv";

describe("parseLinkedinAchievementsCSV", () => {
	it("parses all rows", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result).toHaveLength(5);
	});

	it("parses name correctly", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[0].name).toBe("Inglês Avançado");
	});

	it("parses authority as issuer", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[0].issuer).toBe("Pró-Ser Instituto de Qualificação");
	});

	it("parses URL when present", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[2].url).toBe("https://aws.amazon.com/verify/ABC123");
	});

	it("parses license number", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[2].credentialId).toBe("ABC12345");
	});

	it("parses issue date", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[0].issueDate).toEqual({ month: 10, year: 2021 });
	});

	it("parses expiration date", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[2].expirationDate).toEqual({ month: 1, year: 2026 });
	});

	it("sets undefined for empty dates", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[0].issueDate).toBeDefined();
		expect(result[0].expirationDate).toBeUndefined();
	});

	it("defaults type to Certification", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[0].type).toBe(AchievementType.Certification);
	});

	it("handles achievement with no URL and no license", () => {
		const result = parseLinkedinAchievementsCSV(MOCK_PATH);
		expect(result[1].url).toBeNull();
		expect(result[1].credentialId).toBeNull();
	});
});