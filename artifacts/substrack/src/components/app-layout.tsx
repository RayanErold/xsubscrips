import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, List, Clock, PieChart, Settings, Plus, X } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: List },
  { href: "/trials", label: "Trials", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r border-border bg-sidebar shrink-0 md:h-screen sticky top-0 flex flex-col">
        <div className="p-6 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight cursor-pointer">
            <PieChart className="w-6 h-6" />
            SubsTrack
          </Link>
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
