<script lang="ts">
	import { Paginator, type PaginationSettings } from "@skeletonlabs/skeleton";
	import { t } from "svelte-i18n";

	export let currentPage: number;
	export let pageSize: number;
	export let totalItems: number;
	export let onSetPaging: (page: number) => void;

	let paginationSettings: PaginationSettings = {
		page: currentPage - 1,
		limit: pageSize,
		size: totalItems,
		amounts: [5, 10, 20, 50, 100]
	};

	/**
	 * Handle page change
	 * @param event CustomEvent
	 */
	const handlePageChange = (event: CustomEvent) => {
		const newPage = event.detail + 1;
		onSetPaging(newPage);
	};

	/**
	 * Handle amount (page size) change
	 * @param event CustomEvent
	 */
	const handleAmountChange = (event: CustomEvent) => {
		const newLimit = event.detail;
		// When page size is changed, reset to first page
		paginationSettings.limit = newLimit;
		onSetPaging(1);
	};

	// Reactivity to update pagination page when currentPage is changed
	$: paginationSettings.page = currentPage > 1 ? currentPage - 1 : 0;

	// Reactivity to update pageSize when paginationSettings.limit is changed
	$: pageSize = paginationSettings.limit;

	// Reactivity to update pagination size when total items is updated
	$: paginationSettings.size = totalItems;
</script>

<!-- Area: Pagination -->
<Paginator
	showNumerals
	maxNumerals={1}
	showPreviousNextButtons
	showFirstLastButtons={false}
	buttonClasses="!px-3 !py-1.5 fill-current"
	active="active font-semibold"
	amountText={$t("table.rows")}
	bind:settings={paginationSettings}
	on:page={handlePageChange}
	on:amount={handleAmountChange}
/>

<style lang="scss">
	@use "@scss/shared/atoms/pagination.scss" as *;
</style>
