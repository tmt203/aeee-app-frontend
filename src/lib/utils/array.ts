/**
 * Chunks an array into smaller arrays of a specified size.
 * @param array T[]
 * @param size number
 * @returns T[][]
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
	if (size <= 0) return [];
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
};

/**
 * Flattens a 2D array into a 1D array.
 * @param arrays T[][]
 * @returns T[]
 */
export const flattenArray = <T>(arrays: T[][]): T[] => {
	return arrays.reduce((acc, val) => acc.concat(val), []);
};
