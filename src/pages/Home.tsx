import { fakePosts } from "@/components/Home/fakeData";
import PostBox from "@/components/Home/PostBox";

const Home = () => {
  return fakePosts?.map((post) => <PostBox post={post} />);
};

export default Home;
