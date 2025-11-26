<script lang="ts">
	import { page } from "$app/stores";
	import { API_HOST } from "$lib/env/client";
	import {
		apiDeleteEarlyAccessArticleFile,
		apiPatchEarlyAccessArticleById,
		apiUploadEarlyAccessArticleFile
	} from "@api/early_access_article.api";
	import { Spinner } from "@components/shared/atoms";
	import { Button, InputForm } from "@components/shared/molecules";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
	import type { Author } from "@type/api/article.type";
	import type {
		EarlyAccessArticle,
		EarlyAccessArticleBody
	} from "@type/api/early_access_article.type";
	import type { UploadFileQueryParams } from "@type/api/manager.type";
	import { sanitizeFileName } from "@utils/string";
	import { Info, Move, X } from "lucide-svelte";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { array, object, string } from "yup";

	export let article: EarlyAccessArticle;
	export let onSave: (id: string, body: EarlyAccessArticleBody) => Promise<void>;

	const { token } = $page.data.session;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let isLoading: boolean = false;
	let pdfFiles: FileList | null = null;
	let draggedIndex: number | null = null;
	let authorErrorMessages: Author[] = [];
	let authors: Author[] = [
		...(article.authors.length ? article.authors : [{ first_name: "", last_name: "" }])
	];

	// Form
	const initialValues = {
		title: article.title || "",
		authors,
		pdf_path: article.pdf_path || "",
		active: article.active || false
	};
	const validationSchema = object().shape({
		title: string().required("error.input_required"),
		authors: array().of(
			object().shape({
				first_name: string().required("error.input_required"),
				last_name: string().required("error.input_required")
			})
		),
		pdf_path: string().required("error.select_required")
	});
	const { form, errors, isSubmitting, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			// Upload info file
			if (pdfFiles && pdfFiles.length > 0) {
				// Check if file is pdf
				if (pdfFiles[0].type !== "application/pdf") {
					$errors.pdf_path = "error.invalid_file_type";
					return;
				}

				try {
					// Upload info file
					const fileName: string = `${sanitizeFileName(values.title)}.pdf`;
					const params: UploadFileQueryParams = {
						folder: "/uploads/early-access-articles",
						name: fileName
					};
					const body: BodyInit = new FormData();
					if (pdfFiles && pdfFiles.length > 0) {
						body.append("file", pdfFiles[0]);
					}
					const response = await apiUploadEarlyAccessArticleFile(params, body, token);
					if (response.code !== "OK") {
						toastStore.trigger(
							generateToast("error", {
								message: response.message || "Error uploading file."
							})
						);
						return;
					}

					values.pdf_path = response.data.file_path;
				} catch (error) {
					console.log(error);
				}
			}

			await onSave(article.id, values);
		}
	});

	/**
	 * Close modal
	 */
	const closeModal = () => {
		modalStore.close();
	};

	/**
	 * Handle drag start
	 * @param event DragEvent
	 * @param index number
	 */
	const handleDragStart = (event: DragEvent, index: number) => {
		draggedIndex = index;
		event.dataTransfer!.effectAllowed = "move";
	};

	/**
	 * Handle drag over
	 * @param event DragEvent
	 */
	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer!.dropEffect = "move";
	};

	/**
	 * Handle drop
	 * @param event DragEvent
	 * @param dropIndex number
	 */
	const handleDrop = (event: DragEvent, dropIndex: number) => {
		event.preventDefault();
		if (draggedIndex !== null && draggedIndex !== dropIndex) {
			const draggedItem = $form.authors[draggedIndex];
			$form.authors.splice(draggedIndex, 1);
			$form.authors.splice(dropIndex, 0, draggedItem);
			$form.authors = [...$form.authors]; // Trigger reactivity
		}
		draggedIndex = null;
	};

	/**
	 * Handle remove author
	 * @param index number
	 */
	const handleRemoveAuthor = (index: number) => () => {
		if ($form.authors.length > 0) {
			$form.authors.splice(index, 1);
			$form.authors = [...$form.authors]; // Trigger reactivity
		}
	};

	/**
	 * Handle add author
	 */
	const handleAddAuthor = () => {
		$form.authors = [...$form.authors, { first_name: "", last_name: "" }];
	};

	/**
	 * Handle delete file
	 * @param filePath string
	 */
	const handleDeleteFile = async (filePath: string) => {
		try {
			const response = await apiDeleteEarlyAccessArticleFile(filePath, token);
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
			apiPatchEarlyAccessArticleById(article.id, { pdf_path: "" }, token);

			modalStore.close();
		} catch (error) {
			console.log(error);
		}
	};

	// Reactivity for author error messages
	$: authorErrorMessages = $errors.authors
		? ($errors.authors as any).map((err: Record<string, any>) => ({
				first_name: err.first_name,
				last_name: err.last_name
			}))
		: [];

	// Reactivity for pdf file name
	$: if (pdfFiles && pdfFiles.length > 0) {
		$form.pdf_path = pdfFiles[0].name;
	}
