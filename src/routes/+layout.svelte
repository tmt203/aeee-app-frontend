<script lang="ts">
	import "$lib/i18n";
	import LoadingPage from "@components/shared/pages/loading-page/LoadingPage.svelte";
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
	import {
		Drawer,
		initializeStores,
		Modal,
		storePopup,
		Toast,
		type ModalComponent
	} from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	import { isLoading } from "svelte-i18n";
	import "../app.postcss";

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const modalRegistry: Record<string, ModalComponent> = {};

	let showLoadingOverlay = false;
	let isMounted: boolean = true;

	$: if (!isMounted) {
		showLoadingOverlay = true;
		setTimeout(() => {
			showLoadingOverlay = false;
		}, 1500);
	}

	$: {
		if (!isMounted) {
			if (showLoadingOverlay) {
				document.body.classList.add("overflow-hidden");
			} else {
				document.body.classList.remove("overflow-hidden");
			}
		}
	}

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(async () => {
		isMounted = false;

		// Set scroll smoothing behavior
		if (document) {
			document.documentElement.style.scrollBehavior = "smooth";
		}
	});
</script>

{#if isMounted || $isLoading}
	<div class="flex h-screen items-center justify-center">
		<LoadingPage />
	</div>
{:else}
	<div class="layout-container">
		<slot />
		{#if showLoadingOverlay}
			<div class="loading-overlay">
				<div class="flex h-screen items-center justify-center">
					<LoadingPage />
				</div>
			</div>
		{/if}
	</div>
{/if}

<Drawer zIndex="z-[9999]" rounded="none">
	<!-- {#if $drawerStore.id === "mobile-sidebar"}
		{/if} -->
</Drawer>

<Toast position="t" zIndex="z-[9999] !top-24" />
<Modal zIndex="z-[999]" components={modalRegistry} />
