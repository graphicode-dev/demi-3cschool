import { memo, useCallback } from "react";
import { X, FileCode, FileJson, FileText, File } from "lucide-react";
import { OpenTab } from "./types";

interface EditorTabsProps {
    tabs: OpenTab[];
    activeTabId: string | null;
    onTabSelect: (fileId: string) => void;
    onTabClose: (fileId: string) => void;
}

const getTabIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
        case "js":
        case "jsx":
        case "ts":
        case "tsx":
        case "html":
        case "css":
        case "py":
            return <FileCode className="size-3.5" />;
        case "json":
            return <FileJson className="size-3.5" />;
        case "md":
        case "txt":
            return <FileText className="size-3.5" />;
        default:
            return <File className="size-3.5" />;
    }
};

export const EditorTabs = memo(function EditorTabs({
    tabs,
    activeTabId,
    onTabSelect,
    onTabClose,
}: EditorTabsProps) {
    const handleClose = useCallback(
        (e: React.MouseEvent, fileId: string) => {
            e.stopPropagation();
            onTabClose(fileId);
        },
        [onTabClose]
    );

    if (tabs.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
                <div
                    key={tab.fileId}
                    onClick={() => onTabSelect(tab.fileId)}
                    className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer border-r border-gray-200 dark:border-gray-700 min-w-0 shrink-0 ${
                        activeTabId === tab.fileId
                            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850"
                    }`}
                >
                    <span className="shrink-0 text-gray-500 dark:text-gray-400">
                        {getTabIcon(tab.name)}
                    </span>
                    <span className="text-xs font-medium truncate max-w-[100px]">
                        {tab.name}
                    </span>
                    {tab.isDirty && (
                        <span className="size-2 rounded-full bg-brand-500 shrink-0" />
                    )}
                    <button
                        type="button"
                        onClick={(e) => handleClose(e, tab.fileId)}
                        className="shrink-0 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="size-3 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            ))}
        </div>
    );
});
