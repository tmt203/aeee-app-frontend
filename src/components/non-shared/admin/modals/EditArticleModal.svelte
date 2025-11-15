<script lang="ts">
	import { API_HOST } from "$lib/env/client";
	import { Spinner } from "@components/shared/atoms";
	import { Button, InputForm, InputTime } from "@components/shared/molecules";
	import type { ArticleValidationSchema } from "@components/shared/pages/admin/manage-articles/manageArticlesPage.interface";
	import { getModalStore } from "@skeletonlabs/skeleton";
	import type { Article, ArticleBody, Author } from "@type/api/article.type";
	import { sanitizeFileName } from "@utils/string";
	import { Info, Move, X } from "lucide-svelte";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { array, object, string } from "yup";

	export let article: Article;
	export let onSave: (id: string, body: ArticleBody) => void;

	const modalStore = getModalStore();

	let isLoading: boolean = false;
	let authors: Author[] = [
		...(article.authors.length ? article.authors : [{ first_name: "", last_name: "" }])
	];
	let draggedIndex: number | null = null;
	let files: FileList | null = null;

	/**
	 * Get history date by status
	 * @param status string
	 */
	const getHistoryDate = (status: "received" | "revised" | "accepted"): string => {
		if (article && article.history) {
			const received = article.history.find((item) => item.status === "received");
			const revised = article.history.find((item) => item.status === "revised");
			const accepted = article.history.find((item) => item.status === "accepted");

			const isReceived = status === "received" && received?.day;
			const isRevised = status === "revised" && revised?.day;
			const isAccepted = status === "accepted" && accepted?.day;

			return isReceived
				? `${received?.day}/${received?.month}/${received?.year}`
				: isRevised
					? `${revised?.day}/${revised?.month}/${revised?.year}`
					: isAccepted
						? `${accepted?.day}/${accepted?.month}/${accepted?.year}`
						: "";
		}

		return "";
	};

	// Form
	const initialValues = {
		title: article.title || "",
		doi: article.doi || "",
		volume: article.volume || 0,
		issue: article.issue || 0,
		first_page: article.pages?.first || 0,
		last_page: article.pages?.last || 0,
		abstract: article.abstract || "",
		authors,
		pdf_path: article.pdf_path || "",
		received_date: getHistoryDate("received") || "",
		revised_date: getHistoryDate("revised") || "",
		accepted_date: getHistoryDate("accepted") || "",
		published_date: article.pub_date.day
			? `${article.pub_date.day}/${article.pub_date.month}/${article.pub_date.year}`
			: ""
	};
	const validationSchema = object().shape({
		title: string().required("error.input_required"),
		doi: string().required("error.input_required"),
		volume: string().required("error.input_required"),
		issue: string().required("error.input_required"),
		first_page: string().required("error.input_required"),
		last_page: string().required("error.input_required"),
		abstract: string().required("error.input_required"),
		received_date: string().required("error.select_required"),
		revised_date: string().required("error.select_required"),
		accepted_date: string().required("error.select_required"),
		published_date: string().required("error.select_required"),
		pdf_path: string().required("error.select_required"),
		authors: array().of(
			object().shape({
				first_name: string().required("error.input_required"),
				last_name: string().required("error.input_required")
			})
		)
	});
	const { form, errors, handleSubmit } = createForm<ArticleValidationSchema>({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const body: ArticleBody = {
				doi: values.doi,
				year: article.year,
				title: values.title,
				views: article.views,
				authors: values.authors,
				abstract: values.abstract,
				language: article.language,
				pdf_path: article.pdf_path,
				category: article.category,
				citations: article.citations,
				issue: Number(values.issue),
				volume: Number(values.volume),

				pages: {
					first: Number(values.first_page),
					last: Number(values.last_page)
				},
				pub_date: {
					day: parseInt(values.published_date.split("/")[0], 10),
					month: parseInt(values.published_date.split("/")[1], 10),
					year: parseInt(values.published_date.split("/")[2], 10)
				},
				history: [
					{
						status: "received",
						day: parseInt(values.received_date.split("/")[0], 10),
						month: parseInt(values.received_date.split("/")[1], 10),
						year: parseInt(values.received_date.split("/")[2], 10)
					},
					{
						status: "revised",
						day: parseInt(values.revised_date.split("/")[0], 10),
						month: parseInt(values.revised_date.split("/")[1], 10),
						year: parseInt(values.revised_date.split("/")[2], 10)
					},
					{
						status: "accepted",
						day: parseInt(values.accepted_date.split("/")[0], 10),
						month: parseInt(values.accepted_date.split("/")[1], 10),
						year: parseInt(values.accepted_date.split("/")[2], 10)
					}
				]
			};

			onSave(article.id, body);
		}
	});

	/**
	 * Handle close
	 */
	const handleClose = () => {
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

	$: {
		if (files && files.length > 0) {
			const file = files[0];
			console.log("Selected file:", file);
			// Change pdf path to the selected file name for demonstration
			$form.pdf_path = `/uploads/articles/${$form.published_date.split("/").pop()}/Vol ${$form.volume}, No ${$form.issue}/${sanitizeFileName(file.name)}`;
		}
	}
</script>

<form
	class="edit-page-modal h-full w-11/12 rounded-xl bg-white dark:bg-gray-800"
	on:submit|preventDefault={handleSubmit}
>
	<div class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div class="flex items-center justify-between gap-6 p-2 text-lg font-bold">
			{`${$t(`admin_page.manage_articles.edit_article_modal.${article.id ? "edit_article" : "add_article"}`)} ${article.id ? `- ID: ${article.id}` : ""}`}
			<button type="button" on:click={handleClose} class="rounded-full p-1">
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
					<div class="flex flex-col gap-4">
						<InputForm
							type="text"
							label={$t("admin_page.manage_articles.edit_article_modal.title")}
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.title}
							placeholder="Performance Analysis of ..."
							bind:value={$form.title}
						/>
						<div class="flex items-start gap-4">
							<InputForm
								type="text"
								label={$t("admin_page.manage_articles.edit_article_modal.doi")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.doi}
								placeholder="10.15598/aeee.v23i3.250211"
								bind:value={$form.doi}
							/>
							<InputForm
								type="number"
								min={0}
								label={$t("admin_page.manage_articles.edit_article_modal.volume")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.volume}
								bind:value={$form.volume}
							/>
							<InputForm
								type="number"
								min={0}
								label={$t("admin_page.manage_articles.edit_article_modal.issue")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.issue}
								bind:value={$form.issue}
							/>
							<InputForm
								type="number"
								min={0}
								label={$t("admin_page.manage_articles.edit_article_modal.first_page")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.first_page}
								bind:value={$form.first_page}
							/>
							<InputForm
								type="number"
								min={0}
								label={$t("admin_page.manage_articles.edit_article_modal.last_page")}
								direction="column"
								class="[&_.input-form-wrapper]:w-full"
								showErrorMessage
								errorMessage={$errors.last_page}
								bind:value={$form.last_page}
							/>
						</div>

						<div class="flex items-start gap-4">
							<InputTime
								id="received-date"
								label="admin_page.manage_articles.edit_article_modal.received_date"
								showErrorMessage
								errorMessage={$errors.received_date}
								bind:value={$form.received_date}
							/>
							<InputTime
								id="revised-date"
								label="admin_page.manage_articles.edit_article_modal.revised_date"
								showErrorMessage
								errorMessage={$errors.revised_date}
								bind:value={$form.revised_date}
							/>
							<InputTime
								id="accepted-date"
								label="admin_page.manage_articles.edit_article_modal.accepted_date"
								showErrorMessage
								errorMessage={$errors.accepted_date}
								bind:value={$form.accepted_date}
							/>
							<InputTime
								id="published-date"
								label="admin_page.manage_articles.edit_article_modal.published_date"
								showErrorMessage
								errorMessage={$errors.published_date}
								bind:value={$form.published_date}
							/>
						</div>

						<InputForm
							type="textarea"
							rows={6}
							label={$t("admin_page.manage_articles.edit_article_modal.abstract")}
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							showErrorMessage
							errorMessage={$errors.abstract}
							bind:value={$form.abstract}
						/>
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
									type="text"
									label={$t("admin_page.manage_articles.edit_article_modal.first_name")}
									direction="column"
									class="[&_.input-form-wrapper]:w-full"
									errorMessage={""}
									showErrorMessage
									bind:value={$form.authors[index].first_name}
								/>
								<InputForm
									type="text"
									label={$t("admin_page.manage_articles.edit_article_modal.last_name")}
									direction="column"
									class="[&_.input-form-wrapper]:w-full"
									errorMessage={""}
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
						<p class="text-sm font-bold">
							File path:
							{#if $form.pdf_path}
								<span class="italic text-success-500">{$form.pdf_path}</span>
								<a
									href={`${API_HOST}/${$form.pdf_path}`}
									target="_blank"
									rel="noopener noreferrer"
									class="ml-4 text-primary-500">View PDF</a
								>
							{:else}
								<span class="italic text-gray-500">No file uploaded</span>
							{/if}
						</p>
						<InputForm
							type="file"
							direction="column"
							class="[&_.input-form-wrapper]:w-full"
							errorMessage=""
							showErrorMessage
							bind:files
						/>

						<!-- Area: Attention -->
						<div class="variant-ghost-primary flex items-center gap-2 rounded-lg p-3 text-sm">
							<Info />
							{$t("admin_page.manage_articles.edit_article_modal.file_attention")}
						</div>
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
