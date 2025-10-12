<script lang="ts">
	import Carousel from "svelte-carousel";
	import { Spinner } from "../atoms";

	export let leftLabel: string = "";
	export let rightLabel: string = "";
	export let link: string = "";
	export let className: string = "";
	export let isLoading: boolean = false;

	let carouselElement: any;
</script>

<div
	class="carousel-content flex w-full flex-col rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 {className}"
>
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between border-b pb-4">
		<h3 class="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
			{leftLabel}
		</h3>

		<div class="flex items-center gap-3">
			<!-- Prev button -->
			<button
				on:click={carouselElement?.goToPrev()}
				class="flex size-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-110 hover:bg-primary-500 hover:text-white active:scale-95 dark:bg-gray-800"
			>
				<i class="uil uil-angle-left"></i>
			</button>

			<!-- Right link -->
			{#if link}
				<a href={link} class="text-sm font-medium text-blue-600 transition hover:underline"
					>{rightLabel}</a
				>
			{/if}

			<!-- Next button -->
			<button
				on:click={carouselElement?.goToNext()}
				class="flex size-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-110 hover:bg-primary-500 hover:text-white active:scale-95 dark:bg-gray-800"
			>
				<i class="uil uil-angle-right"></i>
			</button>
		</div>
	</div>

	<!-- Body -->
	<div class="flex flex-col gap-6 xl:flex-row">
		<!-- Sidebar -->
		<slot name="carousel-sidebar" />

		<!-- Carousel / Spinner -->
		<div class="carousel-items w-full">
			{#if isLoading}
				<Spinner />
			{:else}
				<Carousel
					autoplay
					pauseOnFocus
					dots={false}
					arrows={false}
					autoplayDuration={4000}
					bind:this={carouselElement}
				>
					<slot name="carousel-items" />
				</Carousel>
			{/if}
		</div>
	</div>
</div>
