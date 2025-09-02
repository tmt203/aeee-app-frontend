<script lang="ts">
	export let authors: string[] = ["Junlong Zheng", "Chaiyan Jettanasen"];
	export let title: string =
		"Analysis of mutual inductance between transmitter and receiver coils in wireless power transfer system of electric vehicle Analysis of mutual inductance between transmitter and receiver coils in wireless power transfer system of electric vehicle";
	export let link: string = "/#";
	export let views: number = 200;
	export let showButton: boolean = false;
</script>

<div class="article-item flex flex-col text-surface-800">
	<!-- Area: Authors -->
	<div class="flex items-center gap-2 text-sm">
		<i class="uil uil-user"></i>
		<span>{authors.join(", ")}</span>
	</div>

	<!-- Area: Article Title -->
	<h5 class="h5">
		<a
			href={link}
			class="font-medium transition-colors duration-300 hover:text-blue-500"
			target="_blank"
			rel="noopener noreferrer">{title}</a
		>
	</h5>

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
