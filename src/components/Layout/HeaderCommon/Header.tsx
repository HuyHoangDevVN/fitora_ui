import React from "react";
import SearchBar from "./components/SearchBar";
import NotificationActionIcon from "./components/NotificationActionIcon";
import MessageActionIcon from "./components/MessageActionIcon";
import ProfileActionIcon from "./components/ProfileActionIcon";
import CreatePostActionIcon from "./components/CreatePostActionIcon";
import FriendActionIcon from "./components/FriendActionIcon";

const Header: React.FC = () => {
  return (
    <header className="bg-secondBackground text-white p-4 px-6 flex flex-row justify-between items-center border ">
      <h1 className="text-3xl text-primary font-bold">Fitora</h1>
      <SearchBar />
      <nav>
        <ul className="flex items-center space-x-4">
          <li>
            <CreatePostActionIcon />
          </li>
          <li>
            <FriendActionIcon />
          </li>
          <li>
            <MessageActionIcon />
          </li>
          <li>
            <NotificationActionIcon />
          </li>
          <li>
            <ProfileActionIcon />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
