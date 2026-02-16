"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HighlightedTextProps {
  children: React.ReactNode;
  color?: "yellow" | "pink" | "green" | "blue";
  className?: string;
  delay?: number;
}

const highlightColors = {
  yellow: "bg-yellow-400/30",
  pink: "bg-fuchsia-500/30",
  green: "bg-emerald-400/30",
  blue: "bg-cyan-400/30",
};

export function HighlightedText({ children, color = "yellow", className, delay = 1 }: HighlightedTextProps) {
  return (
    <span className={cn("relative inline-block px-1", className)}>
      <motion.span
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={cn(
          "absolute left-0 top-1 bottom-1 -z-10 rounded-sm skew-x-[-10deg]",
          highlightColors[color]
        )}
      />
      <span className="relative z-0 font-medium text-white/90">{children}</span>
    </span>
  );
}
