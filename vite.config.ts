import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { purgeCss } from "vite-plugin-tailwind-purgecss";

export default defineConfig({
	build: {
		sourcemap: false
	},
	plugins: [sveltekit(), purgeCss()],
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler"
			}
		}
	}
});
