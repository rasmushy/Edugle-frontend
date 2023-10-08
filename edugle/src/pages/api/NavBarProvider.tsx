import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavBarContextType {
  isNavBarOpen: boolean;
  openNavBar: () => void;
  closeNavBar: () => void;
}

const NavBarContext = createContext<NavBarContextType | undefined>(undefined);

interface NavBarProviderProps {
  children: ReactNode;
}

export const NavBarProvider: React.FC<NavBarProviderProps> = ({ children }) => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const openNavBar = () => {
    setIsNavBarOpen(true);
  };

  const closeNavBar = () => {
    setIsNavBarOpen(false);
  };

  return (
    <NavBarContext.Provider value={{ isNavBarOpen, openNavBar, closeNavBar }}>
      {children}
    </NavBarContext.Provider>
  );
};

export const useNavBar = (): NavBarContextType => {
  const context = useContext(NavBarContext);
  if (context === undefined) {
    throw new Error("useNavBar must be used within a NavBarProvider");
  }
  return context;
};
