"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Shield, Save, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveMission, parseMissionReport } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissionReportModal({ isOpen, onClose }: MissionReportModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<"IDLE" | "VALIDATING" | "VALID" | "INVALID" | "SUBMITTING" | "SUCCESS">("IDLE");
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    
    if (!value.trim()) {
        setStatus("IDLE");
        setParsedData(null);
        return;
    }

    // Live validation
    const result = parseMissionReport(value);
    if (result.valid) {
        setStatus("VALID");
        setParsedData(result.data);
        setErrorMessage("");
    } else {
        setStatus("INVALID");
        setErrorMessage(result.error || "Syntax Error");
        setParsedData(null);
    }
  };

  const handleSubmit = async () => {
    if (status !== "VALID" || !parsedData) return;
    
    setStatus("SUBMITTING");
    const result = await archiveMission(parsedData);
    
    if (result.success) {
        setStatus("SUCCESS");
        // Reset after delay or keep success state? Keeping for now until close.
    } else {
        setStatus("INVALID");
        setErrorMessage(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header - Incident Report Style */}
        <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary animate-pulse" />
                <h2 className="text-lg font-mono font-bold tracking-wider text-slate-200">
                    INCIDENT REPORT // SUBMISSION
                </h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto font-mono">
            <div className="space-y-4">
                <div className="bg-slate-900/50 p-3 border border-slate-800 rounded text-xs text-slate-400">
                    <p>INSTRUCTIONS: Paste the mission data JSON exported from the neural link (LLM). Verify integrity before archiving.</p>
                </div>
                
                <div className="relative group">
                    <textarea 
                        value={jsonInput}
                        onChange={handleInput}
                        placeholder={'{ "mission_title": "...", "outcome": "Victory", "xp_gained": 350 ... }'}
                        className={cn(
                            "w-full h-64 bg-slate-950 border rounded-md p-4 text-sm focus:outline-none focus:ring-1 transition-all resize-none relative z-10",
                            status === "INVALID" ? "border-red-500/50 focus:border-red-500" :
                            status === "VALID" ? "border-emerald-500/50 focus:border-emerald-500" :
                            "border-slate-800 focus:border-primary"
                        )}
                        spellCheck={false}
                    />
                    
                    {/* Status Indicator Overlay */}
                    <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                        {status === "VALID" && (
                            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-bold">INTEGRITY VERIFIED</span>
                            </div>
                        )}
                        {status === "INVALID" && (
                            <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-xs font-bold">DATA CORRUPTED</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Parsed Summary Preview */}
                <AnimatePresence>
                    {parsedData && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs border-t border-slate-800 pt-4"
                        >
                            <h3 className="text-slate-500 mb-2 uppercase tracking-widest">Decrypted Payload</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                    <span className="block text-slate-500 text-[10px]">MISSION TITLE</span>
                                    <span className="text-primary truncate block" title={parsedData.mission_title as string}>{parsedData.mission_title as string || "N/A"}</span>
                                </div>
                                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                    <span className="block text-slate-500 text-[10px]">XP GAINED</span>
                                    <span className="text-secondary">+{parsedData.xp_gained as number || 0} XP</span>
                                </div>
                                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                    <span className="block text-slate-500 text-[10px]">OUTCOME</span>
                                    <span className={cn(
                                        parsedData.outcome === "Victory" ? "text-emerald-500" : "text-rose-500"
                                    )}>{parsedData.outcome as string || "UNKNOWN"}</span>
                                </div>
                                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                    <span className="block text-slate-500 text-[10px]">RANK</span>
                                    <span className="text-amber-400 font-bold">{parsedData.rank as string || "-"}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                {errorMessage && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs mt-2">
                        {">"} ERROR: {errorMessage}
                    </motion.p>
                )}
                
                {status === "SUCCESS" && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded text-emerald-400 flex flex-col items-center justify-center gap-2 text-center"
                    >
                        <CheckCircle className="w-8 h-8" />
                        <h3 className="font-bold text-lg">ARCHIVE SUCCESSFUL</h3>
                        <p className="text-xs opacity-70">The mission has been logged in your permanent record.</p>
                     </motion.div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/5">
                CANCELAR
            </Button>
            {status !== "SUCCESS" && (
                <Button 
                    onClick={handleSubmit} 
                    disabled={status !== "VALID" && status !== "SUBMITTING"}
                    className={cn(
                        "gap-2 font-bold transition-all duration-300",
                        status === "VALID" ? "bg-primary hover:bg-primary/90 shadow-[0_0_15px_theme('colors.violet.600')]" : "bg-slate-800 text-slate-500"
                    )}
                >
                    {status === "SUBMITTING" ? (
                        <>
                            <UploadCloud className="w-4 h-4 animate-bounce" />
                            UPLOADING...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            ARQUIVAR CASO
                        </>
                    )}
                </Button>
            )}
        </div>
      </motion.div>
    </div>
  );
}
