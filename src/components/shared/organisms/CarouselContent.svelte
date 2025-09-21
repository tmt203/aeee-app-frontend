<script lang="ts">
	import Carousel from "svelte-carousel";

	export let leftLabel: string = "";
	export let rightLabel: string = "";
	export let link: string = "";
	export let className: string = "";

	let carouselElement: any;
</script>

<div class="carousel-content flex w-full flex-col {className}">
	<!-- Area: Header -->
	<div class="flex justify-between border-b pb-4">
		<h3 class="text-2xl">{leftLabel}</h3>
		<div class="flex items-center gap-4">
			<button on:click={carouselElement?.goToPrev()}>
				<span
					class="flex size-6 items-center justify-center rounded-full border transition-colors duration-300 hover:bg-primary-500 hover:text-surface-50"
				>
					<i class="uil uil-angle-left"></i>
				</span>
			</button>
			<a href={link} class="text-blue-500 hover:underline">{rightLabel}</a>
			<button on:click={carouselElement?.goToNext()}>
				<span
					class="flex size-6 items-center justify-center rounded-full border transition-colors duration-300 hover:bg-primary-500 hover:text-surface-50"
				>
					<i class="uil uil-angle-right"></i>
				</span>
			</button>
		</div>
	</div>

	<!-- Area: Carousel Body -->
	<div class="mt-5 flex flex-col items-start gap-4 xl:flex-row">
		<!-- Area: Carousel Sidebar -->
		<slot name="carousel-sidebar" />

		<!-- Area: Carousel Items -->
		<div class="carousel-items w-full">
			<Carousel
				autoplay
				pauseOnFocus
				dots={false}
				arrows={false}
				autoplayDuration={2000}
				bind:this={carouselElement}
			>
				<slot name="carousel-items" />
			</Carousel>
		</div>
	</div>
</div>
