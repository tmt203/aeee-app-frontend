<script lang="ts">
	import type { Color, Placement, Size, TypeVariant } from "@type/common.type";
	import { Icons } from "@type/components/icon.type";
	import clsx from "clsx";
	import { createEventDispatcher, onMount } from "svelte";
	import { locale, t } from "svelte-i18n";
	import type { Placement as TippyPlacement } from "tippy.js";
	import tippy, { type Instance } from "tippy.js";
	import "tippy.js/dist/tippy.css";
	import "tippy.js/themes/translucent.css";
	import { Icon, Spinner } from "../atoms";

	export let pill: boolean = false;
	export let outline: boolean = false;
	export let onlyIcon: boolean = false;
	export let isLoading: boolean = false;
	export let size: Size = "sm";
	export let iconSize: Size = "md";
	export let label: string = "";
	export let rounded: Size = "md";
	export let iconColor: Color = "none";
	export let variant: Color = "primary";
	export let variantType: TypeVariant = "filled";
	export let placement: Placement = "start";
	export let icon: string | keyof typeof Icons = "";
	export let tooltipId: string = "";
	export let tooltipContent: string = "";
	export let tooltipPlacement: TippyPlacement = "top";
	export let onClick: () => void = () => {};

	let spinnerColor: Color;
	let tooltipInstance: Instance | null = null;
	let isHaveTooltip: boolean = tooltipContent.length > 0;

	const dispatch = createEventDispatcher();

	/**
	 * Handle click
	 */
	const handleClick = (event: Event) => {
		if ($$props.disabled) {
			event?.preventDefault();
			return;
		}
		dispatch("click");
		onClick && onClick();
	};

	/**
	 * Init tooltip
	 */
	const initializeTooltip = () => {
		if (tooltipInstance) tooltipInstance.destroy();
		if (isHaveTooltip && tooltipId) {
			const element = document.getElementById(tooltipId);
			if (element) {
				tooltipInstance = tippy(element, {
					placement: tooltipPlacement,
					theme: "translucent",
					content: $t(tooltipContent)
				});
			}
		}
	};

	/**
	 * Initialize spinner color
	 */
	const initializeSpinnerColor = () => {
		if (
			["primary", "info", "danger", "secondary", "success", "dark"].includes(variant) &&
			!outline
		) {
			spinnerColor = "light";
		} else if (outline) {
			spinnerColor = ["light", "transparent", "none"].includes(variant) ? "dark" : variant;
		} else {
			spinnerColor = "dark";
		}
	};

	// Reactivity to init tooltip based on current language
	$: if ($locale && isHaveTooltip) {
		initializeTooltip();
	}

	/**
	 * Runs when the component is mounted to the DOM.
	 */
	onMount(() => {
		initializeSpinnerColor();
		isHaveTooltip && initializeTooltip();
	});
</script>

