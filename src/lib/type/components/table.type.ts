export interface TableColumn {
	placement?: "center" | "left" | "right" | "justify" | "char" | null;
	label: string;
	labelClass?: string;
	cellClass?: string;
	key?: string;
	dataType: ColumnType;
	data?: TableColumnAction[];
	render?: (row: Record<string, unknown>) => unknown;
	action?: TableColumnAction;
	searchable?: boolean;
	sort?: boolean;
	isHidden?: boolean;
	width?: number;
	pinned?: "left" | "right";
	index?: number;
}

export enum ColumnType {
	Text = "text",
	Raw = "raw",
	DateTime = "date-time",
	Action = "action",
	Number = "number"
}

export enum ActionType {
	Link = "link",
	Function = "function"
}

export interface TableColumnAction {
	isHidden?: boolean;
	icon?: string;
	title?: string;
	actionType?: ActionType;
	link?: string;
	function?: (row: Record<string, unknown>) => void;
	component?: (row: Record<string, unknown>) => ConstructorOfATypedSvelteComponent;
	props?: (row: Record<string, unknown>) => Record<string, unknown>;
}

export interface SortColumn {
	order: "asc" | "desc" | "default";
}
