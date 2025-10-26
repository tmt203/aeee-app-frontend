<script lang="ts">
	import { apiGetArticles } from "@api/article.api";
	import GroupByYearArticles from "@components/non-shared/archives/GroupByYearArticles.svelte";
	import { CiteModal } from "@components/shared/atoms";
	import { DefaultPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { ArticleQueryParams, Citation } from "@type/api/article.type";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let tabSet: "archives" | "search" = "archives";
	let articles: ArticleItemProps[] = [];

	/**
	 * Handle get articles
	 * @param params ArticleQueryParams
	 */
	const handleGetArticles = async (params?: ArticleQueryParams) => {
		try {
			params = { ...params };
			const response = await apiGetArticles(params);

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: $t("toast.fail.get", { values: { field: "articles" } })
					})
				);
				return;
			}

			const { data } = response;

			if (!data || data.length === 0) {
				articles = [];
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};

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

	onMount(() => {
		handleGetArticles();
	});
</script>

<DefaultPageLayout showBanner={false} breadcrumbs={["Issues", "Archives"]}>
	<section class="flex w-full flex-col gap-4 text-surface-900/80">
		<GroupByYearArticles />
	</section>
</DefaultPageLayout>
