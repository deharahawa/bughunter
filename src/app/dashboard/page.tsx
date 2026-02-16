"use client";

import { motion } from "framer-motion";
import { StatsRadar } from "@/components/dashboard/StatsRadar";
import { InvestigationTimeline } from "@/components/dashboard/InvestigationTimeline";
import { Shield, Target, Database, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 md:p-12 space-y-8 flex flex-col max-w-7xl mx-auto pb-20">
      
      {/* Header / Agent ID Card */}
      <motion.header 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-primary neon-glow overflow-hidden">
                <Shield className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    AGENT DECO 
                    <Shield className="w-4 h-4 text-emerald-500" />
                </h1>
                <p className="text-slate-400 font-mono text-sm">RANK: JUNIOR DETECTIVE // ID: 8492-X</p>
            </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-8">
            <StatItem icon={Target} label="CASES SOLVED" value="12" />
            <StatItem icon={Database} label="TOTAL XP" value="2,450" color="text-secondary" />
            <StatItem icon={Clock} label="HOURS ON-CALL" value="48.5" />
        </div>
      </motion.header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        
        {/* Left Column: Radar & Skills */}
        <div className="space-y-8">
            {/* Stats Radar */}
            <StatsRadar />
            
            {/* Recent Activity Log - Mini */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6 h-64 overflow-y-auto custom-scrollbar"
            >
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">System Logs</h3>
                <ul className="space-y-3 font-mono text-xs text-slate-400">
                    <LogItem time="10:42" msg="Database query optimized. (+50 XP)" />
                    <LogItem time="09:15" msg="Login secured. OAuth flow implemented." />
                    <LogItem time="Yesterday" msg="Mission failed: 'The Infinite Loop'." type="error" />
                    <LogItem time="2 days ago" msg="New badge acquired: 'Bug Hunter'." />
                </ul>
            </motion.div>
        </div>

        {/* Right Column: The Investigation Board */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 flex flex-col h-full"
        >
            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Investigation Board
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">Connecting the evidence.</p>
                </div>
                <Link href="/cases">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs font-mono">
                        VIEW ARCHIVES {">"}
                    </Button>
                </Link>
            </div>
            
            <div className="flex-1">
                <InvestigationTimeline />
            </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color = "text-primary" }: { icon: LucideIcon, label: string, value: string, color?: string }) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mb-1 text-slate-500">
                <Icon className="w-4 h-4" />
            </div>
            <div className={cn("text-2xl font-black neon-text", color)}>{value}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}

function LogItem({ time, msg, type = "info" }: { time: string, msg: string, type?: "info" | "error" }) {
    return (
        <li className="flex gap-3">
            <span className="text-slate-600 min-w-[60px]">{time}</span>
            <span className={cn(type === "error" ? "text-rose-500" : "text-emerald-400/80")}>
                {">"} {msg}
            </span>
        </li>
    );
}
