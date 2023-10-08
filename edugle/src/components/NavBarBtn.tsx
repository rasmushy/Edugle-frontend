import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import AdminNavBarBtn from "./AdminNavBarBtn";

const NavBarBtn = () => {
  const session = useSession();
  const status = session.status;

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <>
      <Link href="/profile">
        <button
          onClick={() => {}}
          className="bg-[#FFFFFF rounded p-2 text-[#012A4A]"
        >
          Profile
        </button>
      </Link>
      <Link href="/settings">
        <button
          onClick={() => {}}
          className="bg-[#FFFFFF rounded p-2 text-[#012A4A]"
        >
          Settings
        </button>
      </Link>
      {session.data?.user.role.toLocaleLowerCase() === "admin" ? (
        <AdminNavBarBtn />
      ) : null}
      <Link href="/">
        <button
          className="bg-[#FFFFFF rounded p-2 text-[#012A4A]"
          onClick={() => {
            signOut({
              callbackUrl: "/",
            });
          }}
        >
          Logout
        </button>
      </Link>
    </>
  );
};

export default NavBarBtn;
