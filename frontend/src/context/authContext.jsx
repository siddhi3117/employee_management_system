import axios from "axios";
import { set } from "mongoose";
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
          const response = await axios.get("http://localhost:5000/api/auth/verify", 
            {
            headers: {
             Authorization: `Bearer ${token}`

            
            },
          }
          );
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