import { useState, useCallback, memo, useRef, useEffect } from "react";
import Editor, { OnChange, loader } from "@monaco-editor/react";
import { TFunction } from "i18next";
import {
    Play,
    Sun,
    Moon,
    Download,
    FolderDown,
    Terminal,
    RefreshCw,
    Maximize2,
    Minimize2,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
    PanelBottomClose,
    PanelBottomOpen,
    Trash2,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { FileExplorer } from "./FileExplorer";
import { EditorTabs } from "./EditorTabs";
import {
    FileNode,
    OpenTab,
    ClipboardState,
    DEFAULT_FILES,
    getLanguageFromFileName,
} from "./types";

interface MiniIDEProps {
    t: TFunction<"selfStudy", undefined>;
}

loader.config({
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
    },
});

export const MiniIDE = memo(function MiniIDE({ t }: MiniIDEProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState<FileNode[]>(DEFAULT_FILES);
    const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);
    const [clipboard, setClipboard] = useState<ClipboardState>({
        action: null,
        fileId: null,
    });
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<string>("");
    const [showPreview, setShowPreview] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string>("");
    const [showFileExplorer, setShowFileExplorer] = useState(true);
    const [showConsole, setShowConsole] = useState(true);
    const [consoleHeight, setConsoleHeight] = useState(120);

    // Listen for console messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "console") {
                const { method, args } = event.data;
                const message = args.join(" ");
                const prefix =
                    method === "error"
                        ? "Error: "
                        : method === "warn"
                          ? "Warning: "
                          : "";
                setOutput((prev) => {
                    const newLine = prefix + message;
                    return prev ? prev + "\n" + newLine : newLine;
                });
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const findFileById = useCallback(
        (nodes: FileNode[], id: string): FileNode | null => {
            for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children) {
                    const found = findFileById(node.children, id);
                    if (found) return found;
                }
            }
            return null;
        },
        []
    );

    const updateFileContent = useCallback(
        (nodes: FileNode[], fileId: string, content: string): FileNode[] => {
            return nodes.map((node) => {
                if (node.id === fileId) {
                    return { ...node, content };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: updateFileContent(
                            node.children,
                            fileId,
                            content
                        ),
                    };
                }
                return node;
            });
        },
        []
    );

    const activeTab = openTabs.find((tab) => tab.fileId === activeTabId);
    const activeFile = activeTabId ? findFileById(files, activeTabId) : null;
    const currentLanguage = activeFile
        ? getLanguageFromFileName(activeFile.name)
        : "plaintext";

    const handleFileSelect = useCallback(
        (fileId: string) => {
            const file = findFileById(files, fileId);
            if (!file || file.type === "folder") return;

            const existingTab = openTabs.find((tab) => tab.fileId === fileId);
            if (existingTab) {
                setActiveTabId(fileId);
            } else {
                const newTab: OpenTab = {
                    fileId,
                    name: file.name,
                    content: file.content || "",
                    isDirty: false,
                };
                setOpenTabs((prev) => [...prev, newTab]);
                setActiveTabId(fileId);
            }
        },
        [files, openTabs, findFileById]
    );

    const handleTabClose = useCallback(
        (fileId: string) => {
            setOpenTabs((prev) => prev.filter((tab) => tab.fileId !== fileId));
            if (activeTabId === fileId) {
                const remaining = openTabs.filter(
                    (tab) => tab.fileId !== fileId
                );
                setActiveTabId(
                    remaining.length > 0
                        ? remaining[remaining.length - 1].fileId
                        : null
                );
            }
        },
        [activeTabId, openTabs]
    );

    const handleEditorChange: OnChange = useCallback(
        (value) => {
            if (!activeTabId) return;
            const newContent = value ?? "";

            setOpenTabs((prev) =>
                prev.map((tab) =>
                    tab.fileId === activeTabId
                        ? { ...tab, content: newContent, isDirty: true }
                        : tab
                )
            );

            setFiles((prev) =>
                updateFileContent(prev, activeTabId, newContent)
            );
        },
        [activeTabId, updateFileContent]
    );

    const getFileContent = useCallback(
        (fileId: string): string => {
            // First check if file is open in tabs (has latest edits)
            const tab = openTabs.find((t) => t.fileId === fileId);
            if (tab) return tab.content;
            // Otherwise get from files state
            const file = findFileById(files, fileId);
            return file?.content || "";
        },
        [openTabs, files, findFileById]
    );

    // Console capture script to inject into iframe
    const consoleCapture = `<script>
(function() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    function sendToParent(type, args) {
        window.parent.postMessage({
            type: 'console',
            method: type,
            args: Array.from(args).map(arg => {
                try {
                    if (typeof arg === 'object') return JSON.stringify(arg);
                    return String(arg);
                } catch(e) {
                    return String(arg);
                }
            })
        }, '*');
    }
    
    console.log = function() {
        sendToParent('log', arguments);
        originalLog.apply(console, arguments);
    };
    console.error = function() {
        sendToParent('error', arguments);
        originalError.apply(console, arguments);
    };
    console.warn = function() {
        sendToParent('warn', arguments);
        originalWarn.apply(console, arguments);
    };
    
    window.onerror = function(msg, url, line, col, error) {
        sendToParent('error', ['Error: ' + msg + ' (line ' + line + ')']);
    };
})();
</script>`;

    const handleRun = useCallback(() => {
        setIsRunning(true);
        setOutput("");
        setShowPreview(true);
        setShowConsole(true);

        // Get file contents (from tabs if open, otherwise from files)
        const indexHtmlContent = getFileContent("index-html");
        const stylesCSSContent = getFileContent("styles-css");
        const scriptJSContent = getFileContent("script-js");

        let htmlToRender = "";
        const logs: string[] = [];

        if (indexHtmlContent) {
            let html = indexHtmlContent;

            // Inject console capture script at the beginning of head
            html = html.replace("<head>", "<head>" + consoleCapture);

            // Inject CSS if styles.css exists
            if (stylesCSSContent) {
                html = html.replace(
                    '<link rel="stylesheet" href="styles.css">',
                    `<style>${stylesCSSContent}</style>`
                );
            }

            // Inject JS if script.js exists
            if (scriptJSContent) {
                html = html.replace(
                    '<script src="script.js"></script>',
                    `<script>${scriptJSContent}</script>`
                );
            }

            htmlToRender = html;
        } else if (activeFile) {
            // Run current file
            const ext = activeFile.name.split(".").pop()?.toLowerCase();
            const content = activeTab?.content || activeFile.content || "";

            if (ext === "html") {
                // Inject console capture into HTML
                let html = content;
                if (html.includes("<head>")) {
                    html = html.replace("<head>", "<head>" + consoleCapture);
                } else {
                    html = consoleCapture + html;
                }
                htmlToRender = html;
            } else if (ext === "css") {
                htmlToRender = `<!DOCTYPE html><html><head>${consoleCapture}<style>${content}</style></head><body><div style="padding:2rem;"><h1>CSS Preview</h1><p>Your styles are applied.</p></div></body></html>`;
            } else if (ext === "js" || ext === "ts") {
                // Execute JS and capture output
                const originalLog = console.log;
                const originalError = console.error;
                console.log = (...args) => {
                    logs.push(args.map((arg) => String(arg)).join(" "));
                };
                console.error = (...args) => {
                    logs.push(
                        "Error: " + args.map((arg) => String(arg)).join(" ")
                    );
                };

                try {
                    const fn = new Function(content);
                    fn();
                    setOutput(logs.join("\n") || "// No output");
                } catch (error) {
                    logs.push(`Error: ${(error as Error).message}`);
                    setOutput(logs.join("\n"));
                } finally {
                    console.log = originalLog;
                    console.error = originalError;
                }

                htmlToRender = `<!DOCTYPE html><html><head><style>body{font-family:monospace;padding:1rem;background:#1e1e1e;color:#d4d4d4;}</style></head><body><pre>${logs.join("\n") || "// No output"}</pre></body></html>`;
            } else if (ext === "json") {
                try {
                    const parsed = JSON.parse(content);
                    htmlToRender = `<!DOCTYPE html><html><head><style>body{font-family:monospace;padding:1rem;background:#1e1e1e;color:#d4d4d4;}pre{white-space:pre-wrap;}</style></head><body><pre>${JSON.stringify(parsed, null, 2)}</pre></body></html>`;
                } catch (e) {
                    htmlToRender = `<!DOCTYPE html><html><body style="color:red;font-family:sans-serif;padding:1rem;">Invalid JSON: ${(e as Error).message}</body></html>`;
                }
            }
        }

        setPreviewSrc(htmlToRender);
        setIsRunning(false);
    }, [getFileContent, activeFile, activeTab]);

    const handleDownload = useCallback(() => {
        if (!activeTab) return;
        const blob = new Blob([activeTab.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = activeTab.name;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, [activeTab]);

    const handleDownloadProject = useCallback(async () => {
        try {
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();

            // Helper function to add files recursively
            const addFilesToZip = (
                nodes: FileNode[],
                parentPath: string = ""
            ) => {
                for (const node of nodes) {
                    const path = parentPath
                        ? `${parentPath}/${node.name}`
                        : node.name;
                    if (node.type === "file") {
                        // Get latest content from tabs if open
                        const tab = openTabs.find((t) => t.fileId === node.id);
                        const content = tab ? tab.content : node.content || "";
                        zip.file(path, content);
                    } else if (node.type === "folder" && node.children) {
                        addFilesToZip(node.children, path);
                    }
                }
            };

            // Add all files from the root
            if (files.length > 0 && files[0].children) {
                addFilesToZip(files[0].children, "");
            }

            // Generate and download the zip
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement("a");
            link.download = `${files[0]?.name || "project"}.zip`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download project:", error);
        }
    }, [files, openTabs]);

    const toggleTheme = useCallback(() => {
        setIsDarkTheme((prev) => !prev);
    }, []);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => !prev);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden ${
                isFullscreen ? "fixed inset-4 z-50" : "h-full"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <div className="flex items-center gap-2">
                    <Terminal className="size-5 text-brand-500" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("codeEditor.miniIDE", "Code Playground")}
                    </h3>
                </div>

                <div className="flex items-center gap-1">
                    {/* Panel Toggle Buttons */}
                    <button
                        type="button"
                        onClick={() => setShowFileExplorer((prev) => !prev)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            showFileExplorer
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        title={
                            showFileExplorer
                                ? t("codeEditor.hideFiles", "Hide Files")
                                : t("codeEditor.showFiles", "Show Files")
                        }
                    >
                        {showFileExplorer ? (
                            <PanelLeftClose className="size-4" />
                        ) : (
                            <PanelLeftOpen className="size-4" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowConsole((prev) => !prev)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            showConsole
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        title={
                            showConsole
                                ? t("codeEditor.hideConsole", "Hide Console")
                                : t("codeEditor.showConsole", "Show Console")
                        }
                    >
                        {showConsole ? (
                            <PanelBottomClose className="size-4" />
                        ) : (
                            <PanelBottomOpen className="size-4" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowPreview((prev) => !prev)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            showPreview
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        title={
                            showPreview
                                ? t("codeEditor.hidePreview", "Hide Preview")
                                : t("codeEditor.showPreview", "Show Preview")
                        }
                    >
                        {showPreview ? (
                            <PanelRightClose className="size-4" />
                        ) : (
                            <PanelRightOpen className="size-4" />
                        )}
                    </button>

                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={
                            isDarkTheme
                                ? t("codeEditor.lightTheme", "Light theme")
                                : t("codeEditor.darkTheme", "Dark theme")
                        }
                    >
                        {isDarkTheme ? (
                            <Moon className="size-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <Sun className="size-4 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>

                    {activeTab && (
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={t(
                                "codeEditor.downloadFile",
                                "Download file"
                            )}
                        >
                            <Download className="size-4 text-gray-500 dark:text-gray-400" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleDownloadProject}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={t(
                            "codeEditor.downloadProject",
                            "Download project"
                        )}
                    >
                        <FolderDown className="size-4 text-gray-500 dark:text-gray-400" />
                    </button>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={
                            isFullscreen
                                ? t(
                                      "codeEditor.exitFullscreen",
                                      "Exit fullscreen"
                                  )
                                : t("codeEditor.fullscreen", "Fullscreen")
                        }
                    >
                        {isFullscreen ? (
                            <Minimize2 className="size-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <Maximize2 className="size-4 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors disabled:opacity-50"
                    >
                        {isRunning ? (
                            <RefreshCw className="size-4 animate-spin" />
                        ) : (
                            <Play className="size-4" />
                        )}
                        {t("codeEditor.run", "Run")}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-h-0" dir="ltr">
                {/* Top Section: File Explorer + Editor + Preview */}
                <div className="flex flex-1 min-h-0">
                    {/* File Explorer */}
                    {showFileExplorer && (
                        <div className="w-48 shrink-0 transition-all duration-200">
                            <FileExplorer
                                files={files}
                                selectedFileId={activeTabId}
                                onFileSelect={handleFileSelect}
                                onFilesChange={setFiles}
                                clipboard={clipboard}
                                onClipboardChange={setClipboard}
                                translations={{
                                    explorer: t(
                                        "codeEditor.explorer",
                                        "Explorer"
                                    ),
                                    newFile: t(
                                        "codeEditor.newFile",
                                        "New File"
                                    ),
                                    newFolder: t(
                                        "codeEditor.newFolder",
                                        "New Folder"
                                    ),
                                    copy: t("codeEditor.copy", "Copy"),
                                    cut: t("codeEditor.cut", "Cut"),
                                    paste: t("codeEditor.paste", "Paste"),
                                    rename: t("codeEditor.rename", "Rename"),
                                    delete: t("codeEditor.delete", "Delete"),
                                }}
                            />
                        </div>
                    )}

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Tabs */}
                        <EditorTabs
                            tabs={openTabs}
                            activeTabId={activeTabId}
                            onTabSelect={setActiveTabId}
                            onTabClose={handleTabClose}
                        />

                        {/* Editor */}
                        <div className="flex-1 min-h-0">
                            {activeTab ? (
                                <Editor
                                    language={currentLanguage}
                                    theme={isDarkTheme ? "vs-dark" : "light"}
                                    value={activeTab.content}
                                    onChange={handleEditorChange}
                                    height="100%"
                                    loading={
                                        <div className="flex items-center justify-center h-full bg-gray-900">
                                            <span className="text-sm text-gray-400">
                                                {t(
                                                    "codeEditor.loading",
                                                    "Loading editor..."
                                                )}
                                            </span>
                                        </div>
                                    }
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        fontFamily:
                                            "'Fira Code', 'Cascadia Code', Consolas, monospace",
                                        wordWrap: "on",
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 2,
                                        padding: { top: 12, bottom: 12 },
                                        lineNumbers: "on",
                                        renderLineHighlight: "line",
                                        cursorBlinking: "smooth",
                                        cursorSmoothCaretAnimation: "on",
                                        smoothScrolling: true,
                                        bracketPairColorization: {
                                            enabled: true,
                                        },
                                        formatOnPaste: true,
                                        formatOnType: true,
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
                                    <div className="text-center text-gray-400">
                                        <Terminal className="size-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm font-medium">
                                            {t(
                                                "codeEditor.selectFile",
                                                "Select a file to start editing"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    {showPreview && (
                        <div className="w-[40%] min-w-[250px] flex flex-col border-l border-gray-200 dark:border-gray-700 transition-all duration-200">
                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t("codeEditor.preview", "Preview")}
                                </span>
                            </div>
                            <iframe
                                title="Preview"
                                className="flex-1 w-full bg-white"
                                srcDoc={previewSrc}
                                sandbox="allow-scripts"
                            />
                        </div>
                    )}
                </div>

                {/* Console Panel */}
                {showConsole && (
                    <div
                        className="shrink-0 flex flex-col border-t border-gray-200 dark:border-gray-700 bg-gray-900 transition-all duration-200"
                        style={{ height: consoleHeight }}
                    >
                        {/* Console Header */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700 shrink-0">
                            <div className="flex items-center gap-2">
                                <Terminal className="size-3.5 text-gray-400" />
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    {t("codeEditor.console", "Console")}
                                </span>
                                {output && (
                                    <span className="text-xs text-gray-500">
                                        ({output.split("\n").length} lines)
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setConsoleHeight(
                                            consoleHeight === 120 ? 200 : 120
                                        )
                                    }
                                    className="p-1 rounded hover:bg-gray-700 transition-colors"
                                    title={
                                        consoleHeight === 120
                                            ? t("codeEditor.expand", "Expand")
                                            : t(
                                                  "codeEditor.collapse",
                                                  "Collapse"
                                              )
                                    }
                                >
                                    {consoleHeight === 120 ? (
                                        <ChevronUp className="size-3.5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="size-3.5 text-gray-400" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOutput("")}
                                    className="p-1 rounded hover:bg-gray-700 transition-colors"
                                    title={t(
                                        "codeEditor.clearConsole",
                                        "Clear console"
                                    )}
                                >
                                    <Trash2 className="size-3.5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Console Output */}
                        <div className="flex-1 overflow-auto p-2 font-mono text-xs">
                            {output ? (
                                <pre className="text-green-400 whitespace-pre-wrap">
                                    {output.split("\n").map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="text-gray-600 select-none w-6 shrink-0">
                                                {i + 1}
                                            </span>
                                            <span
                                                className={
                                                    line.startsWith("Error")
                                                        ? "text-red-400"
                                                        : "text-green-400"
                                                }
                                            >
                                                {line}
                                            </span>
                                        </div>
                                    ))}
                                </pre>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <span>
                                        {t(
                                            "codeEditor.consoleEmpty",
                                            "Console output will appear here..."
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
