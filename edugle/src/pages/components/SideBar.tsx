import React from "react";
import { User } from "../api/types";

type SidebarProps = {
  users: User[];
  handleNextUser: () => void;
  handleLikeUser: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  users,
  handleNextUser,
  handleLikeUser,
}) => {
  return (
      <div className="relative">
    <div className="flex flex-row bg-white/10 pl-4 pr-4 pb-4">
        {users.map((user, idx) => (
          <div
            key={idx}
            className="space-evenly items-center mt-2 flex flex-row text-center text-white"
          >
            <h3 className="w-full text-xl font-bold">{user.username}</h3>
            <p className="w-full">{user.description}</p>
            <img
              alt={`${user.username}'s avatar`}
              src={user.avatar || "/default-avatar.png"}
              className="ml-8 h-16 w-16 rounded-full"
            />
          </div>
        ))}

        <div className="absolute bottom-0 right-0 flex h-full items-center pr-2">
          <button
            onClick={handleLikeUser}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Like
          </button>
          <button
            onClick={handleNextUser}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
