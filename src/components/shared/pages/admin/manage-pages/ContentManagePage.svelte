<script lang="ts">
	import { apiGetPages, apiPutPageBySlug } from "@api/page.api";
	import EditPageModal from "@components/non-shared/admin/modals/EditPageModal.svelte";
	import { Icon } from "@components/shared/atoms";
	import { InputSearch, Table } from "@components/shared/molecules";
	import { AdminPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { PageBody, PageQueryParams } from "@type/api/page.type";
	import { ColumnType, type TableColumn } from "@type/components/table.type";
	import { removeEmptyFields } from "@utils/obj";
	import { SquarePen } from "lucide-svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let filterParams: Record<string, string> = {};

	// Data Table
	let bordered: boolean = false;
	let isLoading: boolean = false;
	let isCheckbox: boolean = false;
	let currentPage: number = 1;
	let pageSize: number = 20;
	let totalItems: number = 0;
	let dataTable: Record<string, unknown>[] = [];
	let columns: TableColumn[] = [
		{ key: "index", width: 80, label: "table.no", dataType: ColumnType.Text },
		{ key: "slug", width: 200, label: "about_us_page.table.page", dataType: ColumnType.Text },
		{ key: "content", width: 480, label: "about_us_page.table.content", dataType: ColumnType.Text },
		{ key: "updated_at", width: 200, label: "table.updated_at", dataType: ColumnType.DateTime },
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
							onClick: () => openEditPageModal(id)
						};
					}
				}
			]
		}
	];

	/**
	 * Handle update page
	 * @param body PageBody
	 */
	const handleUpdatePage = async (body: PageBody) => {
		try {
			const response = await apiPutPageBySlug(body);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "Failed to update page"
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: "Page updated successfully"
				})
			);

			// Refresh data table
			handlePaging(1);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Open edit page modal
	 * @param id string
	 */
	const openEditPageModal = (id: string) => {
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditPageModal,
				props: {
					id,
					onSave: handleUpdatePage
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Handle get pages
	 * @param params PageQueryParams
	 */
	const handleGetPages = async (params?: PageQueryParams) => {
		try {
			isLoading = true;

			const queryParams: PageQueryParams = { ...params, ...filterParams };
			const response = await apiGetPages(removeEmptyFields(queryParams));

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "Failed to fetch about us pages"
					})
				);
				return;
			}

			const { data, total } = response;

			if (!data || data.length === 0) return;

			totalItems = total || 0;
			dataTable = data.map((item, index) => ({
				...item,
				content: `${item.content.slice(0, 100)}...`,
				index: index + 1 + (currentPage - 1) * pageSize
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
	const handlePaging = (page: number) => {
		currentPage = page;

		let offset = (currentPage - 1) * pageSize;
		offset = offset < 0 ? 0 : offset;

		handleGetPages({ limit: pageSize, offset });
	};

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		handlePaging(1);
	});
</script>

<AdminPageLayout breadcrumbs={[{ label: "Manage Pages" }]}>
	<div slot="content-body" class="flex flex-col">
		<Table
			rounded
			{columns}
			{bordered}
			{isLoading}
			{isCheckbox}
			tableHeaderClass="lg:flex-col xl:flex-row"
			tableClass="max-h-[calc(100vh-418px)] xl:max-h-[calc(100vh-240px)]"
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
						placeholder={$t("input.placeholder.text", {
							values: {
								field: `${$t("keyword")}...`.toLowerCase()
							}
						})}
						rounded="lg"
						onSearch={() => handlePaging(currentPage)}
						bind:value={filterParams.slug_contains}
					/>
				</form>
			</div>
		</Table>
	</div>
</AdminPageLayout>
