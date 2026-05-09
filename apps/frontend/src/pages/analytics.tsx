import { motion } from "framer-motion";
import { BarChart2, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";
import {
  useGetDashboardSummary,
  useGetSpendByCategory,
  useGetSpendOverTime,
  useGetTopSubscriptions,
} from "@workspace/api-client-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(220, 70%, 55%)",
  "hsl(160, 84%, 39%)",
  "hsl(30, 80%, 55%)",
  "hsl(340, 82%, 52%)",
  "hsl(200, 80%, 50%)",
  "hsl(60, 70%, 50%)",
  "hsl(280, 65%, 55%)",
];

function toMonthly(price: number, cycle: string) {
  if (cycle === "yearly") return price / 12;
  if (cycle === "weekly") return price * 4.33;
  return price;
}

export default function Analytics() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: categoryData, isLoading: catLoading } = useGetSpendByCategory();
  const { data: timeData, isLoading: timeLoading } = useGetSpendOverTime();
  const { data: topSubs, isLoading: topLoading } = useGetTopSubscriptions();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Understand your subscription spending</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-12 w-full" /></CardContent></Card>
            ))
          ) : summary ? (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground font-medium">Monthly Spend</p>
                    <p className="text-3xl font-bold text-primary mt-1">${(summary.monthlySpend ?? 0).toFixed(2)}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground font-medium">Yearly Spend</p>
                    <p className="text-3xl font-bold text-foreground mt-1">${(summary.yearlySpend ?? 0).toFixed(2)}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground font-medium">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{summary.activeCount}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Spend by Category - Pie */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-primary" />
                  Subscription Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : topSubs && topSubs.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={topSubs.map(s => ({
                            ...s,
                            monthlyAmount: toMonthly(s.price, s.billingCycle)
                          }))}
                          dataKey="monthlyAmount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={2}
                        >
                          {topSubs.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`$${(value ?? 0).toFixed(2)}/mo`, "Spend"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {topSubs.map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                            />
                            <span className="text-foreground truncate max-w-[120px]">{item.name}</span>
                          </div>
                          <span className="font-medium text-foreground">${(toMonthly(item.price, item.billingCycle) ?? 0).toFixed(2)}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                    No data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Spend Over Time */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Spending Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : timeData && timeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={timeData} barCategoryGap="35%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v}`}
                        width={50}
                      />
                      <Tooltip
                        formatter={(value: number) => [`$${(value ?? 0).toFixed(2)}`, "Monthly Spend"]}
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {timeData.map((_, idx) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                    No data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Subscriptions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Top Subscriptions by Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : topSubs && topSubs.length > 0 ? (
                <div className="space-y-2">
                  {topSubs.slice(0, 8).map((sub, i) => {
                    const monthly = toMonthly(sub.price, sub.billingCycle);
                    const maxMonthly = toMonthly(topSubs[0].price, topSubs[0].billingCycle);
                    const pct = (monthly / maxMonthly) * 100;
                    return (
                      <div key={sub.id} className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-foreground truncate">{sub.name}</span>
                            <span className="text-muted-foreground ml-4">${(monthly ?? 0).toFixed(2)}/mo</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ 
                                width: `${pct}%`,
                                backgroundColor: CHART_COLORS[i % CHART_COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No subscriptions tracked yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
