import { getApi } from "@/lib/api";
import { getAuthUrl } from "@/lib/env";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AdminLogin } from "./types";

// Custom types for theme
interface State {
  isAuthenticated: boolean;
  loading: boolean;
  error: null | any;
  user: null | any;
  token: null | string;
  baseURLs: {
    identityBaseUrl: string;
  };
}

interface Actions {
  setBaseURLs: (baseURLs: { cisBaseUrl: string; api2: string }) => void;
  login: (data: AdminLogin) => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  logout: () => void;
}

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      loading: false,
      error: null,
      user: null,
      token: null,
      baseURLs: {
        identityBaseUrl: getAuthUrl() || "",
      },

      setBaseURLs: () => {
        set({
          baseURLs: {
            identityBaseUrl: getAuthUrl() || "",
          },
        });
      },
      login: async (data: AdminLogin) => {
        const { identityBaseUrl } = useAuthStore.getState().baseURLs;
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
          axios
            .post(`${identityBaseUrl}/api/v1/admins/login`, data)
            .then((response) => {
              set({
                token: response.data.accessToken,
                isAuthenticated: true,
                user: response.data.user,
                loading: false,
              });
              return resolve(response);
            })
            .catch((error: AxiosError) => {
              set({ loading: false, error });
              return reject(error);
            });
        });
      },
      resetPassword: async (data) => {
        set({ loading: true, error: null });
        return new Promise(async (resolve, reject) => {
          try {
            const res = await getApi("auth").patch(
              `api/v1/admins/change-password`,
              data
            );
            set({ loading: false });
            return resolve(res);
          } catch (error: any) {
            set({ loading: false, error });
            return reject(error);
          }
        });
      },
      logout: () => {
        set({ token: null, isAuthenticated: false, user: null });
      },
    }),
    {
      name: "my-app:auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
