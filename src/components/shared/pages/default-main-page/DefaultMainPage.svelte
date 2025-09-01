<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "@components/shared/molecules";
	import Carousel from "svelte-carousel";

	const texts: string[] = ["Text 1", "Text 2", "Text 3"];
	const images: string[] = ["svg/vsb_cs.svg", "svg/vsb_en.svg", "images/uniza_sk.jpg"];
</script>

<section class="default-main-page flex size-full flex-col text-surface-800">
	<!-- Area: Home Banner -->
	<div
		class="home-banner container flex flex-col items-center justify-between gap-20 border-b px-4 py-8 xl:flex-row xl:px-20"
	>
		<img src="images/home-banner.png" alt="Banner" class="h-auto w-[440px] object-cover" />
		<div class="flex flex-col gap-4">
			<h1 class="h1 relative pb-6 leading-[62px]">
				We Welcome Latest Research Articles in Electrical and Electronic Engineering
			</h1>
			<p class="text-xl font-normal leading-[32px]">
				The Advances in Electrical and Electronic Engineering is a peer-reviewed periodical
				scientific journal aimed at publishing research results of the Journal focus areas. The role
				of the Journal is to facilitate contacts between research centers and the industry...
				<a href="about-us/aims-and-scopes" class="text-blue-500 hover:underline">Read more</a>
			</p>
		</div>
	</div>

	<!-- Area: Latest Research -->
	<div class="latest-research container flex items-center gap-20 px-4 py-8 xl:flex-row xl:px-20">
		<div class="w-5/12">
			<Carousel arrows={false} autoplay autoplayDuration={2000}>
				{#each images as image}
					<div class="flex items-center justify-center">
						<img src={image} alt="VSB Logo" class="!min-w-[200px] !max-w-[200px]" />
					</div>
				{/each}
			</Carousel>
		</div>

		<div class="flex w-7/12 flex-col">
			<span class="text-xl">Greetings & Welcome</span>
			<h2 class="h2 mb-6">Explore Latest Researches</h2>
			<p class="mb-6 text-base">
				Foreword from Axel Sikora, Professor of Offenburg University, Germany and Deputy Member of
				the Board at Hahn-Schickard, Villingen-Schwenningen, Germany...
			</p>
			<Button
				label="Read more"
				variant="primary"
				size="md"
				class="w-fit"
				on:click={() => goto("/issues/current-issues")}
			/>
		</div>
	</div>
</section>

<style lang="scss">
	@use "@scss/shared/pages/defaultMainPage.scss" as *;
</style>
