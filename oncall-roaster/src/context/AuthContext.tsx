import { createContext, useContext, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import API from "../services/api";


export type User = {
    userId: string;
    name: string;
    email: string;
    role: "admin" | "user";
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (userId: string, password: string) => Promise<void>;
    register: (userId: string, name: string, email: string, password: string, role: "admin" | "user") => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (userId: string, password: string) => {
  const res = await API.post("/auth/login", { userId, password });

  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  setUser(user);
};

    const register = async (userId: string, name: string, email: string, password: string, role: "admin" | "user") => {
        const res = await API.post("/auth/register", { userId, name, email, password, role });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };


    const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};
