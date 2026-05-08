import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/app-layout";
import { SubscriptionFormModal } from "@/components/subscription-form-modal";
import { ServiceIcon } from "@/components/service-icon";
import {
  useListSubscriptions,
  useDeleteSubscription,
  getListSubscriptionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { CATEGORIES } from "@/lib/constants";
import type { Subscription } from "@workspace/api-client-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function toMonthly(price: number, cycle: string) {
  if (cycle === "yearly") return price / 12;
  if (cycle === "weekly") return price * 4.33;
  return price;
}

export default function Subscriptions() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: subscriptions, isLoading } = useListSubscriptions(
    statusFilter !== "all" ? { status: statusFilter as "active" | "paused" | "cancelled" } : {}
  );

  const deleteMutation = useDeleteSubscription({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListSubscriptionsQueryKey() });
        setDeleteId(null);
      },
    },
  });

  const filtered = (subscriptions ?? []).filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalMonthly = filtered
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + toMonthly(s.price, s.billingCycle), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filtered.length} subscription{filtered.length !== 1 ? "s" : ""}
              {totalMonthly > 0 && ` · $${totalMonthly.toFixed(2)}/mo active`}
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">
                {search || statusFilter !== "all" || categoryFilter !== "all"
                  ? "No subscriptions match your filters"
                  : "No subscriptions yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {search || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Add your first subscription to get started."}
              </p>
              {!search && statusFilter === "all" && categoryFilter === "all" && (
                <Button onClick={() => setAddOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="hover:shadow-sm transition-shadow group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Service icon */}
                        <ServiceIcon name={sub.name} size="md" />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{sub.name}</span>
                            <Badge variant="outline" className="text-xs">{sub.category}</Badge>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[sub.status as keyof typeof STATUS_COLORS]}`}>
                              {sub.status}
                            </span>
                            {sub.hasTrial && (
                              <Badge variant="secondary" className="text-xs">Trial</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Renews {format(parseISO(sub.nextBillingDate), "MMM d, yyyy")} · {sub.billingCycle}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-semibold text-foreground">
                            ${sub.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${toMonthly(sub.price, sub.billingCycle).toFixed(2)}/mo
                          </p>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditSub(sub)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteId(sub.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <SubscriptionFormModal open={addOpen} onOpenChange={setAddOpen} />
      {editSub && (
        <SubscriptionFormModal
          open={!!editSub}
          onOpenChange={(open) => !open && setEditSub(null)}
          subscription={editSub}
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This subscription will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId !== null && deleteMutation.mutate({ id: deleteId })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
