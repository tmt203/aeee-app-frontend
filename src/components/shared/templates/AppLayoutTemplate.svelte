<script lang="ts">
	import { NAV_BAR_GROUPS } from "@constants/navbar.constants";
	import { Navbar } from "../molecules";
</script>

<section class="app-layout-template min-h-screen text-surface-900">
	<div
		class="app-layout-template__wrapper relative mx-auto flex max-w-7xl flex-col justify-start pt-1 shadow-2xl"
	>
		<!-- Area: Header -->
		<Navbar items={NAV_BAR_GROUPS} />

		<!-- Area: Body -->
		<slot />

		<!-- Area: Footer -->
		<footer></footer>
	</div>
</section>

<style lang="scss">
	@use "@scss/shared/templates/appLayoutTemplate.scss" as *;
</style>
