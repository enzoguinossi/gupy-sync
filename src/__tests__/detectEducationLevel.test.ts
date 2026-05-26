import { describe, it, expect } from "vitest";
import { detectEducationLevel } from "@/parsers/shared/detectEducationLevel.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";

describe("detectEducationLevel", () => {
	it("detects High School in Portuguese", () => {
		expect(detectEducationLevel("Ensino Médio")).toBe(EducationLevel.HighSchool);
	});

	it("detects High School in English", () => {
		expect(detectEducationLevel("High School")).toBe(EducationLevel.HighSchool);
	});

	it("detects Elementary in Portuguese", () => {
		expect(detectEducationLevel("Ensino Fundamental")).toBe(EducationLevel.Elementary);
	});

	it("detects Elementary in English", () => {
		expect(detectEducationLevel("Elementary School")).toBe(EducationLevel.Elementary);
	});

	it("detects Technical in Portuguese", () => {
		expect(detectEducationLevel("Curso Técnico")).toBe(EducationLevel.Technical);
	});

	it("detects Technical in English", () => {
		expect(detectEducationLevel("Technical Course")).toBe(EducationLevel.Technical);
	});

	it("detects Technologist", () => {
		expect(detectEducationLevel("Tecnólogo")).toBe(EducationLevel.Technologist);
	});

	it("detects Associate Degree", () => {
		expect(detectEducationLevel("Associate Degree")).toBe(EducationLevel.Technologist);
	});

	it("detects Bachelor in Portuguese", () => {
		expect(detectEducationLevel("Bacharelado")).toBe(EducationLevel.Bachelor);
	});

	it("detects Bachelor in English", () => {
		expect(detectEducationLevel("Bachelor's Degree")).toBe(EducationLevel.Bachelor);
	});

	it("detects Graduação", () => {
		expect(detectEducationLevel("Graduação")).toBe(EducationLevel.Bachelor);
	});

	it("detects Postgraduate", () => {
		expect(detectEducationLevel("Pós-Graduação")).toBe(EducationLevel.PostGraduate);
	});

	it("detects MBA", () => {
		expect(detectEducationLevel("MBA")).toBe(EducationLevel.PostGraduate);
	});

	it("detects Master in Portuguese", () => {
		expect(detectEducationLevel("Mestrado")).toBe(EducationLevel.Master);
	});

	it("detects Master in English", () => {
		expect(detectEducationLevel("Master's Degree")).toBe(EducationLevel.Master);
	});

	it("detects Doctorate in Portuguese", () => {
		expect(detectEducationLevel("Doutorado")).toBe(EducationLevel.Doctorate);
	});

	it("detects PhD in English", () => {
		expect(detectEducationLevel("PhD in Computer Science")).toBe(EducationLevel.Doctorate);
	});

	it("detects Post-Doctorate", () => {
		expect(detectEducationLevel("Pós-Doutorado")).toBe(EducationLevel.PostDoctorate);
	});

	it("returns Unknown for unrecognized text", () => {
		expect(detectEducationLevel("Some random text")).toBe(EducationLevel.Unknown);
	});

	it("detects from notes field when degree name is empty", () => {
		const level = detectEducationLevel("", "Cursando Técnico em Informática");
		expect(level).toBe(EducationLevel.Technical);
	});

	it("detects High School from notes", () => {
		const level = detectEducationLevel("", "Ensino Médio Completo");
		expect(level).toBe(EducationLevel.HighSchool);
	});

	it("detects Technologist from notes", () => {
		const level = detectEducationLevel("", "Tecnólogo em Análise e Desenvolvimento de Sistemas");
		expect(level).toBe(EducationLevel.Technologist);
	});

	it("prefers degree name over notes when both present", () => {
		const level = detectEducationLevel("Bachelor's Degree", "Some random notes");
		expect(level).toBe(EducationLevel.Bachelor);
	});
});