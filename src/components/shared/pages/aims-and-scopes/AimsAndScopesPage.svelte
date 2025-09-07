<script lang="ts">
	import { DefaultPageLayout } from "@components/shared/templates";
	import type { Page } from "@type/api/page.type";
	import { parseToFormat } from "@utils/time";

	export let page: Page;
</script>

<DefaultPageLayout breadcrumbs={["About Us", "Aims & Scopes"]}>
	<div class="flex flex-col gap-4">
		<!-- Area: Last Update -->
		<div class="flex w-full justify-start text-sm text-gray-600 dark:text-gray-400">
			<span>
				Last updated: {parseToFormat(page.updated_at, "yyyy/MM/dd HH:mm:ss")}
			</span>
		</div>

		<!-- Area: Article -->
		<article class="prose lg:prose-xl dark:prose-invert">
			{@html page.content}
		</article>
	</div>
</DefaultPageLayout>
