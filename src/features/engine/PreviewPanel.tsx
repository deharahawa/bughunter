"use client";

import { Loader2 } from "lucide-react";

interface PreviewPanelProps {
  url: string | null;
}

export function PreviewPanel({ url }: PreviewPanelProps) {
  return (
    <div className="h-full w-full bg-slate-950 flex flex-col border-l border-sidebar-border">
      <div className="h-8 flex items-center px-4 bg-sidebar border-b border-sidebar-border select-none justify-between">
        <span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">Preview</span>
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${url ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-600'}`} />
            <span className="text-[10px] text-muted-foreground font-mono">{url ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>
      
      <div className="flex-1 relative bg-background isolate">
        {!url && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p className="text-sm">Waiting for server...</p>
            </div>
        )}
        
        {url && (
          <iframe 
            src={url} 
            className="w-full h-full bg-white z-10 relative"
            title="Preview" 
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        )}
      </div>
    </div>
  );
}
