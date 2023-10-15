"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "../../styles/styles.module.css";
import Image from "next/image";
import { signOut } from "next-auth/react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useSession } from "next-auth/react";
import AdminNavBarBtn from "./AdminNavBarBtn";
import { useNavBar } from "~/components/navBar/NavBarProvider";

const NavBar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [closeNavbar, setCloseNavbar] = useState(true);
  const { isNavBarOpen, openNavBar, closeNavBar } = useNavBar();
  const [activeButton, setActiveButton] = useState("main");

  const session = useSession();
  const status = session.status;

  if (status === "loading") return <div>Loading...</div>;

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
    setCloseNavbar(!closeNavbar);
  };

  const handleMaintPage = () => {
    setCloseNavbar(true);
    setActiveButton("");
  };
 
  const handleChatPage = () => {
    setCloseNavbar(!closeNavbar);
    setShowNavbar(!showNavbar);
    setActiveButton("chat");
  };

  const handleRoulettePage = () => {
    setCloseNavbar(!closeNavbar);
    setShowNavbar(!showNavbar);
    setActiveButton("roulette");
  };

  const handleProfilePage = () => {
    setCloseNavbar(!closeNavbar);
    setShowNavbar(!showNavbar);
    setActiveButton("profile");
  };

  const handleAdminPanelPage = () => {
    setCloseNavbar(!closeNavbar);
    setShowNavbar(!showNavbar);
    setActiveButton("adminpanel");
  };

  const handleLogOut = () => {
    setCloseNavbar(!closeNavbar);
    setShowNavbar(!showNavbar);
    setActiveButton("");
  };

  const handleLogIn = () => {
    setCloseNavbar(!closeNavbar);
    setShowNavbar(!showNavbar);
    setActiveButton("");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className={styles.navbar} rel="preload">
        <div className={styles.navbar_title} onClick={handleMaintPage}>
          <Link href="/">
            <h1 className="text-2xl font-bold text-[#012A4A]">Edugle</h1>
          </Link>
        </div>
        {session.data?.user ? (
          <>
            <div className={styles.menuIcon} onClick={handleShowNavbar}>
              {showNavbar ? (
                <MenuOpenIcon
                  style={{ color: "black", marginRight: "20px" }}
                  fontSize="large"
                  onClick={() => {
                    closeNavBar();
                  }}
                />
              ) : (
                <MenuIcon
                  style={{ color: "black", marginRight: "20px" }}
                  fontSize="large"
                  onClick={() => {
                    openNavBar();
                  }}
                />
              )}
            </div>
            <div
              className={`${styles.navElements}  ${
                !closeNavbar ? (session.data?.user?.role?.toLowerCase() !== "admin" ? styles.active : styles.biggerActive) : styles.none
              }`}
            >
              <>
                <ul>
                  <li>
                    <Link href="/chat" onClick={() => handleChatPage()}>
                      <div className={`${styles.navbar_item} ${activeButton === "chat" ? styles.active : styles.inactive}`}>
                        <p>Chat</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/chatRoulette" onClick={() => handleRoulettePage()}>
                      <div className={`${styles.navbar_item} ${activeButton === "roulette" ? styles.active : styles.inactive}`}>
                        <p>Roulette</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" onClick={() => handleProfilePage()}>
                      <div className={`${styles.navbar_item} ${activeButton === "profile" ? styles.active : styles.inactive}`}>
                        <p>Profile</p>
                      </div>
                    </Link>
                  </li>
                  {session.data?.user?.role?.toLocaleLowerCase() === "admin" ? (
                    <li>
                      <div className={`${styles.navbar_item} ${activeButton === "adminpanel" ? styles.active : styles.inactive}`}>
                        <AdminNavBarBtn handleAdminPanelPage={handleAdminPanelPage} />
                      </div>
                    </li>
                  ) : null}

                  <li>
                    <Link href="/">
                      <div
                        className={`${styles.navbar_item} `}
                        onClick={() => {
                          handleLogOut();
                          signOut({
                            redirect: false,
                            callbackUrl: "/",
                          });
                        }}
                      >
                        <p>Logout</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
