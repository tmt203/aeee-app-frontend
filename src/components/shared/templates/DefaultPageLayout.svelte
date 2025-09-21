<script lang="ts">
	import type { Link } from "@type/components/defaultPageLayout.type";

	export let breadcrumbs: string[];

	const SIDEBAR_LINKS: Link[] = [
		{ label: "University", href: "https://www.vsb.cz/en/university/" },
		{ label: "Partnership", href: "https://www.vsb.cz/en/partnership/" },
		{ label: "Media and University", href: "https://www.vsb.cz/en/media/" },
		{ label: "Alumni Network", href: "https://alumni.vsb.cz/en/" },
		{
			label: "Study at VSB - Technical University of Ostrava",
			href: "https://www.vsb.cz/en/study/"
		}
	];
</script>

<!-- Area: Breadcrumb -->
<div
	class="container flex w-full flex-col items-center justify-between bg-surface-700 px-4 py-3 text-white xl:flex-row xl:px-20"
>
	<span class="mr-auto">{breadcrumbs.join("/")}</span>
</div>

<div
	class="container relative flex w-full flex-col gap-4 bg-white px-4 py-8 xl:flex-row xl:justify-between xl:px-20"
>
	<slot />

	<!-- Area: Sidebar Banner -->
	<div
		class="card sticky right-4 top-8 flex h-fit w-3/12 flex-col !bg-slate-100 p-4 text-surface-700 xl:right-20"
	>
		<span class="font-bold">VSB-TUO</span>
		<ul class="un-ordered-list-circle float-left w-full gap-4">
			{#each SIDEBAR_LINKS as { label, href }}
				<li class="relative float-left w-full cursor-pointer py-1 pl-4 transition-all">
					<a {href} class="hover:active text-sm hover:text-blue-500">{label}</a>
				</li>
			{/each}
		</ul>
		<img src="/images/vsb-tuo-logo.png" alt="VSB TUO Logo" class="" />
	</div>
</div>
