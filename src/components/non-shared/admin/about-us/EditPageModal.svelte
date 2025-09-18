<script lang="ts">
	import { PUBLIC_TINYMCE_API_KEY } from "$env/static/public";
	import { apiGetPageById } from "@api/page.api";
	import { Spinner } from "@components/shared/atoms";
	import { Button } from "@components/shared/molecules";
	import { EDITOR_CONFIG } from "@constants/tiny_mce.constants";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
	import Editor from "@tinymce/tinymce-svelte";
	import type { Page, PageBody } from "@type/api/page.type";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	export let id: string;
	export let onSave: (body: PageBody) => void;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let page: Page | null = null;
	let isLoading: boolean = false;

	/**
	 * Handle close
	 */
	const handleClose = () => {
		modalStore.close();
	};

	/**
	 * Handle save
	 */
	const handleSave = () => {
		onSave &&
			onSave({
				content: page?.content || "",
				slug: page?.slug || ""
			});
		modalStore.close();
	};

	/**
	 * Handle get page by id
	 */
	const handleGetPageById = async (id: string) => {
		if (!id) return;

		try {
			isLoading = true;
			const response = await apiGetPageById(id);
			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "Failed to fetch page"
					})
				);
				return;
			}
			page = response.data;
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	};

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		handleGetPageById(id);
	});
</script>

<div class="edit-page-modal bg-surface-50-900-token h-full w-9/12 rounded-xl">
	<div class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div class="flex items-center justify-start gap-6 border-b px-4 py-2 text-2xl font-bold">
			{$t("about_us_page.modal.title")}
		</div>

		<!-- Area: Modal Body -->
		<div class="flex flex-col gap-4 p-4 text-sm">
			{#if isLoading}
				<Spinner />
			{:else if page}
				<Editor apiKey={PUBLIC_TINYMCE_API_KEY} conf={EDITOR_CONFIG} bind:value={page.content} />
			{/if}
		</div>

		<!-- Area: Modal Footer -->
		<div class="flex items-center justify-end gap-4 border-t p-4">
			<!-- Area: Cancel Button -->
			<Button
				type="button"
				label={$t("form.close")}
				variant="surface"
				variantType="soft"
				size="sm"
				iconSize="xs"
				icon="uil uil-multiply"
				on:click={handleClose}
			/>

			<!-- Area: Save Button -->
			<Button
				type="button"
				label={$t("form.save")}
				variant="secondary"
				size="sm"
				iconSize="xs"
				icon="uil uil-save"
				on:click={handleSave}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	@use "@scss/non-shared/admin/about-us/editPageModal.scss" as *;
</style>
