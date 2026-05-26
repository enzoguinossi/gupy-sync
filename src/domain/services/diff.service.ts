import { DiffItem, DiffResult, DiffStatus } from "./diff.types.js";

export function diffByKey<T>(
	fromLeft: T[],
	fromRight: T[],
	getKey: (entity: T) => string,
): DiffResult<T> {
	const added: T[] = [];
	const removed: T[] = [];
	const kept: T[] = [];
	const items: DiffItem<T>[] = [];

	const rightKeys = fromRight.map(getKey);
	const rightMatched = new Set<number>();

	for (const left of fromLeft) {
		const leftKey = getKey(left);
		const idx = rightKeys.findIndex((k, i) => !rightMatched.has(i) && k === leftKey);
		if (idx !== -1) {
			rightMatched.add(idx);
			kept.push(left);
			items.push({ entity: left, status: DiffStatus.Keep });
		} else {
			added.push(left);
			items.push({ entity: left, status: DiffStatus.Add });
		}
	}

	for (let i = 0; i < fromRight.length; i++) {
		if (!rightMatched.has(i)) {
			removed.push(fromRight[i]);
			items.push({ entity: fromRight[i], status: DiffStatus.Remove });
		}
	}

	return { items, added, removed, kept };
}