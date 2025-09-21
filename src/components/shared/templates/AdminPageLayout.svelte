<script lang="ts">
	import type { BreadcrumbProps } from "@type/components/breadcrumb.type";
	import clsx from "clsx";
	import { Breadcrumb } from "../atoms";

	export let breadcrumbs: BreadcrumbProps[];
</script>

<div class={clsx("flex h-screen flex-col gap-1 bg-gray-50 dark:bg-gray-800", $$props.class)}>
	<div class="flex w-full flex-col gap-2 border-b px-4 py-3 dark:border-tertiary-800">
		<Breadcrumb {breadcrumbs} />
		<slot name="content-header" />
	</div>
	<div class="h-full p-4">
		<slot name="content-body" />
	</div>
	<!-- Area: Footer -->
	<footer class="mx-3 flex items-center justify-end !bg-transparent">
		<small>
			©{new Date().getFullYear()}
			<a target="_blank" href="https://trantri.site/" class="text-primary-500">Tran Minh Tri</a>
		</small>
	</footer>
</div>
