<script lang="ts">
	import { Button, InputForm } from "@components/shared/molecules";
	import { generateToast } from "@constants/toast.constants";
	import { getModalStore, getToastStore, Tab, TabGroup } from "@skeletonlabs/skeleton";
	import { X } from "lucide-svelte";
	import { t } from "svelte-i18n";

	export let apa: string = "";
	export let bibTex: string = "";

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let citeOption: "apa" | "bib_tex" = "apa";

	/**
	 * Handle close
	 */
	const handleClose = () => {
		modalStore.close();
	};

	/**
	 * Handle copy
	 */
	const handleCopy = () => {
		const textToCopy = citeOption === "apa" ? apa : bibTex;
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				toastStore.trigger(
					generateToast("success", {
						message: "Copied to clipboard"
					})
				);
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
			});
	};
</script>

<div class="bg-surface-50-900-token h-full w-8/12 rounded-xl 2xl:w-6/12">
	<form class="flex flex-col justify-between">
		<!-- Area: Modal Header -->
		<div class="flex items-center justify-between gap-6 p-2 text-lg font-bold">
			{$t("cite_modal.title")}
			<button on:click={handleClose} class="rounded-full p-1">
				<X class="h-4 w-4 text-gray-500" />
			</button>
		</div>
		<hr class="!border-t-1 w-full !border-surface-700/70" />

		<!-- Area: Modal Body -->
		<div class="flex flex-col gap-4 p-4 text-sm">
			<TabGroup active="border-b-2 border-secondary-500 text-primary-500">
				<Tab bind:group={citeOption} name="cite_option" value="apa">
					{$t("cite_modal.apa.title")}
				</Tab>
				<Tab bind:group={citeOption} name="cite_option" value="bib_tex">
					{$t("cite_modal.bib_tex.title")}
				</Tab>

				<svelte:fragment slot="panel">
					{#if citeOption === "apa"}
						<pre class="whitespace-pre-line rounded-md bg-gray-100 p-3 text-left font-mono text-sm">
                            {apa ?? "No APA content"}
                        </pre>
					{:else if citeOption === "bib_tex"}
						<pre class="whitespace-pre-line rounded-md bg-gray-100 p-3 text-left font-mono text-sm">
                            {bibTex ?? "No BibTeX content"}
                        </pre>
					{/if}
				</svelte:fragment>
			</TabGroup>
		</div>

		<!-- Area: Modal Footer -->
		<hr class="!border-t-1 mt-2 w-full !border-surface-700/70" />
		<div class="flex items-center justify-end gap-4 p-4">
			<!-- Area: Copy Button -->
			<Button
				type="button"
				label={$t("form.copy")}
				variant="secondary"
				size="sm"
				icon="uil uil-copy"
				onClick={handleCopy}
			/>
		</div>
	</form>
</div>
