import api from "../api/axiosInstance";
import React, { createContext, useContext, useEffect, useState } from "react";
import { use } from "react";


const userContext = createContext();

const Authprovider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading,setLoading]=useState(false)
  

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/auth/verify");
          console.log(response)

          if (response.data.success) {
            setUser(response.data.User);
          }
        } else {
          setUser(null)
          setLoading(false)
        } 
      } catch (error) {
        console.log(error)
        if (error.response && !error.response.data.error) {
          setUser(null)
        }
      } finally{
        setLoading(false)
      }
    };
    verifyUser();
  }, []);

  const login = (user) => {
    setUser(user);
    localStorage.setItem("token", user.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);

export default Authprovider;