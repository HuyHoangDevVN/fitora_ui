import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

import SearchBar from "./components/SearchBar";
import NotificationActionIcon from "./components/NotificationActionIcon";
import MessageActionIcon from "./components/MessageActionIcon";
import ProfileActionIcon from "./components/ProfileActionIcon";
import CreatePostActionIcon from "./components/CreatePostActionIcon";
import FriendActionIcon from "./components/FriendActionIcon";
import CreatePostModal from "@/components/posts/CreatePost";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-secondBackground text-white py-4 border-b border-gray-200 w-full">
        <div className="hidden sm:flex items-center justify-between w-full px-4 relative">
          <div className="flex-shrink-0 z-10">
            <a
              className="text-2xl md:text-3xl text-primary font-bold cursor-pointer"
              href="/"
            >
              Fitora
            </a>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] pointer-events-auto">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-4 z-10">
            <CreatePostModal trigger={<CreatePostActionIcon />} />
            <div className="hidden min-[1100px]:flex items-center space-x-4">
              <FriendActionIcon />
              <MessageActionIcon />
              <NotificationActionIcon className="hidden min-[1100px]:inline-flex" />
            </div>
            {/* NotificationActionIcon for mobile, only visible when mobile menu is open */}
            {isMobileMenuOpen && (
              <div className="sm:hidden inline-flex items-center ml-2">
                <NotificationActionIcon className="sm:hidden" />
              </div>
            )}
            <ProfileActionIcon />
          </div>
        </div>

        <div className="flex sm:hidden items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
            <h1
              className="text-2xl text-primary font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              Fitora
            </h1>
          </div>
          <div className="flex items-center">
            <CreatePostModal trigger={<CreatePostActionIcon />} />
            <button onClick={() => setMobileSearchOpen(!isMobileSearchOpen)}>
              <FiSearch className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="sm:hidden mt-2 px-4">
            <SearchBar />
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-secondBackground text-white p-3 sm:p-4 shadow-lg">
          <nav>
            <ul className="flex justify-around">
              <li className="flex-1 text-center">
                <FriendActionIcon />
              </li>
              <li className="flex-1 text-center">
                <MessageActionIcon />
              </li>
              {/* Removed NotificationActionIcon from here to prevent double mount */}
              <li className="flex-1 text-center">
                <ProfileActionIcon />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
