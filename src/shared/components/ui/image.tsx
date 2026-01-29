import React, { useState } from "react";

type ImageWithSpinnerProps = {
    src: string;
    fallbackSrc?: string;
    alt: string;
    isLoading?: boolean;
    className?: string;
    rounded?: boolean;
    objectFit?: "cover" | "contain" | "fill" | "none";
} & Omit<React.ComponentProps<"img">, "src" | "alt">;

export default function ImgWithSpinner({
    src,
    fallbackSrc,
    alt,
    isLoading: externalLoading,
    className,
    rounded = false,
    objectFit = "cover",
    ...props
}: ImageWithSpinnerProps) {
    const [internalLoading, setInternalLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const isLoading = externalLoading ?? internalLoading;
    const imageSrc = hasError ? fallbackSrc : src || fallbackSrc;

    return (
        <div
            className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                rounded ? "rounded-full" : "rounded-xl"
            } ${className}`}
            style={{
                width: props.width ? `${props.width}px` : "100%",
                height: props.height ? `${props.height}px` : "100%",
            }}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="relative">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700" />
                        <div className="absolute inset-0 h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-brand-500" />
                    </div>
                </div>
            )}

            {hasError && !fallbackSrc ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <svg
                        className="h-8 w-8 text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            ) : (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={`w-full h-full transition-opacity duration-300 ${
                        isLoading ? "opacity-0" : "opacity-100"
                    } ${rounded ? "rounded-full" : "rounded-xl"}`}
                    style={{
                        objectFit,
                    }}
                    loading="lazy"
                    onLoad={() => setInternalLoading(false)}
                    onError={() => {
                        setInternalLoading(false);
                        setHasError(true);
                    }}
                    {...props}
                />
            )}
        </div>
    );
}
