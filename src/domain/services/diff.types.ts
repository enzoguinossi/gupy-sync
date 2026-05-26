export enum DiffStatus {
	Add = "add",
	Remove = "remove",
	Keep = "keep",
}

export interface DiffItem<T> {
	entity: T;
	status: DiffStatus;
}

export interface DiffResult<T> {
	items: DiffItem<T>[];
	added: T[];
	removed: T[];
	kept: T[];
}