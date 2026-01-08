// src/services/auth.js
import { useUserStore } from "../store/user";
import apiClient from "./axios";

export const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  // Decode token to check expiration
  const { exp } = JSON.parse(atob(token.split(".")[1]));
  return Date.now() < exp * 1000;
};

export const logout = () => {
  localStorage.removeItem("user");
  useUserStore().setUser(null);
};
