<script lang="ts">
	import { apiGetIssues } from "@api/issue.api";
	import { Icon } from "@components/shared/atoms";
	import { Button, Table } from "@components/shared/molecules";
	import { AdminPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import { getToastStore } from "@skeletonlabs/skeleton";
	import type { Issue } from "@type/api/issue.type";
	import type { RowActionIconData } from "@type/components/icon.type";
	import { ColumnType, type TableColumn } from "@type/components/table.type";
	import clsx from "clsx";
	import { AlignJustify, SquarePen, Trash2 } from "lucide-svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import type { FileDataTable } from "./manageArticleFiles.interface";

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
	let selectedIssue: Issue | null = null;

	// File
	let pdf_path: string = "";
	let file_name: string = "";
	let files: FileList | null = null;

	// File path: /uploads/articles/{selectedYear}/Vol {selectedIssue.volume}, Issue {selectedIssue.issue}/{file_name}

	// Data Table
	let showFooter: boolean = false;
	let bordered: boolean = false;
	let isLoading: boolean = false;
	let isCheckbox: boolean = false;
	let currentPage: number = 1;
	let pageSize: number = 20;
	let totalItems: number = 0;
	let dataTable: FileDataTable[] = [];
	let columns: TableColumn[] = [
		{ key: "index", width: 80, label: "table.no", dataType: ColumnType.Text, isHidden: true },
		{
			key: "title",
			width: 640,
			label: "admin_page.manage_article_files.table.title",
			dataType: ColumnType.Text
		},
		{
			key: "filePath",
			width: 480,
			label: "admin_page.manage_article_files.table.file_path",
			dataType: ColumnType.Text
		},
		{
			label: "action",
			placement: "center",
			pinned: "right",
			width: 64,
			dataType: ColumnType.Action,
			data: [
				{
					component: () => Icon,
					props: (row) => {
						const id = `${row.id}`;
						const name = `${row.title}`;
						const rowActionData: RowActionIconData[] = [
							{
								label: "tooltip.edit",
								icon: SquarePen,
								color: "primary",
								onClick: () => {
									console.log("edit");
								}
							},
							{
								label: "tooltip.delete",
								icon: Trash2,
								color: "error",
								onClick: () => {
									console.log("delete");
								}
							}
						];
						return {
							id,
							icon: AlignJustify,
							rowAction: true,
							rowActionData,
							color: "primary",
							size: "md"
						};
					}
				}
			]
		}
	];

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

	/**
	 * Handle select issue
	 * @param issue Issue
	 */
	const handleSelectIssue = (issue: Issue) => {
		selectedIssue = issue;

		// Prepare data table
		totalItems = selectedIssue?.articles?.length || 0;
		dataTable =
			selectedIssue?.articles?.map((article, index) => {
				return {
					index: index + 1,
					id: article.id,
					title: article.title,
					filePath: article.pdf_path
				};
			}) || [];
	};

	onMount(() => {
		getIssueBySelectedYear(selectedYear);
	});
</script>

<AdminPageLayout breadcrumbs={[{ label: "Manage Article Files" }]}>
	<div slot="content-body" class="flex flex-col">
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
					<div class="flex flex-wrap items-center gap-3 rounded-lg border p-3">
						{#each issues as issue, i}
							<button
								class={clsx(
									"rounded-lg px-2 py-1 text-primary-500 transition-colors duration-150 hover:bg-primary-100",
									{ "bg-primary-100": selectedIssue?.id === issue.id }
								)}
								on:click={() => handleSelectIssue(issue)}
							>
								Volume {issue.volume} — Issue {issue.issue}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Area: Files -->
			<div>
				{#if selectedIssue}
					<Table
						rounded
						{columns}
						{bordered}
						{isLoading}
						{showFooter}
						{isCheckbox}
						tableHeaderClass="lg:flex-col xl:flex-row"
						tableClass="max-h-[calc(100vh-200px)] xl:max-h-[calc(100vh-240px)]"
						bind:pageSize
						bind:totalItems
						bind:currentPage
						bind:data={dataTable}
					>
						<!-- Area: Left Table Header -->
						<div slot="left-header" class="flex flex-wrap items-center gap-4">
							<h3 class="mb-2 text-base font-bold">Files</h3>
						</div>
						<!-- Area: Right Table Header -->
						<div slot="right-header" class="flex flex-wrap items-center gap-4">
							<Button
								label={$t("admin_page.manage_article_files.add_file")}
								variant="secondary"
								variantType="ghost"
								icon="uil uil-plus"
								rounded="lg"
								on:click={() => {}}
							/>
						</div>
					</Table>
				{/if}
			</div>
		</div>
	</div>
</AdminPageLayout>
