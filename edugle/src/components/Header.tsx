import React from "react";
import { AUTH_TOKEN } from "~/constants";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <Link href="/">
      <h1 className="text-2xl font-bold text-white">Edugle</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/profile">
          <button
            onClick={() => {}}
            className="rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Profile
          </button>
        </Link>

        <Link href="/settings">
          <button
            onClick={() => {}}
            className="rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Settings
          </button>
        </Link>
        <Link href="/logout">
          <button
            className="rounded bg-[hsl(280,100%,70%)] p-2 text-white"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
            }}
          >
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
