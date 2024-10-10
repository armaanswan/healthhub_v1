import type { AuthProvider } from "@refinedev/core";
import api from "./lib/api/api";

export const TOKEN_KEY = "refine-auth";
export const USER_ROLE = "user-role";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const result = await api.auth.login({ email, password });
    if (!result.success)
      return {
        success: false,
        error: { name: "Login Error", message: result.error },
      };

    localStorage.setItem(TOKEN_KEY, result.data.user.token);
    localStorage.setItem(USER_ROLE, result.data.user.role);

    return {
      success: true,
      redirectTo: "/",
    };
  },
  register: async (values) => {
    const result = await api.auth.register(values);
    if (!result.success)
      return {
        success: false,
        error: { name: "Register Error", message: result.error },
      };

    // localStorage.setItem(TOKEN_KEY, result.data.user.token);
    // localStorage.setItem(USER_ROLE, result.data.user.role);

    return {
      success: true,
      redirectTo: "/register-patient",
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ROLE);

    const result = await api.auth.logout();
    if (!result.success)
      return {
        success: false,
        error: {
          name: "Logout Error",
          message: result.error,
        },
      };

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getIdentity: async () => {
    const user = await api.auth.getIdentity();
    if (!user.success) return null;
    return user.data;
    // return {
    //   id: user.data.id,
    //   name: `${user.data.firstName} ${user.data.lastName}`,
    //   avatar: `https://api.dicebear.com/9.x/miniavs/png?flip=true&seed=${user.data.firstName}`,
    // };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
