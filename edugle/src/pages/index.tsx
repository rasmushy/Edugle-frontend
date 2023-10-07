import Head from "next/head";
import Link from "next/link";
import {ApolloClient, InMemoryCache, gql, ApolloProvider} from "@apollo/client";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useState } from "react";

export default function Home() {
  const [activePopup, setActivePopup] = useState(null);

  function togglePopup(popupName: any) {
    setActivePopup((prevPopup) => (prevPopup === popupName ? null : popupName));
  }

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache()
});

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
            <Login toggle={() => togglePopup("Login")} />
          </div>
        ) : null}

        {activePopup === "SignUp" ? (
          <div className="modal">
            <SignUp toggle={() => togglePopup("SignUp")} />
          </div>
        ) : null}

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Link href="/chat">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Edu<span className="text-[hsl(280,100%,70%)]">gle</span>
            </h1>
          </Link>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              onClick={() => togglePopup("Login")}
            >
              <h3 className="text-2xl font-bold">Be ready to chat→</h3>
              <div className="text-lg">
                With Edugle, you can chat with random people from university.
              </div>
            </button>
            <button
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              onClick={() => togglePopup("SignUp")}
            >
              <h3 className="text-2xl font-bold">Sign up→</h3>
              <div className="text-lg">
                Sign up now for absolutely free and start chatting with random
                people from university.
              </div>
            </button>
          </div>
        </div>
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
