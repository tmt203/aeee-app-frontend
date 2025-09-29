import type { ApiResponse } from "@type/api/api.type";
import type { Manager, ManagerQueryParams } from "@type/api/manager.type";
import { apiGet } from "@utils/api";

const PATH = "/api/v1/managers";

/**
 * Api get managers
 * @param params
 * @returns ApiResponse<Manager[]>
 */
export const apiGetManagers = async (params: ManagerQueryParams) => {
	return await apiGet<ApiResponse<Manager[]>>({
		params,
		path: `${PATH}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api get latest manager
 * @returns ApiResponse<Manager>
 */
export const apiGetLatestManager = async () => {
	return await apiGet<ApiResponse<Manager>>({
		path: `${PATH}/latest`,
		token: "AUTH_TOKEN"
	});
};
