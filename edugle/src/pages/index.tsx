import Head from "next/head";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MainPageBtn from "~/components/MainPageBtn";
import { getServerAuthSession } from "../server/auth";

export default function Home({session: initialSession}: {session: any}) {
const { data: session = initialSession, status } = useSession();
  const [activePopup, setActivePopup] = useState(null);

  function togglePopup(popupName: any) {
    setActivePopup((prevPopup) => (prevPopup === popupName ? null : popupName));
  }

/* useEffect(() => {
    console.log(status, " status");
    if (session) {
        // handle authenticated state, maybe close the Login or SignUp popup if they're open.
        console.log(session, " session isAuth");
        setActivePopup(null);
    } else {
        // handle unauthenticated state, maybe open the Login popup.
    }
}, [session]); */

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

export const getServerSideProps = async (context: any) => {
    const session = await getServerAuthSession(context);

    return {
        props: { session }
    }
}