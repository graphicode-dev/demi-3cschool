// src/components/FileInput/index.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileInputProps } from "./types";
import { cn } from "../../utils/cn";
import { Upload, X, File } from "lucide-react";

export const FileInput = ({
    value,
    onChange,
    accept,
    multiple = false,
    maxSize,
    disabled = false,
    className,
}: FileInputProps) => {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        setError(null);

        if (maxSize && file.size > maxSize) {
            setError(
                t("pages.common.form.fileSizeExceeds", {
                    size: (maxSize / 1024 / 1024).toFixed(2),
                }) ||
                    `File size exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB`
            );
            return false;
        }

        if (accept) {
            const acceptedTypes = accept.split(",").map((type) => type.trim());
            const fileType = file.type;
            const fileExtension =
                "." + file.name.split(".").pop()?.toLowerCase();

            const isAccepted = acceptedTypes.some((type) => {
                // Handle wildcard patterns like "image/*", "video/*", etc.
                if (type.endsWith("/*")) {
                    const category = type.slice(0, -2); // e.g., "image" from "image/*"
                    return fileType.startsWith(category + "/");
                }
                // Handle exact MIME type match
                if (type === fileType) return true;
                // Handle file extension match
                if (type === fileExtension) return true;
                // Handle wildcard all
                if (type === "*") return true;
                return false;
            });

            if (!isAccepted) {
                setError(
                    t("pages.common.form.fileTypeNotAccepted", {
                        types: accept,
                    }) || `File type not accepted. Allowed: ${accept}`
                );
                return false;
            }
        }

        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (multiple) {
            const validFiles = Array.from(files).filter(validateFile);
            onChange(validFiles.length > 0 ? validFiles : null);
        } else {
            const file = files[0];
            if (validateFile(file)) {
                onChange(file);
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        if (multiple) {
            const validFiles = Array.from(files).filter(validateFile);
            onChange(validFiles.length > 0 ? validFiles : null);
        } else {
            const file = files[0];
            if (validateFile(file)) {
                onChange(file);
            }
        }
    };

    const handleRemove = (index?: number) => {
        if (multiple && Array.isArray(value) && index !== undefined) {
            const newFiles = value.filter((_, i) => i !== index);
            onChange(newFiles.length > 0 ? newFiles : null);
        } else {
            onChange(null);
        }
    };

    const files = value ? (Array.isArray(value) ? value : [value]) : [];

    return (
        <div className={cn("w-full")}>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    "relative rounded-lg border-2 border-dashed transition-all duration-200",
                    "flex flex-col items-center justify-center p-6",
                    dragActive
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                        : "border-gray-300 dark:border-gray-700",
                    !disabled &&
                        "hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className={cn(
                        "flex flex-col items-center cursor-pointer",
                        disabled && "cursor-not-allowed"
                    )}
                >
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-semibold text-brand-600 dark:text-brand-400">
                            {t("pages.common.form.clickToUpload")}
                        </span>{" "}
                        {t("pages.common.form.orDragAndDrop")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {accept
                            ? t("pages.common.form.accepted", "Accepted") +
                              ": " +
                              accept
                            : t(
                                  "pages.common.form.anyFileType",
                                  "Any file type"
                              )}
                        {maxSize &&
                            " (" +
                                t("pages.common.form.maxSize", "Max") +
                                ": " +
                                (maxSize / 1024 / 1024).toFixed(2) +
                                "MB)"}
                    </p>
                </label>
            </div>

            {error && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                    {error}
                </p>
            )}

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <File className="w-5 h-5 text-gray-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                disabled={disabled}
                                className={cn(
                                    "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                                    disabled && "cursor-not-allowed opacity-50"
                                )}
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
