import { Avatar, Button, Flex } from "antd";
import { ContactPerson } from "../interfaces";

type ContactPersonProp = {
  user?: ContactPerson;
};

const ContactPersonComponent = ({ user }: ContactPersonProp) => {
  return (
    <div style={{ marginTop: 15, width: "100%" }}>
      <Button
        type="text"
        style={{ width: "100%", height: "fit-content", padding: 0 }}
      >
        <Flex align="center" gap={8} style={{ width: "100%" }}>
          <Avatar size={50} src={user?.image} />
          <h2 className="text-[.9375rem] font-[500]">{user?.name}</h2>
        </Flex>
      </Button>
    </div>
  );
};

export default ContactPersonComponent;
