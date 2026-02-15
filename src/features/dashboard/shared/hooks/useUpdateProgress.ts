import { api } from "@/shared/api";
import { useCallback } from "react";

export function useUpdateProgress(
    lessonVideoId:number
) {
    const mutate = useCallback(
        (
            payload: {
                group_id?: number;
                progress_percentage: number;
                last_position: number;
                watch_time: number;
            },
            options?: { onSuccess?: () => void; onError?: () => void }
        ) => {
            api.post(`/groups/progress/video/${lessonVideoId}`, payload)
                .then(() => options?.onSuccess?.())
                .catch(() => options?.onError?.());
        },
        []
    );

    return { mutate };
}
