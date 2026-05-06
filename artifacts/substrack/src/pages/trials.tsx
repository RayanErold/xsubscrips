import { motion } from "framer-motion";
import { Clock, AlertTriangle, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";
import { useListSubscriptions } from "@workspace/api-client-react";
import { format, parseISO, differenceInDays } from "date-fns";

type Trial = {
  id: number;
  name: string;
  category: string;
  trialEndDate: string;
  price: number;
  currency: string;
  billingCycle: string;
  daysLeft: number;
  status: "active" | "ending-soon" | "expired";
};

function getDaysLeft(trialEndDate: string): number {
  return differenceInDays(parseISO(trialEndDate), new Date());
}

function getTrialStatus(daysLeft: number): "active" | "ending-soon" | "expired" {
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 7) return "ending-soon";
  return "active";
}

function urgencyColor(daysLeft: number) {
  if (daysLeft < 0) return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  if (daysLeft <= 3) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (daysLeft <= 7) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
}

function urgencyProgressColor(daysLeft: number) {
  if (daysLeft < 0) return "bg-gray-400";
  if (daysLeft <= 3) return "bg-red-500";
  if (daysLeft <= 7) return "bg-orange-500";
  return "bg-green-500";
}

function toMonthly(price: number, cycle: string) {
  if (cycle === "yearly") return price / 12;
  if (cycle === "weekly") return price * 4.33;
  return price;
}

export default function Trials() {
  const { data: subscriptions, isLoading } = useListSubscriptions({});

  const trialSubs = (subscriptions ?? []).filter((s) => s.hasTrial && s.trialEndDate);

  const trials: Trial[] = trialSubs.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    trialEndDate: s.trialEndDate!,
    price: s.price,
    currency: s.currency,
    billingCycle: s.billingCycle,
    daysLeft: getDaysLeft(s.trialEndDate!),
    status: getTrialStatus(getDaysLeft(s.trialEndDate!)),
  }));

  const active = trials.filter((t) => t.status === "active");
  const endingSoon = trials.filter((t) => t.status === "ending-soon");
  const expired = trials.filter((t) => t.status === "expired");
  const moneyAtRisk = endingSoon.reduce((acc, t) => acc + toMonthly(t.price, t.billingCycle), 0);

  const summaryCards = [
    { label: "Active Trials", value: active.length, icon: CheckCircle, color: "text-green-500" },
    { label: "Ending Soon", value: endingSoon.length, icon: AlertTriangle, color: "text-orange-500" },
    { label: "Expired", value: expired.length, icon: XCircle, color: "text-muted-foreground" },
    { label: "Money at Risk", value: `$${moneyAtRisk.toFixed(2)}/mo`, icon: DollarSign, color: "text-red-500" },
  ];

  const allTrials = [...endingSoon, ...active, ...expired];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trials</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your free trials before they convert</p>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-10 w-full" /></CardContent></Card>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                      <Icon className={`w-6 h-6 shrink-0 ${card.color}`} />
                      <div>
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Trial List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>)}
          </div>
        ) : allTrials.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No trials tracked</h3>
              <p className="text-sm text-muted-foreground">
                Add a subscription with "Has free trial" enabled to track it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allTrials.map((trial, i) => {
              const totalDays = 30;
              const daysUsed = totalDays - Math.max(trial.daysLeft, 0);
              const progressPct = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));

              return (
                <motion.div
                  key={trial.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={trial.daysLeft <= 3 && trial.daysLeft >= 0 ? "border-red-200 dark:border-red-900/50" : ""}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{trial.name}</span>
                            <Badge variant="outline" className="text-xs">{trial.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Trial ends {format(parseISO(trial.trialEndDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-foreground">${trial.price.toFixed(2)}/{trial.billingCycle === "monthly" ? "mo" : trial.billingCycle === "yearly" ? "yr" : "wk"}</p>
                          <p className="text-xs text-muted-foreground">after trial</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor(trial.daysLeft)}`}>
                            {trial.daysLeft < 0
                              ? "Expired"
                              : trial.daysLeft === 0
                              ? "Ends today"
                              : `${trial.daysLeft} day${trial.daysLeft !== 1 ? "s" : ""} left`}
                          </span>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            {trial.daysLeft < 0 ? "Manage" : "Cancel Trial"}
                          </Button>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${urgencyProgressColor(trial.daysLeft)}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
