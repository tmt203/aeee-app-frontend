export type Color =
	| "primary"
	| "secondary"
	| "success"
	| "info"
	| "warning"
	| "danger"
	| "error"
	| "tertiary"
	| "light"
	| "dark"
	| "transparent"
	| "surface"
	| "none"
	| string;

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "fit" | string;
export type TypeVariant = "filled" | "soft" | "ghost" | "ringed";
export type Placement = "start" | "end" | "center" | string;
export type Direction = "row" | "column" | "stacked" | string;
export type Shape = "line" | "circle" | "square" | string;
export interface TableIndex {
	index: number;
}

export interface SelectOption {
	label: string;
	value: string | number | string[] | number[] | boolean | boolean[];
}

export interface FilterParams {
	label: string;
	value: string;
}

export type InputElementType =
	| "email"
	| "file"
	| "hidden"
	| "number"
	| "password"
	| "tel"
	| "text"
	| "select"
	| "search"
	| "textarea"
	| "float-number"
	| "input-chip";
