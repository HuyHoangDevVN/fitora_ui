import { interactRepository } from "./repository";

const API_BASE_URL = "/category";

const getWithParams = async (url: string, params?: Record<string, any>) => {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  const response = await interactRepository.get(`${url}${queryString}`);
  return response.data;
};

const postWithBody = async (url: string, body: any) => {
  const response = await interactRepository.post(url, body);
  return response.data;
};

export const createCategoryApi = async (categoryData: any) => {
  return await postWithBody(`${API_BASE_URL}/create`, categoryData);
};

export const fetchCategoriesApi = async (keySearch?: string) => {
  return await getWithParams(
    `${API_BASE_URL}/get-list`,
    keySearch ? { keySearch } : undefined
  );
};

export const fetchCategoryApi = async (id: string) => {
  return await getWithParams(`${API_BASE_URL}/get`, { id });
};

export const followCategoryApi = async (id: string) => {
  return await postWithBody(`${API_BASE_URL}/follow`, id);
};

export const unfollowCategoryApi = async (id: string) => {
  return await postWithBody(`${API_BASE_URL}/unfollow`, id);
};

export const fetchFollowedCategoriesApi = async (keySearch?: string) => {
  return await getWithParams(
    `${API_BASE_URL}/get-followed`,
    keySearch ? { keySearch } : undefined
  );
};

export const fetchTrendingCategoriesApi = async (params: {
  limit?: number;
  timeRange?: string;
}) => {
  return await getWithParams(`${API_BASE_URL}/get-trending`, params);
};
