/**
 * Remove empty fields from an object.
 * @param obj Record<string, any>
 * @returns Record<string, any>
 */
export const removeEmptyFields = (obj: Record<string, any>): Record<string, any> => {
	Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] === "") && delete obj[key]);
	return obj;
};

/**
 * Normalize filter parameters.
 * @param params <T extends Record<string, any>>
 * @returns Record<string, any>
 */
export const normalizeFilterParams = <T extends Record<string, any>>(
	params: T
): Record<string, any> => {
	const result: Record<string, any> = {};

	for (const [key, value] of Object.entries(params)) {
		if (value && typeof value === "object" && "value" in value) {
			result[key] = value.value;
		} else {
			result[key] = value;
		}
	}

	return result;
};
