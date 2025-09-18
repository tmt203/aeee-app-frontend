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
	 * Handle paging
	 * @param page number
	 */
	const handlePaging = (page: number) => {
		if (totalItems > 0 && currentPage !== page) {
			onSetPaging(page);
		}
	};

	// Reactivity to update pageSize when paginationSettings.limit is changed
	$: pageSize = paginationSettings.limit;

	// Reactivity to trigger pagination when paginationSettings.page is changed
	$: paginationSettings.page >= 0 && handlePaging(paginationSettings.page + 1);

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
/>

<style lang="scss">
	@use "@scss/shared/atoms/pagination.scss" as *;
</style>
