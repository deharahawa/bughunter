"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RankStampProps {
  rank: "S" | "A" | "B" | "C" | "D" | "F";
  className?: string;
}

const rankColors = {
  S: "text-amber-400 border-amber-400",
  A: "text-fuchsia-500 border-fuchsia-500",
  B: "text-violet-500 border-violet-500",
  C: "text-emerald-500 border-emerald-500",
  D: "text-slate-500 border-slate-500",
  F: "text-rose-600 border-rose-600",
};

export function RankStamp({ rank, className }: RankStampProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 2, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: -12 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15, 
        mass: 1.5,
        delay: 0.5 
      }}
      className={cn(
        "relative w-32 h-32 flex items-center justify-center border-4 rounded-lg transform rotate-[-12deg] opacity-80 mix-blend-screen",
        rankColors[rank],
        className
      )}
    >
      {/* Outer Box double border effect handled by CSS or pseudo if needed, keeping simple for now */}
      <div className="absolute inset-1 border border-current opacity-60 rounded-sm" />
      
      <span className="text-6xl font-black font-mono tracking-tighter">
        {rank}
      </span>
      
      {/* Grunge/Noise overlay logic would go here (using SVG filter or mask) */}
      <div className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-widest opacity-70">
        Class
      </div>
    </motion.div>
  );
}
