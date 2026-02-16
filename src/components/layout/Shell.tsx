"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, FileText, BadgeCheck, ShieldAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden scanned-paper font-sans">
      {/* Sidebar (Esquerda): Minimalista */}
      <aside className="w-20 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-md flex flex-col items-center py-6 gap-8 z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        
        {/* Logo / Badge */}
        <div className="flex flex-col items-center justify-center gap-1 group cursor-pointer">
          <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full border border-primary/20 neon-glow group-hover:bg-primary/20 transition-all duration-500">
             <ShieldAlert className="text-primary w-6 h-6 group-hover:animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-primary/60 group-hover:text-primary transition-colors">OCP</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 w-full px-2 items-center flex-1">
          <NavIcon 
            href="/" 
            icon={LayoutDashboard} 
            active={pathname === "/"} 
            label="MURAL" 
          />
          <NavIcon 
            href="/cases" 
            icon={FileText} 
            active={pathname.startsWith("/cases")} 
            label="ARQUIVO" 
          />
          <NavIcon 
            href="/dashboard" 
            icon={BadgeCheck} 
            active={pathname === "/dashboard"} 
            label="AGENT" 
          />
        </nav>

        {/* Footer / System Status */}
        <div className="mb-4">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_theme('colors.emerald.500')]" title="System Online" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Bar for context/breadcrumbs could go here, keeping it minimal for now */}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 overflow-auto p-0 relative [perspective:1000px] w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Decorative overlaid scanlines or vignette if desired */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-40" />
    </div>
  );
}

function NavIcon({ href, icon: Icon, active, label }: { href: string; icon: LucideIcon; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300 w-12 h-12",
        active 
          ? "bg-primary/20 text-primary neon-glow border border-primary/30" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10"
      )}
    >
      <Icon size={20} className={cn("transition-transform duration-300", active && "scale-110")} />
      
      {/* Tooltip-like Label */}
      <div className="absolute left-14 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-xs font-mono border border-border opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50 pointer-events-none whitespace-nowrap">
        {label}
        {/* Little triangle arrow */}
        <div className="absolute top-1/2 -left-1 w-2 h-2 bg-popover border-l border-b border-border transform rotate-45 -translate-y-1/2" />
      </div>
      
      {/* Active Indicator Line */}
      {active && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_theme('colors.violet.600')]"
        />
      )}
    </Link>
  );
}
