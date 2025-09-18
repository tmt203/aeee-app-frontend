<script lang="ts">
	import type { BreadcrumbProps } from "@type/components/breadcrumb.type";
	import { t } from "svelte-i18n";

	export let breadcrumbs: BreadcrumbProps[];
</script>

<ol class="text-surface-900-50-token breadcrumb [&>.crumb:nth-child(1)]:!ml-0">
	{#each breadcrumbs as item, index}
		<li class="crumb !ml-2">
			{#if breadcrumbs.length > index + 1 || item.url}
				<a class="anchor font-bold no-underline xl:text-sm" href={item.url}>
					{$t(item.label)}
				</a>
			{:else}
				<span class="font-bold xl:text-sm">
					{$t(item.label)}
				</span>
			{/if}
		</li>
		{#if breadcrumbs.length > index + 1}
			<li class="crumb-separator !ml-2 text-sm leading-6 xl:text-xl" aria-hidden="true">
				<i class="uil uil-angle-right" />
			</li>
		{/if}
	{/each}
</ol>
