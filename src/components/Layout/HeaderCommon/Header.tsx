import React from "react";
import SearchBar from "./components/SearchBar";
import NotificationActionIcon from "./components/NotificationActionIcon";
import MessageActionIcon from "./components/MessageActionIcon";
import ProfileActionIcon from "./components/ProfileActionIcon";
import CreatePostActionIcon from "./components/CreatePostActionIcon";
import FriendActionIcon from "./components/FriendActionIcon";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "@/components/UI/Post/CreatePost";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-secondBackground text-white p-4 flex items-center justify-between border-b border-gray-200">
      {/* Logo */}
      <h1
        className="text-2xl md:text-3xl text-primary font-bold whitespace-nowrap flex-shrink-0 cursor-pointer"
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
            <CreatePostModal trigger={<CreatePostActionIcon />} />
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
