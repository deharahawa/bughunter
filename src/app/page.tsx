"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, ShieldAlert, FileJson } from "lucide-react";
import Link from "next/link";
import { MissionReportModal } from "@/components/mission/MissionReportModal";

export default function Home() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center gap-10 relative z-10 px-4">
      
      {/* Glitch Title Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="relative group"
      >
        <div className="absolute -inset-1 rounded-lg bg-primary/20 blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
        <h1 className="relative text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 select-none z-10">
          PROTOCOLO
          <br />
          <span className="text-primary neon-glow drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">ON-CALL</span>
        </h1>
      </motion.div>

      {/* Subtitle with typing effect or just minimal mono style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col gap-2 items-center"
      >
        <p className="text-xl md:text-2xl text-muted-foreground font-mono max-w-2xl bg-black/40 p-4 border-l-2 border-primary/50 backdrop-blur-sm">
          <span className="text-primary mr-2 font-bold">{">"}</span>
          O sistema caiu. Você é a última linha de defesa.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <Link href="/cases">
            <Button size="lg" className="bg-primary/90 hover:bg-primary text-primary-foreground font-bold text-lg px-8 py-8 h-auto shadow-[0_0_20px_theme('colors.violet.600')] hover:shadow-[0_0_40px_theme('colors.violet.600')] transition-all duration-300 group rounded-none border border-primary/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <Terminal className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                ACESSAR ARQUIVOS
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
        </Link>
        
        {/* Verification Trigger for Slice 2 */}
        <Button 
          variant="outline"
          size="lg" 
          onClick={() => setIsReportModalOpen(true)}
          className="border-slate-800 bg-black/50 hover:bg-zinc-900 text-slate-400 hover:text-white font-mono h-auto py-8 transition-all duration-300"
        >
          <FileJson className="mr-2 w-5 h-5" />
          REGISTRAR MISSÃO
        </Button>
      </motion.div>

      {/* Footer Status */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 2.0 }}
        className="absolute bottom-4 flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-60"
      >
        <ShieldAlert className="w-4 h-4 text-emerald-500 animate-pulse" />
        <span>SECURE CONNECTION ESTABLISHED // V.1.0.4 // ENCRYPTED</span>
      </motion.div>
      
      <MissionReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
}
