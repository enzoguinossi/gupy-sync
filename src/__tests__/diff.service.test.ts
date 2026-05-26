import { describe, it, expect } from "vitest";
import { diffByKey } from "@/domain/services/diff.service.js";
import { DiffStatus } from "@/domain/services/diff.types.js";

describe("diffByKey", () => {
	const getName = (e: { name: string }) => e.name.toLowerCase().trim();

	it("identifies items to add", () => {
		const left = [{ name: "A" }, { name: "B" }];
		const right = [{ name: "C" }];
		const result = diffByKey(left, right, getName);

		expect(result.added).toHaveLength(2);
		expect(result.added.map((e) => e.name)).toEqual(["A", "B"]);
	});

	it("identifies items to remove", () => {
		const left = [{ name: "A" }];
		const right = [{ name: "B" }, { name: "C" }];
		const result = diffByKey(left, right, getName);

		expect(result.removed).toHaveLength(2);
		expect(result.removed.map((e) => e.name)).toEqual(["B", "C"]);
	});

	it("identifies kept items", () => {
		const left = [{ name: "A" }, { name: "B" }];
		const right = [{ name: "A" }, { name: "C" }];
		const result = diffByKey(left, right, getName);

		expect(result.kept).toHaveLength(1);
		expect(result.kept[0].name).toBe("A");
	});

	it("marks DiffStatus correctly per item", () => {
		const left = [{ name: "A" }, { name: "B" }];
		const right = [{ name: "A" }];
		const result = diffByKey(left, right, getName);

		expect(result.items).toHaveLength(2);
		expect(result.items.find((i) => i.entity.name === "A")!.status).toBe(DiffStatus.Keep);
		expect(result.items.find((i) => i.entity.name === "B")!.status).toBe(DiffStatus.Add);
	});

	it("handles empty left array", () => {
		const left: { name: string }[] = [];
		const right = [{ name: "A" }];
		const result = diffByKey(left, right, getName);

		expect(result.added).toHaveLength(0);
		expect(result.removed).toHaveLength(1);
		expect(result.kept).toHaveLength(0);
	});

	it("handles empty right array", () => {
		const left = [{ name: "A" }];
		const right: { name: string }[] = [];
		const result = diffByKey(left, right, getName);

		expect(result.added).toHaveLength(1);
		expect(result.removed).toHaveLength(0);
		expect(result.kept).toHaveLength(0);
	});

	it("matches case-insensitively", () => {
		const left = [{ name: "English Course" }];
		const right = [{ name: "english course" }];
		const result = diffByKey(left, right, getName);

		expect(result.kept).toHaveLength(1);
		expect(result.added).toHaveLength(0);
		expect(result.removed).toHaveLength(0);
	});

	it("matches by composite key", () => {
		const left = [{ name: "A", issuer: "X" }];
		const right = [{ name: "A", issuer: "Y" }];
		const getComposite = (e: { name: string; issuer: string }) =>
			`${e.name.toLowerCase()}|${e.issuer.toLowerCase()}`;
		const result = diffByKey(left, right, getComposite);

		expect(result.added).toHaveLength(1);
		expect(result.removed).toHaveLength(1);
		expect(result.kept).toHaveLength(0);
	});
});