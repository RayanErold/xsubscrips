import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  useCreateSubscription,
  useUpdateSubscription,
  getListSubscriptionsQueryKey,
  getGetDashboardSummaryQueryKey,
  getGetUpcomingRenewalsQueryKey,
  getGetSpendByCategoryQueryKey,
  getGetSpendOverTimeQueryKey,
  getGetTopSubscriptionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { subscriptionFormSchema, type SubscriptionFormValues, CATEGORIES, CURRENCIES, BILLING_CYCLES } from "@/lib/constants";
import type { Subscription } from "@workspace/api-client-react";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription;
}

function todayStr() {
  return format(new Date(), "yyyy-MM-dd");
}

function nextMonthStr() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return format(d, "yyyy-MM-dd");
}

export function SubscriptionFormModal({ open, onOpenChange, subscription }: Props) {
  const qc = useQueryClient();
  const isEdit = !!subscription;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      category: "Entertainment",
      price: 0,
      currency: "USD",
      billingCycle: "monthly",
      startDate: todayStr(),
      nextBillingDate: nextMonthStr(),
      hasTrial: false,
      trialEndDate: null,
      reminderDaysBefore: 3,
      notes: "",
      status: "active",
    },
  });

  const hasTrial = watch("hasTrial");

  useEffect(() => {
    if (open) {
      if (subscription) {
        reset({
          name: subscription.name,
          category: subscription.category,
          price: subscription.price,
          currency: subscription.currency,
          billingCycle: subscription.billingCycle as "monthly" | "yearly" | "weekly",
          startDate: subscription.startDate,
          nextBillingDate: subscription.nextBillingDate,
          hasTrial: subscription.hasTrial,
          trialEndDate: subscription.trialEndDate ?? null,
          reminderDaysBefore: subscription.reminderDaysBefore ?? null,
          notes: subscription.notes ?? "",
          status: subscription.status as "active" | "paused" | "cancelled",
        });
      } else {
        reset({
          name: "",
          category: "Entertainment",
          price: 0,
          currency: "USD",
          billingCycle: "monthly",
          startDate: todayStr(),
          nextBillingDate: nextMonthStr(),
          hasTrial: false,
          trialEndDate: null,
          reminderDaysBefore: 3,
          notes: "",
          status: "active",
        });
      }
    }
  }, [open, subscription, reset]);

  function invalidateAll() {
    qc.invalidateQueries({ queryKey: getListSubscriptionsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    qc.invalidateQueries({ queryKey: getGetUpcomingRenewalsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetSpendByCategoryQueryKey() });
    qc.invalidateQueries({ queryKey: getGetSpendOverTimeQueryKey() });
    qc.invalidateQueries({ queryKey: getGetTopSubscriptionsQueryKey() });
  }

  const createMutation = useCreateSubscription({
    mutation: {
      onSuccess: () => {
        invalidateAll();
        onOpenChange(false);
      },
    },
  });

  const updateMutation = useUpdateSubscription({
    mutation: {
      onSuccess: () => {
        invalidateAll();
        onOpenChange(false);
      },
    },
  });

  const onSubmit = async (data: SubscriptionFormValues) => {
    const payload = {
      ...data,
      trialEndDate: data.hasTrial ? data.trialEndDate ?? null : null,
      reminderDaysBefore: data.reminderDaysBefore ?? null,
      notes: data.notes ?? null,
    };

    if (isEdit && subscription) {
      updateMutation.mutate({ id: subscription.id, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Subscription Name *</Label>
            <Input id="name" {...register("name")} placeholder="Netflix, Spotify..." />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price + Currency + Billing */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Amount *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select value={watch("currency")} onValueChange={(v) => setValue("currency", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Billing Cycle *</Label>
              <Select
                value={watch("billingCycle")}
                onValueChange={(v) => setValue("billingCycle", v as "monthly" | "yearly" | "weekly")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map((c) => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nextBillingDate">Next Billing Date *</Label>
              <Input id="nextBillingDate" type="date" {...register("nextBillingDate")} />
            </div>
          </div>

          <Separator />

          {/* Trial */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hasTrial" className="cursor-pointer">Has Free Trial</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle if this subscription started with a trial</p>
              </div>
              <Switch
                id="hasTrial"
                checked={hasTrial}
                onCheckedChange={(v) => setValue("hasTrial", v)}
              />
            </div>
            {hasTrial && (
              <div className="space-y-1.5">
                <Label htmlFor="trialEndDate">Trial End Date</Label>
                <Input id="trialEndDate" type="date" {...register("trialEndDate")} />
              </div>
            )}
          </div>

          {/* Reminder */}
          <div className="space-y-1.5">
            <Label htmlFor="reminderDaysBefore">Reminder (days before renewal)</Label>
            <Input
              id="reminderDaysBefore"
              type="number"
              min="0"
              placeholder="3"
              {...register("reminderDaysBefore", { valueAsNumber: true })}
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(v) => setValue("status", v as "active" | "paused" | "cancelled")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any notes about this subscription..."
              className="resize-none"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
