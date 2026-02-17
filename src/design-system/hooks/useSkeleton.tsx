// useSkeleton.tsx

import React from "react";
import { SkeletonType } from "../skeleton/types";
import { SkeletonRegistry } from "../skeleton/SkeletonRegistry";
import { useLoadingScope } from "../skeleton/LoadingScopeContext";

export function withSkeleton<P extends object>(
    type: SkeletonType,
    Component: React.ComponentType<P>
) {
    const Wrapped = (props: P) => {
        const { isLoading } = useLoadingScope();
        if (isLoading) {
            const Skeleton = SkeletonRegistry[type];
            return Skeleton ? <Skeleton /> : null;
        }
        return <Component {...props} />;
    };
    Wrapped.displayName = `withSkeleton(${Component.displayName || Component.name || "Component"})`;
    Wrapped.skeletonType = type;
    return Wrapped;
}

export function SkeletonList<T>({
    data,
    type,
    count = 3,
    renderItem,
    className,
}: {
    data: T[];
    type: SkeletonType;
    count?: number;
    renderItem: (item: T) => React.ReactNode;
    className?: string;
}) {
    const { isLoading } = useLoadingScope();

    if (isLoading) {
        const Skeleton = SkeletonRegistry[type];
        if (!Skeleton) return null;
        return (
            <div className={className}>
                {Array.from({ length: count }).map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </div>
        );
    }

    return <div className={className}>{data.map(renderItem)}</div>;
}
