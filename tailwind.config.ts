import { skeleton } from "@skeletonlabs/tw-plugin";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import { join } from "path";
import type { Config } from "tailwindcss";
import { animation, color, theme, boxShadow } from "./src/lib/constants/css/index";

export default {
	darkMode: "selector",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")
	],
	theme: {
		extend: {
			animation: {
				...animation.ANIMATION
			},
			keyframes: {
				...animation.KEYFRAMES_ANIMATION
			},
			height: {
				custom: "calc(100% - 112px)"
			},
			colors: {
				...color.PRIMARY_COLOR,
				...color.TERTIARY_COLOR,
				...color.SECONDARY_COLOR,
				...color.SURFACE_COLOR,
				...color.INFO_COLOR,
				...color.SUCCESS_COLOR,
				...color.WARNING_COLOR,
				...color.ERROR_COLOR,
				...color.TABLE_COLOR,
				...color.LAYOUT_COLOR
			},
			boxShadow: {
				...boxShadow.BOX_SHADOW
			},
		}
	},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("tailwind-scrollbar")({ nocompatible: true }),
		forms,
		typography,
		skeleton({
			themes: {
				custom: [theme.aeeeTheme]
			},
			base: true
		})
	],
	corePlugins: {
		preflight: true // Ensure reset of tailwindcss enabled
	}
} satisfies Config;
