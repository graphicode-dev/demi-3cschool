/**
 * File utility functions for downloading and handling files
 */

import { AttachmentFile } from "@/shared/types";

/**
 * Downloads a single file from a URL
 * Uses fetch to get the blob and creates a temporary anchor element
 */
export async function downloadFile(file: AttachmentFile): Promise<void> {
    try {
        const response = await fetch(file.fileUrl || file.url);
        if (!response.ok) {
            throw new Error(`Failed to download: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = file.fileName || file.name;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(`Error downloading file ${file.fileName}:`, error);
        throw error;
    }
}

/**
 * Downloads multiple files sequentially with a small delay between each
 * to prevent browser blocking
 */
export async function downloadFiles(
    files: AttachmentFile[],
    delayMs: number = 300
): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const file of files) {
        try {
            await downloadFile(file);
            success++;
            // Add delay between downloads to prevent browser blocking
            if (files.indexOf(file) < files.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        } catch {
            failed++;
        }
    }

    return { success, failed };
}

/**
 * Formats file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "";
}

/**
 * Gets icon type based on file type/extension
 */
export function getFileIconType(
    fileType: string
): "pdf" | "image" | "document" | "other" {
    if (fileType.includes("pdf")) return "pdf";
    if (fileType.includes("image")) return "image";
    if (
        fileType.includes("word") ||
        fileType.includes("document") ||
        fileType.includes("text")
    )
        return "document";
    return "other";
}
