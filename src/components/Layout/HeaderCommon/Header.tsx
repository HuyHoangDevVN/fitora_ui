import React from "react";
import SearchBar from "./components/SearchBar";
import NotificationActionIcon from "./components/NotificationActionIcon";
import MessageActionIcon from "./components/MessageActionIcon";
import ProfileActionIcon from "./components/ProfileActionIcon";
import CreatePostActionIcon from "./components/CreatePostActionIcon";
import FriendActionIcon from "./components/FriendActionIcon";

const Header: React.FC = () => {
  return (
    <header className="bg-secondBackground text-white p-4 flex items-center justify-between border-b border-gray-200 relative">
      {/* Logo */}
      <h1 className="text-2xl md:text-3xl text-primary font-bold whitespace-nowrap flex-shrink-0">
        Fitora
      </h1>

      {/* Search Bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[450px] sm:max-w-[300px] md:max-w-[450px]">
        <SearchBar />
      </div>

      {/* Action Icons */}
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
