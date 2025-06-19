import { createContext, useEffect, useState } from "react";
import { logout } from "../Services/Auth/Logout";
import { callbackSocialLogin } from "../Services/Auth/CallbackSocialLogin";
import { callProtectedRouteApi } from "../Services/Auth/Protected";;
import { UserProfile } from "../Types/User";
import { decodeToken } from "../Helpers/DecodeJWt";
import React from "react";
import axios from "axios";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  error: string | null;
  callbackSocialLoginUser: (code: string, provider: string) => void;
  callProtectedRoute: () => any;
  logoutUser: () => void;
  isLoggedIn: () => boolean;
  setError: (error: string | null) => void;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("UserProvider useEffect called");
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      console.log("User and token found in localStorage");
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setIsReady(true);
  }, []);


  const callbackSocialLoginUser = async (code: string, provider: string) => {
    const res = await callbackSocialLogin(code, provider);
    console.log("callbackSocialLoginUser response:", res.status);
    if (res?.status == 200) {
      const decodedToken = decodeToken(res?.data.idToken!);
      if (!decodedToken?.email) {
        throw new Error("Decoded token does not contain a valid email.");
      }
      const userObj = {
        userName: decodedToken.email,
        email: decodedToken.email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("token", res?.data.idToken);
      setToken(res?.data.idToken!);
      setUser(userObj!);
      return true
    }
    return false;
  };

  const callProtectedRoute = async () => {
    const res = await callProtectedRouteApi();
    if (res?.status == 200) {
      console.log("Protected route accessed successfully");
      return res;
    } else if (res?.status == 401) {
      console.error("Unauthorized access to protected route");
    } else {
      console.error("Unexpected response from protected route:", res);
    }
  };

  const logoutUser = async () => {
    await logout();
  };

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <UserContext.Provider
      value={{
        callbackSocialLoginUser,
        callProtectedRoute,
        user,
        token,
        logoutUser,
        isLoggedIn,
        error,
        setError,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
