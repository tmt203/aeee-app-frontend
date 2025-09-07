import { init, locale, register } from "svelte-i18n";
import { get } from "svelte/store";

let currentLocale = get(locale) || "en";

// English
register("en", () => import(`./${currentLocale}/common.json`));
register("en", () => import(`./${currentLocale}/components.json`));

init({
	fallbackLocale: currentLocale,
	initialLocale: currentLocale
});

export { locale };
