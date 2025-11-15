<script lang="ts">
	import type { Color, Size } from "@type/common.type";
	import { Icons, type RowActionIconData } from "@type/components/icon.type";
	import clsx from "clsx";
	import { Icon } from "lucide-svelte";
	import { onDestroy, onMount, type ComponentType } from "svelte";
	import { locale, t } from "svelte-i18n";
	import { portal } from "svelte-portal";
	import tippy, { type Instance } from "tippy.js";
	import "tippy.js/dist/tippy.css";

	export let id: string = "";
	export let size: Size = "md";
	export let color: Color = "none";
	export let disabled: boolean = false;

	export let rowAction: boolean = false;
	export let rowActionData: RowActionIconData[] = [];

	export let tooltipId: string = "";
	export let tooltipContent: string = "";

	export let icon: string | keyof typeof Icons | ComponentType<Icon>;
	export let onClick: () => void = () => {};

	let iconName = Icons[icon as keyof typeof Icons] || "";
	let tooltipInstance: Instance | null = null;
	let isHaveTooltip: boolean = tooltipContent.length > 0;
	let iconElement: HTMLElement;
	let popupElement: HTMLElement | null = null;
	let isPopupOpen = false;
	let portalTarget: string = "body";

	/**
	 * Handle icon click
	 */
	const handleIconClick = () => {
		if (disabled) return;
		if (rowAction) {
			togglePopup();
		} else {
			onClick && onClick();
		}
	};

	/**
	 * Toggle popup visibility
	 */
	const togglePopup = () => {
		isPopupOpen = !isPopupOpen;

		if (isPopupOpen) {
			// Close all other popups first
			const popups = document.querySelectorAll(".row-action-popup");
			popups.forEach((p) => {
				if (p.id !== id) {
					p.classList.add("hidden");
				}
			});

			// Show current popup
			updatePopupPosition();
		} else {
			// Close the popup
			if (popupElement) {
				popupElement.classList.add("hidden");
			}
		}
	};

	/**
	 * Update popup position to avoid being hidden by header
	 */
	const updatePopupPosition = () => {
		if (!iconElement || !isPopupOpen) return;

		const popup = document.getElementById(id);
		if (!popup) return;

		popupElement = popup;

		// Get position of the icon relative to viewport
		const iconRect = iconElement.getBoundingClientRect();

		// Check if there's enough space below
		const spaceBelow = window.innerHeight - iconRect.bottom;
		const popupHeight = popup.offsetHeight;

		// Set styles directly for more control - this overrides Skeleton's positioning
		// Use fixed positioning to maintain position during scroll
		popup.style.position = "fixed";
		popup.style.zIndex = "100";

		// Position horizontally to the left of the icon (since it's right-aligned)
		popup.style.left = `${iconRect.left - popup.offsetWidth + iconRect.width - 250}px`;

		// If not enough space below, position above
		if (spaceBelow < popupHeight && iconRect.top > popupHeight) {
			popup.style.top = `${iconRect.top - popupHeight}px`;
		} else {
			popup.style.top = `${iconRect.bottom - 20}px`;
		}

		// Ensure popup is visible
		popup.classList.remove("hidden");
	};

	/**
	 * Initialize tooltip
	 */
	const initializeTooltip = () => {
		if (typeof document === "undefined") return;
		if (tooltipInstance) tooltipInstance.destroy();
		if (isHaveTooltip && tooltipId) {
			const element = document.getElementById(tooltipId);
			if (element) {
				tooltipInstance = tippy(element, {
					content: $t(tooltipContent),
					maxWidth: 500
				});
			}
		}
	};

	/**
	 * Handle click outside to close popup
	 */
	const handleClickOutside = (event: MouseEvent) => {
		if (
			isPopupOpen &&
			popupElement &&
			!popupElement.contains(event.target as Node) &&
			iconElement &&
			!iconElement.contains(event.target as Node)
		) {
			isPopupOpen = false;
			if (popupElement) {
				popupElement.classList.add("hidden");
			}
		}
	};

	// Reactivity to init tooltip based on current language
	$: if ($locale && isHaveTooltip) {
		initializeTooltip();
	}

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		if (typeof document !== "undefined") {
			// iconName = `${iconName}`.replace("<svg", '<svg class="svg-custom-icon"') as unknown as Icons;
			isHaveTooltip && initializeTooltip();

			// Add event listeners
			document.addEventListener("click", handleClickOutside);
			window.addEventListener("resize", updatePopupPosition);
		}
	});

	/**
	 * Run immediately before the component is unmounted.
	 */
	onDestroy(() => {
		// Clean up event listeners
		document.removeEventListener("click", handleClickOutside);
		window.removeEventListener("resize", updatePopupPosition);
	});
</script>

