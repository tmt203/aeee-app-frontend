<script lang="ts">
	import { DefaultPageLayout } from "@components/shared/templates";

	const currentYear = new Date().getFullYear();
	const baseYear = 2002;
	const years = Array.from({ length: currentYear - baseYear + 1 }, (_, i) => currentYear - i);
</script>

<svelte:head>
	<title>AEEE - Archives</title>
	<meta name="description" content="Archives of the journal." />
</svelte:head>

<DefaultPageLayout breadcrumbs={["Archives"]}>
	<section class="flex w-full flex-col gap-4 text-surface-900/80 xl:w-9/12">
		<div class="flex flex-wrap items-center gap-x-2 gap-y-0">
			{#each years as year}
				<button class="btn text-primary-500">{year}</button>
			{/each}
		</div>
	</section>
</DefaultPageLayout>
