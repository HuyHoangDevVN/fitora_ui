import { fakePosts } from "@/components/Home/fakeData";
import PostBox from "@/components/Home/PostBox";
import colors from "@/styles/colors";
import { Divider } from "antd";

const Home = () => {
  return fakePosts?.map((post) => (
    <>
      <PostBox post={post} />
      <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
    </>
  ));
};

export default Home;