</script>

<form
	class="edit-page-modal h-full w-7/12 rounded-xl bg-white dark:bg-gray-800"
	on:submit|preventDefault={handleSubmit}
>
	<div class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div class="flex items-center justify-between gap-6 p-2 text-lg font-bold">
			{`${$t(`admin_page.manage_articles.edit_article_modal.${article.id ? "edit_article" : "add_article"}`)} ${article.id ? `- ID: ${article.id}` : ""}`}
			<button type="button" on:click={closeModal} class="rounded-full p-1">
				<X class="h-4 w-4 text-gray-500" />
			</button>
		</div>
		<hr class="!border-t-1 w-full !border-surface-700/70" />

		<!-- Area: Modal Body -->
		<div class="flex flex-col gap-4 text-sm">
			{#if isLoading}
				<Spinner />
			{:else if article}
				<div class="flex max-h-[calc(100vh-240px)] flex-col overflow-auto p-4">
					<span class="mb-2 text-2xl font-bold capitalize">
						{$t("admin_page.manage_articles.edit_article_modal.basic_info")}
					</span>
					<div class="flex gap-4">
						<div class="w-10/12">
							<InputForm
								required
								type="text"
								label={$t("admin_page.manage_articles.edit_article_modal.title")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.title}
								placeholder="Performance Analysis of ..."
								bind:value={$form.title}
							/>
						</div>
						<div class="w-2/12">
							<InputForm
								required
								type="select"
								label={$t("admin_page.manage_articles.edit_article_modal.status")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.active}
								options={[
									{ label: "Active", value: true },
									{ label: "Inactive", value: false }
								]}
								bind:value={$form.active}
							/>
						</div>
					</div>

					<!-- Area: Attention -->
					<div class="variant-soft-primary mt-2 flex items-start gap-2 rounded-md p-2 text-sm">
						<Info />
						{$t("admin_page.manage_articles.edit_article_modal.status_attention")}
					</div>

					<!-- Area: Authors -->
					<span class="mb-2 mt-4 text-2xl font-bold capitalize">
						{$t("admin_page.manage_articles.edit_article_modal.authors")}
					</span>
					<div class="flex flex-col gap-4">
						{#each $form.authors as author, index}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="flex items-start gap-4"
								draggable="true"
								on:dragstart={(e) => handleDragStart(e, index)}
								on:dragover={handleDragOver}
								on:drop={(e) => handleDrop(e, index)}
							>
								<InputForm
									required
									type="text"
									label={$t("admin_page.manage_articles.edit_article_modal.first_name")}
									direction="column"
									class="[&_.input-form-wrapper]:w-full"
									errorMessage={authorErrorMessages[index]?.first_name || ""}
									showErrorMessage
									bind:value={$form.authors[index].first_name}
								/>
								<InputForm
									required
									type="text"
									label={$t("admin_page.manage_articles.edit_article_modal.last_name")}
									direction="column"
									class="[&_.input-form-wrapper]:w-full"
									errorMessage={authorErrorMessages[index]?.first_name || ""}
									showErrorMessage
									bind:value={$form.authors[index].last_name}
								/>

								<div class="flex items-center gap-4 self-start pt-8">
									<button type="button" class="cursor-move" title="Move Author">
										<Move class="text-gray-500" />
									</button>
									<button
										type="button"
										class="cursor-pointer"
										title="Remove Author"
										on:click={handleRemoveAuthor(index)}
									>
										<X class="text-error-500" />
									</button>
								</div>
							</div>
						{/each}

						<!-- Area: Add Author -->
						<div class="flex items-center gap-4">
							<Button
								type="button"
								label={$t("admin_page.manage_articles.edit_article_modal.add_author")}
								variant="primary"
								variantType="soft"
								icon="uil uil-plus"
								rounded="lg"
								on:click={handleAddAuthor}
							/>
						</div>
					</div>

					<!-- Area: Files -->
					<span class="mb-2 mt-4 text-2xl font-bold capitalize">
						{$t("admin_page.manage_articles.edit_article_modal.pdf_file")}
					</span>
					<div class="flex flex-col gap-2">
						<InputForm
							type="file"
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.pdf_path}
							bind:files={pdfFiles}
						/>

						{#if !pdfFiles && $form.pdf_path}
							<div class="flex items-start gap-4 text-sm">
								<a
									href={`${API_HOST}${$form.pdf_path}`}
									target="_blank"
									class="flex items-center text-primary-500 underline"
								>
									View current file
								</a>
							</div>
						{/if}
					</div>

					<!-- Area: Attention -->
					<div class="variant-soft-primary mt-2 flex items-start gap-2 rounded-md p-2 text-sm">
						<Info />
						{$t("admin_page.manage_articles.edit_article_modal.file_attention")}
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
				isLoading={$isSubmitting}
			/>
		</div>
	</div>
</form>