<button
	{...$$props}
	type={$$props.type || "button"}
	id={tooltipId}
	disabled={isLoading}
	class={clsx(
		{
			btn: !onlyIcon,
			// Button color
			"variant-filled-primary": variant === "primary" && !outline,
			"variant-filled-secondary": variant === "secondary" && !outline,
			"variant-filled-success": variant === "success" && !outline,
			"variant-filled-warning ": variant === "warning" && !outline,
			"bg-info-500 text-white": variant === "info" && !outline,
			"variant-filled-error": variant === "error" && !outline,
			"variant-filled-tertiary": variant === "tertiary" && !outline,
			"variant-filled-surface": variant === "surface" && !outline,

			"border border-primary-500 !bg-transparent !text-primary-500":
				variant === "primary" && outline && variantType === "none",
			"border border-secondary-500 !bg-transparent !text-secondary-500":
				variant === "secondary" && outline && variantType === "none",
			"border border-success-500 !bg-transparent !text-success-500":
				variant === "success" && outline && variantType === "none",
			"border border-warning-500 !bg-transparent !text-warning-500":
				variant === "warning" && outline && variantType === "none",
			"border border-info-500 !bg-transparent !text-info-500":
				variant === "info" && outline && variantType === "none",
			"border border-error-500 !bg-transparent !text-error-500":
				variant === "error" && outline && variantType === "none",
			"border border-tertiary-500 !bg-transparent !text-tertiary-500":
				variant === "tertiary" && outline && variantType === "none",
			"border border-surface-700 !bg-transparent !text-surface-700":
				variant === "surface" && outline && variantType === "none",

			"border border-primary-500 !bg-primary-500/30 text-primary-500":
				variant === "primary" && outline && variantType === "soft",
			"border border-secondary-500 !bg-secondary-500/30 text-secondary-500":
				variant === "secondary" && outline && variantType === "soft",
			"border border-success-500 !bg-success-500/30 text-success-500":
				variant === "success" && outline && variantType === "soft",
			"border border-warning-500 !bg-warning-500/30 text-warning-500":
				variant === "warning" && outline && variantType === "soft",
			"border border-info-500 !bg-info-500/30 text-info-500":
				variant === "info" && outline && variantType === "soft",
			"border border-error-500 !bg-error-500/30 text-error-500":
				variant === "error" && outline && variantType === "soft",
			"border border-tertiary-500 !bg-tertiary-500/30 text-tertiary-500":
				variant === "tertiary" && outline && variantType === "soft",
			"border border-surface-500 !bg-surface-500/30 text-surface-500":
				variant === "surface" && outline && variantType === "soft",

			"variant-soft-primary": variant === "primary" && variantType === "soft",
			"variant-soft-secondary": variant === "secondary" && variantType === "soft",
			"variant-soft-success": variant === "success" && variantType === "soft",
			"variant-soft-warning": variant === "warning" && variantType === "soft",
			"bg-info-400/20 text-info-700": variant === "info" && variantType === "soft",
			"variant-soft-error": variant === "error" && variantType === "soft",
			"variant-soft-tertiary": variant === "tertiary" && variantType === "soft",
			"variant-soft-surface": variant === "surface" && variantType === "soft",

			"variant-ringed-primary": variant === "primary" && variantType === "ringed",
			"variant-ringed-secondary": variant === "secondary" && variantType === "ringed",
			"variant-ringed-success": variant === "success" && variantType === "ringed",
			"variant-ringed-warning": variant === "warning" && variantType === "ringed",
			"border-info-500 bg-transparent text-white": variant === "info" && variantType === "ringed",
			"variant-ringed-error": variant === "error" && variantType === "ringed",
			"variant-ringed-tertiary": variant === "tertiary" && variantType === "ringed",
			"variant-ringed-surface": variant === "surface" && variantType === "ringed",

			// Button size
			"!h-fit !w-fit": size === "fit",
			"btn-sm !h-9": size === "sm",
			"btn-md !h-10": size === "md",
			"btn-lg !h-11": size === "lg",
			"btn-xl !h-12": size === "xl",
			// Button icon size
			"btn-icon-sm !h-9 !w-9": size === "sm" && onlyIcon,
			"btn-icon-md !h-10 !w-10": size === "md" && onlyIcon,
			"btn-icon-lg !h-11 !w-11": size === "lg" && onlyIcon,
			"btn-icon-xl !h-12 !w-12": size === "xl" && onlyIcon,
			// Button icon around
			"btn-icon": icon && onlyIcon,
			// Button pill
			"!rounded-full": pill,
			// Button rounded
			"rounded-sm": rounded === "xs",
			rounded: rounded === "sm",
			"rounded-md": rounded === "md",
			"rounded-lg": rounded === "lg",
			"rounded-xl": rounded === "xl",
			"rounded-2xl": rounded === "2xl",
			// Button disabled
			"cursor-not-allowed opacity-50": $$props.disabled
		},
		$$props.class
	)}
	on:click|stopPropagation={handleClick}
>
	{#if placement === "start" && icon}
		{#if isLoading}
			<Spinner color={spinnerColor} size={iconSize} />
		{:else}
			<Icon {icon} color={iconColor} size={iconSize} disabled={$$props.disabled} />
		{/if}
	{/if}

	{#if label}
		<span class="text-sm">{label}</span>
	{:else}
		<slot />
	{/if}

	{#if placement === "end" && icon}
		{#if isLoading}
			<Spinner color={spinnerColor} size={iconSize} />
		{:else}
			<Icon {icon} color={iconColor} size={iconSize} disabled={$$props.disabled} />
		{/if}
	{/if}
</button>
