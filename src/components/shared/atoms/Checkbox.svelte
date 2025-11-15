<script lang="ts">
	import type { Direction, Placement } from "@type/common.type";
	import clsx from "clsx";
	import { t } from "svelte-i18n";

	export let isNull: boolean = false;
	export let label: string = "";
	export let direction: Direction = "row";
	export let placement: Placement = "start";
	export let checked: boolean;
	export let onChange: () => void = () => {};
</script>

{#if isNull}
	<span>-</span>
{:else}
	<label
		class={clsx(
			"flex items-center gap-2 text-sm",
			direction === "row" ? "flex-row" : "flex-col",
			$$props.class
		)}
	>
		{#if placement === "start"}
			{$t(label)}
		{/if}
		<input class="checkbox" type="checkbox" {checked} on:change={onChange} />
		{#if placement === "end"}
			{$t(label)}
		{/if}
	</label>
{/if}
