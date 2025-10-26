<script lang="ts">
	import { CiteModal } from "@components/shared/atoms";
	import { ArticleItem } from "@components/shared/molecules";
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { Citation } from "@type/api/article.type";
	import type { ArticleItemProps } from "@type/components/articleItem.type";

	export let articles: ArticleItemProps[] = [];

	const modalStore = getModalStore();

	/**
	 * Handle cite article
	 * @param citations Citation
	 */
	const handleCiteArticle = (citations: Citation) => () => {
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: CiteModal,
				props: {
					apa: citations?.apa ?? "",
					bibTex: citations?.bib_tex ?? ""
				}
			}
		};

		modalStore.trigger(modal);
	};
</script>

{#if articles.length > 0}
	<div class="flex-column flex gap-4">
		{#each articles as article}
			<ArticleItem {...article} onCiteArticle={handleCiteArticle} />
		{/each}
	</div>
{:else}
	<p>No articles found.</p>
{/if}
