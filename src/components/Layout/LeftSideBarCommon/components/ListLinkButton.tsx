import { useState, useCallback, useMemo, memo } from "react";
import { MenuItem } from "../interfaces";
import LinkButton from "./LinkButton";
import { Button, Flex } from "antd";
import { FaCircleChevronDown, FaCircleChevronUp } from "react-icons/fa6";

type ListLinkButtonProps = {
  listItems: MenuItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
};

const ListLinkButton = memo(
  ({ listItems, onLoadMore, hasMore }: ListLinkButtonProps) => {
    const [showAll, setShowAll] = useState(false);

    const itemsToShow = useMemo(
      () => (showAll ? listItems : listItems.slice(0, 6)),
      [showAll, listItems]
    );

    const handleLoadMore = useCallback(() => {
      if (onLoadMore) {
        onLoadMore();
      }
      setShowAll(true);
    }, [onLoadMore]);

    const shouldShowMoreButton = useMemo(
      () => listItems.length > 6 && hasMore,
      [listItems.length, hasMore]
    );

    return (
      <div>
        <ul className="space-y-5">
          {itemsToShow?.map((item, index) => (
            <li key={item.link || index}>
              <LinkButton
                icon={item.icon}
                link={item?.link ?? ""}
                title={item.title}
              />
            </li>
          ))}
        </ul>

        {shouldShowMoreButton && (
          <Flex flex={"row"} className="mt-4">
            <Button
              onClick={handleLoadMore}
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
  }
);

ListLinkButton.displayName = "ListLinkButton";

export default ListLinkButton;
