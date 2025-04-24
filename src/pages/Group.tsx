import PostBox from "@/components/posts/PostBox";
import { GroupResponse } from "@/types/group";
import { Post } from "@/types/post";
import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Divider, List, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupApi } from "../api/groupApi";
import { postApi } from "../api/postApi";

const { Title, Text } = Typography;

const Group: React.FC = () => {
  const navigate = useNavigate();
  const [managedGroups, setManagedGroups] = useState<GroupResponse[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupResponse[]>([]);
  const [loadingManagedGroups, setLoadingManagedGroups] = useState(false);
  const [loadingJoinedGroups, setLoadingJoinedGroups] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingManagedGroups(true);
      setLoadingJoinedGroups(true);

      try {
        const [managedResponse, joinedResponse] = await Promise.all([
          groupApi.getManagedGroups({ PageIndex: 0, PageSize: 10 }),
          groupApi.getJoinedGroups({ IsAll: true, PageIndex: 0, PageSize: 10 }),
        ]);

        setManagedGroups(managedResponse.data);
        setJoinedGroups(joinedResponse.data);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      } finally {
        setLoadingManagedGroups(false);
        setLoadingJoinedGroups(false);
      }
    };

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await postApi.fetchPosts({
          feedType: 1, // Fetch all posts
        });
        if (response?.isSuccess) {
          setPosts(response.data.data);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchGroups();
    fetchPosts();
  }, []);

  const renderGroupList = (groups: GroupResponse[], loading: boolean) =>
    loading ? (
      <Text>Loading...</Text>
    ) : (
      <List
        dataSource={groups}
        renderItem={(group) => (
          <List.Item
            style={{ justifyContent: "start" }}
            className="px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => handleViewGroup(group.id)}
          >
            <Avatar src={group.avatarUrl} size={40} className="mr-3" />
            <Text className="text-base text-gray-900 font-[500]">
              {group.name}
            </Text>
          </List.Item>
        )}
      />
    );

  const handleViewGroup = (id) => {
    navigate(`/groups/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-2 w-full lg:w-80">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="w-full mb-6 bg-primary hover:bg-hover rounded-lg font-semibold"
              onClick={() => navigate("/groups/create")}
            >
              Tạo nhóm
            </Button>
            <Card
              title={
                <Title level={4} className="text-gray-900">
                  Nhóm
                </Title>
              }
              className="rounded-lg shadow-sm border-gray-200"
              bodyStyle={{ padding: "16px" }}
            >
              <Title level={5} className="text-gray-700 mb-3">
                Nhóm do bạn quản lý
              </Title>
              {renderGroupList(managedGroups, loadingManagedGroups)}
              <Divider className="my-3" />
              <Title level={5} className="text-gray-700 mb-3">
                Nhóm của bạn
              </Title>
              {renderGroupList(joinedGroups, loadingJoinedGroups)}
            </Card>
          </div>

          <div className="flex-1 flex min-w-[650px] max-w-[650px] justify-center items-center mx-auto">
            {loadingPosts ? (
              <Text>Loading posts...</Text>
            ) : (
              <List
                dataSource={posts}
                renderItem={(post) => <PostBox post={post} />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
