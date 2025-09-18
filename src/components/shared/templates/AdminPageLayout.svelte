<script lang="ts">
	import type { BreadcrumbProps } from "@type/components/breadcrumb.type";
	import clsx from "clsx";
	import { Breadcrumb } from "../atoms";

	export let breadcrumbs: BreadcrumbProps[];
</script>

<div class={clsx("flex flex-col gap-1 rounded-xl", $$props.class)}>
	<div class="border-surface-700-200-token flex w-full flex-col gap-2 border-b px-4 py-3">
		<Breadcrumb {breadcrumbs} />
		<slot name="content-header" />
	</div>
	<div class="h-full p-4">
		<slot name="content-body" />
	</div>
</div>
