<script lang="ts">
	import { PUBLIC_TINYMCE_API_KEY } from "$env/static/public";
	import { apiGetAnnouncementById } from "@api/announcement.api";
	import { Spinner } from "@components/shared/atoms";
	import { Button, InputForm } from "@components/shared/molecules";
	import { EDITOR_CONFIG } from "@constants/tiny_mce.constants";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
	import Editor from "@tinymce/tinymce-svelte";
	import type { Announcement, AnnouncementBody } from "@type/api/announcement.type";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	export let id: string;
	export let onSave: (id: string, body: AnnouncementBody) => void;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let announcement: Announcement | null = null;
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
			onSave(id, {
				author: announcement?.author || "",
				title: announcement?.title || "",
				content: announcement?.content || ""
			});
		modalStore.close();
	};

	/**
	 * Handle get announcement by id
	 * @param id string
	 */
	const handleGetAnnouncementById = async (id: string) => {
		if (!id) return;

		try {
			isLoading = true;
			const response = await apiGetAnnouncementById(id);
			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "Failed to fetch announcement"
					})
				);
				return;
			}
			announcement = response.data;
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
		handleGetAnnouncementById(id);
	});
</script>

<div class="edit-announcement-modal bg-surface-50-900-token h-full w-9/12 rounded-xl">
	<div class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div class="flex items-center justify-start gap-6 border-b px-4 py-2 text-2xl font-bold">
			{$t("about_us_page.modal.title")}
		</div>

		<!-- Area: Modal Body -->
		<div class="flex flex-col gap-4 p-4 text-sm">
			{#if isLoading}
				<Spinner />
			{:else if announcement}
				<!-- Area: Title -->
				<InputForm
					id="title"
					direction="column"
					label={$t("admin_page.announcement.title")}
					bind:value={announcement.title}
					class="[&_.input-form-wrapper]:w-full"
					labelClass="font-medium"
					placeholder="Announcement title"
				/>

				<!-- Area: Content -->
				<label class="block font-medium" for="content">
					{$t("admin_page.announcement.content")}
				</label>
				<Editor
					id="content"
					apiKey={PUBLIC_TINYMCE_API_KEY}
					conf={EDITOR_CONFIG}
					bind:value={announcement.content}
				/>
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
	@use "@scss/non-shared/admin/modals/editAnnouncementModal.scss" as *;
</style>
