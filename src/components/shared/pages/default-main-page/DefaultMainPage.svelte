<script lang="ts">
	import { goto } from "$app/navigation";
	import { apiGetArticles } from "@api/article.api";
	import { CiteModal } from "@components/shared/atoms";
	import Spinner from "@components/shared/atoms/Spinner.svelte";
	import { Button } from "@components/shared/molecules";
	import ArticleItem from "@components/shared/molecules/ArticleItem.svelte";
	import { CarouselContent } from "@components/shared/organisms";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { Article, ArticleQueryParams, Citation } from "@type/api/article.type";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import type { DefaultMainPageProps } from "@type/components/defaultMainPage.type";
	import { chunkArray } from "@utils/array";
	import clsx from "clsx";
	import Carousel from "svelte-carousel";

	export let {
		latestManagerForeword,
		mostViewsArticles,
		previousArticles,
		incomingArticles
	}: DefaultMainPageProps = {
		latestManagerForeword: "",
		mostViewsArticles: [],
		previousArticles: [],
		incomingArticles: []
	};
	export let mappingToArticleItem: (article: Article, showButton: boolean) => ArticleItemProps;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const images: string[] = ["svg/vsb_cs.svg", "svg/vsb_en.svg", "images/uniza_sk.jpg"];

	let chunkMostViewArticles = chunkArray(mostViewsArticles, 4);
	let chunkPreviousArticles = chunkArray(previousArticles, 5);
	let selectedYear: number = new Date().getFullYear() - 1;
	let isLoading: boolean = false;

	/**
	 * Fetch articles
	 * @param params ArticleQueryParams
	 * @returns Promise<Article[]>
	 */
	const handleFetchArticles = async (params: ArticleQueryParams): Promise<Article[]> => {
		isLoading = true;

		try {
			const response = await apiGetArticles(params);

			if (response.code !== "OK") {
				toastStore.trigger(generateToast("error", { message: response.message }));
				return [];
			}

			return response.data;
		} catch (error) {
			console.log(error);
		} finally {
			// Delay for 1s
			await new Promise((resolve) => setTimeout(resolve, 1000));
			isLoading = false;
		}

		return [];
	};

	/**
	 * On previous year click
	 * @param year number
	 */
	const onPreviousYearClick = (year: number) => async () => {
		selectedYear = year;

		const previousArticles = await handleFetchArticles({ year, limit: 9999 });
		const mappedPreviousArticles = previousArticles.map((article) =>
			mappingToArticleItem(article, false)
		);

		chunkPreviousArticles = chunkArray(mappedPreviousArticles, 5);
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
</script>

<section class="default-main-page flex size-full flex-col text-surface-900/80">
	<!-- Area: Home Banner -->
	<div
		class="home-banner container flex flex-col items-center justify-between gap-10 border-b px-4 py-8 xl:flex-row xl:gap-20 xl:px-20"
	>
		<img src="images/home-banner.png" alt="Banner" class="h-auto w-[440px] object-cover" />
		<div class="flex flex-col gap-4">
			<h1
				class="h1 relative pb-6 text-center leading-[32px] max-xl:text-[28px] xl:text-left xl:leading-[62px]"
			>
				We Welcome Latest Research Articles in Electrical and Electronic Engineering
			</h1>
			<p class="text-center text-xl font-normal leading-[32px] xl:text-left">
				The Advances in Electrical and Electronic Engineering is a peer-reviewed periodical
				scientific journal aimed at publishing research results of the Journal focus areas. The role
				of the Journal is to facilitate contacts between research centers and the industry...
				<a href="about-us/aims-and-scopes" class="text-blue-500 hover:underline">Read more</a>
			</p>
		</div>
	</div>

	<!-- Area: Latest Research -->
	<div
		class="latest-research container flex flex-col items-center gap-10 px-4 py-8 xl:flex-row xl:gap-20 xl:px-20"
	>
		<div class="w-full xl:w-5/12">
			<Carousel arrows={false} dots={false} autoplay autoplayDuration={2000}>
				{#each images as image}
					<div class="flex items-center justify-center">
						<img src={image} alt="VSB Logo" class="!min-w-[200px] !max-w-[200px]" />
					</div>
				{/each}
			</Carousel>
		</div>

		<div class="flex w-full flex-col items-center xl:w-7/12 xl:items-start">
			<span class="text-xl">Greetings & Welcome</span>
			<h2 class="h2 mb-6">Explore Latest Researches</h2>
			<p class="mb-6 text-center text-base xl:text-left">
				{latestManagerForeword}...
			</p>
			<a href="/issues/current-issues">
				<Button variant="primary" size="md" class="w-fit">Read more</Button>
			</a>
		</div>
	</div>

	<!-- Area: Most Views -->
	<div
		id="most-views"
		class="most-views container flex flex-col gap-10 px-4 py-8 xl:flex-row xl:gap-20 xl:px-20"
	>
		<CarouselContent leftLabel="Most Views" rightLabel="View All" link="/issues/archives">
			<svelte:fragment slot="carousel-items">
				{#each chunkMostViewArticles as group}
					<div class="flex flex-col gap-4">
						{#each group as item (item.id)}
							<ArticleItem
								{...item}
								link={`/index.php/AEEE/article/view/${item.id}`}
								onCiteArticle={handleCiteArticle(item.citations)}
							/>
						{/each}
					</div>
				{/each}
			</svelte:fragment>
		</CarouselContent>
	</div>

	<!-- Area: Previous Issues -->
	<div
		id="previous-issues"
		class="previous-issues container flex flex-col gap-20 px-4 py-8 xl:flex-row xl:px-20"
	>
		<CarouselContent
			{isLoading}
			leftLabel="Previous Issues"
			rightLabel="View All"
			link="/issues/archives"
		>
			<svelte:fragment slot="carousel-sidebar">
				<ul
					class="un-ordered-list-circle float-left grid w-full auto-rows-min grid-cols-2 gap-4 md:grid-cols-4 xl:w-40 xl:grid-cols-1 xl:grid-rows-none"
				>
					<!-- Show past 10 years -->
					{#each Array.from({ length: 10 }) as _, i}
						<li
							class={clsx(
								"relative float-left h-fit w-full cursor-pointer py-1 pl-4 transition-all hover:pl-8",
								{
									"active text-primary-500": selectedYear === new Date().getFullYear() - i - 1
								}
							)}
						>
							<button on:click={onPreviousYearClick(new Date().getFullYear() - i - 1)}>
								Issues From: {new Date().getFullYear() - i - 1}
							</button>
						</li>
					{/each}
				</ul>
			</svelte:fragment>

			<svelte:fragment slot="carousel-items">
				{#each chunkPreviousArticles as group}
					<div class="flex flex-col gap-4">
						{#each group as item (item.id)}
							<ArticleItem
								{...item}
								link={`/index.php/AEEE/article/view/${item.id}`}
								onCiteArticle={handleCiteArticle(item.citations)}
							/>
						{/each}
					</div>
				{/each}
			</svelte:fragment>
		</CarouselContent>
	</div>

	<!-- Area: This Year Articles -->
	<div class="this-year-articles container flex flex-col gap-20 px-4 py-8 xl:flex-row xl:px-20">
		<CarouselContent
			leftLabel={`Coming In ${new Date().getFullYear()}`}
			rightLabel="View All"
			link="/issues/archives"
		>
			<svelte:fragment slot="carousel-items">
				<div class="flex flex-col gap-4">
					{#each incomingArticles as item}
						<ArticleItem
							{...item}
							link={`/index.php/AEEE/article/view/${item.id}`}
							onCiteArticle={handleCiteArticle(item.citations)}
						/>
					{/each}
				</div>
			</svelte:fragment>
		</CarouselContent>
	</div>
</section>

<style lang="scss">
	@use "@scss/shared/pages/defaultMainPage.scss" as *;
</style>
