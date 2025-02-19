import React from "react";
import SearchBar from "./components/SearchBar";
import NotificationActionIcon from "./components/NotificationActionIcon";
import MessageActionIcon from "./components/MessageActionIcon";
import ProfileActionIcon from "./components/ProfileActionIcon";
import CreatePostActionIcon from "./components/CreatePostActionIcon";
import FriendActionIcon from "./components/FriendActionIcon";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-secondBackground text-white p-4 flex items-center justify-between border-b border-gray-200 relative">
      {/* Logo */}
      <h1
        className="text-2xl md:text-3xl text-primary font-bold whitespace-nowrap flex-shrink-0"
        onClick={() => navigate("/")}
      >
        Fitora
      </h1>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
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
