<script lang="ts">
	import {
		Autocomplete,
		InputChip,
		popup,
		type AutocompleteOption,
		type PopupSettings
	} from "@skeletonlabs/skeleton";
	import type { Direction, InputElementType, SelectOption, Size } from "@type/common.type";
	import { handleFloatNumberInput, handleKeyDownInputNumber } from "@utils/input";
	import clsx from "clsx";
	import { t } from "svelte-i18n";
	import "tippy.js/dist/tippy.css";
	import Icon from "../atoms/Icon.svelte";

	export let rows: number = 3;
	export let size: Size = "md";
	export let label: string = "";
	export let labelClass: string = "max-w-fit";
	export let value = $$props.value;
	export let placeholder: string = "";
	export let pattern: string = ".*";
	export let required: boolean = false;
	export let showErrorMessage: boolean = false;
	export let options: SelectOption[] = [];
	export let direction: Direction = "row";
	export let feedback: string = "";
	export let errorMessage: string = "";
	export let type: InputElementType = $$props.type;
	export let searchOption: AutocompleteOption<string>[] = [];
	export let files: FileList | undefined | null = ($$props.files = null);
	export let onSearch: (event: CustomEvent<AutocompleteOption<string>>) => void = (
		_event: CustomEvent<AutocompleteOption<string>>
	) => {};
	export let onChange: (event: Event) => void = (_event: Event) => {};
	export let onBlur: (event: Event) => void = (_event: Event) => {};
	export let onInput: (event: Event) => void = (_event: Event) => {};
	export let onKeyDown: (event: KeyboardEvent) => void = (_event: KeyboardEvent) => {};
	export let onPaste: (event: ClipboardEvent) => void = (_event: ClipboardEvent) => {};
	export let onInvalid: (event: Event) => void = (_event: Event) => {};
	export let onAddChip: (
		event: CustomEvent<{ event: Event; chipIndex: number; chipValue: string }>
	) => void = (_event: CustomEvent<{ event: Event; chipIndex: number; chipValue: string }>) => {};
	export let onInputChipValidation: (...args: any[]) => boolean = () => true;

	let showPassword: boolean = false;
	let popupSearch: PopupSettings = {
		event: "focus-click",
		target: "popupSearch",
		placement: "bottom"
	};

	/**
	 * Handle search keyword
	 * @param event CustomEvent<AutocompleteOption<string>>
	 */
	const onSearchSelection = (event: CustomEvent<AutocompleteOption<string>>) => {
		value = event.detail.label;
		onSearch && onSearch(event);
	};

	/**
	 * Handle show password
	 * @param event Event
	 */
	const handleShowPassword = (event: Event) => {
		showPassword = !showPassword;

		const target = event.target as HTMLElement;
		const targetInput = target.parentElement?.parentElement?.firstElementChild as HTMLInputElement;
		if (targetInput && targetInput.hasAttribute("type")) {
			targetInput.setAttribute("type", targetInput.type === "text" ? "password" : "text");
		}
	};

	/**
	 * Handle change
	 * @param event Event
	 */
	const handleChange = (event: Event) => {
		if (errorMessage?.length) errorMessage = "";
		onChange && onChange(event);
	};

	/**
	 * Handle input
	 * @param event Event
	 */
	const handleInput = (event: Event) => {
		onInput && onInput(event);
	};
</script>

<label
	class={clsx("relative flex w-full gap-2", $$props.class, {
		"flex-col": direction === "column",
		"flex-row items-center": direction === "row",
		// Size
		"[&_input]:h-7 [&_select]:h-7": size === "sm",
		"[&_input]:h-9 [&_select]:h-9": size === "md",
		"[&_input]:h-10 [&_select]:h-10": size === "lg",
		"[&_input]:h-12 [&_select]:h-12": size === "xl",
		"[&_input]:h-14 [&_select]:h-14": size === "2xl"
	})}
