import { Flex, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";

type LinkButtonProps = {
  title: string;
  link: string;
  icon?: React.ReactElement;
  onClick?: () => void;
};
const LinkButton = memo(({ title, icon, link }: LinkButtonProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(link);
  }, [navigate, link]);

  return (
    <Space
      size={24}
      style={{ width: "100%" }}
      styles={{ item: { width: "100%" } }}
    >
      <button
        className="w-full hover:text-primary bg-transparent border-none p-0 text-left"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Flex align="center" gap={15}>
          {icon && <>{icon}</>}
          <h2 className="text-[14px] font-semibold">{title}</h2>
        </Flex>
      </button>
    </Space>
  );
});

LinkButton.displayName = "LinkButton";

export default LinkButton;
