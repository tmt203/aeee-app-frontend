<script lang="ts">
	import type { Color, Size } from "@type/common.type";
	import clsx from "clsx";

	export let thin: Size = "md";
	export let size: Size = "md";
	export let color: Color = "primary";
</script>

<span
	class={clsx(
		"relative flex size-12 animate-loader rounded-full",
		"before:absolute before:inset-0 before:animate-prixClipFix before:rounded-full before:content-['']",
		"before:box-border before:border-4 before:border-solid before:border-white",
		{
			// Spinner color
			"before:!border-primary-500": color === "primary",
			"before:!border-secondary-500": color === "secondary",
			"before:!border-success-500": color === "success",
			"before:!border-tertiary-500": color === "tertiary",
			"before:!border-warning-500": color === "warning",
			"before:!border-error-500": color === "error",
			"before:!border-surface-50": color === "surface",
			// Spinner thin
			"before:border": thin === "xs",
			"before:border-2": thin === "sm",
			"before:border-4": thin === "md",
			"before:border-[6px]": thin === "lg",
			"before:border-8": thin === "xl",
			"before:border-[10px]": thin === "2xl",
			// Spinner size
			"size-4": size === "xs",
			"size-5": size === "sm",
			"size-6": size === "md",
			"size-7": size === "lg",
			"size-8": size === "xl",
			"size-9": size === "2xl"
		}
	)}
/>
