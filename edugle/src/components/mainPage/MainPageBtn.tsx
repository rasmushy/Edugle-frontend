import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MainPageBtn = ({ handleGoChat, togglePopup, session: initialSession }: any) => {
  const { data: session = initialSession, status } = useSession();
  const router = useRouter();

  const handleGoChatBtn = () => {
    if (session?.user) {
      router.replace("/chat");
    } else {
      togglePopup("Login");
    }
  }

  const handleGoChatRouletteBtn = () => {
    if (session?.user) {
      router.replace("/chatRoulette");
    } else {
      togglePopup("Login");
    }
  }


  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <div style={{ pointerEvents: "none" }}>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Edu<span className="text-[#012A4A]">gle</span>
        </h1>
      </div>

      {session?.user ? (
        <>
          {" "}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2A6F97] p-4 text-white hover:bg-white/20" onClick={() => handleGoChatBtn()}>
              <h3 className="text-2xl font-bold">Start chatting!</h3>
              <div className="text-lg">Start chatting in a big room full people!</div>
            </button>
            <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2A6F97] p-4 text-white hover:bg-white/20" onClick={() => handleGoChatRouletteBtn()}>
              <h3 className="text-2xl font-bold">Feeling lucky?</h3>
              <div className="text-lg">Discover the thrill of chance with Chat Roulette!</div>
            </button>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2A6F97] p-4 text-white hover:bg-white/20" onClick={() => togglePopup("Login")}>
              <h3 className="text-2xl font-bold">Login→</h3>
              <div className="text-lg">Already signed? Login now and start chatting!</div>
            </button>
            <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2A6F97] p-4 text-white hover:bg-white/20" onClick={() => togglePopup("SignUp")}>
              <h3 className="text-2xl font-bold">Sign up→</h3>
              <div className="text-lg">Sign up now for absolutely free and start chatting with random people from university.</div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPageBtn;
