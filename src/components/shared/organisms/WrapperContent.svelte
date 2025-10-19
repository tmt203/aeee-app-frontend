<script lang="ts">
	import { Spinner } from "../atoms";

	export let id: string = "";
	export let leftLabel: string = "";
	export let rightLabel: string = "";
	export let link: string = "";
	export let className: string = "";
	export let isLoading: boolean = false;
</script>

<div
	{id}
	class="wrapper-content flex w-full flex-col rounded-xl bg-white shadow-sm dark:bg-gray-900 {className}"
>
	<!-- Area: Header -->
	<div class="mb-4 flex items-center justify-between border-b pb-4">
		<h3 class="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
			{leftLabel}
		</h3>

		<div class="flex items-center gap-3">
			<!-- Right link -->
			{#if link}
				<a href={link} class="text-sm font-medium text-blue-600 transition hover:underline">
					{rightLabel}
				</a>
			{/if}
		</div>
	</div>

	<!-- Area: Body -->
	<div class="flex flex-col gap-6 xl:flex-row">
		<!-- Area: Sidebar -->
		<slot name="wrapper-sidebar" />

		<!-- Area: Content / Spinner -->
		<div class="wrapper-items w-full">
			{#if isLoading}
				<Spinner />
			{:else}
				<slot />
			{/if}
		</div>
	</div>
</div>
