<script lang="ts">
	import { page } from "$app/stores";
	import { apiGetArticleById, apiGetArticles, apiPutArticleById } from "@api/article.api";
	import { apiPutPageBySlug } from "@api/page.api";
	import EditArticleModal from "@components/non-shared/admin/modals/EditArticleModal.svelte";
	import { Icon } from "@components/shared/atoms";
	import { Button, InputSearch, InputSelect, Table } from "@components/shared/molecules";
	import { AdminPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { Article, ArticleBody, ArticleQueryParams } from "@type/api/article.type";
	import type { PageBody, PageQueryParams } from "@type/api/page.type";
	import type { SelectOption } from "@type/common.type";
	import { ColumnType, type TableColumn } from "@type/components/table.type";
	import { normalizeFilterParams, removeEmptyFields } from "@utils/obj";
	import { toCapitalCase } from "@utils/string";
	import { SquarePen } from "lucide-svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import type { ArticleDataTable, ArticleFilterParams } from "./manageArticlesPage.interface";

	const { token } = $page.data.session;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let volumeOptions: SelectOption[] = [];
	let issueOptions: SelectOption[] = [];
	let filterParams: ArticleFilterParams = {
		title_contains: "",
		volume_eq: { label: "", value: "" },
		issue_eq: { label: "", value: "" }
	};

	// Data Table
	let bordered: boolean = false;
	let isLoading: boolean = false;
	let isCheckbox: boolean = false;
	let currentPage: number = 1;
	let pageSize: number = 20;
	let totalItems: number = 0;
	let dataTable: ArticleDataTable[] = [];
	let columns: TableColumn[] = [
		{ key: "index", width: 80, label: "table.no", dataType: ColumnType.Text, isHidden: true },
		{
			key: "volume",
			width: 100,
			label: "admin_page.manage_articles.table.volume",
			dataType: ColumnType.Text,
			pinned: "left"
		},
		{
			key: "issue",
			width: 80,
			label: "admin_page.manage_articles.table.issue",
			dataType: ColumnType.Text,
			pinned: "left"
		},
		{
			key: "title",
			width: 640,
			label: "admin_page.manage_articles.table.title",
			dataType: ColumnType.Text
		},
		{
			key: "doi",
			width: 200,
			label: "admin_page.manage_articles.table.doi",
			dataType: ColumnType.Text
		},
		{
			key: "authors",
			width: 480,
			label: "admin_page.manage_articles.table.authors",
			dataType: ColumnType.Text
		},
		{
			key: "pub_date",
			width: 120,
			label: "admin_page.manage_articles.table.published_at",
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
						return {
							icon: SquarePen,
							size: "md",
							color: "primary",
							onClick: () => openEditArticleModal(id)
						};
					}
				}
			]
		}
	];

	/**
	 * Handle update article by id
	 * @param id string
	 * @param body ArticleBody
	 */
	const handleUpdateArticle = async (id: string, body: ArticleBody) => {
		try {
			const response = await apiPutArticleById(id, body, token);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to update article"
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: "Article updated successfully"
				})
			);

			// Refresh data table
			handlePaging(currentPage);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handle get article by id
	 * @param id string
	 * @return Article | null
	 */
	const getArticleById = async (id: string): Promise<Article | null> => {
		if (!id) return null;

		try {
			isLoading = true;
			const response = await apiGetArticleById(Number(id));
			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to fetch article"
					})
				);
				return null;
			}

			return response.data;
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}

		return null;
	};

	/**
	 * Open edit article modal
	 * @param articleId string
	 */
	const openEditArticleModal = async (articleId: string) => {
		// Get article by id
		const article = await getArticleById(articleId);
		if (!article) return;

		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditArticleModal,
				props: {
					article,
					onSave: handleUpdateArticle
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Handle get articles
	 * @param params PageQueryParams
	 */
	const handleGetArticles = async (params?: PageQueryParams) => {
		try {
			isLoading = true;

			const queryParams: ArticleQueryParams = {
				fields: "id,title,volume,issue,doi,authors,pub_date",
				sort: "-volume,-issue",
				...params,
				...removeEmptyFields(normalizeFilterParams(filterParams))
			};
			const response = await apiGetArticles(queryParams);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "Failed to fetch articles"
					})
				);
				return;
			}

			const { data, total } = response;

			if (!data || data.length === 0) return;

			totalItems = total || 0;

			// Map to data table
			dataTable = data.map((item, index) => ({
				id: item.id,
				volume: item.volume,
				issue: item.issue,
				title: item.title,
				doi: item.doi,
				authors: item.authors
					.map((author) => `${author.first_name} ${toCapitalCase(author.last_name)}`)
					.join(", "),
				pub_date: `${item.pub_date.day}/${item.pub_date.month}/${item.pub_date.year}`,
				index: index + 1 + (currentPage - 1) * pageSize
			}));

			// Generate volume options
			if (volumeOptions.length === 0) {
				volumeOptions = Array.from({ length: data[0].volume }, (_, i) => ({
					label: `Volume ${i + 1}`,
					value: `${i + 1}`
				})).reverse();
			}
		} catch (error) {
			console.log(error);
			toastStore.trigger(
				generateToast("error", {
					message: "Failed to fetch articles"
				})
			);
		} finally {
			isLoading = false;
		}
	};

	/**
	 * Handle paging
	 * @param page number
	 */
	const handlePaging = (page: number) => {
		currentPage = page;

		let offset = (currentPage - 1) * pageSize;
		offset = offset < 0 ? 0 : offset;

		handleGetArticles({ limit: pageSize, offset });
	};

	/**
	 * Handle get issues by volume
	 * @param volume string
	 */
	const handleGetIssuesByVolume = (volume: string, dataTable: ArticleDataTable[]) => {
		if (volume === "") return;

		const issuesSet: Set<string> = new Set(
			dataTable
				.filter((item) => item.volume === Number(volume))
				.map((item) => item.issue.toString())
		);

		issueOptions = Array.from(issuesSet)
			.map((issue) => ({
				label: `Issue ${issue}`,
				value: issue
			}))
			.sort((a, b) => Number(b.value) - Number(a.value));
	};

	/**
	 * Handle add article
	 */
	const handleAddArticle = () => {
		const article: Article = {
			id: "",
			title: "",
			doi: "",
			volume: 0,
			issue: 0,
			abstract: "",
			category: "",
			created_at: "",
			created_by: "",
			language: "",
			pdf_path: "",
			views: 0,
			updated_at: "",
			updated_by: "",
			year: 0,
			pages: {
				first: 0,
				last: 0
			},
			pub_date: {
				day: 0,
				month: 0,
				year: 0
			},
			history: [],
			authors: [],
			citations: {
				apa: "",
				bib_tex: ""
			}
		};

		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditArticleModal,
				props: {
					article,
					onSave: handleUpdateArticle
				}
			}
		};

		modalStore.trigger(modal);
	};

	// Run when filterParams.volume_eq.value or dataTable changes
	$: handleGetIssuesByVolume(filterParams.volume_eq.value, dataTable);

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		handlePaging(1);
	});
