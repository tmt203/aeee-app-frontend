import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			"@api": path.resolve("./src/lib/api"),
			"@type": path.resolve("./src/lib/type"),
			"@utils": path.resolve("./src/lib/utils"),
			"@store": path.resolve("./src/lib/store"),
			"@scss": path.resolve("./src/assets/scss"),
			"@components": path.resolve("./src/components"),
			"@constants": path.resolve("./src/lib/constants")
		},
		prerender: {
			crawl: true
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
