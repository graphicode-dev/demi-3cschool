/**
 * useConfirmDialog Hook
 *
 * Global confirmation dialog state management using React Context.
 * Allows triggering confirmation dialogs from anywhere in the app.
 *
 * @example
 * ```tsx
 * // In a component
 * const { confirm } = useConfirmDialog();
 *
 * const handleDelete = async () => {
 *     const confirmed = await confirm({
 *         title: "Delete Item",
 *         message: "Are you sure?",
 *         variant: "danger",
 *     });
 *     if (confirmed) {
 *         // perform delete
 *     }
 * };
 * ```
 */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import { ConfirmDialog, type DialogVariant } from "../components/ConfirmDialog";
import { useToast } from "@/design-system";

interface ConfirmOptions {
    title?: string;
    message: string;
    variant?: DialogVariant;
    confirmText?: string;
    cancelText?: string;
    icon?: ReactNode;
    successMessage?: string;
}

interface ConfirmDialogContextValue {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(
    null
);

interface ConfirmDialogProviderProps {
    children: ReactNode;
}

export function ConfirmDialogProvider({
    children,
}: ConfirmDialogProviderProps) {
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<
        ((value: boolean) => void) | null
    >(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(opts);
            setResolvePromise(() => resolve);
            setIsOpen(true);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        resolvePromise?.(true);
        setResolvePromise(null);
        const successMsg = options?.successMessage;
        if (successMsg) {
            addToast({
                type: "success",
                message: successMsg,
            });
        }
        setOptions(null);
    }, [resolvePromise, addToast, options]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        resolvePromise?.(false);
        setResolvePromise(null);
        setOptions(null);
    }, [resolvePromise]);

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                isOpen={isOpen}
                onClose={handleCancel}
                title={options?.title}
                message={options?.message ?? ""}
                variant={options?.variant ?? "danger"}
                confirmText={options?.confirmText}
                cancelText={options?.cancelText}
                icon={options?.icon}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmDialogContext.Provider>
    );
}

export function useConfirmDialog(): ConfirmDialogContextValue {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error(
            "useConfirmDialog must be used within a ConfirmDialogProvider"
        );
    }
    return context;
}

export type { ConfirmOptions, ConfirmDialogContextValue };
