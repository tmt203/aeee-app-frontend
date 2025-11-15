<script lang="ts">
	import { page } from "$app/stores";
	import {
		apiDeleteEarlyAccessArticleById,
		apiGetEarlyAccessArticleById,
		apiGetEarlyAccessArticles,
		apiPostEarlyAccessArticle,
		apiUpdateEarlyAccessArticleById
	} from "@api/early_access_article.api";
	import EditEarlyAccessArticleModal from "@components/non-shared/admin/modals/EditEarlyAccessArticleModal.svelte";
	import { ConfirmModal, Icon } from "@components/shared/atoms";
	import { Button, InputSearch, InputSelect, Table } from "@components/shared/molecules";
	import { AdminPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type {
		EarlyAccessArticle,
		EarlyAccessArticleBody,
		EarlyAccessArticleQueryParams
	} from "@type/api/early_access_article.type";
	import type { SelectOption } from "@type/common.type";
	import type { RowActionIconData } from "@type/components/icon.type";
	import { ColumnType, type TableColumn } from "@type/components/table.type";
	import { toCapitalCase } from "@utils/string";
	import { calculatePageAfterDeletion } from "@utils/table";
	import { AlignJustify, SquarePen, Trash2 } from "lucide-svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import type { ArticleFilterParams } from "../manage-articles/manageArticlesPage.interface";

	const { token } = $page.data.session;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let filterParams: ArticleFilterParams = {
		title_contains: ""
	};

	// Data Table
	let bordered: boolean = false;
	let isLoading: boolean = false;
	let isCheckbox: boolean = false;
	let currentPage: number = 1;
	let pageSize: number = 20;
	let totalItems: number = 0;
	let dataTable: Record<string, any>[] = [];
	let columns: TableColumn[] = [
		{ key: "index", width: 80, label: "table.no", dataType: ColumnType.Text, isHidden: true },
		{
			key: "title",
			width: 640,
			label: "admin_page.manage_articles.table.title",
			dataType: ColumnType.Text
		},
		{
			key: "authors",
			width: 480,
			label: "admin_page.manage_articles.table.authors",
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
								onClick: () => openEditEarlyAccessArticleModal(id)
							},
							{
								label: "tooltip.delete",
								icon: Trash2,
								color: "error",
								onClick: () => openConfirmDeleteModal(id, name)
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
	 * Open confirm delete modal
	 * @param articleId string
	 * @param articleTitle string
	 */
	const openConfirmDeleteModal = (articleId: string, articleTitle: string) => {
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: ConfirmModal,
				props: {
					variant: "danger",
					title: $t("confirm_modal.delete.title"),
					message: $t("confirm_modal.delete.message", {
						values: { field: `<strong>${articleTitle}</strong>` }
					}),
					body: $t("confirm_modal.delete.body"),
					onCancel: () => {
						modalStore.close();
					},
					onConfirm: async () => {
						try {
							const response = await apiDeleteEarlyAccessArticleById(articleId, token);

							if (response.code !== "OK") {
								toastStore.trigger(
									generateToast("error", {
										message: response.message || "Failed to delete early access article."
									})
								);
								return;
							}

							modalStore.close();

							toastStore.trigger(
								generateToast("success", {
									message: "Article deleted successfully."
								})
							);

							// Calculate new page after deletion
							const newCurrentPage = calculatePageAfterDeletion(currentPage, pageSize, totalItems);
							handlePaging(newCurrentPage);
						} catch (error) {
							console.log(error);
						}
					}
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Get early access article by id
	 * @param articleId string
	 * @returns EarlyAccessArticle | null
	 */
	const getEarlyAccessArticleById = async (
		articleId: string
	): Promise<EarlyAccessArticle | null> => {
		try {
			const response = await apiGetEarlyAccessArticleById(articleId);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to get early access article."
					})
				);
				return null;
			}

			return response.data;
		} catch (error) {
			console.log(error);
		}

		return null;
	};

	/**
	 * Handle save article
	 * @param id string
	 * @param body EarlyAccessArticleBody
	 */
	const handleSaveArticle = async (id: string, body: EarlyAccessArticleBody) => {
		let response;
		try {
			if (!id) {
				response = await apiPostEarlyAccessArticle(body, token);
				currentPage = 1;
			} else {
				response = await apiUpdateEarlyAccessArticleById(id, body, token);
			}

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to save article."
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: "Article saved successfully."
				})
			);

			modalStore.close();

			handlePaging(currentPage);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Open edit early access article modal
	 * @param articleId string
	 */
	const openEditEarlyAccessArticleModal = async (articleId: string) => {
		// Get early access article by id
		const article = await getEarlyAccessArticleById(articleId);
		if (!article) return;

		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditEarlyAccessArticleModal,
				props: {
					article,
					onSave: handleSaveArticle
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Open add early access article modal
	 */
	const openAddEarlyAccessArticleModal = () => {
		const article: EarlyAccessArticle = {
			id: "",
			title: "",
			authors: [],
			pdf_path: "",
			created_at: "",
			updated_at: "",
			created_by: "",
			updated_by: ""
		};

		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditEarlyAccessArticleModal,
				props: {
					article,
					onSave: handleSaveArticle
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Handle get early access articles
	 * @param params EarlyAccessArticleQueryParams
	 */
	const handleGetEarlyAccessArticles = async (params: EarlyAccessArticleQueryParams) => {
		try {
			isLoading = true;

			params = { ...filterParams, ...params };
			const response = await apiGetEarlyAccessArticles(params);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to get early access articles."
					})
				);
				return;
			}

			const { data, total } = response;

			if (!data || data.length === 0) {
				dataTable = [];
				totalItems = 0;
				return;
			}

			totalItems = total || 0;
			dataTable = data.map((article, index) => ({
				...article,
				authors: article.authors
					.map((author) => `${author.first_name} ${toCapitalCase(author.last_name)}`)
					.join(", "),
				index: (currentPage - 1) * pageSize + index + 1
			}));
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	};

	/**
	 * Handle paging
	 * @param page number
	 */
	const handlePaging = async (page: number) => {
		currentPage = page;

		let offset = (currentPage - 1) * pageSize;
		offset = offset < 0 ? 0 : offset;

		handleGetEarlyAccessArticles({ limit: pageSize, offset });
	};

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		handlePaging(1);
	});
</script>

<AdminPageLayout breadcrumbs={[{ label: "Manage Early Access Articles" }]}>
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
			</div>

			<!-- Area: Right Table Header -->
			<div slot="right-header" class="flex flex-wrap items-center gap-4">
				<Button
					label={$t("admin_page.manage_articles.add_article")}
					variant="secondary"
					variantType="ghost"
					icon="uil uil-plus"
					rounded="lg"
					on:click={openAddEarlyAccessArticleModal}
				/>
			</div>
		</Table>
	</div>
</AdminPageLayout>
