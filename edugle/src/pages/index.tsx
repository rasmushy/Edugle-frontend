import Head from "next/head";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useSession } from "next-auth/react";
import MainPageBtn from "~/components/MainPageBtn";
import styles from "../styles/styles.module.css";
import { useEffect, useState, useRef, MutableRefObject, use } from "react";
import { useNavBar } from "./api/NavBarProvider";

export default function Home({ session: initialSession }: { session: any }) {
  const [activePopup, setActivePopup] = useState(null);
  const bubblesContainerRef = useRef<HTMLDivElement | null>(null);
  const { isNavBarOpen, openNavBar, closeNavBar } = useNavBar();

  function togglePopup(popupName: any) {
    setActivePopup((prevPopup) => (prevPopup === popupName ? null : popupName));
  }

  function createBubbles() {
    const bubbles = bubblesContainerRef.current;
    if (bubbles) {
      const bottom = window.innerHeight;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const bubble = document.createElement("div");
          const delay = Math.random() * -100;
          const duration = Math.random() * 10 + 3;
          const posX = Math.random() * bubbles.clientWidth;
          const posY = bottom;

          bubble.style.left = `${posX}px`;
          bubble.style.bottom = `-${posY}px`; // Negative value to start from the bottom

          bubble.className = `${styles.bubble}`;
          bubble.style.animationDelay = `${delay}s`;
          bubble.style.animationDuration = `${duration}s`;

          bubbles.appendChild(bubble);
        }, i * 1000);
      }
    }
  }

  useEffect(() => {
    createBubbles();
  }, []);

  useEffect(() => {}, [status]);

  return (
    <>
      <Head>
        <title>Edugle</title>
        <meta name="description" content="Random chatting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          position: "relative",
          overflowX: "hidden",
          zIndex: isNavBarOpen == true ? -1 : 1,
        }}
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2C7DA0] to-[#2C7DA0]"
      >
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <div ref={bubblesContainerRef}></div>
        </div>
        {activePopup ? <div className="backdrop" onClick={() => togglePopup(null)}></div> : null}

        {activePopup === "Login" ? (
          <div className="modal">
            <Login toggle={() => togglePopup("Login")} />
          </div>
        ) : null}
        {activePopup === "SignUp" ? (
          <div className="modal">
            <SignUp toggle={() => togglePopup("SignUp")} />
          </div>
        ) : null}
        <MainPageBtn togglePopup={togglePopup} />
      </main>
      <style>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
        }
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9998;
        }
      `}</style>
    </>
  );
}
