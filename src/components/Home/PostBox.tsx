import { TblPost } from "@/interfaces/TblPost";
import { timeToLast } from "@/utils/FunctionHelpper";
import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Space } from "antd";
import { BsDot } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { RiShareForwardLine } from "react-icons/ri";

type PostBoxProps = {
  post: TblPost;
};

const PostBox = ({ post }: PostBoxProps) => (
  <div className="post-box mb-3">
    <div className="post-header flex justify-between items-center w-full">
      <div className="post-info flex items-center gap-2">
        <Avatar src={post.createByAvatar} />
        <h2 className="category-name text-xs font-semibold cursor-pointer">
          {`f/${post.postCategoryName}`}
        </h2>
        <BsDot />
        <span className="create-date text-xs font-semibold">
          {timeToLast(post.createDate)}
        </span>
      </div>
      <Space>
        <Button
          className="follow-btn bg-primary rounded-2xl hover:bg-primary"
          icon={<PlusOutlined />}
          type="primary"
          size="small"
        >
          Theo dõi
        </Button>
        <IoIosMore className="icon-more" />
      </Space>
    </div>

    <div className="post-content mt-2">
      <h2 className="post-title text-sm font-semibold overflow-hidden mb-2">
        {post.postTitle}
      </h2>
      <div className="post-main-content">{post.postContent}</div>
    </div>

    <div className="post-footer flex items-center gap-2 mt-2">
      <div className="vote-controls flex items-center bg-gray-100 rounded-2xl px-2">
        <Button type="text" icon={<PiArrowFatUpLight />} />
        <span className="vote-count text-xs font-medium">
          {post.voteQuantity}
        </span>
        <Button type="text" icon={<PiArrowFatDownLight />} />
      </div>
      <Button
        className="comment-btn bg-gray-100 rounded-2xl"
        icon={<FaRegComment />}
        type="text"
        size="small"
      >
        {post.numberOfComments}
      </Button>
      <Button
        className="share-btn bg-gray-100 rounded-2xl"
        icon={<RiShareForwardLine />}
        type="text"
        size="small"
      >
        Share
      </Button>
    </div>
  </div>
);

export default PostBox;
