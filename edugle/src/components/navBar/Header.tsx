import React, { useState } from "react";
import Link from "next/link";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <div>
      <NavBar />
    </div>
  );
};

export default Header;

Header.auth = {
  role: "User",
};
