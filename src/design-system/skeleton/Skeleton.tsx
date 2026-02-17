import React from "react";
import clsx from "clsx";

type SkeletonProps = {
    className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={clsx(
                "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
                className
            )}
        />
    );
};
