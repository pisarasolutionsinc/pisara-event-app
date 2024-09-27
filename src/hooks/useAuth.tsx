import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { useCookie } from "../utils/useCookie";
import { useSessionStorage } from "../utils/useSessionStorage";
import { useLocalStorage } from "../utils/useLocalStorage";
interface Auth {
  isAuthenticated: boolean;
  token: string | null;
  user: any; // Adjust `user` type based on your user model
}

export const useAuth = (): {
  auth: Auth;
  Login: (email: string, password: string) => Promise<void>;
} => {
  const { setCookie, getCookie } = useCookie();
  const { saveSession, getSession } = useSessionStorage();
  const { saveLocal, getLocal } = useLocalStorage();

  // Initialize auth state with default values
  const [auth, setAuth] = useState<Auth>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    // Retrieve token and session on component mount
    const storedToken = getCookie("token");
    const session = getSession("auth");
    const local = getLocal("auth");

    if (session && session.token) {
      // Set auth state based on session storage
      const data: Auth = {
        isAuthenticated: true,
        token: session.token ? session.token : local.token,
        user: session.user ? session.user : local.user,
      };
      setAuth(data);
    } else if (storedToken) {
      // Update auth state if token is available from cookies
      setAuth((prevAuth) => ({
        ...prevAuth,
        token: storedToken,
        isAuthenticated: true,
      }));
    }
  }, []);

  const Login = async (email: string, password: string) => {
    try {
      const result = await userService.LOGIN({ email, password });

      if (result && result.user && result.token) {
        // Update auth state with user and token information
        const newAuth = {
          isAuthenticated: true,
          token: result.token,
          user: result.user,
        };
        setAuth(newAuth);

        // Persist auth data in cookie and session storage
        setCookie("token", result.token);
        saveSession("auth", newAuth);
        saveLocal("auth", newAuth);

        return newAuth as any;
      } else {
        console.error("Invalid credentials");
        setAuth({ isAuthenticated: false, token: null, user: null });
        setCookie("token", "");
        return null;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  return {
    auth,
    Login,
  };
};
