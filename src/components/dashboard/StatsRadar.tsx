"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { subject: "Frontend", A: 120, fullMark: 150 },
  { subject: "Backend", A: 98, fullMark: 150 },
  { subject: "Database", A: 86, fullMark: 150 },
  { subject: "DevOps", A: 65, fullMark: 150 },
  { subject: "Security", A: 45, fullMark: 150 },
  { subject: "Soft Skills", A: 110, fullMark: 150 },
];

export function StatsRadar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]"
    >
      {/* Decorative Header */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
         <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse" />
         <span className="text-xs font-mono text-fuchsia-500 tracking-widest uppercase">Skillset Matrix</span>
      </div>

      <div className="h-[300px] w-full mt-4 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }} 
            />
            <Radar
              name="My Skills"
              dataKey="A"
              stroke="var(--color-primary)" // Violet-600 defined in globals
              strokeWidth={2}
              fill="var(--color-primary)"
              fillOpacity={0.3}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Decorative Corner */}
      <div className="absolute bottom-2 right-2 border-r-2 border-b-2 border-slate-700 w-4 h-4" />
    </motion.div>
  );
}
