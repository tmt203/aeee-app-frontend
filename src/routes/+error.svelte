<script lang="ts">
	import { page } from "$app/state";
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<h1 class="mb-4 text-5xl font-bold text-red-600">{status}</h1>
	<p class="text-lg text-gray-700 dark:text-gray-300">
		{page?.error?.message ?? "Something went wrong."}
	</p>

	{#if page.status === 404}
		<p class="mt-2 text-gray-500">The page you’re looking for doesn’t exist.</p>
	{/if}

	<a href="/" class="mt-6 inline-block text-primary-600 hover:underline"> Back to Home </a>
</div>
