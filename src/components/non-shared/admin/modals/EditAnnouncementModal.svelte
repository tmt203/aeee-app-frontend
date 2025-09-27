<script lang="ts">
	import { Spinner, TinyEditor } from "@components/shared/atoms";
	import { Button, InputForm } from "@components/shared/molecules";
	import { getModalStore } from "@skeletonlabs/skeleton";
	import type { Announcement, AnnouncementBody } from "@type/api/announcement.type";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { object, string } from "yup";

	export let announcement: Announcement;
	export let onSave: (body: AnnouncementBody, id?: string) => void;

	const modalStore = getModalStore();

	let isLoading: boolean = false;

	// Form
	const initialValues = {
		author: announcement?.author || "",
		title: announcement?.title || "",
		content: announcement?.content || ""
	};
	const validationSchema = object().shape({
		author: string(),
		title: string().required("error.input_required"),
		content: string()
	});
	const { form, errors, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			onSave?.(values, announcement?.id);
			modalStore.close();
		}
	});

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
			onSave(
				{
					author: announcement?.author || "",
					title: announcement?.title || "",
					content: announcement?.content || ""
				},
				announcement?.id
			);
		modalStore.close();
	};
</script>

<form
	class="edit-announcement-modal h-full w-9/12 rounded-xl bg-white dark:bg-gray-800"
	on:submit|preventDefault={handleSubmit}
>
	<div class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div
			class="flex items-center justify-start gap-6 border-b px-4 py-2 text-2xl font-bold dark:border-tertiary-800"
		>
			{$t(
				`manage_announcement_page.modal.${announcement.id ? "edit_announcement" : "create_announcement"}`
			)}
		</div>

		<!-- Area: Modal Body -->
		<div class="flex flex-col gap-4 p-4 text-sm">
			{#if isLoading}
				<Spinner />
			{:else if announcement}
				<!-- Area: Title -->
				<InputForm
					id="title"
					name="title"
					direction="column"
					label={$t("admin_page.announcement.title")}
					bind:value={$form.title}
					class="[&_.input-form-wrapper]:w-full"
					labelClass="font-medium"
					placeholder="Announcement title"
					errorMessage={$errors.title}
				/>

				<!-- Area: Content -->
				<label class="block font-medium" for="content">
					{$t("admin_page.announcement.content")}
				</label>
				<TinyEditor bind:value={$form.content} />
			{/if}
		</div>

		<!-- Area: Modal Footer -->
		<div class="flex items-center justify-end gap-4 border-t p-4 dark:border-tertiary-800">
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
				type="submit"
				label={$t("form.save")}
				variant="secondary"
				size="sm"
				iconSize="xs"
				icon="uil uil-save"
			/>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@scss/non-shared/admin/modals/editAnnouncementModal.scss" as *;
</style>
