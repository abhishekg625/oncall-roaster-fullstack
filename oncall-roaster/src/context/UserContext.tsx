import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/roaster";
import API from "../services/api";

type UserContextType = {
  users: User[];
  fetchUsers: () => Promise<void>;
  toggleAvailability: (userId: string) => void;
  updateUser: (userId: string, data: { name?: string; email?: string; role?: string }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/auth/users");

      const formattedUsers = res.data.map((u: any) => ({
        id: u.userId,
        name: u.name,
        email: u.email,
        role: u.role,
        isAvailableNextWeek: u.isAvailableNextWeek ?? true
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleAvailability = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newValue = !user.isAvailableNextWeek;

    try {
      await API.patch(`/users/${userId}/availability`, {
        isAvailableNextWeek: newValue
      });

      setUsers(prev =>
        prev.map(u =>
          u.id === userId
            ? { ...u, isAvailableNextWeek: newValue }
            : u
        )
      );
    } catch (error) {
      console.error("Failed to update availability", error);
    }
  };

  const updateUser = async (userId: string, data: { name?: string; email?: string; role?: string }) => {
    await API.put(`/users/${userId}`, data);
    await fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    await API.delete(`/users/${userId}`);
    await fetchUsers();
  };

  return (
    <UserContext.Provider value={{ users, fetchUsers, toggleAvailability, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUsers must be used within UserProvider");
  }
  return ctx;
};
