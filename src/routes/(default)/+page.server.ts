import { apiGetArticles } from "@api/article.api";
import type { Article } from "@type/api/article.type";
import type { PageServerLoad } from "./$types";
import type { Manager } from "@type/api/manager.type";
import { apiGetLatestManager } from "@api/manager.api";

export const load: PageServerLoad = async () => {
	let latestManager: Manager | null = null;
	let mostViewsArticles: Article[] = [];
	let previousArticles: Article[] = [];
	let incomingArticles: Article[] = [];

	try {
		// Make API calls concurrently
		const [latestManagerResponse, mostViewsResponse, previousResponse, incomingResponse] =
			await Promise.all([
				apiGetLatestManager(),
				apiGetArticles({ limit: 20, sort: "-views" }),
				apiGetArticles({ limit: 9999, year: new Date().getFullYear() - 1 }), // Previous year
				apiGetArticles({ limit: 9999, year: new Date().getFullYear() })
			]);

		if (
			(latestManagerResponse.code !== "OK" && mostViewsResponse.code !== "OK") ||
			previousResponse.code !== "OK" ||
			incomingResponse.code !== "OK"
		) {
			throw new Error("Failed to fetch articles");
		}

		latestManager = latestManagerResponse.data || null;
		mostViewsArticles = mostViewsResponse.data || [];
		previousArticles = previousResponse.data || [];
		incomingArticles = incomingResponse.data || [];

		return { latestManager, mostViewsArticles, previousArticles, incomingArticles };
	} catch (error) {
		console.log(error);
	}

	return { latestManager, mostViewsArticles, previousArticles, incomingArticles };
};
