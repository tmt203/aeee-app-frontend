import { init, locale, register } from "svelte-i18n";

// English
register("en", () => import("./en/common.json"));

const defaultLocale = "en";

init({
	fallbackLocale: defaultLocale,
	initialLocale: defaultLocale
});

export { locale };
