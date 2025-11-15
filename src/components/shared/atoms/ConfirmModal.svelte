<script lang="ts">
	import clsx from "clsx";
	import { t } from "svelte-i18n";
	import Button from "../molecules/Button.svelte";
	import Icon from "./Icon.svelte";

	export let className: string = "max-w-[460px]";
	export let title: string = "";
	export let message: string = "";
	export let body: string = "";
	export let variant: "success" | "danger" | "warning" | "info" = "info";
	export let onCancel: () => void = () => {};
	export let onConfirm: () => void = () => {};

	const iconName: string = `custom-${variant}-icon`;
	const confirmColor: string =
		variant === "danger" ? "error" : variant === "info" ? "primary" : variant;
</script>

<!-- Area: Confirm Delete Modal -->
<div
	class={clsx("rounded-lg bg-gray-50 px-5 py-4 shadow-custom-glass dark:bg-gray-800", className)}
>
	<div class="flex justify-start gap-4">
		<div
			class={clsx(
				"flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700"
			)}
		>
			<Icon icon={iconName} />
		</div>

		<div class="flex flex-col gap-1">
			<p class="text-lg font-bold">{title}</p>
			<div class="text-sm text-surface-800">
				<p>{@html message}</p>
				<p>{@html body}</p>
			</div>
		</div>
	</div>

	<div class="mt-4 flex w-full items-center justify-end gap-4">
		<Button
			type="button"
			label={$t("form.cancel")}
			outline
			variant="surface"
			variantType="none"
			size="sm"
			iconSize="xs"
			rounded="xl"
			class="!h-8"
			on:click={onCancel}
		/>

		<Button
			label={$t("form.confirm")}
			type="button"
			variant={confirmColor}
			size="sm"
			iconSize="xs"
			rounded="xl"
			class="!h-8"
			on:click={onConfirm}
		/>
	</div>
</div>
