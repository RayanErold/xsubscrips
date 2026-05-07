import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, List, Clock, PieChart, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { NotificationBell } from "./notification-bell";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: List },
  { href: "/trials", label: "Trials", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SubsTrackLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Product icon mark */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
        style={{
          background: "linear-gradient(135deg, hsl(262, 83%, 62%) 0%, hsl(280, 75%, 52%) 100%)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="5" height="2" rx="1" fill="white" fillOpacity="0.9" />
          <rect x="2" y="7" width="8" height="2" rx="1" fill="white" fillOpacity="0.9" />
          <rect x="2" y="11" width="6" height="2" rx="1" fill="white" fillOpacity="0.9" />
          <circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.35" />
          <path d="M11 12 L12 13 L13.5 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="font-bold text-lg tracking-tight text-foreground">SubsTrack</span>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r border-border bg-sidebar shrink-0 md:h-screen sticky top-0 flex flex-col">
        <div className="p-5 pb-4 flex items-center justify-between">
          <Link href="/dashboard" className="cursor-pointer">
            <SubsTrackLogo />
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
        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 border-b border-border gap-2 scrollbar-none">
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
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
