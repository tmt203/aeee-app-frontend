/**
 * Handle keydown for number input
 * Allows only numbers, "+" character, and handles copy & paste
 * Prevents entering "c" and "v" unless used with Ctrl or Cmd
 * @param event KeyboardEvent
 */
export const handleKeyDownPhoneNumber = (event: KeyboardEvent) => {
	const allowedKeys = [
		"Backspace",
		"Tab",
		"ArrowLeft",
		"ArrowRight",
		"Delete",
		"Control",
		"Meta",
		"Shift",
		"+"
	];

	// Allow numeric keys (0-9), "+" and allowed control/navigation keys
	if (
		(event.key >= "0" && event.key <= "9") || // Numbers 0-9
		allowedKeys.includes(event.key) || // Allowed control/navigation keys
		(event.ctrlKey &&
			(event.key === "a" || event.key === "v" || event.key === "c" || event.key === "x")) || // Allow Ctrl+V, Ctrl+C, Ctrl+X
		(event.metaKey &&
			(event.key === "a" || event.key === "v" || event.key === "c" || event.key === "x")) // Allow Cmd+V, Cmd+C, Cmd+X on Mac
	) {
		return; // Allow the keypress
	}

	// Prevent any other key, including "c" and "v" when not used with Ctrl/Cmd
	event.preventDefault();
};

/**
 * Handle paste event to allow only numbers and "+" character
 * @param event ClipboardEvent
 */
export const handlePastePhoneNumber = (event: ClipboardEvent) => {
	const pastedData = event.clipboardData?.getData("text");

	// Validate if the pasted content only contains numbers and "+" character
	if (pastedData && !/^[0-9+]+$/.test(pastedData)) {
		event.preventDefault(); // Prevent the paste if it contains invalid characters
	}
};

/**
 * Handle keydown for allowed characters
 * @param allowedChars Optional array of allowed characters
 */
export const handleKeyDownInputNumber =
	(allowedChars: string[] = []) =>
	(event: KeyboardEvent) => {
		const allowedKeys = [
			"Backspace",
			"Tab",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
			"ArrowUp",
			"ArrowDown",
			...allowedChars
		];

		// Allow numbers (0-9) and numpad numbers
		if (
			(event.key >= "0" && event.key <= "9") ||
			(event.key >= "Numpad0" && event.key <= "Numpad9") ||
			allowedKeys.includes(event.key)
		) {
			return;
		}

		event.preventDefault();
	};

/**
 * Handle on input float number
 * @param event Event
 */
export const handleFloatNumberInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const validValue = target.value.match(/^[0-9]*\.?[0-9]*$/)
		? target.value
		: target.value.slice(0, -1);
	target.value = validValue;
};
