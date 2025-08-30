<script lang="ts">
	export let loadingType: "circle" | "pac-man" = "circle";
</script>

{#if loadingType === "pac-man"}
	<div class="flex-column flex">
		<div class="pac-man-loader" />
		<div class="loader" />
	</div>
{:else}
	<div class="circle-loader" />
{/if}

<style lang="scss">
	@use "@scss/shared/pages/loadingPage.scss" as *;
</style>
