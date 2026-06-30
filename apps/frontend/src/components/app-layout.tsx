import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, List, Clock, PieChart, Settings, LogOut, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { NotificationBell } from "./notification-bell";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: List },
  { href: "/trials", label: "Trials", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/business", label: "Business Suite", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(124,58,237,0.25)]">
      <defs>
        <linearGradient id="logo-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logo-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path 
        d="M26 22 L46 50 L26 78 L38 78 L58 50 L38 22 Z" 
        fill="url(#logo-violet)" 
        className="opacity-95" 
      />
      <path 
        d="M74 22 L54 50 L74 78 L62 78 L42 50 L62 22 Z" 
        fill="url(#logo-cyan)" 
        className="opacity-90" 
      />
    </svg>
  );
}

function XSubscriptionLogo() {
  return (
    <div className="flex items-center gap-2.5 group">
      <BrandLogo size={30} />
      <span className="font-bold text-lg tracking-tight text-foreground">Xsubscrips</span>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden">
      {/* Premium glowing purple gradient backgrounds to ensure 100% design consistency with the landing page! */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#C084FC] to-[#818CF8] opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#E879F9] to-[#C084FC] opacity-[0.05] rounded-full blur-[140px] pointer-events-none" />

      <aside className="w-full md:w-64 border-r border-border bg-sidebar shrink-0 md:h-screen sticky top-0 flex flex-col z-10">
        <div className="p-5 pb-4 flex items-center justify-between">
          <Link href="/dashboard" className="cursor-pointer">
            <XSubscriptionLogo />
          </Link>
          <NotificationBell />
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto hidden md:block">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${isActive ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 hidden md:block border-t border-border mt-auto">
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 border-b border-border gap-2 scrollbar-none items-center">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`gap-2 whitespace-nowrap ${isActive ? "bg-primary/10 text-primary" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          <div className="h-4 w-[1px] bg-border mx-1 shrink-0" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="gap-2 whitespace-nowrap text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden z-10">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
