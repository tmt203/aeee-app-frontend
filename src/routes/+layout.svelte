<script lang="ts">
	import "$lib/i18n";
	import { ConfirmDeleteModal } from "@components/shared/molecules";
	import LoadingPage from "@components/shared/pages/loading-page/LoadingPage.svelte";
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
	import {
		Drawer,
		initializeStores,
		Modal,
		modeOsPrefers,
		setModeCurrent,
		storePopup,
		Toast,
		type ModalComponent
	} from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	import { isLoading } from "svelte-i18n";
	import "../app.postcss";

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const modalRegistry: Record<string, ModalComponent> = {
		confirmDeleteModal: { ref: ConfirmDeleteModal }
	};

	let showLoadingOverlay = false;
	let isInitializing: boolean = true;

	$: if (!isInitializing) {
		showLoadingOverlay = true;
		setTimeout(() => {
			showLoadingOverlay = false;
		}, 1500);
	}

	$: {
		if (!isInitializing) {
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
		try {
			// Init current light mode
			const currentMode = localStorage.getItem("modeCurrent");
			setModeCurrent(currentMode ? JSON.parse(currentMode) : $modeOsPrefers);
		} catch (error) {
			console.log(error);
		} finally {
			isInitializing = false;
		}
	});
</script>

{#if isInitializing || $isLoading}
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
