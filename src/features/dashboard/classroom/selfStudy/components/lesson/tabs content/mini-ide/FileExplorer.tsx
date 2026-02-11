import { memo, useState, useCallback } from "react";
import {
    Folder,
    FolderOpen,
    File,
    FileCode,
    FileJson,
    FileText,
    ChevronRight,
    ChevronDown,
    Plus,
    FolderPlus,
    Trash2,
    Edit3,
    Copy,
    Scissors,
    Clipboard,
} from "lucide-react";
import {
    FileNode,
    ContextMenuState,
    ClipboardState,
    generateId,
} from "./types";

interface Translations {
    explorer: string;
    newFile: string;
    newFolder: string;
    copy: string;
    cut: string;
    paste: string;
    rename: string;
    delete: string;
}

interface FileExplorerProps {
    files: FileNode[];
    selectedFileId: string | null;
    onFileSelect: (fileId: string) => void;
    onFilesChange: (files: FileNode[]) => void;
    clipboard: ClipboardState;
    onClipboardChange: (clipboard: ClipboardState) => void;
    translations: Translations;
}

const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
        case "js":
        case "jsx":
        case "ts":
        case "tsx":
            return <FileCode className="size-4 text-yellow-500" />;
        case "html":
        case "htm":
            return <FileCode className="size-4 text-orange-500" />;
        case "css":
        case "scss":
        case "sass":
            return <FileCode className="size-4 text-blue-500" />;
        case "json":
            return <FileJson className="size-4 text-yellow-600" />;
        case "md":
            return <FileText className="size-4 text-gray-500" />;
        case "py":
            return <FileCode className="size-4 text-green-500" />;
        default:
            return <File className="size-4 text-gray-400" />;
    }
};

interface FileTreeItemProps {
    node: FileNode;
    depth: number;
    selectedFileId: string | null;
    onFileSelect: (fileId: string) => void;
    onToggleFolder: (folderId: string) => void;
    onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
    onRename: (nodeId: string, newName: string) => void;
    renamingId: string | null;
    setRenamingId: (id: string | null) => void;
}

const FileTreeItem = memo(function FileTreeItem({
    node,
    depth,
    selectedFileId,
    onFileSelect,
    onToggleFolder,
    onContextMenu,
    onRename,
    renamingId,
    setRenamingId,
}: FileTreeItemProps) {
    const [renameValue, setRenameValue] = useState(node.name);
    const isRenaming = renamingId === node.id;

    const handleClick = useCallback(() => {
        if (node.type === "folder") {
            onToggleFolder(node.id);
        } else {
            onFileSelect(node.id);
        }
    }, [node, onFileSelect, onToggleFolder]);

    const handleRenameSubmit = useCallback(() => {
        if (renameValue.trim() && renameValue !== node.name) {
            onRename(node.id, renameValue.trim());
        }
        setRenamingId(null);
    }, [renameValue, node, onRename, setRenamingId]);

    const handleRenameKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleRenameSubmit();
            } else if (e.key === "Escape") {
                setRenameValue(node.name);
                setRenamingId(null);
            }
        },
        [handleRenameSubmit, node.name, setRenamingId]
    );

    return (
        <>
            <div
                className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors ${
                    selectedFileId === node.id
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-gray-700 dark:text-gray-300"
                }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={handleClick}
                onContextMenu={(e) => onContextMenu(e, node)}
            >
                {node.type === "folder" && (
                    <span className="shrink-0">
                        {node.isOpen ? (
                            <ChevronDown className="size-3.5" />
                        ) : (
                            <ChevronRight className="size-3.5 rtl:rotate-180" />
                        )}
                    </span>
                )}
                <span className="shrink-0">
                    {node.type === "folder" ? (
                        node.isOpen ? (
                            <FolderOpen className="size-4 text-brand-500" />
                        ) : (
                            <Folder className="size-4 text-brand-500" />
                        )
                    ) : (
                        getFileIcon(node.name)
                    )}
                </span>
                {isRenaming ? (
                    <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleRenameKeyDown}
                        className="flex-1 px-1 py-0.5 text-xs bg-white dark:bg-gray-900 border border-brand-500 rounded outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="text-xs font-medium truncate">
                        {node.name}
                    </span>
                )}
            </div>
            {node.type === "folder" && node.isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectedFileId={selectedFileId}
                            onFileSelect={onFileSelect}
                            onToggleFolder={onToggleFolder}
                            onContextMenu={onContextMenu}
                            onRename={onRename}
                            renamingId={renamingId}
                            setRenamingId={setRenamingId}
                        />
                    ))}
                </div>
            )}
        </>
    );
});

