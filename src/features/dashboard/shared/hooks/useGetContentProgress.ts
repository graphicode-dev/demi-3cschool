import { api } from "@/shared/api";
import { useEffect, useState } from "react";

export function useGetContentProgress(
    sessionId: string,
    groupId: string | null,
    enabled: boolean
) {
    const [data, setData] = useState<unknown>(undefined);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        api.get(`/groups/progress/session/${sessionId}`, {
            params: groupId ? { groupId } : undefined,
        })
            .then((res) => {
                if (cancelled) return;
                setData((res as any)?.data ?? res);
            })
            .catch(() => {
                if (cancelled) return;
                setData(undefined);
            });

        return () => {
            cancelled = true;
        };
    }, [enabled, groupId, sessionId]);

    return { data };
}