>
	<!-- Area: Label -->
	{#if label}
		<div class={labelClass}>
			<slot name="left-label" />
			<span class="text-sm">
				{$t(label)}
				{#if required}
					<small class="align-super text-error-500">*</small>
				{/if}
			</span>
			<slot name="right-label" />
		</div>
	{/if}

	<!-- Area: Input -->
	<div class="relative flex items-center gap-2">
		<div
			class={clsx("input-form-wrapper [&>input]:text-sm", {
				"[>]:!pr-7": errorMessage?.length
			})}
		>
			<!-- Input select -->
			{#if type === "select"}
				<select
					class={clsx(
						"select rounded-xl border py-1 text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800 dark:[&>option]:!bg-gray-700",
						{
							"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
					{required}
					disabled={$$props.disabled}
					on:change={handleChange}
					bind:value
				>
					{#if options && options.length}
						{#each options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					{:else}
						<option value="" class="text-surface-600" disabled>{$t("no_data")}</option>
					{/if}
				</select>
			{:else if type === "textarea"}
				<!-- Input textarea -->
				<textarea
					{rows}
					{required}
					disabled={$$props.disabled}
					class={clsx(
						"scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-700 textarea rounded-xl border text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800",
						{
							"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
					placeholder={$t(placeholder)}
					style={$$props["fieldSizingContent"] ? "field-sizing: content;" : ""}
					bind:value
					on:blur={onBlur}
				/>
			{:else if type === "file"}
				<!-- Input file -->
				<input
					id={$$props.id}
					class={clsx(
						"input !h-fit border-dashed text-sm file:rounded file:border-none file:!bg-primary-500 file:px-3 file:py-1 file:!text-white placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800",
						{
							"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
					type="file"
					accept={$$props.accept}
					{required}
					bind:files
					on:change={handleChange}
				/>
			{:else if type === "search"}
				<!-- Input Search -->
				<input
					placeholder={$t(placeholder)}
					type="search"
					class="autocomplete input border !border-slate-300 text-sm placeholder:text-sm placeholder:text-surface-700 focus:!border-primary-500 focus:shadow-md dark:!bg-gray-700 dark:placeholder:text-surface-800"
					bind:value
					use:popup={popupSearch}
				/>
				<!-- Area: Search popup -->
				<div
					tabindex="-1"
					data-popup="popupSearch"
					class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-700 card max-h-48
						overflow-y-auto rounded-xl p-4 dark:!bg-gray-700"
				>
					<Autocomplete
						options={searchOption}
						bind:input={value}
						on:selection={onSearchSelection}
					/>
				</div>
			{:else if type === "password"}
				<!-- Input password -->
				<div
					class={clsx(
						"input-group input-group-divider grid-cols-[1fr_auto] border text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800",
						{
							"!border-slate-300 focus-within:!border-primary-500 focus-within:shadow-md":
								!errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
				>
					<input
						type="password"
						placeholder={$t(placeholder)}
						bind:value
						class={clsx(
							"input border text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800"
						)}
					/>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="w-12 !p-0" on:click={handleShowPassword}>
						<i
							class={clsx(
								"flex h-full w-full items-center !justify-center text-lg text-slate-500",
								{
									"uil uil-eye-slash": showPassword,
									"uil uil-eye": !showPassword
								}
							)}
						/>
					</div>
				</div>
			{:else if type === "number"}
				<!-- Input Number -->
				<input
					{...$$props}
					{required}
					type="number"
					class={clsx(
						"input border text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800",
						{
							"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
					placeholder={$t(placeholder)}
					on:change={handleChange}
					on:input={handleInput}
					on:keydown={handleKeyDownInputNumber()}
					bind:value
				/>
			{:else if type === "float-number"}
				<!-- Float number input -->
				<input
					{...$$props}
					{required}
					type="number"
					step="0.000001"
					class={clsx(
						"input border text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800",
						{
							"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
					placeholder={$t(placeholder)}
					on:change={handleFloatNumberInput}
					on:input={handleInput}
					on:keydown={handleKeyDownInputNumber(["."])}
					on:paste={onPaste}
					bind:value
				/>
			{:else if type === "input-chip"}
				<InputChip
					id={$$props.id}
					name={$$props.name}
					placeholder={$$props.placeholder}
					minlength={1}
					allowDuplicates
					regionInput="input placeholder:text-surface-700 dark:placeholder:text-surface-800 dark:!bg-gray-700"
					rounded={clsx("rounded-xl h-full px-3 ", {
						"border-surface-600 dark:!border-surface-200 dark:!bg-gray-700": !errorMessage?.length,
						"!border-error-500": errorMessage?.length
					})}
					{value}
					invalid=""
					validation={onInputChipValidation}
					on:add={onAddChip}
				/>
			{:else}
				<!-- Generic input -->
				<input
					{...$$props}
					{required}
					{pattern}
					class={clsx(
						"input border text-sm placeholder:text-sm placeholder:text-surface-700 dark:!bg-gray-700 dark:placeholder:text-surface-800",
						{
							"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
							"!border-error-500": errorMessage?.length
						}
					)}
					placeholder={$t(placeholder)}
					on:change={handleChange}
					on:input={handleInput}
					on:keydown={onKeyDown}
					on:paste={onPaste}
					on:blur={onBlur}
					on:invalid={onInvalid}
					bind:value
				/>
			{/if}
		</div>

		<!-- Feedback -->
		{#if feedback?.length}
			<Icon
				color="primary"
				icon="uil uil-info-circle"
				tooltipId={`${$$props.id}-feedback-message`}
				tooltipContent={feedback}
			/>
		{/if}

		<!-- Error -->
		{#if !showErrorMessage && errorMessage?.length}
			<div class="absolute right-2">
				<Icon
					color="error"
					icon="uil uil-exclamation-circle"
					tooltipId={`${$$props.id}-error-message`}
					tooltipContent={errorMessage}
				/>
			</div>
		{/if}
	</div>

	<!-- Area: Error message -->
	{#if showErrorMessage && errorMessage?.length}
		<span class="text-xs text-error-500">
			{$t(errorMessage)}
		</span>
	{/if}
</label>
