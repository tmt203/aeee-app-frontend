/**
 * To Capital Case
 * @param input string
 * @returns string
 */
export const toCapitalCase = (input: string): string =>
	input
		.toLowerCase()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

/**
 * Normalize academic article title to Title Case
 *
 * Example:
 * "an introduction to the theory of computation"
 * -> "An Introduction to the Theory of Computation"
 *
 * @param input string
 * @returns string
 */
export const normalizeTitle = (input: string): string => {
	if (!input) return "";

	const LOWERCASE_WORDS = new Set([
		"a",
		"an",
		"the",
		"and",
		"but",
		"or",
		"nor",
		"for",
		"so",
		"yet",
		"as",
		"at",
		"by",
		"in",
		"of",
		"on",
		"per",
		"to",
		"via",
		"with",
		"from"
	]);

	const words = input.toLowerCase().split(/\s+/);

	return words
		.map((word, index) => {
			const isFirst = index === 0;
			const isLast = index === words.length - 1;

			if (isFirst || isLast) {
				return toCapitalCase(word);
			}

			if (LOWERCASE_WORDS.has(word)) {
				return word; // giữ lowercase
			}

			return toCapitalCase(word);
		})
		.join(" ");
};
