import { useState, useRef, useEffect } from "react";
import { Bell, X, Clock, CreditCard, AlertTriangle, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetNotifications } from "@workspace/api-client-react";

const SEEN_KEY = "substrack_seen_notifications";

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
};

export function NotificationBell() {
  const { data: notifications = [] } = useGetNotifications({
    query: { refetchInterval: 60_000 },
  });

  const [open, setOpen] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(getSeenIds);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unseenCount = notifications.filter((n) => !seenIds.has(n.id)).length;

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
    const updated = new Set([...seenIds, ...notifications.map((n) => n.id)]);
    setSeenIds(updated);
    saveSeenIds(updated);
  }

  function dismissOne(id: string) {
    const updated = new Set([...seenIds, id]);
    setSeenIds(updated);
    saveSeenIds(updated);
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
            className="absolute right-0 top-11 z-50 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">Notifications</span>
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {notifications.length}
                  </Badge>
                )}
              </div>
              {unseenCount > 0 && (
                <button
                  onClick={markAllSeen}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No alerts right now</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Trials and renewals will appear here
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1.5">
                  {notifications.map((n) => {
                    const styles = SEVERITY_STYLES[n.severity as keyof typeof SEVERITY_STYLES];
                    const Icon = styles.icon;
                    const isSeen = seenIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`relative rounded-lg border p-3 ${styles.bg} ${styles.border} ${isSeen ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${styles.iconColor}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-semibold text-foreground">{n.title}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${styles.badge}`}>
                                {n.type === "trial" ? "Trial" : "Renewal"}
                              </span>
                              {!isSeen && (
                                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} ml-auto`} />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                          </div>
                          <button
                            onClick={() => dismissOne(n.id)}
                            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0 mt-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border px-4 py-2.5 text-center">
                <p className="text-xs text-muted-foreground">
                  Alerts based on reminder settings per subscription
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
