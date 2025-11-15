<script lang="ts">
	import type { Color, Size } from "@type/common.type";
	import clsx from "clsx";
	import { Search } from "lucide-svelte";
	import { Icon } from "../atoms";

	export let value: string = "";
	export let rounded: Size = "lg";
	export let size: Size = "lg";
	export let borderColor: Color = "light";
	export let onSearch: () => void = () => {};
	export let onChange: (_event: Event) => void = (_event: Event) => {};

	const sizeMap: Record<Size, number> = {
		sm: 16,
		md: 16,
		lg: 16,
		xl: 18,
		"2xl": 24
	};

	/**
	 * InputSearch class names
	 * @param size Size
	 * @param rounded Size
	 * @param borderColor Color
	 * @returns string
	 */
	const getInputSearchClassNames = (
		size: Size,
		rounded: Size,
		borderColor: Color,
		value?: string | number | readonly string[]
	) => {
		return clsx(
			"flex items-center justify-center border p-2 bg-light-500 group",
			"bg-white dark:!border-surface-400/30 dark:!bg-surface-300/5",
			"hover:justify-between hover:!w-56 transition-all duration-200 ease-in-out",
			{
				"!w-56": typeof value === "string" || Array.isArray(value) ? value.length > 0 : false,
				// Rounded
				"rounded-sm": rounded === "sm",
				"rounded-md": rounded === "md",
				"rounded-lg": rounded === "lg",
				"rounded-xl": rounded === "xl",
				"rounded-2xl": rounded === "2xl",
				"rounded-full": rounded === "full",

				// Border
				"border-primary-500": borderColor === "primary",
				"border-secondary-500": borderColor === "secondary",
				"border-success-500": borderColor === "success",
				"border-info-500": borderColor === "info",
				"border-warning-500": borderColor === "warning",
				"border-danger-500": borderColor === "danger",
				"border-surface-500": borderColor === "surface",

				// Size
				"h-7 w-7 text-xs": size === "sm",
				"h-8 w-8 text-xs": size === "md",
				"h-9 w-9 text-xs": size === "lg",
				"h-10 w-10 text-sm": size === "xl",
				"h-11 w-11 text-base": size === "2xl"
			}
		);
	};

	/**
	 * Input class name
	 * @param size Size
	 * @param value string | number | readonly string[] | undefined
	 * @returns string
	 */
	const getInputClassNames = (size: Size, value?: string | number | readonly string[]) => {
		return clsx(
			"w-0 border-none outline-none focus:ring-0 focus:border-transparent p-0 pr-0 bg-transparent font-semibold text-primary-500",
			"transition-all duration-500 ease-in-out transform scale-0 opacity-0",
			"group-hover:scale-100 group-hover:w-full group-hover:opacity-100 group-hover:pr-2 group-hover:flex",
			"placeholder:font-normal placeholder:text-sm placeholder:text-secondary-text-color",
			{
				"pr-2 w-full opacity-100 scale-100 flex":
					typeof value === "string" || Array.isArray(value) ? value.length > 0 : false,
				// Size
				"text-xs": ["sm", "md", "lg", "xl"].includes(size),
				"text-base": size === "2xl"
			}
		);
	};

	/**
	 * Handle search
	 * @param event KeyboardEvent
	 */
	const handleSearch = (event: KeyboardEvent) => {
		if (event.key === "Enter" || event.code === "Enter") {
			event.preventDefault();
			onSearch && onSearch();
		}
	};

	/**
	 * Handle input search change
	 * @param event Event
	 */
	const handleInputSearchChange = (event: Event) => {
		onChange && onChange(event);
	};
</script>

<div class={clsx(getInputSearchClassNames(size, rounded, borderColor, value), $$props.class)}>
	<input
		{...$$props}
		type="text"
		placeholder={$$props.placeholder}
		class={getInputClassNames(size, value)}
		bind:value
		on:keydown={handleSearch}
		on:change={handleInputSearchChange}
	/>
	{#if value?.length}
		<Icon icon="uil uil-times-circle" onClick={() => (value = "")} color="primary" class="mr-1" />
	{/if}
	<Search size={sizeMap[size]} className="cursor-pointer" on:click={onSearch} />
</div>
