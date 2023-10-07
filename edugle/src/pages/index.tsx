import Head from "next/head";
import Link from "next/link";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Main } from "next/document";
import MainPageBtn from "~/components/MainPageBtn";

export default function Home() {
  const { status: session } = useSession();
  const [activePopup, setActivePopup] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  function togglePopup(popupName: any) {
    setActivePopup((prevPopup) => (prevPopup === popupName ? null : popupName));
  }

  function handleGoChat(): void {
    console.log(isAuthenticated, " isAuthhthth");
  }

  useEffect(() => {
    console.log(session, " isAuth");
  }, [session]);

  return (
    <>
    
      <Head>
        <title>Edugle</title>
        <meta name="description" content="Random chatting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {activePopup ? (
          <div className="backdrop" onClick={() => togglePopup(null)}></div>
        ) : null}

        {activePopup === "Login" ? (
          <div className="modal">
            <Login
              setIsAuthenticated={setIsAuthenticated}
              toggle={() => togglePopup("Login")}
            />
          </div>
        ) : null}

        {activePopup === "SignUp" ? (
          <div className="modal">
            <SignUp toggle={() => togglePopup("SignUp")} />
          </div>
        ) : null}

        <MainPageBtn handleGoChat={handleGoChat} togglePopup={togglePopup} />
      </main>
      <style jsx>{`
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
