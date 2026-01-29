import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "./ToastProvider";
import { ThemeProvider } from "@/shared/context/ThemeContext";

function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <ToastProvider maxToasts={5}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default Providers;
