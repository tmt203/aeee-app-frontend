<script lang="ts">
	import { apiGetIssues } from "@api/issue.api";
	import { generateToast } from "@constants/toast.constants";
	import { getToastStore } from "@skeletonlabs/skeleton";
	import type { Issue } from "@type/api/issue.type";
	import clsx from "clsx";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	const toastStore = getToastStore();

	const CURRENT_YEAR = new Date().getFullYear();
	const MIN_YEAR = 2002;

	const years = Array.from(
		{ length: CURRENT_YEAR - MIN_YEAR + 1 },
		(_, i) => MIN_YEAR + i
	).reverse();

	let selectedYear = CURRENT_YEAR;
	let selectedIssueIndex: number | null = null;

	let issues: Issue[] = [];
	let isLoading = false;

	/**
	 * Get issue by selected year
	 * @param year number
	 */
	const getIssueBySelectedYear = async (year: number) => {
		selectedYear = year;
		selectedIssueIndex = null;
		isLoading = true;

		try {
			const response = await apiGetIssues({ year });

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: $t("toast.fail.get", { values: { field: "issues" } })
					})
				);
				return;
			}

			const { data } = response;
			issues = data || [];
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		getIssueBySelectedYear(selectedYear);
	});
</script>

<!-- ================= UI ================= -->
<div class="flex flex-col gap-6">
	<!-- Area: Years -->
	<div>
		<h3 class="mb-2 font-bold">Years</h3>
		<div class="flex flex-wrap items-center gap-3 rounded-lg border p-3">
			{#each years as year}
				<button
					class={clsx(
						"rounded-lg px-2 py-1 text-primary-500 transition-colors duration-150 hover:bg-primary-100",
						{ "bg-primary-100": selectedYear === year }
					)}
					on:click={() => getIssueBySelectedYear(year)}
				>
					{year}
				</button>
			{/each}
		</div>
	</div>

	<!-- Area: Issues -->
	<div>
		<h3 class="mb-2 font-bold">Issues</h3>

		{#if isLoading}
			<!-- Skeleton -->
			<div class="flex flex-col gap-3">
				{#each Array.from({ length: 10 }) as _, i}
					<div class="placeholder h-12 w-full rounded-lg border p-3" />
				{/each}
			</div>
		{:else if issues.length === 0}
			<p>No issues found for {selectedYear}.</p>
		{:else}
			<div class="flex flex-col gap-3">
				{#each issues as issue, i}
					<div class="rounded-lg border p-3">
						<div class="flex items-center justify-between">
							<a
								href={`/issues/current-issues?volume=${issue.volume}&issue=${issue.issue}`}
								target="_blank"
							>
								<h4 class="font-semibold text-primary-600">
									Volume {issue.volume} — Issue {issue.issue}
								</h4>
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
