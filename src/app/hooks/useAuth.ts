import { useEffect, useState } from "react";
import { useCookie } from "../utils/useCookie";
import { useSessionStorage } from "../utils/useSessionStorage";
import { useLocalStorage } from "../utils/useLocalStorage";
import { UserService } from "../services/userService";

interface Auth {
  isAuthenticated: boolean;
  token: string | null;
  user: any;
}

export const useAuth = (): {
  auth: Auth;
  Login: (email: string, password: string) => Promise<Auth | undefined>;
  getUser: (id: string) => Promise<any | null>;
  Logout: () => Promise<any | null>;
} => {
  const { setCookie, getCookie } = useCookie();
  const { saveSession, getSession } = useSessionStorage();
  const { saveLocal } = useLocalStorage();
  const userService = new UserService();

  const [auth, setAuth] = useState<Auth>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    const storedToken = getCookie("token");
    const session = getSession("auth");

    if (session && session.token) {
      setAuth({
        isAuthenticated: true,
        token: session.token,
        user: session.user,
      });
    } else if (storedToken) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        token: storedToken,
        isAuthenticated: true,
      }));
    }
  }, []);

  const Login = async (
    email: string,
    password: string
  ): Promise<Auth | undefined> => {
    try {
      const credentials = { email, password };
      const result: any = await userService.login(credentials);

      console.log("Login result:", result);

      if (result && result.token && result.user) {
        const newAuth: Auth = {
          isAuthenticated: true,
          token: result.token,
          user: result.user,
        };
        setAuth(newAuth);
        setCookie("token", result.token);
        saveSession("auth", newAuth);
        saveLocal("auth", newAuth);

        return newAuth;
      } else {
        console.error("Invalid credentials");
        setAuth({ isAuthenticated: false, token: null, user: null });
        setCookie("token", "");
        return undefined;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuth({ isAuthenticated: false, token: null, user: null });
      setCookie("token", "");
      return undefined;
    }
  };

  const Logout = async () => {
    try {
      const result: any = await userService.logout();
      console.log(result);
      if (result) {
        setAuth({ isAuthenticated: false, token: null, user: null });
        setCookie("token", "");
        saveSession("auth", {
          isAuthenticated: false,
          token: null,
          user: null,
        });
        saveLocal("auth", { isAuthenticated: false, token: null, user: null });

        return result;
      }
    } catch (error) {
      console.error("Logout failed:", error);
      return null;
    }
  };

  const getUser = async (id: string) => {
    try {
      const result = await userService
        .select(["id", "firstname", "email"])
        .get(id);
      return result;
    } catch (error) {
      console.error("Get user failed:", error);
      return null;
    }
  };

  return {
    auth,
    Login,
    getUser,
    Logout,
  };
};
