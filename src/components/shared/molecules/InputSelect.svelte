<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import type { Direction, SelectOption, Size } from "@type/common.type";
	import type { SearchParams } from "@type/components/inputSelect.type";
	import clsx from "clsx";
	import { t } from "svelte-i18n";
	import { Icon, Spinner } from "../atoms";

	export let id: string;
	export let label: string = "";
	export let selectedOptionLabel: string = "";
	export let size: Size = "md";
	export let value: string = "";
	export let icon: string = "";
	export let iconSize: Size = "md";
	export let options: SelectOption[] = [];
	export let clearable: boolean = false;
	export let searchable: boolean = false;
	export let searchParams: SearchParams | null = null;
	export let isLoading: boolean = false;
	export let disabled: boolean = false;
	export let direction: Direction = "stacked";
	export let inputPattern: string = ".*";
	export let errorMessage: string = "";
	export let showErrorMessage: boolean = false;
	export let selectClasses: string = "";
	export let onLoadMore: () => void = () => {};
	export let onInput: (event: Event) => void = (_event: Event) => {};
	export let onChange: (event?: Event) => void = (_event?: Event) => {};
	export let onAfterRemove: () => void = () => {};

	let loadMoreBtn: boolean = false;
	let searchOptions: SelectOption[] = [];
	let popupInputSelect: PopupSettings = {
		event: "click",
		target: `${id}-combobox`,
		placement: "bottom-start",
		closeQuery: ".listbox-item"
	};

	/**
	 * Handle remove value
	 */
	const handleRemoveValue = () => {
		if (disabled) return;

		value = "";
		selectedOptionLabel = "";
		searchOptions = options;

		if (searchParams) {
			Object.assign(searchParams, { baseOffset: 0, searchOffset: 0 });
			options = [];
		}

		onAfterRemove && onAfterRemove();
	};

	/**
	 * Handle fetch
	 */
	const handleFetch = () => {
		if (!searchParams) return;

		if (selectedOptionLabel.length) {
			searchParams.searchOffset += searchParams.limit;
		} else {
			searchParams.baseOffset += searchParams.limit;
		}

		onLoadMore && onLoadMore();
	};

	/**
	 * Handle change
	 * @param event Event
	 */
	const handleChange = (event: Event) => {
		if (searchParams) {
			Object.assign(searchParams, { baseOffset: 0, searchOffset: 0 });
			options = [];
		}
		const target = event.target as HTMLSelectElement;
		selectedOptionLabel = target.name;
		onChange && onChange(event);
	};

	/**
	 * Handle on input
	 * @param event Event
	 */
	const handleOnInput = (event: Event) => {
		value = "";
		onInput && onInput(event);
	};

	// Reactivity to update selectedOptionLabel
	$: {
		if (options.length && value?.length) {
			selectedOptionLabel = options.find((item) => item.value === value)?.label || "";
			if (errorMessage?.length) errorMessage = "";
		}

		if (searchable && !searchOptions.length) {
			searchOptions = options;
		}
	}

	// Reactivity to update popupInputSelect based on disabled state
	$: if (disabled) {
		popupInputSelect.target = "undefined";
	} else {
		popupInputSelect.target = `${id}-combobox`;
	}

	// Reactivity to update load more button state
	$: if (searchParams) {
		loadMoreBtn = options.length < searchParams.total;
	}
</script>

<div
	class={clsx(
		"relative",
		{
			"flex gap-2": direction !== "stacked",
			"flex-col": direction === "column",
			"flex-row": direction === "row"
		},
		$$props.class
	)}
