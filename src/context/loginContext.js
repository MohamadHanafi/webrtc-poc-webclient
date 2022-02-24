import React, { createContext, useState } from "react";

const LoginContext = createContext();

const LoginContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginContextProvider };
