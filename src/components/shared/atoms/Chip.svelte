<script lang="ts">
	import type { Color, Placement, Size } from "@type/common.type";
	import clsx from "clsx";
	import { onMount } from "svelte";
	import { locale, t } from "svelte-i18n";
	import type { Instance } from "tippy.js";
	import tippy from "tippy.js";
	import Icon from "./Icon.svelte";

	export let size: Size = "xs";
	export let icon: string = "";
	export let variant: Color = "";
	export let rounded: Size = "md";
	export let children: string = "";
	export let pill: boolean = false;
	export let outline: boolean = false;
	export let placement: Placement = "start";
	export let tooltipId: string = "";
	export let tooltipContent: string = "";
	export let onClick: () => void = () => {};

	let tooltipInstance: Instance | null = null;
	let isHaveTooltip: boolean = tooltipContent.length > 0;

	/**
	 * Handle click
	 */
	const handleClick = () => {
		onClick && onClick();
	};

	/**
	 * Init tooltip
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

	// Reactivity to init tooltip based on current language
	$: if ($locale && isHaveTooltip) {
		initializeTooltip();
	}

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		if (typeof document !== "undefined") {
			isHaveTooltip && initializeTooltip();
		}
	});
</script>

<!-- Chip Component -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id={tooltipId}
	class={clsx("chip cursor-default gap-1 font-semibold", $$props.class, {
		// Chip variant
		"variant-filled-primary": variant === "primary" && !outline,
		"variant-filled-secondary": variant === "secondary" && !outline,
		"variant-filled-success": variant === "success" && !outline,
		"bg-info-500 text-white": variant === "info" && !outline,
		"variant-filled-warning": variant === "warning" && !outline,
		"variant-filled-error": variant === "error" && !outline,
		"variant-filled-surface": variant === "surface" && !outline,
		"variant-filled-tertiary": variant === "tertiary" && !outline,
		// Chip outline
		"variant-ghost-primary text-primary-500": variant === "primary" && outline,
		"variant-ghost-secondary text-secondary-500": variant === "secondary" && outline,
		"variant-ghost-success text-success-500": variant === "success" && outline,
		"border border-info-500 bg-info-300/70 text-info-500/95": variant === "info" && outline,
		"variant-ghost-warning text-warning-700": variant === "warning" && outline,
		"variant-ghost-error text-error-500": variant === "error" && outline,
		"variant-ghost-tertiary text-tertiary-500": variant === "tertiary" && outline,
		"variant-ghost-surface border border-surface-800 text-surface-800 dark:text-surface-600":
			variant === "surface" && outline,
		// Chip rounded
		"rounded-sm": rounded === "xs",
		rounded: rounded === "sm",
		"rounded-md": rounded === "md",
		"rounded-lg": rounded === "lg",
		"rounded-xl": rounded === "xl",
		"rounded-2xl": rounded === "2xl",
		// Chip pill
		"!rounded-full": pill,
		// Chip size
		"h-5": size === "xs",
		"h-6": size === "sm",
		"h-7": size === "md",
		"h-8": size === "lg",
		"h-9": size === "xl",
		"h-10": size === "2xl"
	})}
	on:click={handleClick}
>
	{#if placement === "start" && icon}
		<Icon {icon} color={variant} size="xs" />
	{/if}

	{#if children}
		{$t(children)}
	{:else}
		<slot />
	{/if}

	{#if placement === "end" && icon}
		<Icon {icon} color={variant} size="xs" />
	{/if}
</div>
