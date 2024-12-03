import { Flex, Space } from "antd";

type LinkButtonProps = {
  title: string;
  link?: string;
  icon?: React.ReactElement;
};
const LinkButton = ({ title, link, icon }: LinkButtonProps) => {
  return (
    <Space
      size={24}
      style={{ width: "100%" }}
      styles={{ item: { width: "100%" } }}
    >
      <a href={link} className="w-full hover:text-primary">
        <Flex align="center" gap={15}>
          {icon && <>{icon}</>}
          <h2 className="text-[16px] font-semibold">{title}</h2>
        </Flex>
      </a>
    </Space>
  );
};

export default LinkButton;
