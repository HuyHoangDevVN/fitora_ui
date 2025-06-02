import { adminApi } from "@/api/adminApi";
import { logout } from "@/features/auth/authSlice";
import { AppDispatch } from "@/store/store";
import colors from "@/styles/colors";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Popover, Space, Typography } from "antd";
import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileActionIcon = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("x-client-id");
  const profile = JSON.parse(localStorage.getItem("userInfo") ?? "{}");

  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      (async () => {
        try {
          const response = await adminApi.isAdmin(true);
          setIsAdmin(response);
        } catch (error) {
          console.error("Failed to check admin status:", error);
          setIsAdmin(false);
        }
      })();
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const content = (
    <div className="w-[200px] p-0 flex flex-col gap-1 bg-white rounded-lg">
      <button
        className="flex flex-col items-start w-full text-left p-2 rounded-md"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <span className="font-medium text-gray-800 pb-2">Profile</span>
        <div className="flex flex-row items-center gap-2">
          <Avatar
            size={30}
            style={{ backgroundColor: colors.primary }}
            icon={<UserOutlined />}
            src={profile?.profilePictureUrl || ""}
          />
          <span className="text-sm font-medium text-gray-700">
            {profile?.firstName || "User"}
          </span>
        </div>
      </button>

      {isAdmin && (
        <button
          className="flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-slate-50 p-2 rounded-md w-full"
          onClick={() => navigate("/admin/dashboard")}
        >
          <UserOutlined className="text-xl text-primary" />
          <Typography className="font-normal">Quản trị viên</Typography>
        </button>
      )}

      <Divider style={{ borderColor: colors.border, margin: 0, padding: 0 }} />

      <button
        className="flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-slate-50 p-2 rounded-md w-full"
        onClick={handleLogout}
      >
        <IoLogOutOutline className="text-xl text-primary" />
        <Typography className="font-normal">Đăng xuất</Typography>
      </button>
    </div>
  );

  return (
    <Space size={20}>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Avatar
          size={35}
          style={{ backgroundColor: colors.primary }}
          icon={<UserOutlined />}
        />
      </Popover>
    </Space>
  );
};

export default ProfileActionIcon;
