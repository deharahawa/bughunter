"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Folder, FileText, Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { fetchMissions, type Mission } from "@/lib/api";

// Mock Data
const mockCases = [
  { id: "1", title: "The Null Pointer Anomaly", status: "SOLVED", rank: "S", xp: 150, date: "2024-02-15", tags: ["TS", "Node"] },
  { id: "2", title: "Race Condition Riots", status: "SOLVED", rank: "A", xp: 300, date: "2024-02-14", tags: ["Go", "Redis"] },
  { id: "3", title: "Memory Leak Estate", status: "LOCKED", xp: 0, date: "---", tags: ["C++", "Valgrind"] },
  { id: "4", title: "SQL Injection Syndicate", status: "LOCKED", xp: 0, date: "---", tags: ["SQL", "Security"] },
  { id: "5", title: "The Deadlock Conspiracy", status: "LOCKED", xp: 0, date: "---", tags: ["Java", "Threads"] },
  { id: "6", title: "Infinite Loop Island", status: "SOLVED", rank: "B", xp: 100, date: "2024-02-10", tags: ["JS", "EventLoop"] },
];

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState<any[]>(mockCases);

  useEffect(() => {
    fetchMissions().then((missions) => {
        if (missions.length > 0) {
            const mappedMissions = missions.map((m: any) => ({
                id: m.id,
                title: m.case_data.mission_title || "Unknown Mission",
                status: m.status === "SUCCESS" ? "SOLVED" : "FAILURE", // Mapping SUCCESS to SOLVED for UI consistency
                rank: m.case_data.rank || "C",
                xp: m.xp_earned,
                date: new Date(m.created_at).toLocaleDateString(),
                tags: m.case_data.skills_improved || []
            }));
            
            // Combine with mock data, putting new missions first
            setCases([...mappedMissions, ...mockCases]);
        }
    });
  }, []);

  const filteredCases = cases.filter(c => 
    (c.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (c.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto pb-20 space-y-8">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6"
      >
        <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                <Folder className="w-8 h-8 text-primary" />
                Case Archives
            </h1>
            <p className="text-slate-500 font-mono text-sm mt-2">
                CLASSIFIED RECORDS // LEVEL 3 CLEARANCE
            </p>
        </div>

        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
                placeholder="Search database..." 
                className="pl-9 bg-slate-950 border-slate-800 focus:border-primary/50 font-mono text-xs"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem, index) => (
            <CaseCard key={caseItem.id} data={caseItem} index={index} />
        ))}
        {filteredCases.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-mono">
                NO RECORDS FOUND MATCHING QUERY.
            </div>
        )}
      </div>
    </div>
  );
}

function CaseCard({ data, index }: { data: any, index: number }) {
    const isLocked = data.status === "LOCKED";
    
    return (
        <Link href={isLocked ? "#" : `/cases/${data.id}`} className={cn(isLocked && "pointer-events-none")}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                    "group relative h-48 p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 overflow-hidden",
                    isLocked 
                        ? "bg-slate-950/50 border-slate-900 grayscale opacity-70" 
                        : "bg-slate-900/40 border-slate-800 hover:border-primary/50 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                )}
            >
                {/* Status Indicator */}
                <div className="flex justify-between items-start">
                    <div className={cn(
                        "p-2 rounded-lg border",
                        isLocked ? "bg-slate-900 border-slate-800" : "bg-primary/10 border-primary/20 text-primary"
                    )}>
                        {isLocked ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    {isLocked ? (
                         <span className="text-[10px] bg-slate-900 text-slate-600 px-2 py-1 rounded font-mono border border-slate-800">
                            LOCKED
                         </span>
                    ) : (
                        <div className="flex items-center gap-2">
                             <span className={cn(
                                "text-lg font-black font-mono",
                                data.rank === 'S' ? "text-amber-400" : 
                                data.rank === 'A' ? "text-fuchsia-500" : "text-emerald-500"
                             )}>{data.rank}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div>
                    <h3 className={cn(
                        "font-bold truncate mb-1",
                        isLocked ? "text-slate-600" : "text-slate-200 group-hover:text-primary transition-colors"
                    )}>
                        {data.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {data.tags.map((tag: string) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-slate-400 font-mono">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Decorative Corner */}
                {!isLocked && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent -mr-8 -mt-8 rounded-full blur-xl group-hover:from-primary/30 transition-all" />
                )}
            </motion.div>
        </Link>
    );
}
