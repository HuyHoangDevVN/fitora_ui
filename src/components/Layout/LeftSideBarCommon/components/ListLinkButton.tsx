import { useState } from "react";
import { MenuItem } from "../interfaces";
import LinkButton from "./LinkButton";
import { Button, Flex } from "antd";
import { FaCircleChevronDown, FaCircleChevronUp } from "react-icons/fa6";

type ListLinkButtonProps = {
  listItems: MenuItem[];
};

const ListLinkButton = ({ listItems }: ListLinkButtonProps) => {
  const [showAll, setShowAll] = useState(false);

  const itemsToShow = showAll ? listItems : listItems.slice(0, 6);

  return (
    <div>
      <ul className="space-y-5">
        {itemsToShow?.map((item, index) => (
          <li key={index}>
            <LinkButton
              icon={item.icon}
              link={item?.link ?? ""}
              title={item.title}
            />
          </li>
        ))}
      </ul>

      {listItems.length > 6 && (
        <Flex flex={"row"} className="mt-4">
          <Button
            onClick={() => setShowAll(!showAll)}
            type="text"
            icon={showAll ? <FaCircleChevronUp /> : <FaCircleChevronDown />}
            className="text-primary bg-white font-medium w-full"
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default ListLinkButton;
