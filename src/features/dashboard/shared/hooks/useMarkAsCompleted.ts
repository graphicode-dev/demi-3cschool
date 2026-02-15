import { api } from "@/shared/api";
import { useCallback } from "react";

export function useMarkAsCompleted() {
    const mutate = useCallback(
        (
            payload: { lessonVideoId: string; group_id?: number },
            options?: { onSuccess?: () => void; onError?: () => void }
        ) => {
            api.post(`/groups/progress/video/${payload.lessonVideoId}/complete`, payload.group_id)
                .then(() => options?.onSuccess?.())
                .catch(() => options?.onError?.());
        },
        []
    );

    return { mutate };
}