export const FileExplorer = memo(function FileExplorer({
    files,
    selectedFileId,
    onFileSelect,
    onFilesChange,
    clipboard,
    onClipboardChange,
    translations,
}: FileExplorerProps) {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        isOpen: false,
        x: 0,
        y: 0,
        targetId: null,
        targetType: null,
    });
    const [renamingId, setRenamingId] = useState<string | null>(null);

    const findNodeById = useCallback(
        (nodes: FileNode[], id: string): FileNode | null => {
            for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children) {
                    const found = findNodeById(node.children, id);
                    if (found) return found;
                }
            }
            return null;
        },
        []
    );

    const updateNodeInTree = useCallback(
        (
            nodes: FileNode[],
            nodeId: string,
            updater: (node: FileNode) => FileNode
        ): FileNode[] => {
            return nodes.map((node) => {
                if (node.id === nodeId) {
                    return updater(node);
                }
                if (node.children) {
                    return {
                        ...node,
                        children: updateNodeInTree(
                            node.children,
                            nodeId,
                            updater
                        ),
                    };
                }
                return node;
            });
        },
        []
    );

    const addNodeToParent = useCallback(
        (
            nodes: FileNode[],
            parentId: string,
            newNode: FileNode
        ): FileNode[] => {
            return nodes.map((node) => {
                if (node.id === parentId && node.type === "folder") {
                    return {
                        ...node,
                        isOpen: true,
                        children: [...(node.children || []), newNode],
                    };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: addNodeToParent(
                            node.children,
                            parentId,
                            newNode
                        ),
                    };
                }
                return node;
            });
        },
        []
    );

    const removeNodeFromTree = useCallback(
        (nodes: FileNode[], nodeId: string): FileNode[] => {
            return nodes
                .filter((node) => node.id !== nodeId)
                .map((node) => {
                    if (node.children) {
                        return {
                            ...node,
                            children: removeNodeFromTree(node.children, nodeId),
                        };
                    }
                    return node;
                });
        },
        []
    );

    const handleToggleFolder = useCallback(
        (folderId: string) => {
            const updated = updateNodeInTree(files, folderId, (node) => ({
                ...node,
                isOpen: !node.isOpen,
            }));
            onFilesChange(updated);
        },
        [files, onFilesChange, updateNodeInTree]
    );

    const handleContextMenu = useCallback(
        (e: React.MouseEvent, node: FileNode) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({
                isOpen: true,
                x: e.clientX,
                y: e.clientY,
                targetId: node.id,
                targetType: node.type,
            });
        },
        []
    );

    const closeContextMenu = useCallback(() => {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const handleNewFile = useCallback(() => {
        const parentId =
            contextMenu.targetType === "folder"
                ? contextMenu.targetId
                : files[0]?.id || null;

        if (!parentId) return;

        const newFile: FileNode = {
            id: generateId(),
            name: "untitled.js",
            type: "file",
            parentId,
            content: "// New file\n",
        };

        const updated = addNodeToParent(files, parentId, newFile);
        onFilesChange(updated);
        setRenamingId(newFile.id);
        closeContextMenu();
    }, [contextMenu, files, addNodeToParent, onFilesChange, closeContextMenu]);

    const handleNewFolder = useCallback(() => {
        const parentId =
            contextMenu.targetType === "folder"
                ? contextMenu.targetId
                : files[0]?.id || null;

        if (!parentId) return;

        const newFolder: FileNode = {
            id: generateId(),
            name: "new-folder",
            type: "folder",
            parentId,
            isOpen: false,
            children: [],
        };

        const updated = addNodeToParent(files, parentId, newFolder);
        onFilesChange(updated);
        setRenamingId(newFolder.id);
        closeContextMenu();
    }, [contextMenu, files, addNodeToParent, onFilesChange, closeContextMenu]);

    const handleRename = useCallback(
        (nodeId: string, newName: string) => {
            const updated = updateNodeInTree(files, nodeId, (node) => ({
                ...node,
                name: newName,
            }));
            onFilesChange(updated);
        },
        [files, onFilesChange, updateNodeInTree]
    );

    const handleDelete = useCallback(() => {
        if (!contextMenu.targetId) return;
        const updated = removeNodeFromTree(files, contextMenu.targetId);
        onFilesChange(updated);
        closeContextMenu();
    }, [
        contextMenu.targetId,
        files,
        removeNodeFromTree,
        onFilesChange,
        closeContextMenu,
    ]);

    const handleCopy = useCallback(() => {
        if (!contextMenu.targetId) return;
        onClipboardChange({ action: "copy", fileId: contextMenu.targetId });
        closeContextMenu();
    }, [contextMenu.targetId, onClipboardChange, closeContextMenu]);

    const handleCut = useCallback(() => {
        if (!contextMenu.targetId) return;
        onClipboardChange({ action: "cut", fileId: contextMenu.targetId });
        closeContextMenu();
    }, [contextMenu.targetId, onClipboardChange, closeContextMenu]);

    const handlePaste = useCallback(() => {
        if (!clipboard.fileId || !contextMenu.targetId) return;

        const sourceNode = findNodeById(files, clipboard.fileId);
        if (!sourceNode) return;

        const targetId =
            contextMenu.targetType === "folder"
                ? contextMenu.targetId
                : files[0]?.id;

        if (!targetId) return;

        const newNode: FileNode = {
            ...sourceNode,
            id: generateId(),
            parentId: targetId,
            name:
                clipboard.action === "copy"
                    ? `${sourceNode.name}`
                    : sourceNode.name,
        };

        let updated = addNodeToParent(files, targetId, newNode);

        if (clipboard.action === "cut") {
            updated = removeNodeFromTree(updated, clipboard.fileId);
            onClipboardChange({ action: null, fileId: null });
        }

        onFilesChange(updated);
        closeContextMenu();
    }, [
        clipboard,
        contextMenu,
        files,
        findNodeById,
        addNodeToParent,
        removeNodeFromTree,
        onFilesChange,
        onClipboardChange,
        closeContextMenu,
    ]);

    const handleStartRename = useCallback(() => {
        if (contextMenu.targetId) {
            setRenamingId(contextMenu.targetId);
        }
        closeContextMenu();
    }, [contextMenu.targetId, closeContextMenu]);

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {translations.explorer}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => {
                            setContextMenu({
                                isOpen: false,
                                x: 0,
                                y: 0,
                                targetId: files[0]?.id || null,
                                targetType: "folder",
                            });
                            handleNewFile();
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={translations.newFile}
                    >
                        <Plus className="size-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setContextMenu({
                                isOpen: false,
                                x: 0,
                                y: 0,
                                targetId: files[0]?.id || null,
                                targetType: "folder",
                            });
                            handleNewFolder();
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={translations.newFolder}
                    >
                        <FolderPlus className="size-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto py-1">
                {files.map((node) => (
                    <FileTreeItem
                        key={node.id}
                        node={node}
                        depth={0}
                        selectedFileId={selectedFileId}
                        onFileSelect={onFileSelect}
                        onToggleFolder={handleToggleFolder}
                        onContextMenu={handleContextMenu}
                        onRename={handleRename}
                        renamingId={renamingId}
                        setRenamingId={setRenamingId}
                    />
                ))}
            </div>

            {/* Context Menu */}
            {contextMenu.isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={closeContextMenu}
                    />
                    <div
                        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button
                            type="button"
                            onClick={handleNewFile}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Plus className="size-3.5" />
                            {translations.newFile}
                        </button>
                        <button
                            type="button"
                            onClick={handleNewFolder}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FolderPlus className="size-3.5" />
                            {translations.newFolder}
                        </button>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Copy className="size-3.5" />
                            {translations.copy}
                        </button>
                        <button
                            type="button"
                            onClick={handleCut}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Scissors className="size-3.5" />
                            {translations.cut}
                        </button>
                        {clipboard.fileId && (
                            <button
                                type="button"
                                onClick={handlePaste}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Clipboard className="size-3.5" />
                                {translations.paste}
                            </button>
                        )}
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <button
                            type="button"
                            onClick={handleStartRename}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Edit3 className="size-3.5" />
                            {translations.rename}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <Trash2 className="size-3.5" />
                            {translations.delete}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
});
