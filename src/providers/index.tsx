import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "./ToastProvider";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { DynamicBreadcrumbProvider } from "@/navigation";

function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <ToastProvider maxToasts={5}>
                <QueryClientProvider client={queryClient}>
                    <DynamicBreadcrumbProvider>
                        {children}
                    </DynamicBreadcrumbProvider>
                </QueryClientProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default Providers;
