import { useState, useCallback, memo } from "react";
import Editor, { OnChange, loader } from "@monaco-editor/react";
import { TFunction } from "i18next";
import { Play, RotateCcw, ChevronDown } from "lucide-react";

type EditorTabProps = {
    t: TFunction<"selfStudy", undefined>;
};

type SupportedLanguage =
    | "javascript"
    | "typescript"
    | "python"
    | "html"
    | "css"
    | "json";

interface LanguageConfig {
    id: SupportedLanguage;
    label: string;
    defaultCode: string;
}

const LANGUAGES: LanguageConfig[] = [
    {
        id: "javascript",
        label: "JavaScript",
        defaultCode: `// Write your JavaScript code here
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("World"));
`,
    },
    {
        id: "typescript",
        label: "TypeScript",
        defaultCode: `// Write your TypeScript code here
function greet(name: string): string {
    return "Hello, " + name + "!";
}

console.log(greet("World"));
`,
    },
    {
        id: "python",
        label: "Python",
        defaultCode: `# Write your Python code here
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
`,
    },
    {
        id: "html",
        label: "HTML",
        defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to my page.</p>
</body>
</html>
`,
    },
    {
        id: "css",
        label: "CSS",
        defaultCode: `/* Write your CSS code here */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}
`,
    },
    {
        id: "json",
        label: "JSON",
        defaultCode: `{
    "name": "example",
    "version": "1.0.0",
    "description": "A sample JSON file",
    "keywords": ["sample", "json"],
    "author": "Student"
}
`,
    },
];

// Configure Monaco loader to use CDN
loader.config({
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
    },
});

export const EditorTab = memo(function EditorTab({ t }: EditorTabProps) {
    const [language, setLanguage] = useState<SupportedLanguage>("javascript");
    const [code, setCode] = useState(LANGUAGES[0].defaultCode);
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const currentLanguage =
        LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];

    const handleChange: OnChange = useCallback((value) => {
        setCode(value ?? "");
    }, []);

    const handleLanguageChange = useCallback(
        (newLanguage: SupportedLanguage) => {
            const langConfig = LANGUAGES.find((l) => l.id === newLanguage);
            if (langConfig) {
                setLanguage(newLanguage);
                setCode(langConfig.defaultCode);
                setOutput("");
            }
            setShowLanguageMenu(false);
        },
        []
    );

    const handleReset = useCallback(() => {
        setCode(currentLanguage.defaultCode);
        setOutput("");
    }, [currentLanguage]);

    const handleRun = useCallback(() => {
        setIsRunning(true);
        setOutput("");

        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map((arg) => String(arg)).join(" "));
        };

        try {
            // Execute the code safely
            const fn = new Function(code);
            fn();
            setOutput(logs.join("\n") || "// No output");
        } catch (error) {
            setOutput(`Error: ${(error as Error).message}`);
        } finally {
            console.log = originalLog;
            setIsRunning(false);
        }
    }, [code]);

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("codeEditor.title", "Code Editor")}
                    </h3>

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setShowLanguageMenu(!showLanguageMenu)
                            }
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            {currentLanguage.label}
                            <ChevronDown className="size-3.5" />
                        </button>

                        {showLanguageMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowLanguageMenu(false)}
                                />
                                <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[140px]">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.id}
                                            type="button"
                                            onClick={() =>
                                                handleLanguageChange(lang.id)
                                            }
                                            className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                                                language === lang.id
                                                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {(language === "javascript" ||
                        language === "typescript") && (
                        <button
                            type="button"
                            onClick={handleRun}
                            disabled={isRunning}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-success-500 hover:bg-success-600 text-white transition-colors disabled:opacity-50"
                        >
                            <Play className="size-3.5" />
                            {t("codeEditor.run", "Run")}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <RotateCcw className="size-3.5" />
                        {t("codeEditor.reset", "Reset")}
                    </button>
                </div>
            </div>

            {/* Editor container - overflow visible for autocomplete dropdown */}
            <div className="flex-1 min-h-0 border border-gray-200 dark:border-gray-700 rounded-xl [&_.monaco-editor]:overflow-visible! [&_.overflow-guard]:overflow-visible!">
                <Editor
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleChange}
                    height="100%"
                    loading={
                        <div className="flex items-center justify-center h-full bg-gray-900">
                            <span className="text-sm text-gray-400">
                                {t("codeEditor.loading", "Loading editor...")}
                            </span>
                        </div>
                    }
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
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
                        bracketPairColorization: { enabled: true },
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                />
            </div>

            {/* Output Panel */}
            {output && (
                <div className="shrink-0 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {t("codeEditor.output", "Output")}
                        </span>
                    </div>
                    <pre className="p-3 bg-gray-900 text-sm text-gray-300 font-mono max-h-24 overflow-auto">
                        {output}
                    </pre>
                </div>
            )}
        </div>
    );
});
