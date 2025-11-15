<script lang="ts">
	import { page } from "$app/stores";
	import { API_HOST } from "$lib/env/client";
	import {
		apiDeleteManagerFile,
		apiPatchManagerById,
		apiUploadManagerFile
	} from "@api/manager.api";
	import { ConfirmModal, Spinner } from "@components/shared/atoms";
	import { Button, InputForm } from "@components/shared/molecules";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { Manager, ManagerBody, UploadFileQueryParams } from "@type/api/manager.type";
	import { FileText, Info, X } from "lucide-svelte";
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
		volume: manager?.volume || 0,
		issue: manager?.issue || 0,
		foreword: manager?.foreword || "",
		avatar_url: manager?.avatar_url || "",
		info_file_url: manager?.info_file_url || "",
		foreword_content: manager?.foreword_content || ""
	};
	const validationSchema = object().shape({
		volume: number().required("error.input_required"),
		issue: number().required("error.input_required"),
		foreword: string(),
		avatar_url: string(),
		info_file_url: string(),
		foreword_content: string()
	});
	const { form, errors, handleSubmit } = createForm({
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

			onSave(manager.id || "", values);
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

	$: console.log("token", token);
</script>

<form
	class="edit-page-modal h-full w-6/12 rounded-xl bg-white dark:bg-gray-800"
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

					<div class="variant-soft-primary mt-2 flex items-center gap-2 rounded-md p-2 text-sm">
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
			<!-- Area: Copy Button -->
			<Button
				type="submit"
				label={$t("form.save")}
				variant="secondary"
				size="sm"
				icon="uil uil-copy"
			/>
		</div>
	</div>
</form>
