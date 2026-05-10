import { useState, useEffect } from "react";
import { Bell, Moon, Sun, Monitor, Download, Trash2, User, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/app-layout";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useGetUserSettings, useUpdateUserSettings } from "@workspace/api-client-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { data: userSettings, isLoading } = useGetUserSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateUserSettings({
    mutation: {
      onSuccess: () => {
        toast.success("Settings updated successfully");
      },
      onError: (error) => {
        toast.error("Failed to update settings");
        console.error(error);
      }
    }
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    if (userSettings?.fullName) {
      setTempName(userSettings.fullName);
    }
  }, [userSettings]);

  const handleUpdatePreference = (key: string, value: any) => {
    updateSettings({ data: { [key]: value } });
  };

  const handleSaveName = () => {
    updateSettings({ data: { fullName: tempName } });
    setIsEditingName(false);
  };

  const handleExport = () => {
    const link = document.createElement("a");
    link.href = "/api/subscriptions/export";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export started — check your downloads");
  };

  const handleDeleteAccount = () => {
    toast.error("Delete account feature coming soon");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
          </div>
          {isUpdating && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </div>
          )}
        </div>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-foreground">Display Name</p>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      value={tempName} 
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter your name"
                      className="max-w-[240px]"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveName}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      setIsEditingName(false);
                      setTempName(userSettings?.fullName || "");
                    }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <p className="text-sm text-foreground mt-0.5 font-semibold">
                      {userSettings?.fullName || "Not set"}
                    </p>
                    <p className="text-xs text-muted-foreground">{userSettings?.email}</p>
                  </div>
                )}
              </div>
              {!isEditingName && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>Edit</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Control when and how you get reminded about subscriptions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "trialReminders" as const, label: "Trial expiry reminders", desc: "Get notified when a free trial is about to end" },
              { key: "renewalReminders" as const, label: "Renewal reminders", desc: "Get notified before subscriptions renew" },
              { key: "weeklySummary" as const, label: "Weekly summary", desc: "Receive a weekly overview of your spending" },
              { key: "emailDigest" as const, label: "Email digest", desc: "Get a monthly email summary of your subscriptions" },
            ].map((item, i) => (
              <div key={item.key}>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor={item.key} className="text-sm font-medium text-foreground cursor-pointer">
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.key}
                    checked={userSettings?.[item.key] ?? false}
                    disabled={isUpdating}
                    onCheckedChange={(checked) => handleUpdatePreference(item.key, checked)}
                  />
                </div>
                {i < 3 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="w-4 h-4 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">Select your preferred display mode</p>
              </div>
              <div className="flex gap-2">
                {[
                  { value: "light", icon: Sun, label: "Light" },
                  { value: "dark", icon: Moon, label: "Dark" },
                  { value: "system", icon: Monitor, label: "System" },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <Button
                      key={t.value}
                      variant={theme === t.value ? "default" : "outline"}
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setTheme(t.value)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Currency & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Default Currency</p>
                <p className="text-xs text-muted-foreground mt-0.5">Used for displaying totals</p>
              </div>
              <Select 
                value={userSettings?.currency || "USD"} 
                onValueChange={(val) => handleUpdatePreference("currency", val)}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">Export Data</p>
                <p className="text-xs text-muted-foreground mt-0.5">Download your subscription data as CSV</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions that affect your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete your account and all subscription data.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
