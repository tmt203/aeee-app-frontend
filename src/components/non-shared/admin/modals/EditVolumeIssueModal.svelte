<script lang="ts">
	import { page } from "$app/stores";
	import { API_HOST } from "$lib/env/client";
	import { apiPostPublishIssue } from "@api/issue.api";
	import {
		apiDeleteManagerFile,
		apiPatchManagerById,
		apiUploadManagerFile
	} from "@api/manager.api";
	import { Spinner } from "@components/shared/atoms";
	import { Button, InputForm, InputTime } from "@components/shared/molecules";
	import { STATUS_OPTIONS } from "@components/shared/pages/admin/manage-articles/manageArticlesPage.constant";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
	import type { PublishIssueBody } from "@type/api/issue.type";
	import type { Manager, ManagerBody, UploadFileQueryParams } from "@type/api/manager.type";
	import { Info, X } from "lucide-svelte";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { number, object, string } from "yup";

	export let manager: Manager;
	export let onSave: (id: string, body: ManagerBody) => void;

	const { token } = $page.data.session;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let isLoading: boolean = false;
	let avatarFiles: FileList | null = null;
	let infoFiles: FileList | null = null;

	// Form
	const initialValues = {
		publish_date: `${manager?.year}-${manager?.month.toString().padStart(2, "0")}` || "",
		volume: manager?.volume || 0,
		issue: manager?.issue || 0,
		foreword: manager?.foreword || "",
		avatar_url: manager?.avatar_url || "",
		info_file_url: manager?.info_file_url || "",
		foreword_content: manager?.foreword_content || "",
		active: manager?.active || false,
	};
	const validationSchema = object().shape({
		publish_date: string().required("error.input_required"),
		volume: number().required("error.input_required"),
		issue: number().required("error.input_required"),
		foreword: string(),
		avatar_url: string(),
		info_file_url: string(),
		foreword_content: string()
	});
	const { form, errors, isSubmitting, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			// Upload avatar
			if (avatarFiles && avatarFiles.length > 0) {
				// Check if file is image (.png, .jpg, .jpeg)
				if (
					avatarFiles[0].type !== "image/png" &&
					avatarFiles[0].type !== "image/jpg" &&
					avatarFiles[0].type !== "image/jpeg"
				) {
					$errors.avatar_url = "error.invalid_file_type";
					return;
				}

				try {
					const params: UploadFileQueryParams = { folder: "/uploads/managers/images" };
					const body: BodyInit = new FormData();
					if (avatarFiles && avatarFiles.length > 0) {
						body.append("file", avatarFiles[0]);
					}
					const response = await apiUploadManagerFile(params, body, token);
					if (response.code !== "OK") {
						toastStore.trigger(
							generateToast("error", {
								message: response.message || "Error uploading avatar file."
							})
						);
						return;
					}

					values.avatar_url = response.data.file_path;
				} catch (error) {
					console.log(error);
				}
			}

			// Upload info file
			if (infoFiles && infoFiles.length > 0) {
				// Check if file is pdf
				if (infoFiles[0].type !== "application/pdf") {
					$errors.info_file_url = "error.invalid_file_type";
					return;
				}

				try {
					// Upload info file
					const fileName: string = `VOL${values.volume}_NO${values.issue}.pdf`;
					const params: UploadFileQueryParams = {
						folder: "/uploads/managers/files",
						name: fileName
					};
					const body: BodyInit = new FormData();
					if (infoFiles && infoFiles.length > 0) {
						body.append("file", infoFiles[0]);
					}
					const response = await apiUploadManagerFile(params, body, token);
					if (response.code !== "OK") {
						toastStore.trigger(
							generateToast("error", {
								message: response.message || "Error uploading avatar file."
							})
						);
						return;
					}

					values.info_file_url = response.data.file_path;
				} catch (error) {
					console.log(error);
				}
			}

			onSave(manager.id || "", {
				...values,
				year: Number(values.publish_date.split("-")[0]),
				month: Number(values.publish_date.split("-")[1])
			});
		}
	});

	/**
	 * Handle close
	 */
	const handleClose = () => {
		modalStore.close();
	};

	/**
	 * Handle delete file
	 * @param filePath string
	 * @param type "avatar" | "info"
	 */
	const handleDeleteFile = async (filePath: string, type: "avatar" | "info") => {
		try {
			const response = await apiDeleteManagerFile(filePath, token);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: response.message || "An error occurred while deleting the file."
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: $t("toast.success.delete", {
						values: {
							field: "file"
						}
					})
				})
			);

			// Update file path to empty
			apiPatchManagerById(
				manager.id,
				type === "avatar" ? { avatar_url: "" } : { info_file_url: "" },
				token
			);

			modalStore.close();
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handle sync articles
	 */
	const handleSyncArticles = async () => {
		try {
			isSubmitting.set(true);

			const body: PublishIssueBody = {
				volume: $form.volume,
				issue: $form.issue
			};
			const response = await apiPostPublishIssue(body, token);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "An error occurred while syncing the articles."
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: "Sync articles successfully."
				})
			);

			modalStore.close();
		} catch (error) {
			console.log(error);
		} finally {
			isSubmitting.set(false);
		}
	};
