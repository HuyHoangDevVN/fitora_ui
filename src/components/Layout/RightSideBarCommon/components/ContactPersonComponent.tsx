import { Avatar, Button, Flex } from "antd";
import { User } from "@/types/user";
import { fakeImage } from "../fakeData";
import { useMemo, memo } from "react";

type ContactPersonProp = {
  user?: User;
};

const ContactPersonComponent = memo(({ user }: ContactPersonProp) => {
  const avatarSrc = useMemo(() => {
    return user?.profilePictureUrl ?? fakeImage;
  }, [user?.profilePictureUrl]);

  const buttonStyle = useMemo(
    () => ({
      width: "100%",
      height: "fit-content",
      padding: 0,
    }),
    []
  );

  const flexStyle = useMemo(
    () => ({
      width: "100%",
    }),
    []
  );

  const containerStyle = useMemo(
    () => ({
      marginTop: 15,
      width: "100%",
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <Button type="text" style={buttonStyle}>
        <Flex align="center" gap={8} style={flexStyle}>
          <Avatar size={40} src={avatarSrc} />
          <h2 className="text-[14px] font-[500]">{user?.username}</h2>
        </Flex>
      </Button>
    </div>
  );
});

ContactPersonComponent.displayName = "ContactPersonComponent";

export default ContactPersonComponent;
