import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, DollarSign, CreditCard, Clock, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";
import { SubscriptionFormModal } from "@/components/subscription-form-modal";
import { ServiceIcon } from "@/components/service-icon";
import {
  useGetDashboardSummary,
  useGetUpcomingRenewals,
} from "@workspace/api-client-react";
import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  delay,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay ?? 0 }}
    >
      <Card className={`border ${accent ? "border-primary/20 bg-primary/5" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className={`text-2xl font-bold mt-1 ${accent ? "text-primary" : "text-foreground"}`}>
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? "bg-primary/15" : "bg-muted"}`}>
              <Icon className={`w-5 h-5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: upcoming, isLoading: upcomingLoading } = useGetUpcomingRenewals();

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Your subscription overview</p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Subscription
          </Button>
        </div>

        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Monthly Spend"
              value={`$${(summary.monthlySpend ?? 0).toFixed(2)}`}
              subtitle={`$${(summary.yearlySpend ?? 0).toFixed(0)}/year`}
              icon={DollarSign}
              accent
              delay={0}
            />
            <StatCard
              title="Active Subscriptions"
              value={String(summary.activeCount)}
              icon={CreditCard}
              delay={0.05}
            />
            <StatCard
              title="Trials Ending Soon"
              value={String(summary.trialsEndingSoon)}
              subtitle="Within 7 days"
              icon={Clock}
              delay={0.1}
            />
            <StatCard
              title="Upcoming Renewals"
              value={String(summary.upcomingRenewals)}
              subtitle="Next 30 days"
              icon={Calendar}
              delay={0.15}
            />
          </div>
        ) : null}

        {/* Savings Banner */}
        {summary && summary.savingsOpportunity > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Potential savings: ${(summary.savingsOpportunity ?? 0).toFixed(2)}/month
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  You have paused subscriptions still costing money.
                </p>
              </div>
            </div>
            <Link href="/subscriptions">
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300">
                Review
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Upcoming Renewals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Renewals</h2>
            <Link href="/subscriptions">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {upcomingLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcoming && upcoming.length > 0 ? (
            <div className="space-y-2">
              {upcoming.map((sub, i) => {
                const daysLeft = differenceInDays(parseISO(sub.nextBillingDate), new Date());
                const isUrgent = daysLeft <= 3;
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <ServiceIcon name={sub.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{sub.name}</p>
                            <Badge variant="outline" className="text-xs">{sub.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {format(parseISO(sub.nextBillingDate), "MMM d, yyyy")}
                            {" · "}
                            <span className={isUrgent ? "text-destructive font-medium" : ""}>
                              {daysLeft === 0 ? "Today" : `in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                            </span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-foreground">${(sub.price ?? 0).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{sub.billingCycle}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No renewals in the next 30 days</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <SubscriptionFormModal open={addOpen} onOpenChange={setAddOpen} />
    </AppLayout>
  );
}
