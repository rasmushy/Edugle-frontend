import React, { useState } from "react";
import { AUTH_TOKEN } from "~/constants";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import withAuth from "../pages/api/auth/withAuth";

const NavBarBtn = () => {
  return (
    <>
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
    </>
  );
};

export default withAuth(NavBarBtn);
