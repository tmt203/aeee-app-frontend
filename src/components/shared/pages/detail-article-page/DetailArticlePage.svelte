<script lang="ts">
	import CiteModal from "@components/shared/atoms/CiteModal.svelte";
	import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout.svelte";
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { Article } from "@type/api/article.type";
	import { toCapitalCase } from "@utils/string";
	import { BookOpen, FileText } from "lucide-svelte";

	export let article: Article;

	const modalStore = getModalStore();

	/**
	 * Handle cite article
	 */
	const handleCiteArticle = () => {
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: CiteModal,
				props: {
					apa: article?.citations?.apa ?? "",
					bibTex: article?.citations?.bib_tex ?? ""
				}
			}
		};

		modalStore.trigger(modal);
	};
</script>

<DefaultPageLayout breadcrumbs={["Article"]}>
	<article
		class="container max-w-3xl rounded-2xl bg-white p-6 text-primary-text-color shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700"
	>
		<!-- Title -->
		<h3 class="mb-4 text-2xl font-bold leading-snug tracking-tight">
			{article?.title}
		</h3>

		<!-- Meta info -->
		<div class="mb-6 space-y-1 text-xs text-gray-600 dark:text-gray-400">
			<p>
				<span class="font-medium text-gray-800 dark:text-gray-200">Authors:</span>
				{article?.authors
					.map(
						(item) =>
							item.first_name.replace("-", " ") +
							" " +
							toCapitalCase(item.last_name.replace("-", " "))
					)
					.join(", ")}
			</p>
			<p>
				<span class="font-medium text-gray-800 dark:text-gray-200">DOI:</span>
				{article?.doi}
			</p>
		</div>

		<!-- Abstract -->
		<div class="mb-6 space-y-2">
			<h4 class="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200">
				Abstract
			</h4>
			<div
				class="rounded-lg border-l-4 border-primary-500 bg-primary-50/60 p-4 dark:border-primary-400 dark:bg-primary-900/40"
			>
				{@html article?.abstract ?? "<p>No abstract available.</p>"}
			</div>
		</div>

		<!-- Actions -->
		<div
			class="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700"
		>
			<a
				href="/index.php/AEEE/article/view/{article.id}/pdf"
				target="_blank"
				rel="noopener noreferrer"
			>
				<button class="variant-filled-primary btn btn-sm">
					<FileText class="mr-2" size={16} /> View PDF
				</button>
			</a>

			<button class="variant-ringed-primary btn btn-sm" on:click={handleCiteArticle}>
				<BookOpen class="mr-2" size={16} /> Cite this
			</button>
		</div>
	</article>
</DefaultPageLayout>
