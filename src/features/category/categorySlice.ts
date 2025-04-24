import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/api/categoryApi";

// Fetch categories for newfeed (followed + trending)
export const useCategoriesForNewfeed = () => {
  return useQuery({
    queryKey: ["categoriesForNewfeed"],
    queryFn: async () => {
      const followed = await categoryApi.fetchFollowedCategories();
      const trending = await categoryApi.fetchTrendingCategories({ limit: 10 });
      return { followed, trending };
    },
  });
};

// Fetch categories for post creation (searchable)
export const useCategoriesForPost = (keySearch?: string) => {
  return useQuery({
    queryKey: ["categoriesForPost", keySearch],
    queryFn: () => categoryApi.fetchCategories(keySearch),
  });
};

// Create a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesForNewfeed"] });
    },
  });
};

// Follow a category
export const useFollowCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.followCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesForNewfeed"] });
    },
  });
};

// Unfollow a category
export const useUnfollowCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.unfollowCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesForNewfeed"] });
    },
  });
};
