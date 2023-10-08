import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const NavBarBtn = () => {
  const session = useSession();
  const status = session.status;

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <>
      {session.data?.user.role === "admin" && (
        <Link href="/admin">
          <button
            onClick={() => {}}
            className="bg-[#FFFFFF rounded p-2 text-[#012A4A]"
          >
            Admin
          </button>
        </Link>
      )}
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
