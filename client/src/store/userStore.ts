import { create } from "zustand";
import type { StateCreator } from "zustand";

import { persist } from "zustand/middleware";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logoutUser: () => void;
}

const UserStore: StateCreator<UserStore> = (set) => {
  return {
    user: null,
    setUser: (user: User) => {
      set(function () {
        return { user };
      });
    },
    logoutUser: () => {
      set(function () {
        return { user: null };
      });
    },
  };
};

const useUser = create(persist(UserStore, { name: "TaskY-User" }));

export default useUser;
