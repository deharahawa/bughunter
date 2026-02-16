"use client";

import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface TerminalPanelProps {
  onMount?: (terminal: Terminal) => void;
}

export function TerminalPanel({ onMount }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const onMountRef = useRef(onMount);

  useEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);

  useEffect(() => {
    if (!terminalRef.current) return;

    let cleanupFn = () => {};

    const initTerminal = () => {
       if (xtermRef.current) return;

       // STRICT CHECK: Do not initialize if dimensions are invalid
       const { width, height } = terminalRef.current!.getBoundingClientRect();
       if (width === 0 || height === 0) return;

       try {
           const terminal = new Terminal({
            theme: {
                background: '#020617',
                foreground: '#e2e8f0',
                cursor: '#8b5cf6',
                selectionBackground: '#334155',
                black: '#020617',
                red: '#f43f5e',
                green: '#34d399',
                yellow: '#f59e0b',
                blue: '#3b82f6',
                magenta: '#8b5cf6',
                cyan: '#06b6d4',
                white: '#e2e8f0',
                brightBlack: '#1e293b',
                brightRed: '#f43f5e',
                brightGreen: '#34d399',
                brightYellow: '#f59e0b',
                brightBlue: '#3b82f6',
                brightMagenta: '#8b5cf6',
                brightCyan: '#06b6d4',
                brightWhite: '#f8fafc',
            },
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            cursorBlink: true,
            convertEol: true,
            allowProposedApi: true,
          });
          
          const fitAddon = new FitAddon();
          terminal.loadAddon(fitAddon);
          
          // Delay open to ensure DOM is settled
          requestAnimationFrame(() => {
            if (!terminalRef.current || !xtermRef.current) return;
             try {
                terminal.open(terminalRef.current);
                
                // Initial safe fit
                setTimeout(() => {
                    const safeFit = () => {
                        try {
                            if (!terminalRef.current || !fitAddon) return;
                            const dims = fitAddon.proposeDimensions();
                            if (!dims || isNaN(dims.cols) || isNaN(dims.rows)) return;
                            fitAddon.fit();
                        } catch (e) {
                            console.warn("Fit error suppressed:", e);
                        }
                    };
                    safeFit();
                 }, 50);
            } catch (e) {
                console.error("Terminal open failed:", e);
            }
          });
          
          xtermRef.current = terminal;
          fitAddonRef.current = fitAddon;

          if (onMountRef.current) {
            onMountRef.current(terminal);
          }
          
          terminal.writeln('\x1b[35mBugHunter Engine v1.0\x1b[0m');
          terminal.writeln('Ready to boot...');
          
          cleanupFn = () => {
            terminal.dispose();
            xtermRef.current = null;
          };
       } catch (e) {
           console.error("Failed to initialize terminal", e);
       }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry?.contentRect?.width ?? 0;
      const height = entry?.contentRect?.height ?? 0;

      if (!xtermRef.current) {
        if (width > 0 && height > 0) {
            initTerminal();
        }
      } else {
        try {
            if (width > 0 && height > 0) {
                 fitAddonRef.current?.fit();
            }
        } catch (e) { 
            console.warn("Resize fit error:", e); 
        }
      }
    });
    
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      cleanupFn();
    };
  }, []);

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden border-t border-sidebar-border">
        <div className="h-8 flex items-center px-4 bg-sidebar border-b border-sidebar-border select-none">
             <span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">Terminal</span>
        </div>
        <div ref={terminalRef} className="flex-1 p-2 overflow-hidden" />
    </div>
  );
}
