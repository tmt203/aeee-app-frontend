<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import clsx from "clsx";

	export let expanded: boolean;
	export let logo: string;
</script>

<div
	class={clsx("cursor-pointer", {
		"flex items-center justify-between gap-3": $sidebarExpanded || expanded
	})}
>
	<!-- Area: Logo -->
	<div class={clsx("flex items-center justify-center")}>
		<img src={logo} alt="Logo" class={clsx("h-6 w-auto", { "hidden": !$sidebarExpanded && !expanded })} />
	</div>
</div>
