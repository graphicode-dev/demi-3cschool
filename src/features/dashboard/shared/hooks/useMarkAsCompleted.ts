import { api } from "@/shared/api";
import { useCallback } from "react";

export function useMarkAsCompleted() {
    const mutate = useCallback(
        (
            payload: { lessonContentId: string; groupId?: number },
            options?: { onSuccess?: () => void; onError?: () => void }
        ) => {
            api.post("/content-progress/complete", payload)
                .then(() => options?.onSuccess?.())
                .catch(() => options?.onError?.());
        },
        []
    );

    return { mutate };
}