</script>

<form
	class="edit-page-modal h-full w-8/12 rounded-xl bg-white dark:bg-gray-800"
	on:submit|preventDefault={handleSubmit}
>
	<div class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div class="flex items-center justify-between gap-6 p-2 text-lg font-bold">
			{`${$t(`admin_page.manage_volumes_issues.edit_volume_issue_modal.${manager.id ? "edit_volume_issue" : "add_volume_issue"}`)} ${manager.id ? `- ID: ${manager.id}` : ""}`}
			<button type="button" on:click={handleClose} class="rounded-full p-1">
				<X class="h-4 w-4 text-gray-500" />
			</button>
		</div>
		<hr class="!border-t-1 w-full !border-surface-700/70" />

		<!-- Area: Modal Body -->
		<div class="flex flex-col gap-4 text-sm">
			{#if isLoading}
				<Spinner />
			{:else if manager}
				<div class="flex max-h-[calc(100vh-240px)] flex-col gap-4 overflow-auto p-4">
					<div class="flex items-start gap-4">
						<InputForm
							required
							type="month"
							label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.publish_date")}
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.publish_date}
							bind:value={$form.publish_date}
						/>

						<InputForm
							required
							type="number"
							min={1}
							label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.volume")}
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.volume}
							bind:value={$form.volume}
						/>

						<InputForm
							required
							type="number"
							min={1}
							label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.issue")}
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.issue}
							bind:value={$form.issue}
						/>

						<InputForm
							required
							type="select"
							label={$t("admin_page.manage_articles.edit_article_modal.status")}
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.active}
							options={STATUS_OPTIONS}
							bind:value={$form.active}
						/>
					</div>

					<InputForm
						type="text"
						label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.foreword")}
						direction="column"
						class="[&_.input-form-wrapper]:w-full"
						placeholder="Foreword from Kou Yamada, Professor of Gunma University, Japan."
						showErrorMessage
						errorMessage={$errors.foreword}
						bind:value={$form.foreword}
					/>

					<InputForm
						rows={6}
						type="textarea"
						label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.foreword_content")}
						direction="column"
						class="[&_.input-form-wrapper]:w-full"
						showErrorMessage
						placeholder="Dear readers,...."
						errorMessage={$errors.foreword_content}
						bind:value={$form.foreword_content}
					/>

					<div class="flex items-start gap-4">
						<!-- Upload Avatar -->
						<div class="flex w-full flex-col">
							<InputForm
								label={$t(
									"admin_page.manage_volumes_issues.edit_volume_issue_modal.avatar_manager"
								)}
								type="file"
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.avatar_url}
								bind:files={avatarFiles}
							/>

							{#if !avatarFiles && manager.avatar_url}
								<div class="mt-2 flex items-start gap-4 text-sm">
									<a
										href={`${API_HOST}${manager.avatar_url}`}
										target="_blank"
										class="flex items-center text-primary-500 underline"
									>
										View current file
									</a>

									<button
										type="button"
										class="text-error-500 underline"
										on:click={() => handleDeleteFile(manager.avatar_url, "avatar")}
									>
										{$t("form.delete")}
									</button>
								</div>
							{/if}
						</div>

						<!-- Upload Info File -->
						<div class="flex w-full flex-col">
							<InputForm
								label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.info_manager")}
								type="file"
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								errorMessage={$errors.info_file_url}
								showErrorMessage
								bind:files={infoFiles}
							/>

							{#if !infoFiles && manager.info_file_url}
								<div class="mt-2 flex items-start gap-4 text-sm">
									<a
										href={`${API_HOST}${manager.info_file_url}`}
										target="_blank"
										class="flex items-center text-primary-500 underline"
									>
										View current file
									</a>
									<button
										type="button"
										class="text-error-500 underline"
										on:click={() => handleDeleteFile(manager.info_file_url, "info")}
									>
										{$t("form.delete")}
									</button>
								</div>
							{/if}
						</div>
					</div>

					<div class="variant-soft-primary mt-2 flex items-start gap-2 rounded-md p-2 text-sm">
						<Info />
						{@html $t(
							"admin_page.manage_volumes_issues.edit_volume_issue_modal.info_file_attention"
						)}
					</div>
				</div>
			{/if}
		</div>

		<!-- Area: Modal Footer -->
		<hr class="!border-t-1 w-full !border-surface-700/70" />
		<div class="flex items-center justify-end gap-4 p-4">
			{#if manager.id}
				<!-- Area: Sync Articles Button -->
				<Button
					type="button"
					label={$t("admin_page.manage_volumes_issues.edit_volume_issue_modal.sync_articles")}
					variant="primary"
					size="sm"
					icon="uil uil-sync"
					onClick={handleSyncArticles}
					loading={$isSubmitting}
				/>
			{/if}
			<!-- Area: Copy Button -->
			<Button
				type="submit"
				label={$t("form.save")}
				variant="secondary"
				size="sm"
				icon="uil uil-copy"
				loading={$isSubmitting}
			/>
		</div>
	</div>
</form>
