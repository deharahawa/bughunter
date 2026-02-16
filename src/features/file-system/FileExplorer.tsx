"use client";

import { useFileSystemStore } from "@/store/file-system-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileCode, FolderOpen } from "lucide-react";

export function FileExplorer() {
  const { files, activeFile, selectFile } = useFileSystemStore();

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="h-10 flex items-center px-4 border-b border-sidebar-border">
        <span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Explorer
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {Object.entries(files).map(([path, file]) => {
            const isActive = activeFile === path;
            return (
              <button
                key={path}
                onClick={() => selectFile(path)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm rounded-sm text-left transition-colors w-full",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary pl-[10px]" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <FileCode className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
