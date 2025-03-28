import { AppDispatch, RootState } from "@/store/store";
import colors from "@/styles/colors";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Popover, Space } from "antd";
import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/authSlice";

const ProfileActionIcon = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  const content = (
    <div className="w-[200px] p-0 flex flex-col gap-1 bg-white rounded-lg">
      <button
        className="flex flex-col items-start w-full text-left p-2 rounded-md"
        onClick={() => navigate("/personal")}
      >
        <span className="font-medium text-gray-800 pb-2">Profile</span>
        <div className="flex flex-row items-center gap-2">
          <Avatar
            size={30}
            style={{ backgroundColor: colors.primary }}
            icon={<UserOutlined />}
          />
          <span className="text-sm font-medium text-gray-700">
            {userInfo?.fullName || "User"}
          </span>
        </div>
      </button>

      <Divider style={{ borderColor: colors.border, margin: 0, padding: 0 }} />

      <button
        className="flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-slate-50 p-2 rounded-md w-full"
        onClick={handleLogout}
      >
        <IoLogOutOutline className="text-xl text-primary" />
        <span>Đăng xuất</span>
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
