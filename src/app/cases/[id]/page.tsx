"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Terminal, Shield, CheckCircle, AlertOctagon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RankStamp } from "@/components/dossier/RankStamp";
import { HighlightedText } from "@/components/dossier/HighlightedText";

// Mock Data - In real app, fetch by ID
const mockCaseStudy = {
  id: "1",
  title: "THE NULL POINTER ANOMALY",
  rank: "S",
  xp: 150,
  stack: ["TypeScript", "Node.js"],
  date: "2024-02-15",
  evidenceLog: [
    { time: "10:00:01", level: "INFO", msg: "System initialization..." },
    { time: "10:00:05", level: "WARN", msg: "Memory usage spike detected." },
    { time: "10:01:20", level: "ERROR", msg: "Uncaught ReferenceError: user is not defined." },
    { time: "10:05:00", level: "ACTION", msg: "Agent initiated debugging sequence." },
    { time: "10:12:30", level: "SUCCESS", msg: "Patch deployed. System stable." },
  ],
  analysis: "Evaluation of the incident reveals a critical oversight in the authentication middleware. A variable trace confirmed that the user object was being accessed before the JWT validation completed.",
  lessons: [
    "Always validate optional chaining in deeply nested objects.",
    "Implement strict type guards for API responses.",
    "Review middleware execution order.",
  ]
};

export default function CasePage({ params }: { params: { id: string } }) {
  // const { id } = params; // Not using for mock, but would fetch here
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-6xl mx-auto pb-20">
      
      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4"
      >
        <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-white gap-2 pl-0 hover:bg-transparent">
                <ChevronLeft className="w-5 h-5" />
                BACK TO DASHBOARD
            </Button>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-rose-900/20 border border-rose-700/50 rounded text-rose-500 font-mono text-xs uppercase tracking-widest animate-pulse">
            <AlertOctagon className="w-4 h-4" />
            Top Secret // Debrief
        </div>
      </motion.div>

      {/* Main Content - Folio Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
        
        {/* Left Column: The Incident (Evidence) */}
        <motion.div 
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="space-y-6"
        >
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tighter">
                    CASE #{mockCaseStudy.id.padStart(3, '0')}
                </h1>
                <h2 className="text-xl text-primary font-mono">{mockCaseStudy.title}</h2>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 font-mono text-sm shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="flex items-center gap-2 mb-4 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-900 pb-2">
                    <Terminal className="w-4 h-4" />
                    Evidence Log // {mockCaseStudy.date}
                </div>
                
                <ul className="space-y-3 relative z-10">
                    {mockCaseStudy.evidenceLog.map((log, i) => (
                        <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="flex gap-4"
                        >
                           <span className="text-slate-600 shrink-0">{log.time}</span>
                           <span className={cn(
                                "uppercase font-bold w-16 shrink-0 text-[10px]",
                                log.level === "ERROR" ? "text-rose-500" :
                                log.level === "SUCCESS" ? "text-emerald-500" :
                                log.level === "WARN" ? "text-amber-500" : "text-blue-500"
                           )}>{log.level}</span>
                           <span className="text-slate-300 opacity-80">{log.msg}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>

        {/* Right Column: The Verdict */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="relative bg-slate-100/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm"
        >
            <div className="absolute -top-4 -right-4 rotate-12 z-20">
                <RankStamp rank={mockCaseStudy.rank as any} />
            </div>

            <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Forensic Analysis
            </h3>

            <div className="prose prose-invert prose-sm max-w-none mb-8">
                <p className="leading-relaxed text-slate-300">
                    <HighlightedText color="pink" delay={1.5}>Evaluation of the incident</HighlightedText> reveals a critical oversight in the authentication middleware. A variable trace confirmed that the user object was being accessed before the JWT validation completed.
                </p>
                <p className="border-l-2 border-primary/50 pl-4 italic text-slate-400 my-4">
                    "Excellent recovery time. Your ability to isolate the race condition demonstrates significant growth in systems thinking." -- Mentor Marcus
                </p>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tactical Learnings</h4>
                <ul className="space-y-2">
                    {mockCaseStudy.lessons.map((lesson, i) => (
                        <motion.li 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 + (i * 0.2) }}
                            className="flex items-start gap-3 text-sm text-slate-300"
                        >
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            {lesson}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
      </div>    
    </div>
  );
}
