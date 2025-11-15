import { init, locale, register } from "svelte-i18n";
import { get } from "svelte/store";

let currentLocale = get(locale) || "en";

// English
register("en", () => import(`./${currentLocale}/auth.json`));
register("en", () => import(`./${currentLocale}/admin.json`));
register("en", () => import(`./${currentLocale}/common.json`));
register("en", () => import(`./${currentLocale}/components.json`));
register("en", () => import(`./${currentLocale}/about_us_page.json`));
register("en", () => import(`./${currentLocale}/archives_page.json`));
register("en", () => import(`./${currentLocale}/manage_announcement_page.json`));

init({
	fallbackLocale: currentLocale,
	initialLocale: currentLocale
});

export { locale };
