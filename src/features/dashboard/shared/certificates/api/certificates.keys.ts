import type { CertificatesListParams } from "../types";

export const certificatesKeys = {
    all: ["certificates"] as const,
    lists: () => [...certificatesKeys.all, "list"] as const,
    list: (params: CertificatesListParams) =>
        [...certificatesKeys.lists(), params] as const,
};
