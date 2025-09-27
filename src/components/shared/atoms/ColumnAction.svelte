<script lang="ts">
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import type { FilterItem } from "@type/components/columnAction.type";
	import type { TableColumn } from "@type/components/table.type";
	import clsx from "clsx";
	import { EyeOff, Pin, PinOff, type Icon } from "lucide-svelte";
	import { onMount, type ComponentType } from "svelte";
	import { t } from "svelte-i18n";
	import { portal } from "svelte-portal";

	export let columnId: string;
	export let icon: ComponentType<Icon>;
	export let orderedColumns: TableColumn[] = [];
	export let isPinned: "left" | "right" | undefined;
	export let onAfterClick: () => void = () => {};

	const columnActionPopup: PopupSettings = {
		event: "click",
		target: `${columnId}-columnActionPopup`,
		placement: "bottom-end",
		closeQuery: ".listbox-item"
	};

	let popupElement: HTMLElement;
	let triggerElement: HTMLElement;
	let portalTarget: string = "body";
	let filterItems: FilterItem[] = [];

	/**
	 * Update popup position
	 */
	const updatePopupPosition = () => {
		if (triggerElement && popupElement) {
			triggerElement.style.display = "block";
			popupElement.style.zIndex = "9999";
		}
	};

	/**
	 * Handle column action item click
	 * @param label string
	 */
	const handleColumnActionItemClick = (label: string) => {
		if (label === "table.hide_col") {
			orderedColumns = orderedColumns.map((item) =>
				item.label === columnId ? { ...item, isHidden: !item.isHidden } : item
			);
			onAfterClick();
			return;
		}
		if (label === "table.pin_col" || label === "table.unpin_col") {
			orderedColumns = orderedColumns.map((item) => {
				if (item.label === columnId) {
					item.pinned = item.pinned ? undefined : "left";
				}
				return {
					...item
				};
			});
			let midColumns = orderedColumns.filter((col) => !col.pinned);
			midColumns.sort((a, b) => {
				if (a.index === undefined) return 1;
				if (b.index === undefined) return -1;
				return a.index - b.index;
			});
			orderedColumns = [
				...orderedColumns.filter((col) => col.pinned === "left"),
				...midColumns,
				...orderedColumns.filter((col) => col.pinned === "right")
			];
			onAfterClick();
			return;
		}
	};

	/**
	 * Handle click
	 * @param label string
	 */
	const handleClick = (label: string) => () => {
		// Handle logic
		handleColumnActionItemClick(label);

		// Hide column action icon
		setTimeout(() => {
			const triggerElement = document.getElementById(`${columnId}-trigger`);
			if (triggerElement) {
				triggerElement.style.display = "none";
			}
		}, 200);
	};

	/**
	 * Handle outside click to hide the trigger
	 * @param event MouseEvent
	 */
	const handleOutsideClick = (event: MouseEvent) => {
		if (
			triggerElement &&
			!triggerElement.contains(event.target as Node) &&
			popupElement &&
			!popupElement.contains(event.target as Node)
		) {
			setTimeout(() => {
				triggerElement.style.display = "none";
			}, 200);
		}
	};

	$: filterItems = [
		{ label: `table.${isPinned ? "unpin_col" : "pin_col"}`, icon: isPinned ? PinOff : Pin },
		{ label: "table.hide_col", icon: EyeOff }
	];

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		document.addEventListener("click", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	});
</script>

<!-- Area: Column Filter Icon -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<i
	id={`${columnId}-trigger`}
	bind:this={triggerElement}
	use:popup={columnActionPopup}
	on:click={updatePopupPosition}
>
	<svelte:component
		this={icon}
		class="stroke-text-secondary-color cursor-pointer"
		strokeWidth={2.5}
		size={16}
	/>
</i>

<!-- Area: Column Filter Popup -->
<div
	use:portal={portalTarget}
	bind:this={popupElement}
	class="column-action card absolute w-48 space-y-1 rounded-lg bg-surface-300 p-2 shadow-custom-glass dark:!bg-tertiary-600"
	data-popup={`${columnId}-columnActionPopup`}
>
	{#each filterItems as item}
		<button
			class="listbox-item flex w-full cursor-pointer items-center justify-between rounded-lg bg-surface-300 p-2 hover:bg-surface-500 dark:bg-tertiary-600 dark:hover:bg-surface-50/10"
			on:click={handleClick(item.label)}
		>
			<svelte:component this={item.icon} size={16} class="stroke-secondary-text-color" />
			<span class="text-sm font-normal dark:text-surface-600">{$t(item.label)}</span>
		</button>
	{/each}
</div>
