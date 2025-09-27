import { apiGetPages } from "@api/page.api";
import type { Page, PageQueryParams } from "@type/api/page.type";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let page: Page | null = null;

	try {
		const params: PageQueryParams = { slug_eq: "about-us/open-access-policy" };
		const response = await apiGetPages(params);

		page = response.data?.[0] ?? null;

		return { page };
	} catch (error) {
		console.log(error);
	}

	return { page };
};
