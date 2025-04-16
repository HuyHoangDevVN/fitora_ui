import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Divider, List, Typography } from "antd";
import {
  CommentOutlined,
  LikeOutlined,
  PlusOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { groupApi } from "../api/groupApi";
import { GroupResponse } from "@/types/group";

const { Title, Text } = Typography;

const Group: React.FC = () => {
  const navigate = useNavigate();
  const [managedGroups, setManagedGroups] = useState<GroupResponse[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupResponse[]>([]);
  const [loadingManagedGroups, setLoadingManagedGroups] = useState(false);
  const [loadingJoinedGroups, setLoadingJoinedGroups] = useState(false);

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

    fetchGroups();
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

  const posts = [
    {
      id: 1,
      group: "Yêu Thú Cưng",
      groupAvatar: "https://via.placeholder.com/40",
      author: "Nguyễn Văn A",
      time: "2 giờ trước",
      content:
        "Mọi người có ai biết chỗ nào bán thức ăn cho mèo chất lượng không ạ?",
    },
    {
      id: 2,
      group: "Cộng đồng Công nghệ",
      groupAvatar: "https://via.placeholder.com/40",
      author: "Trần Thị B",
      time: "5 giờ trước",
      content: "React 19 sắp ra mắt, mọi người đã thử các tính năng mới chưa?",
    },
  ];

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

          <div className="flex-1 flex justify-center mx-auto lg:mx-0">
            <List
              dataSource={posts}
              renderItem={(post) => (
                <Card
                  key={post.id}
                  className="mb-6 rounded-lg shadow-sm border-gray-200"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar src={post.groupAvatar} size={40} />
                    <div>
                      <Text className="text-sm font-semibold text-gray-900">
                        {post.author}{" "}
                        <span className="text-gray-500">trong</span>{" "}
                        <span className="text-[#1b74e4] hover:underline cursor-pointer">
                          {post.group}
                        </span>
                      </Text>
                      <Text className="text-xs text-gray-500 block">
                        {post.time}
                      </Text>
                    </div>
                  </div>
                  <Text className="text-gray-900 mb-4 block">
                    {post.content}
                  </Text>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <Button
                      type="text"
                      icon={<LikeOutlined />}
                      className="text-gray-600 hover:text-[#1b74e4]"
                    >
                      Thích
                    </Button>
                    <Button
                      type="text"
                      icon={<CommentOutlined />}
                      className="text-gray-600 hover:text-[#1b74e4]"
                    >
                      Bình luận
                    </Button>
                    <Button
                      type="text"
                      icon={<ShareAltOutlined />}
                      className="text-gray-600 hover:text-[#1b74e4]"
                    >
                      Chia sẻ
                    </Button>
                  </div>
                </Card>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
