<script lang="ts">
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import type { FilterItem } from "@type/components/columnAction.type";
	import type { TableColumn } from "@type/components/table.type";
	import clsx from "clsx";
	import { Eye, EyeOff, RefreshCcw, type Icon } from "lucide-svelte";
	import type { ComponentType } from "svelte";
	import { t } from "svelte-i18n";
	import { portal } from "svelte-portal";

	export let columnId: string;
	export let icon: ComponentType<Icon>;
	export let orderedColumns: TableColumn[];
	export let columns: TableColumn[];
	export let onAfterClick: () => void = () => {};

	const columnActionPopup: PopupSettings = {
		event: "click",
		target: `${columnId}-columnActionPopup`,
		placement: "bottom-end",
		closeQuery: ".listbox-item"
	};

	const hideOrShowColumnPopup: PopupSettings = {
		event: "click",
		target: `hideOrShowColumnPopup`,
		placement: "left-start",
		closeQuery: "",
		state: (event) => {
			hideOrShowColumnOpen = event.state;
		}
	};

	const filterItems: FilterItem[] = [
		{ label: "table.hide_or_show_col", icon: Eye },
		{ label: "table.resize_col", icon: RefreshCcw }
	];

	let portalTarget: string = "body";
	let triggerElement: HTMLElement;
	let popupElement: HTMLElement;
	let hideOrShowColumnOpen: boolean = false;

	/**
	 * Update popup position
	 */
	const updatePopupPosition = () => {
		if (triggerElement && popupElement) {
			popupElement.style.zIndex = "9999";
		}
	};

	/**
	 * Handle set column display/hidden
	 * @param label string
	 */
	const handleDisplayColumn = (label: string) => () => {
		orderedColumns = orderedColumns.map((item) => {
			if (item.label === label) {
				item.isHidden = !item.isHidden;
			}
			return {
				...item
			};
		});
		onAfterClick();
	};

	/**
	 * Reset column width
	 * @param column TableColumn
	 */
	const resetColumnWidth = (column: TableColumn) => {
		column.width = columns.find((item) => item.label === column.label)?.width;
		return column;
	};

	/**
	 * Handle reset column width
	 */
	const handleResetColumnWidth = () => {
		orderedColumns = orderedColumns.map((column) => resetColumnWidth(column));
	};
</script>

<!-- Area: Column Filter Icon -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<i bind:this={triggerElement} use:popup={columnActionPopup} on:click={updatePopupPosition}>
	<svelte:component this={icon} color="#aaaeb4" size={16} class="cursor-pointer" />
</i>

<!-- Area: Column Filter Popup -->
<div
	use:portal={portalTarget}
	bind:this={popupElement}
	class="column-action card absolute w-48 space-y-1 rounded-lg bg-surface-300 p-2 shadow-custom-glass dark:!bg-gray-800"
	data-popup={`${columnId}-columnActionPopup`}
>
	{#each filterItems as item}
		{#if item.label === "table.hide_or_show_col"}
			<button
				class={clsx(
					"mb-1 flex w-full cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-surface-500 dark:!bg-gray-800 dark:hover:!bg-surface-50/10",
					{
						"bg-surface-500 dark:!bg-surface-50/10": hideOrShowColumnOpen,
						"bg-surface-300": !hideOrShowColumnOpen
					}
				)}
				use:popup={hideOrShowColumnPopup}
			>
				<svelte:component
					this={item.icon}
					size={16}
					class={clsx({
						"stroke-primary-500": hideOrShowColumnOpen,
						"stroke-secondary-text-color": !hideOrShowColumnOpen
					})}
				/>
				<span class="text-sm dark:text-surface-600">{$t(item.label)}</span>
			</button>

			<!-- Area: Hide/Show Column Dropdown -->
			<div
				data-popup="hideOrShowColumnPopup"
				class="card !-top-1 z-20 rounded-lg bg-surface-300 p-2 text-sm shadow-custom-glass dark:!bg-gray-800"
			>
				<div
					class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-700 max-h-[300px] w-36 space-y-1 overflow-auto rounded-lg md:w-48"
				>
					{#each orderedColumns.slice(0, orderedColumns.length - 1) as column}
						<label
							class="relative flex items-center space-x-2 [&>input:checked:next-nth]:bg-surface-500"
						>
							<!-- Area: Hidden Checkbox -->
							<input
								class="peer absolute opacity-0 checked:bg-surface-500"
								type="checkbox"
								checked={!column.isHidden}
								on:click={handleDisplayColumn(column.label)}
							/>

							<!-- Area: Visible label that changes based on checkbox state -->
							<span
								class="!ml-0 flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 text-sm font-normal [transition:background-color_0.3s,color_0.3s] hover:bg-surface-500 peer-checked:bg-surface-500 peer-checked:font-semibold dark:hover:bg-surface-50/10 dark:peer-checked:bg-surface-50/10"
							>
								{#if column.isHidden}
									<EyeOff size={16} />
								{:else}
									<Eye size={16} />
								{/if}
								{$t(`${column.label}`)}
							</span>
						</label>
					{/each}
				</div>
			</div>
		{:else}
			<button
				class="listbox-item flex w-full cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-surface-500 dark:bg-gray-800 dark:hover:bg-surface-50/10"
				on:click={handleResetColumnWidth}
			>
				<svelte:component
					this={item.icon}
					size={16}
					class={clsx({
						"stroke-primary-500": hideOrShowColumnOpen,
						"stroke-secondary-text-color": !hideOrShowColumnOpen
					})}
				/>
				<span class="text-sm dark:text-surface-600">{$t(item.label)}</span>
			</button>
		{/if}
	{/each}
</div>
