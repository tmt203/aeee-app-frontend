<script lang="ts">
	import { apiGetArticles } from "@api/article.api";
	import GroupByYearArticles from "@components/non-shared/archives/GroupByYearArticles.svelte";
	import SearchArticles from "@components/non-shared/archives/SearchArticles.svelte";
	import { CiteModal } from "@components/shared/atoms";
	import { DefaultPageLayout } from "@components/shared/templates";
	import { generateToast } from "@constants/toast.constants";
	import {
		getModalStore,
		getToastStore,
		Tab,
		TabGroup,
		type ModalSettings
	} from "@skeletonlabs/skeleton";
	import type { ArticleQueryParams, Citation } from "@type/api/article.type";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import { mappingToArticleItem } from "@utils/components/article_item";
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
		<TabGroup
			active="border-b-2 border-secondary-500 text-primary-500 bg-primary-50"
			rounded="rounded-t-lg"
		>
			<!-- Area: Tab Header -->
			<Tab bind:group={tabSet} name="archives" value="archives">
				{$t("archives_page.tabs.archives")}
			</Tab>

			<Tab bind:group={tabSet} name="search" value="search">
				{$t("archives_page.tabs.search")}
			</Tab>

			<!-- Area: Tab Content -->
			<svelte:fragment slot="panel">
				{#if tabSet === "archives"}
					<GroupByYearArticles />
				{:else if tabSet === "search"}
					<SearchArticles />
				{/if}
			</svelte:fragment>
		</TabGroup>
	</section>
</DefaultPageLayout>
