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
export type TypeVariant = "filled" | "soft" | "ghost" | "ringed" | "none";
export type Placement = "start" | "end" | "center" | string;
export type Direction = "row" | "column" | "stacked" | string;
export type Shape = "line" | "circle" | "square" | string;

export type TableIndex = {
	index: number;
};

export type FilterParams = {
	label: string;
	value: string | number | boolean | null;
};

export type InputElementType =
	| "month"
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

export type AuditInfo = {
	id: string;
	created_at: Date | string;
	created_by: string;
	updated_at: Date | string;
	updated_by: string;
};

export type SelectOption = {
	label: string;
	value: string | number | boolean;
	disabled?: boolean;
	notAllowed?: boolean;
	noTranslate?: boolean;
};

export type Param = {
	limit?: number;
	offset?: number;
	sort?: string;
	fields?: string;
};
