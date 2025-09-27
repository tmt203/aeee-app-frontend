<script lang="ts">
	import { t } from "svelte-i18n";

	export let currentPage: number;
	export let pageSize: number;
	export let totalItems: number;

	$: start = (currentPage - 1) * pageSize + 1;
	$: end = Math.min(currentPage * pageSize, totalItems);
</script>

<aside
	class="mr-6 h-9 rounded-lg border bg-surface-50 px-4 text-sm leading-8 dark:!border-surface-400/30 dark:!bg-tertiary-400"
>
	{#if totalItems > 0}
		<b>{start}</b> - <b>{end}</b> / <b>{totalItems}</b>
	{:else}
		{$t("no_data")}
	{/if}
</aside>
