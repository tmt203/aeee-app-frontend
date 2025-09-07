<script lang="ts">
	import { PUBLIC_TINYMCE_API_KEY } from "$env/static/public";
	import Editor from "@tinymce/tinymce-svelte";
	import { Button } from "@components/shared/molecules";
	import { t } from "svelte-i18n";
	import { apiPutPageBySlug } from "@api/page.api";
	import { getToastStore } from "@skeletonlabs/skeleton";
	import { generateToast } from "@constants/toast.constants";

	export let data: PageData;

	const toastStore = getToastStore();

	let value: string = data.page?.content ?? "";
	let conf = {
		selector: "textarea",
		height: "calc(100vh - 132px)",
		width: "100%",
		plugins: [
			"advlist",
			"autolink",
			"link",
			"image",
			"lists",
			"charmap",
			"preview",
			"anchor",
			"pagebreak",
			"searchreplace",
			"wordcount",
			"visualblocks",
			"code",
			"fullscreen",
			"insertdatetime",
			"media",
			"table",
			"emoticons",
			"help"
		],
		toolbar:
			"undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
			"bullist numlist outdent indent | link image | print preview media fullscreen | " +
			"forecolor backcolor emoticons | help",
		menubar: "favs file edit view insert format tools table help",
		autosave_interval: "30s",
		autosave_restore_when_empty: true,
		autosave_retention: "2m",
		quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote",
		quickbars_insert_toolbar: "image media table codesample",
		image_advtab: true,
		image_title: true,
		automatic_uploads: true,
		file_picker_types: "image media",
		content_css: "dark",
		skin: "oxide-dark"
	};

	/**
	 * Handle submit
	 */
	const handleSubmit = async () => {
		try {
			const response = await apiPutPageBySlug({
				slug: "about-us/aims-and-scopes",
				content: value
			});

			if (response.code !== "OK") {
				toastStore.trigger(
					generateToast("error", {
						message: "Update failed!"
					})
				);
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: "Update successfully!"
				})
			);
		} catch (error) {
			console.log(error);
		}
	};
</script>

<main class="min-h-screen bg-tertiary-600 p-4">
	<form class="container mx-auto max-w-7xl" on:submit|preventDefault={handleSubmit}>
		<Editor apiKey={PUBLIC_TINYMCE_API_KEY} bind:value {conf} />
		<div class="my-4 flex justify-center">
			<Button type="submit" variant="secondary" size="md" label={$t("form.save")} />
		</div>
	</form>
</main>
