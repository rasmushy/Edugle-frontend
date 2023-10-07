import React, { useState } from "react";
import { AUTH_TOKEN } from "~/constants";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import withAuth from "../pages/api/auth/withAuth";
import NavBarBtn from "./NavBarBtn";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <Link href="/">
        <h1 className="text-2xl font-bold text-white">Edugle</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <NavBarBtn />
      </div>
    </div>
  );
};

export default Header;
