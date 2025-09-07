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
			typography: (theme) => ({
				DEFAULT: {
					css: {
						"--tw-prose-body": theme("colors.surface-800"), // Text chính
						"--tw-prose-headings": theme("colors.surface-900"), // Heading
						"--tw-prose-lead": theme("colors.surface-600"), // Lead
						"--tw-prose-links": theme("colors.primary-500"), // Link
						"--tw-prose-bold": theme("colors.surface-900"), // Bold
						"--tw-prose-counters": theme("colors.surface-800"), // Counter list
						"--tw-prose-bullets": theme("colors.surface-700"), // Bullets
						"--tw-prose-hr": theme("colors.surface-200"), // Horizontal rule
						"--tw-prose-quotes": theme("colors.surface-800"), // Quote text
						"--tw-prose-quote-borders": theme("colors.surface-300"), // Quote border
						"--tw-prose-captions": theme("colors.surface-600"), // Captions
						"--tw-prose-kbd": theme("colors.surface-900"), // <kbd>
						"--tw-prose-kbd-shadows": "17 24 39", // Shadow mặc định
						"--tw-prose-code": theme("colors.tertiary-600"), // Inline code
						"--tw-prose-pre-code": theme("colors.surface-100"), // Code trong block
						"--tw-prose-pre-bg": theme("colors.surface-900"), // Background <pre>
						"--tw-prose-th-borders": theme("colors.surface-300"), // Table header border
						"--tw-prose-td-borders": theme("colors.surface-200") // Table cell border
					}
				}
			})
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
