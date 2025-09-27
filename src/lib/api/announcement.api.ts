import type {
	Announcement,
	AnnouncementBody,
	AnnouncementQueryParams
} from "@type/api/announcement.type";
import type { ApiResponse } from "@type/api/api.type";
import { apiGet, apiPost, apiPut } from "@utils/api";

const PATH = "/api/v1/announcements";

/**
 * Api get announcements
 * @param params
 * @returns ApiResponse<Announcement[]>
 */
export const apiGetAnnouncements = async (params: AnnouncementQueryParams) => {
	return await apiGet<ApiResponse<Announcement[]>>({
		params,
		path: `${PATH}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api get announcement by id
 * @param id string
 * @returns ApiResponse<Announcement>
 */
export const apiGetAnnouncementById = async (id: string) => {
	return await apiGet<ApiResponse<Announcement>>({
		path: `${PATH}/${id}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api update announcement by id
 * @param id string
 * @param body AnnouncementBody
 * @returns ApiResponse<Announcement>
 */
export const apiUpdateAnnouncementById = async (id: string, body: AnnouncementBody) => {
	return await apiPut<ApiResponse<Announcement>>({
		path: `${PATH}/${id}`,
		body: JSON.stringify(body),
		token: "AUTH_TOKEN"
	});
};

/**
 * Api create announcement
 * @param body AnnouncementBody
 * @returns ApiResponse<Announcement>
 */
export const apiCreateAnnouncement = async (body: AnnouncementBody) => {
	return await apiPost<ApiResponse<Announcement>>({
		path: `${PATH}`,
		body: JSON.stringify(body),
		token: "AUTH_TOKEN"
	});
};
