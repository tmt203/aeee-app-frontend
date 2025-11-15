<script lang="ts">
	import { page } from "$app/stores";
	import {
		apiDeleteManagerById,
		apiGetManagerById,
		apiGetManagers,
		apiPostManager,
		apiPutManagerById
	} from "@api/manager.api";
	import EditVolumeIssueModal from "@components/non-shared/admin/modals/EditVolumeIssueModal.svelte";
	import { ConfirmModal, Icon } from "@components/shared/atoms";
	import { Button, Table } from "@components/shared/molecules/";
	import { AdminPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type {
		Manager,
		ManagerBody,
		ManagerQueryParams,
		UploadFileQueryParams
	} from "@type/api/manager.type";
	import type { RowActionIconData } from "@type/components/icon.type";
	import { ColumnType, type TableColumn } from "@type/components/table.type";
	import { calculatePageAfterDeletion } from "@utils/table";
	import { AlignJustify, SquarePen, Trash2 } from "lucide-svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	const { token } = $page.data.session;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

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
			key: "volume",
			width: 100,
			label: "admin_page.manage_volumes_issues.table.volume",
			dataType: ColumnType.Text,
			pinned: "left"
		},
		{
			key: "issue",
			width: 80,
			label: "admin_page.manage_volumes_issues.table.issue",
			dataType: ColumnType.Text,
			pinned: "left"
		},
		{
			key: "foreword",
			width: 640,
			label: "admin_page.manage_volumes_issues.table.foreword",
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
						const name = `Volume ${row.volume}- Issue${row.issue}`;
						const rowActionData: RowActionIconData[] = [
							{
								label: "tooltip.edit",
								icon: SquarePen,
								color: "primary",
								onClick: () => openEditVolumeIssueModal(id)
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
	 * @param id string
	 * @param name string
	 */
	const openConfirmDeleteModal = (id: string, name: string) => {
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
						values: { field: `<strong>${name}</strong>` }
					}),
					body: $t("confirm_modal.delete.body"),
					onCancel: () => {
						modalStore.close();
					},
					onConfirm: async () => {
						try {
							const response = await apiDeleteManagerById(id, token);

							if (response.code !== "OK") {
								toastStore.trigger(
									generateToast("error", {
										message: response.message || "Failed to delete volume issue."
									})
								);
								return;
							}

							modalStore.close();

							toastStore.trigger(
								generateToast("success", {
									message: "Volume issue deleted successfully."
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
	 * Get volume issue by id
	 * @param id string
	 * @returns EarlyAccessArticle | null
	 */
	const getVolumeIssueById = async (id: string): Promise<Manager | null> => {
		try {
			const response = await apiGetManagerById(id);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to get volume issue."
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
	 * Handle save volume issue
	 * @param id string
	 * @param body ManagerBody
	 */
	const handleSaveVolumeIssue = async (id: string, body: ManagerBody) => {
		let response;
		try {
			if (!id) {
				response = await apiPostManager(body, token);
				currentPage = 1;
			} else {
				response = await apiPutManagerById(id, body, token);
			}

			if (response.code !== "OK") {
				if (response.code === "ERR_DUPLICATE_FIELD") {
					toastStore.trigger(
						generateToast("error", {
							message: "A volume issue with the same volume and issue already exists."
						})
					);
					return;
				}
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "Failed to save volume issue."
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: "Volume issue saved successfully."
				})
			);

			modalStore.close();

			handlePaging(currentPage);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Open edit volume issue modal
	 * @param id string
	 */
	const openEditVolumeIssueModal = async (id: string) => {
		// Get manager by id
		const manager = await getVolumeIssueById(id);
		if (!manager) return;

		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditVolumeIssueModal,
				props: {
					manager,
					onSave: handleSaveVolumeIssue
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Handle add volume issue
	 */
	const handleAddVolumeIssue = () => {
		const manager: Manager = {
			id: "",
			created_at: "",
			created_by: "",
			updated_at: "",
			updated_by: "",
			volume: 0,
			issue: 0,
			foreword: "",
			foreword_content: "",
			avatar_url: "",
			info_file_url: ""
		};
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: EditVolumeIssueModal,
				props: {
					manager,
					onSave: handleSaveVolumeIssue
				}
			}
		};

		modalStore.trigger(modal);
	};

	/**
	 * Handle get managers
	 * @param params ManagerQueryParams
	 */
	const handleGetManagers = async (params: ManagerQueryParams) => {
		try {
			params = {
				...params,
				sort: "-volume,-issue"
			};
			const response = await apiGetManagers(params);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "An error occurred while fetching managers."
					})
				);
				return;
			}

			const { data, total } = response;

			totalItems = total || 0;
			dataTable = data.map((item, index) => ({
				...item,
				index: (currentPage - 1) * pageSize + index + 1
			}));
		} catch (error) {
			console.log(error);
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

		handleGetManagers({ limit: pageSize, offset });
	};

	onMount(() => {
		handlePaging(currentPage);
	});
</script>

<AdminPageLayout breadcrumbs={[{ label: "Manage Volumes and Issues" }]}>
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
			<!-- Area: Right Table Header -->
			<div slot="right-header" class="flex flex-wrap items-center gap-4">
				<Button
					label={$t("admin_page.manage_articles.add_article")}
					variant="secondary"
					variantType="ghost"
					icon="uil uil-plus"
					rounded="lg"
					on:click={handleAddVolumeIssue}
				/>
			</div>
		</Table>
	</div>
</AdminPageLayout>
