import { apiGetAnnouncements } from "@api/announcement.api";
import type { Announcement, AnnouncementQueryParams } from "@type/api/announcement.type";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let announcements: Announcement[] | null = null;

	try {
		const params: AnnouncementQueryParams = {};
		const response = await apiGetAnnouncements(params);

		announcements = response.data ?? null;

		return { announcements };
	} catch (error) {
		console.log(error);
	}

	return { announcements };
};
