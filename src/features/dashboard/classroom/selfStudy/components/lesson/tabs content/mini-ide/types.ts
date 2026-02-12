export type FileType = "file" | "folder";

export interface FileNode {
    id: string;
    name: string;
    type: FileType;
    content?: string;
    children?: FileNode[];
    parentId: string | null;
    isOpen?: boolean; // For folders
}

export interface OpenTab {
    fileId: string;
    name: string;
    content: string;
    isDirty: boolean;
}

export interface ContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    targetId: string | null;
    targetType: FileType | null;
}

export interface ClipboardState {
    action: "copy" | "cut" | null;
    fileId: string | null;
}

export const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const languageMap: Record<string, string> = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        html: "html",
        htm: "html",
        css: "css",
        scss: "scss",
        sass: "sass",
        less: "less",
        json: "json",
        md: "markdown",
        py: "python",
        java: "java",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        go: "go",
        rs: "rust",
        php: "php",
        rb: "ruby",
        sql: "sql",
        xml: "xml",
        yaml: "yaml",
        yml: "yaml",
        sh: "shell",
        bash: "shell",
        txt: "plaintext",
    };
    return languageMap[ext] || "plaintext";
};

export const getFileIcon = (fileName: string, isFolder: boolean): string => {
    if (isFolder) return "folder";
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const iconMap: Record<string, string> = {
        js: "javascript",
        jsx: "react",
        ts: "typescript",
        tsx: "react",
        html: "html",
        css: "css",
        json: "json",
        md: "markdown",
        py: "python",
        java: "java",
        go: "go",
        rs: "rust",
        php: "php",
    };
    return iconMap[ext] || "file";
};

export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 11);
};

export const DEFAULT_FILES: FileNode[] = [
    {
        id: "root",
        name: "my-project",
        type: "folder",
        parentId: null,
        isOpen: true,
        children: [
            {
                id: "index-html",
                name: "index.html",
                type: "file",
                parentId: "root",
                content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Hello, World!</h1>
        <p>Welcome to my project.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
            },
            {
                id: "styles-css",
                name: "styles.css",
                type: "file",
                parentId: "root",
                content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-linear(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#app {
    background: white;
    padding: 2rem 3rem;
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 0.5rem;
}

p {
    color: #666;
}`,
            },
            {
                id: "script-js",
                name: "script.js",
                type: "file",
                parentId: "root",
                content: `// Main JavaScript file
console.log('Hello from script.js!');

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    console.log('App loaded:', app);
});`,
            },
            {
                id: "src-folder",
                name: "src",
                type: "folder",
                parentId: "root",
                isOpen: false,
                children: [
                    {
                        id: "utils-js",
                        name: "utils.js",
                        type: "file",
                        parentId: "src-folder",
                        content: `// Utility functions
export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
                    },
                ],
            },
        ],
    },
];
