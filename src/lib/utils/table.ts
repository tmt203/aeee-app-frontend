export const isSelectValueValid = (e: Event): [ok: boolean, val: string] => {
	let ok = false;
	const val = (e.target as HTMLInputElement).value;
	if (val?.length > 0) {
		ok = true;
	}
	return ok ? [ok, val] : [ok, ""];
};

export const isCheckboxValueValid = (e: Event): [ok: boolean, val: string, isChecked: boolean] => {
	let ok = false;
	const val = (e.target as HTMLInputElement).value;
	const isChecked = (e.target as HTMLInputElement).checked;
	if (val?.length > 0) {
		ok = true;
	}
	return ok ? [ok, val, isChecked] : [ok, "", isChecked];
};

/**
 * Calculate page after delete an item
 * @param currentPage number
 * @param pageSize number
 * @param totalItems number
 * @returns number
 */
export const calculatePageAfterDeletion = (
	currentPage: number,
	pageSize: number,
	totalItems: number
): number => {
	const newTotalItems = totalItems - 1;
	const maxPage = Math.ceil(newTotalItems / pageSize);
	const targetPage = currentPage > maxPage ? Math.max(1, maxPage) : currentPage;

	return targetPage;
};
