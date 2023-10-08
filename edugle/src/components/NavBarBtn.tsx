import React, { useState } from "react";
import { AUTH_TOKEN } from "~/constants";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import withAuth from "../pages/api/auth/withAuth";
import AdminNavBarBtn from "./AdminNavBarBtn";

const NavBarBtn = () => {
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
      <AdminNavBarBtn />
      <Link href="/logout">
        <button
          className="bg-[#FFFFFF rounded p-2 text-[#012A4A]"
          onClick={() => {
            localStorage.removeItem(AUTH_TOKEN);
          }}
        >
          Logout
        </button>
      </Link>
    </>
  );
};

export default withAuth(NavBarBtn);
