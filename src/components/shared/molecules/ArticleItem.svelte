<script lang="ts">
	export let authors: string[] = [];
	export let title: string = "";
	export let link: string = "";
	export let views: number = 0;
	export let showButton: boolean = false;
</script>

<div class="article-item flex flex-col">
	<!-- Area: Authors -->
	<div class="flex items-center gap-2 text-sm">
		<i class="uil uil-user"></i>
		<span>{authors.join(", ")}</span>
	</div>

	<!-- Area: Article Title -->
	<span class="h6">
		<a
			href={link}
			class="font-medium transition-colors duration-300 hover:text-blue-500"
			target="_blank"
			rel="noopener noreferrer">{title}</a
		>
	</span>

	<!-- Area: Views -->
	<span class="text-xs font-normal">Views: {views}</span>

	<!-- Area: Buttons -->
	{#if showButton}
		<div class="mt-4 flex items-center gap-2">
			<button class="variant-filled-primary btn btn-sm">View full article</button>
			<button class="variant-outline-primary btn btn-sm">Cite this</button>
		</div>
	{/if}
</div>
