import Head from "next/head";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MainPageBtn from "~/components/MainPageBtn";

export default function Home() {
  const { data: session, status } = useSession();
  const [activePopup, setActivePopup] = useState(null);

  function togglePopup(popupName: any) {
    setActivePopup((prevPopup) => (prevPopup === popupName ? null : popupName));
  }

  function handleGoChat(): void {
  }

  useEffect(() => {
    console.log(session, " session isAuth");
    console.log(status, " status");
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
