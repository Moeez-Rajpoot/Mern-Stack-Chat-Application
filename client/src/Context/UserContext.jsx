import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || false);
  const [userdata , setUserData] = useState({});

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user'); 
    setUser(false); 
  };

  return (
    <UserContext.Provider value={{ user, setUser , logout , setUserData , userdata }}>
      {children}
    </UserContext.Provider>
  );
};