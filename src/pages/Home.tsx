import React, { useEffect, useState } from "react";
import { Divider, message, Spin } from "antd";
import PostBox from "@/components/Home/PostBox";
import colors from "@/styles/colors";
import { interactRepository } from "@/_base/const/Repository";
import { Post } from "@/interfaces/Post";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await interactRepository.get("/post/get-all");
      if (response?.isSuccess && response.data) {
        // Giả sử API trả về dữ liệu trong response.data.data
        setPosts(response.data || []);
      } else {
        message.error(response?.message || "Không thể tải bài viết");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Có lỗi xảy ra khi tải bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <div key={post.id}>
          <PostBox post={post} />
          <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
        </div>
      ))}
    </>
  );
};

export default Home;
