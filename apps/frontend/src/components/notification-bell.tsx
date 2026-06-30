import { useState, useRef, useEffect } from "react";
import { Bell, X, Clock, CreditCard, AlertTriangle, CheckCheck, ShieldAlert, Sparkles, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetNotifications, getListSubscriptionsQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const SEEN_KEY = "x_subscription_seen_notifications";
const SNOOZE_KEY = "x_subscription_snoozed_notifications";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
}

function getSnoozedMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const SEVERITY_STYLES = {
  urgent: {
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800/50",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
    dot: "bg-red-500",
    icon: AlertTriangle,
    iconColor: "text-red-500",
  },
  warning: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800/50",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
    dot: "bg-orange-500",
    icon: Clock,
    iconColor: "text-orange-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800/50",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
    dot: "bg-primary",
    icon: CreditCard,
    iconColor: "text-blue-500",
  },
  overlap: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800/50",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
    dot: "bg-purple-500",
    icon: ShieldAlert,
    iconColor: "text-purple-500",
  },
  spike: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/50",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
    dot: "bg-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  leak: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800/50",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
    dot: "bg-rose-500",
    icon: Sparkles,
    iconColor: "text-rose-500",
  },
};

export function NotificationBell() {
  const qc = useQueryClient();
  const { data: notifications = [] } = useGetNotifications({
    query: { queryKey: ["notifications"], refetchInterval: 60_000 },
  });

  const [open, setOpen] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(getSeenIds);
  const [snoozedMap, setSnoozedMap] = useState<Record<string, number>>(getSnoozedMap);
  const [corporateLeakAlerts, setCorporateLeakAlerts] = useState<any[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Parse local business seat leak notifications dynamically
  useEffect(() => {
    try {
      const saved = localStorage.getItem("xsubscrips_corporate_licenses");
      if (saved) {
        const licenses = JSON.parse(saved);
        const wastedCount = licenses.reduce((sum: number, l: any) => sum + (l.seatsPurchased - l.seatsActive), 0);
        if (wastedCount > 0) {
          setCorporateLeakAlerts([
            {
              id: "corp-leak-notification",
              type: "leak",
              title: "Idle Seat Leakage Alert",
              message: `You are losing budget on ${wastedCount} inactive software seats. Run AI Seat Optimization in the Business Suite to prune them.`,
              daysLeft: 0,
              severity: "warning",
            }
          ]);
        } else {
          setCorporateLeakAlerts([]);
        }
      }
    } catch {
      setCorporateLeakAlerts([]);
    }
  }, [open]);

  // Combine & filter out snoozed items
  const activeNotifications = [
    ...corporateLeakAlerts,
    ...(Array.isArray(notifications) ? notifications : [])
  ].filter((n) => {
    const expires = snoozedMap[n.id];
    if (expires && Date.now() < expires) return false;
    return true;
  });

  const unseenCount = activeNotifications.filter((n) => !seenIds.has(n.id)).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openPanel() {
    setOpen((v) => !v);
  }

  function markAllSeen() {
    const updated = new Set([...seenIds, ...activeNotifications.map((n) => n.id)]);
    setSeenIds(updated);
    saveSeenIds(updated);
  }

  function dismissOne(id: string) {
    const updated = new Set([...seenIds, id]);
    setSeenIds(updated);
    saveSeenIds(updated);
  }

  function snoozeAlert(id: string) {
    const current = getSnoozedMap();
    current[id] = Date.now() + 7 * 24 * 60 * 60 * 1000; // Snooze for 7 days
    localStorage.setItem(SNOOZE_KEY, JSON.stringify(current));
    setSnoozedMap(current);
    toast.success("Notification snoozed for 7 days");
  }

  async function handleAutoCancel(subId: number, name: string, notificationId: string) {
    const toastId = toast.loading(`Cancelling subscription "${name}"...`);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
      const response = await fetch(`${API_URL}/api/subscriptions/${subId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Cancellation failed");

      toast.success(`Successfully cancelled subscription "${name}"!`, { id: toastId });
      dismissOne(notificationId);
      
      // Refresh React Query caches
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: getListSubscriptionsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    } catch {
      toast.error("Failed to cancel subscription. Please try again.", { id: toastId });
    }
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={openPanel}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unseenCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 z-50 w-[340px] bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">Notifications</span>
                {activeNotifications.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-primary/10 text-primary border-none">
                    {activeNotifications.length}
                  </Badge>
                )}
              </div>
              {unseenCount > 0 && (
                <button
                  onClick={markAllSeen}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-semibold"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
              {activeNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Subscription alerts will appear here
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {activeNotifications.map((n) => {
                    const alertType = n.type || "info";
                    const styles = SEVERITY_STYLES[alertType as keyof typeof SEVERITY_STYLES] || SEVERITY_STYLES.info;
                    const Icon = styles.icon;
                    const isSeen = seenIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`relative rounded-lg border p-3 transition-opacity ${styles.bg} ${styles.border} ${isSeen ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${styles.iconColor}`} />
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs font-extrabold text-foreground tracking-tight">{n.title}</span>
                              <span className={`text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-full font-bold leading-none ${styles.badge}`}>
                                {n.type === "trial" ? "Trial" : n.type === "renewal" ? "Renewal" : n.type === "overlap" ? "Overlap" : n.type === "spike" ? "Cost Spike" : "Seat Alert"}
                              </span>
                              {!isSeen && (
                                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} ml-auto`} />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-light">{n.message}</p>
                            
                            {/* Actions Footer */}
                            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => snoozeAlert(n.id)}
                                  className="text-[9px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors uppercase tracking-wider"
                                >
                                  <Moon className="w-3 h-3" /> Snooze 7d
                                </button>
                                
                                {n.subscriptionId && (n.type === "trial" || n.type === "renewal") && (
                                  <button
                                    onClick={() => handleAutoCancel(n.subscriptionId, n.subscriptionName || "SaaS", n.id)}
                                    className="text-[9px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 transition-colors uppercase tracking-wider"
                                  >
                                    <X className="w-3 h-3" /> Cancel Sub
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={() => dismissOne(n.id)}
                                className="text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {activeNotifications.length > 0 && (
              <div className="border-t border-border px-4 py-2 text-center bg-muted/20">
                <p className="text-[10px] text-muted-foreground leading-none">
                  AI-driven billing consolidation alarms
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
