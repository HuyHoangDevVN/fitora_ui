export interface Post {
  postId: string | number;
  postCategoryName: string | null;
  postCategoryId: string | number;
  postTitle: string | null;
  postContent: string | null;
  postImage?: string | null;
  postUrl?: string | null;
  voteQuantity: number | null;
  numberOfComments: number | null;
  createDate: Date;
  createdBy: string | null;
  createByAvatar?: string | null;
  updateDate?: Date | null;
  updatedBy?: string | null;
  status: string;
  tags?: string[];
  slug?: string;
  isFeatured?: boolean;
}