>
	{#if direction !== "stacked"}
		<!-- Area: Label (direction = Row/Column) -->
		<label class="text-sm" for={id}>
			{`${$t(label)}`}
			{#if $$props.required}
				<small class="align-super text-error-500">*</small>
			{/if}
		</label>
	{/if}

	<!-- Area: Input Form -->
	<div
		class={clsx(
			"flex min-h-fit w-full cursor-pointer items-center gap-1 rounded-lg border bg-white dark:bg-surface-300/5",
			{
				"hover:brightness-105 hover:filter": direction !== "stacked",
				"border-error-500 shadow-md": errorMessage?.length,
				"dark:border-surface-400/30": !errorMessage?.length
			}
		)}
	>
		<div
			class={clsx("flex w-full items-center gap-1 pl-2", {
				// Size
				"h-[26px]": size === "sm",
				"h-[34px]": size === "md",
				"h-[38px]": size === "lg",
				"h-[46px]": size === "xl",
				"h-[54px]": size === "2xl",

				// Disabled
				"cursor-not-allowed opacity-50": disabled
			})}
			use:popup={popupInputSelect}
		>
			{#if icon.length}
				<!-- Area: Icon -->
				<Icon {icon} size={iconSize} class="text-surface-700" />
			{/if}

			<!-- Area: Label (direction = Stacked) -->
			{#if direction === "stacked"}
				<span class="min-w-fit text-xs font-semibold text-surface-700">
					{#if searchable}
						{`${$t(label)}: `}
					{:else}
						{`${$t(label)}${selectedOptionLabel.length ? ":" : ""} `}
						<span class="text-primary-500">
							{selectedOptionLabel}
						</span>
					{/if}
				</span>
			{/if}

			{#if searchable}
				<input
					{id}
					{disabled}
					name={$$props.name}
					pattern={inputPattern}
					type="text"
					class="h-full w-full rounded-none border-none bg-transparent p-0 text-xs font-semibold text-primary-500 duration-0 placeholder:text-xs placeholder:text-surface-700 focus:border-transparent focus:ring-0"
					placeholder={$$props.placeholder}
					required={$$props.required}
					autocomplete="off"
					bind:value={selectedOptionLabel}
					on:input={handleOnInput}
				/>
			{:else if direction !== "stacked"}
				<span class="text-sm text-primary-500">{selectedOptionLabel}</span>
			{/if}
		</div>

		<div class={clsx("pr-2", { "cursor-not-allowed opacity-50": disabled })}>
			{#if clearable && value?.length}
				<Icon
					icon="uil uil-times-circle"
					onClick={handleRemoveValue}
					class="p-[0.5px]"
					color="primary"
				/>
			{/if}

			{#if errorMessage?.length}
				<Icon
					color="error"
					icon="uil uil-exclamation-circle"
					tooltipId={`${id}-error-message`}
					tooltipContent={errorMessage}
				/>
			{/if}
		</div>
	</div>

	<!-- Area: Error message -->
	{#if showErrorMessage && errorMessage?.length}
		<span class="text-xs text-error-500">
			{errorMessage}
		</span>
	{/if}

	<!-- Area: SelectBox -->
	<div
		class={clsx(
			"card z-50 max-h-72 min-w-max overflow-hidden rounded-lg border shadow-xl !duration-0 dark:border-gray-600",
			{
				"w-max !min-w-full": selectedOptionLabel.length || options.length
			},
			selectClasses
		)}
		data-popup={`${id}-combobox`}
	>
		<div
			class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-700 max-h-[calc(288px-16px)] overflow-auto text-xs dark:bg-gray-700"
			tabindex="-1"
		>
			<ListBox
				rounded="rounded-none"
				hover="hover:bg-surface-500 dark:hover:bg-gray-600"
				active="bg-primary-500/30 dark:bg-tertiary-600"
			>
				{#if options.length}
					{#each options as option}
						<ListBoxItem
							name={option.label}
							value={option.value}
							bind:group={value}
							on:change={handleChange}
						>
							{option.label}
						</ListBoxItem>
					{/each}
					{#if loadMoreBtn}
						<button type="button" class="flex w-full justify-center p-2" on:click={handleFetch}>
							{#if isLoading}
								<div class="ml-2">
									<Spinner size={iconSize} />
								</div>
							{:else}
								<span class="text-sm font-semibold text-primary-500">
									{$t("form.load_more")}
								</span>
							{/if}
						</button>
					{/if}
				{:else}
					<ListBoxItem disabled name="no_data" value="no_data" bind:group={value}>
						{$t("no_data")}
					</ListBoxItem>
				{/if}
			</ListBox>
		</div>
	</div>
</div>
