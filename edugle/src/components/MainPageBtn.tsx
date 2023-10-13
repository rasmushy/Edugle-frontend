const MainPageBtn = ({ handleGoChat, togglePopup }: any) => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Edu<span className="text-[#012A4A]">gle</span>
        </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <button
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2A6F97] p-4 text-white hover:bg-white/20"
          onClick={() => togglePopup("Login")}
        >
          <h3 className="text-2xl font-bold">Be ready to chat→</h3>
          <div className="text-lg">
            With Edugle, you can chat with random people from university.
          </div>
        </button>
        <button
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2A6F97] p-4 text-white hover:bg-white/20"
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
  );
};

export default MainPageBtn;
