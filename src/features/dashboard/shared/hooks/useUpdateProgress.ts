import { api } from "@/shared/api";
import { useCallback } from "react";

export function useUpdateProgress() {
    const mutate = useCallback(
        (
            payload: {
                lessonContentId: number;
                groupId?: number;
                progressPercentage: number;
                lastPosition: number;
                watchTime: number;
            },
            options?: { onSuccess?: () => void; onError?: () => void }
        ) => {
            api.post("/content-progress", payload)
                .then(() => options?.onSuccess?.())
                .catch(() => options?.onError?.());
        },
        []
    );

    return { mutate };
}
