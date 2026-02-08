import { api } from "@/shared/api";
import { useEffect, useState } from "react";

export function useGetGroupProgress(groupId: string | null, enabled: boolean) {
    const [data, setData] = useState<unknown>(undefined);

    useEffect(() => {
        if (!enabled || !groupId) return;

        let cancelled = false;
        api.get("/content-progress", { params: { groupId } })
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
    }, [enabled, groupId]);

    return { data };
}
