import { api } from "@/shared/api";
import { useEffect, useState } from "react";

export function useGetGroupProgress(sessionId: number | null, enabled: boolean) {
    const [data, setData] = useState<unknown>(undefined);

    useEffect(() => {
        if (!enabled || !sessionId) return;

        let cancelled = false;
        api.get(`/groups/progress/session/${sessionId}`)
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
    }, [enabled, sessionId]);

    return { data };
}
