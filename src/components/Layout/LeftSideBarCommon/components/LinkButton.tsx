import { Flex, Space } from "antd";
import { useNavigate } from "react-router-dom";

type LinkButtonProps = {
  title: string;
  link: string;
  icon?: React.ReactElement;
  onClick?: () => void;
};
const LinkButton = ({ title, icon, link }: LinkButtonProps) => {
  const navigate = useNavigate();
  return (
    <Space
      size={24}
      style={{ width: "100%" }}
      styles={{ item: { width: "100%" } }}
    >
      <button
        className="w-full hover:text-primary bg-transparent border-none p-0 text-left"
        onClick={() => navigate(link)}
        style={{ cursor: "pointer" }}
      >
        <Flex align="center" gap={15}>
          {icon && <>{icon}</>}
          <h2 className="text-[14px] font-semibold">{title}</h2>
        </Flex>
      </button>
    </Space>
  );
};

export default LinkButton;
