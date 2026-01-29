import { useContext } from "react";
import { ToastContext } from "@/providers/ToastProvider";
import { ToastContextValue } from "../../shared/types";

export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
