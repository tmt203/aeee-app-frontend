<script lang="ts">
	import { TINYMCE_API_KEY } from "$lib/env/client";
	import { EDITOR_CONFIG } from "@constants/tiny_mce.constants";
	import { modeCurrent } from "@skeletonlabs/skeleton";
	import Editor from "@tinymce/tinymce-svelte";

	export let value: string;

	let editorConfig = { ...EDITOR_CONFIG };

	// Reactivity to update editor theme based on current mode
	$: if (!$modeCurrent) {
		editorConfig = { ...EDITOR_CONFIG, skin: "oxide-dark", content_css: "dark" };
	} else {
		editorConfig = { ...EDITOR_CONFIG };
	}
</script>

<Editor apiKey={TINYMCE_API_KEY} conf={editorConfig} bind:value />
