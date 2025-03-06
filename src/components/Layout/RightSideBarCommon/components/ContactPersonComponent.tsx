import { Avatar, Button, Flex } from "antd";
import { User } from "@/interfaces/User";
import { fakeImage } from "../fakeData";
import { useNavigate } from "react-router-dom";

type ContactPersonProp = {
  user?: User;
};

const ContactPersonComponent = ({ user }: ContactPersonProp) => {
  const navigate = useNavigate();
  return (
    <div style={{ marginTop: 15, width: "100%" }}>
      <Button
        type="text"
        style={{ width: "100%", height: "fit-content", padding: 0 }}
        onClick={() =>
          navigate("/personal", {
            state: { isWatching: true, userId: user?.id },
          })
        }
      >
        <Flex align="center" gap={8} style={{ width: "100%" }}>
          <Avatar size={40} src={user?.profilePictureUrl ?? fakeImage} />
          <h2 className="text-[14] font-[500]">{user?.username}</h2>
        </Flex>
      </Button>
    </div>
  );
};

export default ContactPersonComponent;
