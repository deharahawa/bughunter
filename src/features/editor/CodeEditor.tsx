"use client";

import Editor from "@monaco-editor/react";
import { useFileSystemStore } from "@/store/file-system-store";

export function CodeEditor() {
  const { activeFile, files, updateFileContent } = useFileSystemStore();
  const file = activeFile ? files[activeFile] : null;

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Configurações do compilador TypeScript para o Monaco
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowSyntheticDefaultImports: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      noImplicitAny: false,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
    });

    // Mock types for React to silence errors
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' { any }
       declare module 'react-dom/client' { any }`,
      'file:///node_modules/@types/react/index.d.ts'
    );
    
    // Theme setup
    monaco.editor.defineTheme('cyberpunk', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#020617', // Slate-950
            'editor.lineHighlightBackground': '#1e293b', // Slate-800
            'editorCursor.foreground': '#8b5cf6', // Violet-500
            'editor.selectionBackground': '#334155', // Slate-700
            'editorIndentGuide.background': '#1e293b',
            'editorIndentGuide.activeBackground': '#475569',
        }
    });
    monaco.editor.setTheme('cyberpunk');
  };

  if (!activeFile || !file) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-background border-l border-border">
        Select a file to start coding
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background relative group border-l border-border">
      <div className="absolute top-2 right-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-xs text-muted-foreground font-mono px-2 py-1 bg-secondary/50 rounded border border-border">
          {file.language}
        </span>
      </div>
      <Editor
        height="100%"
        theme="cyberpunk"
        path={activeFile}
        language={file.language}
        value={file.content}
        onChange={(value) => updateFileContent(activeFile, value || "")}
        options={{
          minimap: {
            enabled: true,
            scale: 1,
            showSlider: "always",
          },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          overviewRulerBorder: false,
        }}
        onMount={handleEditorDidMount}
        loading={<div className="flex h-full items-center justify-center text-muted-foreground text-sm">Initializing Editor...</div>}
      />
    </div>
  );
}
