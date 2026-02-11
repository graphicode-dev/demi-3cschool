import { useContext } from "react";
import { ToastContext } from "@/providers/ToastProvider";
import { ToastContextValue } from "../../shared/types";

// No-op fallback for HMR transitions when ToastProvider isn't available yet
const noopToastContext: ToastContextValue = {
    toasts: [],
    position: "top-right",
    onClose: () => {},
    spacing: 4,
    addToast: () => "",
    removeToast: () => {},
    removeAllToasts: () => {},
    updateToast: () => {},
    addAlertToast: () => {},
    getButtonHandler: () => undefined,
};

export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        // During HMR, context may temporarily be undefined - return no-op instead of throwing
        if (import.meta.hot) {
            console.warn(
                "[useToast] ToastProvider not found - returning no-op (likely HMR transition)"
            );
            return noopToastContext;
        }
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
