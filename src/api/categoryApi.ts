import { interactRepository } from "./repository";

const API_BASE_URL = "/category";

export const categoryApi = {
  createCategory: async (categoryData: any): Promise<any> => {
    const url = `${API_BASE_URL}/create`;
    const response = await interactRepository.post(url, categoryData);
    return response.data;
  },

  fetchCategories: async (keySearch?: string): Promise<any> => {
    const url = `${API_BASE_URL}/get-list`;
    const queryParams = keySearch ? { keySearch } : undefined;
    const queryString = queryParams
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";
    const response = await interactRepository.get(`${url}${queryString}`);
    return response.data;
  },

  fetchCategory: async (id: string): Promise<any> => {
    const url = `${API_BASE_URL}/get`;
    const queryString = `?id=${id}`;
    const response = await interactRepository.get(`${url}${queryString}`);
    return response.data;
  },

  followCategory: async (id: string): Promise<any> => {
    const url = `${API_BASE_URL}/follow`;
    const response = await interactRepository.post(url, id);
    return response.data;
  },

  unfollowCategory: async (id: string): Promise<any> => {
    const url = `${API_BASE_URL}/unfollow`;
    const response = await interactRepository.post(url, id);
    return response.data;
  },

  fetchFollowedCategories: async (keySearch?: string): Promise<any> => {
    const url = `${API_BASE_URL}/get-followed`;
    const queryParams = keySearch ? { keySearch } : undefined;
    const queryString = queryParams
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";
    const response = await interactRepository.get(`${url}${queryString}`);
    return response.data;
  },

  fetchTrendingCategories: async (params: {
    limit?: number;
    timeRange?: string;
  }): Promise<any> => {
    const url = `${API_BASE_URL}/get-trending`;
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    const response = await interactRepository.get(`${url}${queryString}`);
    return response.data;
  },
};
