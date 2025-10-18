import { apiGetArticleById } from "@api/article.api";
import type { Article } from "@type/api/article.type";
import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { API_HOST } from "$lib/env/server";

export const load: PageServerLoad = async ({ params }) => {
	const { path } = params;
	const parts = path.split("/").filter(Boolean);

	// Expect structure: AEEE/article/view/[id][/pdf?]
	const idIndex = parts.findIndex((p) => p === "view") + 1;
	const id = parts[idIndex];
	const isPdf = parts[idIndex + 1] === "pdf";

	// Validate ID
	if (!id || isNaN(+id)) {
		throw error(404, "Invalid article ID");
	}

	// Fetch article data
	let article: Article | null = null;
	try {
		const response = await apiGetArticleById(+id);
		if (response.code !== "OK") {
			throw error(404, "Article not found");
		}
		article = response.data;
	} catch (err) {
		console.error(err);
		throw error(500, "Failed to fetch article");
	}

	// If /pdf → redirect to backend static PDF
	if (isPdf) {
		// URL: http://localhost:4000{pdf_path}
		const pdfUrl = `${API_HOST}${article.pdf_path}`;
		console.log("pdf url", pdfUrl);
		throw redirect(302, pdfUrl);
	}

	// Normal article detail view
	if (parts.includes("view")) {
		return { article };
	}

	// Invalid route → 404
	throw error(404, "Not Found");
};
