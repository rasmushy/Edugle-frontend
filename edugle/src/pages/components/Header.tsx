type HeaderProps = {
  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onLogout,
  onProfile,
  onSettings,
  toggleSidebar,
}) => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <h1 className="text-2xl font-bold text-white">Edugle</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={onProfile}
          className="rounded bg-[hsl(280,100%,70%)] p-2 text-white"
        >
          Profile
        </button>
        <button
          onClick={onSettings}
          className="rounded bg-[hsl(280,100%,70%)] p-2 text-white"
        >
          Settings
        </button>
        <button
          onClick={onLogout}
          className="rounded bg-[hsl(280,100%,70%)] p-2 text-white"
        >
          Logout
        </button>
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="block p-4 lg:hidden">
            🍔
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
