import { TblPost } from "@/interfaces/TblPost";
import colors from "@/styles/colors";
import { timeToLast } from "@/utils/FunctionHelpper";
import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Space } from "antd";
import { BsDot } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { RiShareForwardLine } from "react-icons/ri";

type PostBoxProps = {
  post: TblPost;
};

const PostBox = ({ post }: PostBoxProps) => (
  <div className="mb-3">
    <div className="header">
      <Flex style={{ width: "100%" }} align="center" justify="space-between">
        <Flex style={{ width: "230px" }} align="center" justify="space-between">
          <Avatar src={post.createByAvatar}></Avatar>
          <h2 className="text-neutral-content whitespace-nowrap flex items-center h-xl a cursor-pointer text-[12px] font-semibold no-visited no-underline hover:no-underline">{`f/${post.postCategoryName}`}</h2>
          <BsDot />
          <h2 className="text-[12px] font-semibold">
            {timeToLast(post.createDate)}
          </h2>
        </Flex>
        <Space style={{ width: "fit-content" }}>
          <Button
            style={{
              borderRadius: "20px",
              backgroundColor: colors.primary,
              fontSize: "14px",
            }}
            icon={<PlusOutlined />}
            iconPosition="end"
            type="primary"
            size="small"
          >
            Theo dõi
          </Button>
          <IoIosMore />
        </Space>
      </Flex>
    </div>

    <div className="content">
      <h2 className="title block font-semibold text-neutral-content-strong m-0 visited:text-neutral-content-weak text-16 xs:text-18  mb-2xs xs:mb-xs  overflow-hidden">
        {post.postTitle}
      </h2>
      <div id="mainContent">{post.postContent}</div>
    </div>
    <Flex align="center" gap={10}>
      <div className="bg-secondBackground rounded-2xl w-fit flex flex-row items-center">
        <Button type="text" icon={<PiArrowFatUpLight />}></Button>
        <p className="text-[12px] font-[600]">{post.voteQuantity}</p>
        <Button type="text" icon={<PiArrowFatDownLight />}></Button>
      </div>
      <Button
        style={{
          borderRadius: "1rem",
          backgroundColor: colors.secondBackground,
          fontSize: "12px",
        }}
        type="text"
        icon={<FaRegComment />}
      >
        {post.numberOfComments}
      </Button>
      <Button
        style={{
          borderRadius: "1rem",
          backgroundColor: colors.secondBackground,
          fontSize: "12px",
        }}
        type="text"
        icon={<RiShareForwardLine />}
      >
        Share
      </Button>
    </Flex>
  </div>
);

export default PostBox;
