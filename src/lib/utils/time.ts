import { format } from "date-fns";

export const parseToFormat = (
	str: string | null | Date = "",
	formatDate: string = "yyyy-MM-dd HH:mm:ss"
) => {
	if (str instanceof Date) return format(str, formatDate);
	if (str == null || str.length < 1) return "";
	const date = new Date(str);
	return format(date, formatDate);
};
