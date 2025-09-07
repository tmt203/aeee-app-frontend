<script lang="ts">
	import AimsAndScopesPage from "@components/shared/pages/aims-and-scopes/AimsAndScopesPage.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

{#if data.page}
	<AimsAndScopesPage page={data.page} />
{/if}
