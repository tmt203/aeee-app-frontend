<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton";
	import { locale, t } from "svelte-i18n";
	import { Button } from ".";
	import Icon from "../atoms/Icon.svelte";

	const modalStore = getModalStore();

	let note: string = "";

	/**
	 * Handle submit
	 */
	const handleSubmit = () => {
		if ($modalStore[0]) {
			$modalStore[0].meta.onSubmit();
		}

		modalStore.close();
	};

	/**
	 * Handle cancel
	 */
	const handleCancel = () => {
		modalStore.close();
	};

	// Reactivity to translate based on current language
	$: if (locale) {
		note = $t("modal.delete_body");
	}
</script>

<!-- Area: Confirm Delete Modal -->
<div class="bg-surface-50-900-token max-w-[460px] rounded-lg px-5 py-4 shadow-custom-glass">
	<div class="flex justify-start gap-4">
		<div class="size-fit">
			<Icon icon="exclamation-icon" size="3xl" />
		</div>

		<div class="flex flex-col gap-1">
			<p class="text-lg font-bold">{$t("form.confirm_delete")}</p>
			<div class="text-sm text-surface-800">
				{#if $modalStore[0]}
					{@html $modalStore[0].meta.body}
				{/if}
				<p>{note}</p>
			</div>
		</div>
	</div>

	<div class="mt-4 flex w-full items-center justify-end gap-4">
		<Button
			label={$t("form.cancel")}
			rounded="lg"
			variant="surface"
			variantType="ringed"
			class="bg-surface-300 dark:!bg-surface-700"
			on:click={handleCancel}
		/>

		<Button label={$t("form.confirm")} rounded="lg" variant="error" on:click={handleSubmit} />
	</div>
</div>
