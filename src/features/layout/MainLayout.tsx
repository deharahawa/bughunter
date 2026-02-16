"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileExplorer } from "@/features/file-system/FileExplorer";
import { CodeEditor } from "@/features/editor/CodeEditor";
import { PreviewPanel } from "@/features/engine/PreviewPanel";
import { useWebContainer } from "@/features/engine/useWebContainer";
import { Button } from "@/components/ui/button";
import { Play, RotateCw, Sparkles, Loader2 } from "lucide-react";
import { Terminal } from "@xterm/xterm";
import { generateChallenge } from "@/app/actions/generate-challenge";
import { useFileSystemStore } from "@/store/file-system-store";

const TerminalPanel = dynamic(
  () => import("@/features/engine/TerminalPanel").then((mod) => mod.TerminalPanel),
  { ssr: false }
);

export function MainLayout() {
  const { executeProject, previewUrl, isBooting } = useWebContainer();
  const terminalRef = useRef<Terminal | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { loadChallenge } = useFileSystemStore();

  const hasRunRef = useRef(false);

  const handleTerminalMount = (terminal: Terminal) => {
    terminalRef.current = terminal;
    
    // Auto-run on first mount
    if (!hasRunRef.current) {
        hasRunRef.current = true;
        // Small delay to ensure everything is ready
        setTimeout(() => {
            handleRun();
        }, 500);
    }
  };

  const handleRun = async () => {
    const term = terminalRef.current;
    if (!term) return;

    setIsRunning(true);
    term.clear();
    
    await executeProject((data) => {
      term.write(data);
    });
    
    setIsRunning(false);
  };
  
  const handleGenerateValues = async () => {
      setIsGenerating(true);
      try {
          const result = await generateChallenge("React useState bug");
          
          if (result.success && result.data) {
              loadChallenge(result.data);
              
              // Trigger auto-run for new challenge
              setTimeout(() => handleRun(), 500);
          } else {
              console.error("Generation failed:", result.error);
          }
      } catch(e) {
          console.error("Generation error:", e);
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="h-14 flex items-center px-4 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-2">
           <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
             <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
           </div>
           <h1 className="text-lg font-bold tracking-tight text-foreground select-none">
             BugHunter <span className="text-muted-foreground text-xs font-normal ml-2">v0.1.0</span>
           </h1>
        </div>
        
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateValues} 
                disabled={isGenerating || isRunning}
                className="gap-2 border-primary/20 hover:bg-primary/10 text-primary"
            >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isGenerating ? "Generating..." : "Generate AI Challenge"}
            </Button>

            <Button 
                variant="default" 
                size="sm" 
                onClick={handleRun} 
                disabled={isRunning}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
                {isRunning || isBooting ? <RotateCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {isBooting ? "Booting..." : isRunning ? "Running..." : "Run Code"}
            </Button>
        </div>
      </header>

      
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full" id="main-layout-group">
          <ResizablePanel 
            id="sidebar-panel"
            defaultSize={15} 
            minSize="10" 
            maxSize="30" 
            className="bg-sidebar border-r border-sidebar-border"
          >
            <FileExplorer />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-border hover:bg-primary/50 transition-colors w-1 data-[resize-handle-state=drag]:bg-primary data-[resize-handle-state=hover]:bg-primary/50" />
          
          <ResizablePanel id="center-panel" defaultSize={55} minSize="30">
            <ResizablePanelGroup direction="vertical" id="editor-terminal-group">
                <ResizablePanel id="editor-panel" defaultSize={70} minSize="20">
                    <CodeEditor />
                </ResizablePanel>
                
                <ResizableHandle withHandle className="bg-border hover:bg-primary/50 transition-colors h-1 data-[resize-handle-active]:bg-primary" />
                
                <ResizablePanel id="terminal-panel" defaultSize={30} minSize="10">
                    <TerminalPanel onMount={handleTerminalMount} />
                </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-primary/50 transition-colors w-1 data-[resize-handle-state=drag]:bg-primary data-[resize-handle-state=hover]:bg-primary/50" />

          <ResizablePanel id="preview-panel" defaultSize={30} minSize="20" className="bg-background">
            <PreviewPanel url={previewUrl} />
          </ResizablePanel>

        </ResizablePanelGroup>
      </main>
    </div>
  );
}
