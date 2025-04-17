import { groupApi } from "@/api/groupApi";
import { userApi } from "@/api/userApi";
import { Avatar, Button, Input, List, message, Modal, Spin } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";

interface Friend {
  id: string;
  username: string;
  fullName?: string;
  profilePictureUrl?: string;
  email?: string;
  isOnline?: boolean;
}

interface InviteMembersModalProps {
  groupId: string;
  visible: boolean;
  onClose: () => void;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  groupId,
  visible,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);

  const fetchFriends = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    try {
      const response = await userApi.getListFriends({
        pageIndex: 0,
        pageSize: 10,
        keySearch: searchTerm.trim(),
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      message.error("Không thể tìm kiếm bạn bè. Vui lòng thử lại.");
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchFriends();
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectMember = (friendId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleInvite = async () => {
    if (selectedMembers.length === 0) {
      message.info("Vui lòng chọn ít nhất một người bạn để mời.");
      return;
    }

    setInviting(true);
    try {
      await groupApi.inviteNewMembers({
        GroupId: groupId,
        ReceiverUserIds: selectedMembers,
      });
      message.success("Mời bạn bè thành công!");
      setSelectedMembers([]);
      setSearchTerm("");
      onClose();
    } catch (error: any) {
      message.error(error.message || "Không thể mời bạn bè. Vui lòng thử lại.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={
        <h2 className="text-xl font-semibold text-gray-800">
          Mời bạn bè vào nhóm
        </h2>
      }
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="invite"
          type="primary"
          loading={inviting}
          onClick={handleInvite}
          disabled={selectedMembers.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Mời {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ""}
        </Button>,
      ]}
      className="rounded-lg"
      centered
    >
      <div className="space-y-4">
        {/* Thanh tìm kiếm */}
        <Input
          placeholder="Tìm kiếm bạn bè theo tên..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={handleSearchChange}
          className="rounded-md border-gray-300 focus:border-blue-500"
          size="large"
        />

        {/* Danh sách bạn bè */}
        <div className="max-h-64 overflow-y-auto rounded-md border border-gray-200">
          {loadingSearch ? (
            <div className="flex justify-center py-4">
              <Spin tip="Đang tìm kiếm..." />
            </div>
          ) : searchResults.length === 0 && searchTerm.trim() ? (
            <div className="py-4 text-center text-gray-500">
              Không tìm thấy bạn bè nào với từ khóa "{searchTerm}".
            </div>
          ) : (
            <List
              dataSource={searchResults}
              renderItem={(friend: Friend) => (
                <List.Item
                  onClick={() => handleSelectMember(friend.id)}
                  className={`cursor-pointer px-4 py-3 hover:bg-gray-100 ${
                    selectedMembers.includes(friend.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <List.Item.Meta
                    className="px-2"
                    avatar={
                      <Avatar
                        src={
                          friend.profilePictureUrl ||
                          "https://via.placeholder.com/40"
                        }
                        className="border border-gray-200"
                      />
                    }
                    title={
                      <span className="text-gray-800 font-medium">
                        {friend.username}
                      </span>
                    }
                    description={
                      <span className="text-gray-500">
                        {friend.email || "Không có tên đầy đủ"}
                      </span>
                    }
                  />
                  {selectedMembers.includes(friend.id) && (
                    <span className="text-blue-500 font-semibold">Đã chọn</span>
                  )}
                </List.Item>
              )}
            />
          )}
        </div>

        {/* Hiển thị số lượng bạn bè đã chọn */}
        {selectedMembers.length > 0 && (
          <div className="text-gray-600">
            Đã chọn: {selectedMembers.length} bạn bè
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InviteMembersModal;
