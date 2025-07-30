import type { User } from "../../types";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const getUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = "/login";
};

export const getUserInitials = (user: User | null) => {
  if (!user) return "";
  const firstInitial = user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "";
  const lastInitial = user.lastName
    ? user.lastName.charAt(0).toUpperCase()
    : "";
  return firstInitial + lastInitial;
};