{#if rowAction}
	<div class="relative" bind:this={iconElement}>
		{#if typeof icon === "function"}
			<button on:click={handleIconClick} type="button">
				<svelte:component
					this={icon}
					size={clsx({
						"12": size === "xs",
						"14": size === "sm",
						"16": size === "md",
						"18": size === "lg",
						"20": size === "xl",
						"22": size === "2xl"
					})}
					color={clsx({
						"#1075BA": color === "primary",
						"#F0592C": color === "secondary",
						"#E2E8F0": color === "surface",
						"#0BAA60": color === "success",
						"#06b6d4": color === "info",
						"#FFCB45": color === "warning",
						"#CF2A2A": color === "error",
						"#003745": color === "tertiary"
					})}
					class="cursor-pointer"
				/>
			</button>
		{/if}

		<div
			{id}
			class="row-action-popup absolute hidden w-48 space-y-1 rounded-lg bg-surface-300 p-2 shadow-custom-glass dark:!bg-gray-800"
			use:portal={portalTarget}
		>
			{#each rowActionData as item}
				<button
					disabled={item.disabled}
					class={clsx(
						"listbox-item text-{item.color}-500 flex w-full cursor-pointer items-center justify-between rounded-lg bg-surface-300 p-2 hover:bg-surface-500 dark:bg-gray-800 dark:hover:bg-surface-50/10",
						{
							"!cursor-not-allowed opacity-50": item.disabled
						}
					)}
					on:click={() => {
						item.onClick();
						isPopupOpen = false;
						if (popupElement) {
							popupElement.classList.add("hidden");
						}
					}}
					type="button"
				>
					{#if item.icon}
						<svelte:component
							this={item.icon}
							size={16}
							color={clsx({
								"#1075BA": item.color === "primary",
								"#F0592C": item.color === "secondary",
								"#E2E8F0": item.color === "surface",
								"#0BAA60": item.color === "success",
								"#06b6d4": item.color === "info",
								"#FFCB45": item.color === "warning",
								"#CF2A2A": item.color === "error",
								"#003745": item.color === "tertiary"
							})}
						/>
					{/if}
					<span
						class={clsx("text-sm font-normal", {
							"text-primary-500": item.color === "primary",
							"text-secondary-500": item.color === "secondary",
							"text-success-500": item.color === "success",
							"text-info-500": item.color === "info",
							"text-warning-700": item.color === "warning",
							"text-error-500": item.color === "error",
							"text-surface-500": item.color === "surface",
							"text-tertiary-500": item.color === "tertiary"
						})}>{$t(item.label)}</span
					>
				</button>
			{/each}
		</div>
	</div>
{:else}
	{#if typeof icon === "function"}
		<button
			id={tooltipId}
			{disabled}
			class="disabled:opacity-75"
			on:click={handleIconClick}
			bind:this={iconElement}
		>
			<svelte:component
				this={icon}
				size={clsx({
					"12": size === "xs",
					"14": size === "sm",
					"16": size === "md",
					"18": size === "lg",
					"20": size === "xl",
					"22": size === "2xl"
				})}
				color={clsx({
					"#1075BA": color === "primary",
					"#F0592C": color === "secondary",
					"#E2E8F0": color === "surface",
					"#0BAA60": color === "success",
					"#06b6d4": color === "info",
					"#FFCB45": color === "warning",
					"#CF2A2A": color === "error",
					"#003745": color === "tertiary"
				})}
				class="cursor-pointer"
			/>
		</button>
	{/if}

	{#if iconName}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			id={tooltipId}
			{...$$props}
			class={clsx("flex w-fit items-center justify-center", $$props.class, {
				// Icon color
				"[&_.svg-custom-icon]:fill-primary-500": color === "primary",
				"[&_.svg-custom-icon]:fill-secondary-500": color === "secondary",
				"[&_.svg-custom-icon]:fill-success-500": color === "success",
				"[&_.svg-custom-icon]:fill-info-500": color === "info",
				"[&_.svg-custom-icon]:fill-warning-700": color === "warning",
				"[&_.svg-custom-icon]:fill-error-500": color === "error",
				"[&_.svg-custom-icon]:fill-surface-700": color === "surface",
				"[&_.svg-custom-icon]:fill-tertiary-500": color === "tertiary",
				// Icon size
				"[&_.svg-custom-icon]:h-[10px] [&_.svg-custom-icon]:w-[10px]": size === "xs",
				"[&_.svg-custom-icon]:h-3 [&_.svg-custom-icon]:w-3": size === "sm",
				"[&_.svg-custom-icon]:h-4 [&_.svg-custom-icon]:w-4": size === "md",
				"[&_.svg-custom-icon]:h-6 [&_.svg-custom-icon]:w-6": size === "lg",
				"[&_.svg-custom-icon]:h-[30px] [&_.svg-custom-icon]:w-[30px]": size === "xl",
				"[&_.svg-custom-icon]:h-9 [&_.svg-custom-icon]:w-9": size === "2xl",
				"cursor-pointer": !disabled,
				"!cursor-not-allowed opacity-50": disabled
			})}
			on:click={handleIconClick}
			bind:this={iconElement}
		>
			{@html iconName}
		</div>
	{:else}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<i
			id={tooltipId}
			class={clsx(`${icon}`, "flex", $$props.class, {
				// Icon with <i>
				"text-primary-500": color === "primary",
				"text-secondary-500": color === "secondary",
				"text-success-500": color === "success",
				"text-info-500": color === "info",
				"text-warning-700": color === "warning",
				"text-error-500": color === "error",
				"text-surface-500": color === "surface",
				"text-tertiary-500": color === "tertiary",
				// Icon size
				"text-xs": size === "xs",
				"text-sm": size === "sm",
				"text-base": size === "md",
				"text-xl": size === "lg",
				"text-3xl": size === "xl",
				"text-4xl": size === "2xl",
				"cursor-pointer": !disabled,
				"!cursor-not-allowed !text-surface-700": disabled
			})}
			on:click={handleIconClick}
			bind:this={iconElement}
		/>
	{/if}
{/if}
