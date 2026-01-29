import { persist } from "zustand/middleware";
import { create } from "zustand";
import { API_CONFIG } from "@/shared/api/config/env";
import { AuthState, AuthSteps, User } from "./auth.types";

interface AuthStoreState extends AuthState {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const authStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            authStep: AuthSteps.Login,
            signupEmail: null,
            resetEmail: null,
            error: null,
            isLoading: false,
            _hasHydrated: false,

            setUser: (user: User | null) => {
                set({ user });
            },
            setIsLoading: (isLoading: boolean) => {
                set({ isLoading });
            },
            setError: (error: string | null) => {
                set({ error });
            },
            setAuthStep: (authStep) => {
                set({ authStep });
            },
            setIsAuthenticated: (isAuthenticated: boolean) => {
                set({ isAuthenticated });
            },
            setSignupEmail: (email: string | null) => {
                set({ signupEmail: email });
            },
            setResetEmail: (email: string | null) => {
                set({ resetEmail: email });
            },
            setHasHydrated: (state: boolean) => {
                set({ _hasHydrated: state });
            },
        }),
        {
            name: API_CONFIG.PROJECT_NAME + "-auth",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                console.log("Auth Store Rehydrated - user:", state?.user);
                console.log(
                    "Auth Store Rehydrated - userInformation:",
                    state?.user?.userInformation
                );
                state?.setHasHydrated(true);
            },
        }
    )
);
