<script lang="ts">
	import { LINK_GROUPS } from "@constants/appLayoutFooter.constants";
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
		<footer
			class="container flex flex-row flex-wrap items-start justify-between gap-6 border-t px-4 py-16 text-surface-700 xl:flex-nowrap xl:gap-20 xl:px-20"
		>
			<div class="float-left w-full sm:w-1/2 lg:w-1/4">
				<div class="flex flex-col gap-2 xl:gap-6">
					<img src="images/logo.png" alt="AEEE Logo" class="h-auto w-auto" />
					<p>
						VSB - Technical University of Ostrava and University of Zilina Faculty of Electrical
						Engineering and Computer Science.
					</p>
					<a href="https://www.fei.vsb.cz/en/about-us/" class="text-blue-500 hover:underline">
						Read more
					</a>
				</div>
			</div>
			{#each LINK_GROUPS as item}
				<div class="float-left w-full sm:w-1/2 lg:w-1/4">
					<div class="flex flex-col">
						<h5 class="h5 capitalize">{item.title}</h5>
						<ul class="float-left w-full list-none text-sm">
							{#each item.content as link}
								<li
									class="relative float-left w-full cursor-pointer list-none py-2 pl-4 pr-0 transition-colors duration-300 ease-in-out hover:text-blue-500"
								>
									{#if link.icon}
										<i class={link.icon}></i>
									{/if}
									<a href={link.link} target="_blank" rel="noopener">{link.text}</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</footer>
	</div>
</section>

<style lang="scss">
	@use "@scss/shared/templates/appLayoutTemplate.scss" as *;
</style>
