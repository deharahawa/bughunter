"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMissions } from "@/lib/api";
import { useEffect, useState } from "react";

interface CaseNode {
  id: string;
  title: string;
  status: "SOLVED" | "LOCKED" | "FAILED";
  rank?: "S" | "A" | "B" | "C" | "D" | "F";
  xp?: number;
  stack?: string[];
  date?: string;
}

const mockCases: CaseNode[] = [
  { id: "1", title: "The Null Pointer Anomaly", status: "SOLVED", rank: "S", xp: 150, stack: ["TS", "Node"], date: "2023-11-15" },
  { id: "2", title: "Race Condition Riots", status: "SOLVED", rank: "A", xp: 300, stack: ["Go", "Redis"], date: "2023-11-20" },
  { id: "3", title: "Memory Leak Estate", status: "LOCKED" },
  { id: "4", title: "SQL Injection Syndicate", status: "LOCKED" },
];

export function InvestigationTimeline() {
  const [nodes, setNodes] = useState<CaseNode[]>(mockCases);

  useEffect(() => {
    fetchMissions().then((missions) => {
        if (missions.length > 0) {
            const newNodes = missions.map((m: any) => ({
                id: m.id,
                title: m.case_data.mission_title || "Unknown Mission",
                status: (m.status === "SUCCESS" ? "SOLVED" : "FAILED") as "SOLVED" | "FAILED",
                rank: m.case_data.rank || "B",
                xp: m.xp_earned,
                stack: m.case_data.skills_improved || [],
                date: new Date(m.created_at).toLocaleDateString()
            }));
            
            // Prepend new nodes so most recent is top
            setNodes([...newNodes, ...mockCases]);
        }
    });
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950/30 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Case Files Directory</h3>
        <span className="text-xs text-slate-500 font-mono">{nodes.length} RECORDS FOUND</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {nodes.map((caseNode, index) => (
            <CaseListItem key={caseNode.id} data={caseNode} index={index} />
        ))}
      </div>
    </div>
  );
}

function CaseListItem({ data, index }: { data: CaseNode; index: number }) {
  const isLocked = data.status === "LOCKED";
  const isSolved = data.status === "SOLVED";
  const isFailed = data.status === "FAILED";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
          "relative flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 group",
          isLocked 
            ? "bg-slate-950/50 border-slate-800/50 opacity-60" 
            : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
      )}
    >
        {/* Leading Icon / Rank */}
        <div className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center font-bold font-mono text-lg shadow-sm border",
            isSolved ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/30" :
            isFailed ? "bg-red-950/30 text-red-400 border-red-500/30" :
            "bg-slate-900 text-slate-600 border-slate-700"
        )}>
            {isLocked ? <Lock className="w-4 h-4" /> : data.rank}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <h4 className={cn(
                "font-medium truncate",
                isLocked ? "text-slate-500" : "text-slate-200 group-hover:text-white"
            )}>
                {data.title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                {!isLocked && <span>{data.date}</span>}
                {!isLocked && data.stack && (
                    <>
                        <span>•</span>
                        <span className="truncate">{data.stack.join(", ")}</span>
                    </>
                )}
            </div>
        </div>

        {/* Trailing Status */}
        <div className="text-right">
             <div className={cn(
                 "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                 isSolved ? "bg-emerald-500/10 text-emerald-400" :
                 isFailed ? "bg-destructive/10 text-destructive" :
                 "bg-slate-800 text-slate-500"
             )}>
                {isSolved && <CheckCircle className="w-3 h-3" />}
                {isFailed && <XCircle className="w-3 h-3" />}
                {data.status}
             </div>
             {data.xp && (
                 <div className="text-[10px] text-slate-400 mt-1 font-mono">
                     +{data.xp} XP
                 </div>
             )}
        </div>
    </motion.div>
  );
}
