import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { removeAuth, setAuth, verifyToken } from "../utils/auth";
import { AuthContext } from "./AuthContext";
import { User } from "../types/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );
  const navigate = useNavigate();

  const login = (token: string, user: User) => {
    setIsAuthenticated(true);
    setUser(user);
    setAuth(token, user);
    navigate("/dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    removeAuth();
    navigate("/login");
  };

  const checkAuth = async () => {
    try {
      const response = await verifyToken();
      setIsAuthenticated(response.valid);
      setUser(response.data);
      setAuth(response.token, response.data);
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      setUser(null);
      removeAuth();
    }
  };

  useEffect(() => {
    if (isAuthenticated) checkAuth();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
