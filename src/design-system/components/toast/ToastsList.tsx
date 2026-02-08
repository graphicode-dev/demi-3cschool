import { ToastItem } from "./ToastItem";
import AlertToast from "./AlertToast";
import { ToastPosition } from "@/shared/types";
import { useToast } from "@/design-system";

// Position class mapping
const positionClasses: Record<ToastPosition, string> = {
    "top-right":
        "fixed top-5 right-5 flex flex-col gap-3 z-9999 max-w-sm w-full",
    "top-left": "fixed top-5 left-5 flex flex-col gap-3 z-9999 max-w-sm w-full",
    "bottom-right":
        "fixed bottom-5 right-5 flex flex-col gap-3 z-9999 max-w-sm w-full",
    "bottom-left":
        "fixed bottom-5 left-5 flex flex-col gap-3 z-9999 max-w-sm w-full",
    "top-center":
        "fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-9999 max-w-sm w-full",
    "bottom-center":
        "fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-9999 max-w-sm w-full",
    center: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 z-9999 max-w-sm w-full",
};

const ToastsList = () => {
    const { toasts, position, spacing, removeToast } = useToast();

    // Group toasts by position
    const toastsByPosition: Record<ToastPosition, typeof toasts> = {
        "top-right": [],
        "top-left": [],
        "bottom-right": [],
        "bottom-left": [],
        "top-center": [],
        "bottom-center": [],
        center: [],
    };

    // Sort toasts into position groups
    toasts.forEach((toast: any) => {
        const toastPosition = toast.position || position;
        if (toastPosition) {
            (
                toastsByPosition[
                    toastPosition as keyof typeof toastsByPosition
                ] as any[]
            ).push(toast);
        }
    });

    return (
        <>
            {Object.entries(toastsByPosition).map(([pos, positionToasts]) => {
                if (positionToasts.length === 0) return null;

                return (
                    <div
                        key={pos}
                        className={positionClasses[pos as ToastPosition]}
                        style={{ gap: `${spacing * 0.25}rem` }}
                    >
                        {positionToasts.map((toast: any) => {
                            // Handle alert toasts with buttons separately
                            if (
                                toast.type === "alert" &&
                                toast.buttons &&
                                toast.buttons.length > 0
                            ) {
                                return (
                                    <div key={toast.id}>
                                        <AlertToast
                                            id={toast.id || ""}
                                            title={toast.title || ""}
                                            message={toast.message || ""}
                                            onClose={() => {
                                                if (toast.id) {
                                                    removeToast(toast.id);
                                                    toast.onCloseToast?.();
                                                }
                                            }}
                                            buttons={toast.buttons}
                                        />
                                    </div>
                                );
                            }

                            // Regular toasts
                            return (
                                <div
                                    key={toast.id}
                                    className="pointer-events-auto w-full"
                                >
                                    <ToastItem
                                        id={toast.id}
                                        type={toast.type}
                                        title={toast.title}
                                        message={toast.message}
                                        duration={toast.duration}
                                        position={toast.position}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
};
export default ToastsList;
