import type { ApiResponse } from "@type/api/api.type";
import type {
	Manager,
	ManagerBody,
	ManagerQueryParams,
	UploadFile,
	UploadFileQueryParams
} from "@type/api/manager.type";
import { apiDelete, apiGet, apiPost, apiPostFile, apiPut } from "@utils/api";

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
 * Api get manager by id
 * @param id string
 * @returns ApiResponse<Manager>
 */
export const apiGetManagerById = async (id: string) => {
	return await apiGet<ApiResponse<Manager>>({
		path: `${PATH}/${id}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api post manager
 * @param body ManagerBody
 * @param token string
 * @returns ApiResponse<Manager>
 */
export const apiPostManager = async (body: ManagerBody, token: string) => {
	return await apiPost<ApiResponse<Manager>>({
		token,
		path: `${PATH}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api put manager by id
 * @param id string
 * @param body ManagerBody
 * @param token string
 * @returns ApiResponse<Manager>
 */
export const apiPutManagerById = async (id: string, body: ManagerBody, token: string) => {
	return await apiPut<ApiResponse<Manager>>({
		token,
		path: `${PATH}/${id}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api patch manager by id
 * @param id string
 * @param body Partial<ManagerBody>
 * @param token string
 * @returns ApiResponse<Manager>
 */
export const apiPatchManagerById = async (
	id: string,
	body: Partial<ManagerBody>,
	token: string
) => {
	return await apiPut<ApiResponse<Manager>>({
		token,
		path: `${PATH}/${id}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api delete manager by id
 * @param id string
 * @param token string
 * @returns ApiResponse<Manager>
 */
export const apiDeleteManagerById = async (id: string, token: string) => {
	return await apiDelete<ApiResponse<Manager>>({
		path: `${PATH}/${id}`,
		token
	});
};

/**
 * Api upload manager file
 * @param params UploadFileQueryParams
 * @param body BodyInit
 * @param token string
 * @returns ApiResponse<UploadFile>
 */
export const apiUploadManagerFile = async (
	params: UploadFileQueryParams,
	body: BodyInit,
	token: string
) => {
	return await apiPostFile<ApiResponse<UploadFile>>({
		path: `${PATH}/upload-file`,
		params,
		body,
		token
	});
};

/**
 * Api delete manager file
 * @param filePath string
 * @param token string
 * @returns ApiResponse<null>
 */
export const apiDeleteManagerFile = async (filePath: string, token: string) => {
	return await apiDelete<ApiResponse<null>>({
		path: `${PATH}/delete-file`,
		params: { filePath },
		token
	});
};