</script>

<AdminPageLayout breadcrumbs={[{ label: "Manage Articles" }]}>
	<div slot="content-body" class="flex flex-col">
		<Table
			rounded
			{columns}
			{bordered}
			{isLoading}
			{isCheckbox}
			tableHeaderClass="lg:flex-col xl:flex-row"
			tableClass="max-h-[calc(100vh-200px)] xl:max-h-[calc(100vh-240px)]"
			bind:pageSize
			bind:totalItems
			bind:currentPage
			bind:data={dataTable}
			{handlePaging}
		>
			<!-- Area: Left Table Header -->
			<div slot="left-header" class="flex flex-wrap items-center gap-4">
				<!-- Area: Search Input -->
				<form on:submit|preventDefault={() => handlePaging(currentPage)}>
					<InputSearch
						placeholder={$t("input.placeholder.search", {
							values: {
								field: `${$t("admin_page.manage_articles.table.title")}...`.toLowerCase()
							}
						})}
						rounded="lg"
						onSearch={() => handlePaging(currentPage)}
						bind:value={filterParams.title_contains}
					/>
				</form>

				<!-- Area: Volume Select -->
				<InputSelect
					id="volume-select"
					label="admin_page.manage_articles.table.volume"
					icon="uil uil-filter"
					clearable
					options={volumeOptions}
					selectClasses="min-w-40"
					bind:selectedOptionLabel={filterParams.volume_eq.label}
					bind:value={filterParams.volume_eq.value}
					onChange={() => handlePaging(1)}
					onAfterRemove={() => handlePaging(1)}
				/>

				<!-- Area: Issue Select -->
				<InputSelect
					id="issue-select"
					label="admin_page.manage_articles.table.issue"
					icon="uil uil-filter"
					clearable
					options={issueOptions}
					selectClasses="min-w-40"
					disabled={filterParams.volume_eq.value === ""}
					bind:selectedOptionLabel={filterParams.issue_eq.label}
					bind:value={filterParams.issue_eq.value}
					onChange={() => handlePaging(1)}
					onAfterRemove={() => handlePaging(1)}
				/>
			</div>

			<!-- Area: Right Table Header -->
			<div slot="right-header" class="flex flex-wrap items-center gap-4">
				<Button
					label={$t("admin_page.manage_articles.add_article")}
					variant="secondary"
					variantType="ghost"
					icon="uil uil-plus"
					rounded="lg"
					on:click={handleAddArticle}
				/>
			</div>
		</Table>
	</div>
</AdminPageLayout>
