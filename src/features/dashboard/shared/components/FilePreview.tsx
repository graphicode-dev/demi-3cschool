import { TFunction } from "i18next";
import { Eye, X } from "lucide-react";
import { useState } from "react";
import JSZip from "jszip";

type FilePreviewProps<T extends string> = {
    t: TFunction<T>;
    file: any;
    selectedFile: File | null;
    showPreviewModal: boolean;
    setShowPreviewModal: (show: boolean) => void;
};

export const FilePreview = <T extends string>({
    t,
    file,
    selectedFile,
    showPreviewModal,
    setShowPreviewModal,
}: FilePreviewProps<T>) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pptSlides, setPptSlides] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getFileExtension = (filename: string) =>
        filename.split(".").pop()?.toLowerCase() || "";

    const filename = selectedFile?.name || file?.fileName || "";
    const extension = getFileExtension(filename);

    const handlePreviewFile = async () => {
        setIsLoading(true);

        try {
            let url = "";

            if (selectedFile) {
                url = URL.createObjectURL(selectedFile);
                setPreviewUrl(url);
            } else if (file?.url) {
                url = file.url;
                setPreviewUrl(url);
            }

            // PPTX handling
            if (extension === "pptx") {
                const response = await fetch(url);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();

                const zip = await JSZip.loadAsync(arrayBuffer);

                const slideFiles = Object.keys(zip.files)
                    .filter(
                        (name) =>
                            name.startsWith("ppt/slides/slide") &&
                            name.endsWith(".xml")
                    )
                    .sort();

                const slides: string[] = [];

                for (const slideFile of slideFiles) {
                    const content = await zip.files[slideFile].async("text");

                    const matches = content.match(/<a:t>(.*?)<\/a:t>/g) || [];

                    const slideText = matches
                        .map((m) =>
                            m.replace("<a:t>", "").replace("</a:t>", "")
                        )
                        .join(" ");

                    slides.push(slideText || "Slide contains no text");
                }

                setPptSlides(slides);
            }

            setShowPreviewModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setPptSlides([]);
    };

    const renderPreview = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-[70vh]">
                    Loading...
                </div>
            );
        }

        if (!previewUrl) return null;

        // Images
        if (
            ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(
                extension
            )
        ) {
            return (
                <img
                    src={previewUrl}
                    className="max-w-full mx-auto"
                    draggable={false}
                />
            );
        }

        // PDF
        if (extension === "pdf") {
            return (
                <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-[85vh] border-0 select-none"
                    title="PDF Preview"
                    onContextMenu={(e) => e.preventDefault()}
                />
            );
        }

        // PPTX (Rendered as Slides)
        if (extension === "pptx") {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
                    className="w-full h-[75vh] border-0"
                />
            );
        }

        return (
            <div className="flex items-center justify-center h-[70vh]">
                Cannot preview this file type
            </div>
        );
    };

    const canPreview = [
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "bmp",
        "pptx",
    ].includes(extension);

    return (
        <>
            {canPreview && (
                <button
                    onClick={handlePreviewFile}
                    className="mt-2 flex items-center gap-1 text-xs text-brand-500"
                >
                    <Eye className="w-3 h-3" />
                    Preview file
                </button>
            )}

            {showPreviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-semibold">File Preview</h3>
                            <button onClick={closePreviewModal}>
                                <X />
                            </button>
                        </div>
                        {/* <div
                            className="overflow-auto max-h-[85vh]"
                            onContextMenu={(e) => e.preventDefault()}
                            onKeyDown={(e) => {
                                if (
                                    (e.ctrlKey && e.key === "s") ||
                                    (e.ctrlKey && e.key === "p") ||
                                    (e.ctrlKey && e.key === "u")
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            tabIndex={0}
                        > */}
                        {renderPreview()}
                        {/* </div> */}
                    </div>
                </div>
            )}
        </>
    );
};
