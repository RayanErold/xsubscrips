import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Plus, DollarSign, Users, ShieldAlert, Zap, 
  Trash2, Check, ArrowUpRight, TrendingUp, TrendingDown, Sparkles, Building, ChevronRight, UserCheck, Trash, CreditCard, Search, Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// Premium HSL theme colors consistent with the landing page design palette
const COLORS = ["#7C3AED", "#A78BFA", "#C084FC", "#F472B6"];

const DEPT_BUDGETS = {
  Engineering: 2500,
  Design: 1000,
  Marketing: 1500,
  "HR & Admin": 800,
};

interface License {
  id: string;
  name: string;
  category: string;
  department: string;
  seatsPurchased: number;
  seatsActive: number;
  pricePerSeat: number;
  logo: string;
}

interface FlaggedCharge {
  id: string;
  employee: string;
  dept: string;
  service: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "dismissed";
}

interface EmployeeSeat {
  id: string;
  name: string;
  email: string;
  department: string;
  toolName: string;
  toolId: string;
  provisionedAt: string;
  lastActive: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  savings: number;
  details: string;
  applied: boolean;
}

const defaultCorporateLicenses: License[] = [
  { id: "slack", name: "Slack Enterprise", category: "Communication", department: "Engineering", seatsPurchased: 10, seatsActive: 8, pricePerSeat: 15, logo: "S" },
  { id: "figma", name: "Figma Pro", category: "Design", department: "Design", seatsPurchased: 5, seatsActive: 5, pricePerSeat: 20, logo: "F" },
  { id: "zoom", name: "Zoom Pro", category: "Communication", department: "HR & Admin", seatsPurchased: 6, seatsActive: 4, pricePerSeat: 15, logo: "Z" },
  { id: "canva", name: "Canva Business", category: "Marketing", department: "Marketing", seatsPurchased: 12, seatsActive: 9, pricePerSeat: 12, logo: "C" },
];

const defaultFlaggedCharges: FlaggedCharge[] = [
  { id: "fc-1", employee: "Sarah Connor", dept: "Engineering", service: "GitHub Copilot", amount: 19.00, date: "2 hours ago", status: "pending" },
  { id: "fc-2", employee: "James Bond", dept: "Marketing", service: "Midjourney Pro", amount: 30.00, date: "1 day ago", status: "pending" },
];

const defaultEmployeeSeats: EmployeeSeat[] = [
  { id: "emp-1", name: "Alice Vance", email: "alice@eroldrayan.com", department: "Engineering", toolName: "Slack Enterprise", toolId: "slack", provisionedAt: "2026-05-12", lastActive: "2026-06-29" },
  { id: "emp-2", name: "Bob Miller", email: "bob@eroldrayan.com", department: "Design", toolName: "Figma Pro", toolId: "figma", provisionedAt: "2026-04-18", lastActive: "2026-06-28" },
  { id: "emp-3", name: "Charlie Davis", email: "charlie@eroldrayan.com", department: "Engineering", toolName: "Slack Enterprise", toolId: "slack", provisionedAt: "2026-03-05", lastActive: "2026-06-30" },
  { id: "emp-4", name: "Diane Ross", email: "diane@eroldrayan.com", department: "Marketing", toolName: "Canva Business", toolId: "canva", provisionedAt: "2026-05-20", lastActive: "2026-06-25" },
  { id: "emp-5", name: "Ethan Hunt", email: "ethan@eroldrayan.com", department: "HR & Admin", toolName: "Zoom Pro", toolId: "zoom", provisionedAt: "2026-01-15", lastActive: "2026-06-27" },
];

export default function BusinessSuite() {
  const [licenses, setLicenses] = useState<License[]>(() => {
    const saved = localStorage.getItem("xsubscrips_corporate_licenses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCorporateLicenses;
      }
    }
    return defaultCorporateLicenses;
  });

  const [flaggedCharges, setFlaggedCharges] = useState<FlaggedCharge[]>(() => {
    const saved = localStorage.getItem("xsubscrips_flagged_charges");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultFlaggedCharges;
      }
    }
    return defaultFlaggedCharges;
  });

  const [employeeSeats, setEmployeeSeats] = useState<EmployeeSeat[]>(() => {
    const saved = localStorage.getItem("xsubscrips_employee_seats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultEmployeeSeats;
      }
    }
    return defaultEmployeeSeats;
  });

  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(() => {
    const saved = localStorage.getItem("xsubscrips_ai_recommendations");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "rec-1", title: "Downgrade Idle Engineering Seats", savings: 30, details: "Engineering department has 8 active seats but 10 purchased for Slack Enterprise.", applied: false },
      { id: "rec-2", title: "Consolidate Marketing Canva Seats", savings: 36, details: "Canva Business has 9 active seats but is billing for 12 purchased licenses.", applied: false },
      { id: "rec-3", title: "Trim Inactive HR Zoom Seats", savings: 30, details: "Zoom Pro has 2 unused seats allocated to HR division.", applied: false },
    ];
  });

  const [activeTab, setActiveTab] = useState<"licenses" | "directory">("licenses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [addLicenseOpen, setAddLicenseOpen] = useState(false);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [addChargeOpen, setAddChargeOpen] = useState(false);
  
  // Custom License Form States
  const [newLicName, setNewLicName] = useState("");
  const [newLicCategory, setNewLicCategory] = useState("Software");
  const [newLicDept, setNewLicDept] = useState("Engineering");
  const [newLicPurchased, setNewLicPurchased] = useState("10");
  const [newLicActive, setNewLicActive] = useState("8");
  const [newLicPrice, setNewLicPrice] = useState("15");

  // Provision Form States
  const [selectedLicenseId, setSelectedLicenseId] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  // Flagged Charge Form States
  const [newChargeEmployee, setNewChargeEmployee] = useState("");
  const [newChargeDept, setNewChargeDept] = useState("Engineering");
  const [newChargeService, setNewChargeService] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState("19");

  // Persist State Updates
  useEffect(() => {
    localStorage.setItem("xsubscrips_corporate_licenses", JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem("xsubscrips_flagged_charges", JSON.stringify(flaggedCharges));
  }, [flaggedCharges]);

  useEffect(() => {
    localStorage.setItem("xsubscrips_employee_seats", JSON.stringify(employeeSeats));
  }, [employeeSeats]);

  useEffect(() => {
    localStorage.setItem("xsubscrips_ai_recommendations", JSON.stringify(aiRecommendations));
  }, [aiRecommendations]);

  // Compute Live Metrics
  const totalMonthlySpend = licenses.reduce(
    (acc, lic) => acc + lic.seatsPurchased * lic.pricePerSeat,
    0
  );

  const activeSeatsSpend = licenses.reduce(
    (acc, lic) => acc + lic.seatsActive * lic.pricePerSeat,
    0
  );

  const wastedMonthlySpend = totalMonthlySpend - activeSeatsSpend;
  const activeCount = licenses.length;
  const totalEmployeesCount = employeeSeats.length;

  // Group Cost Allocation dynamically by department
  const deptAllocation = licenses.reduce((acc: { [key: string]: number }, lic) => {
    const dept = lic.department || "Other";
    const cost = lic.seatsPurchased * lic.pricePerSeat;
    acc[dept] = (acc[dept] || 0) + cost;
    return acc;
  }, {});

  const pieChartData = Object.keys(deptAllocation).map(name => ({
    name,
    value: deptAllocation[name]
  }));

  // Auto-optimize all active licenses
  const handleAutoOptimize = () => {
    if (licenses.length === 0) {
      toast.error("Please add at least one corporate license subscription to audit!");
      return;
    }
    
    setIsOptimizing(true);
    toast.info("Running AI seat optimization audit on your active stack...", { duration: 1500 });
    
    setTimeout(() => {
      setLicenses(prev => 
        prev.map(lic => ({
          ...lic,
          seatsPurchased: lic.seatsActive
        }))
      );
      setAiRecommendations(prev => prev.map(rec => ({ ...rec, applied: true })));
      setIsOptimizing(false);
      toast.success(`AI Seat Optimization completed! Pruned idle seat counts, saving $${wastedMonthlySpend.toLocaleString()}/mo instantly!`, {
        duration: 4000,
        icon: <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
      });
    }, 2000);
  };

  // Apply single AI recommendation
  const handleApplyRecommendation = (recId: string, savings: number, title: string) => {
    setAiRecommendations(prev => prev.map(r => r.id === recId ? { ...r, applied: true } : r));
    
    if (recId === "rec-1") {
      setLicenses(prev => prev.map(l => l.id === "slack" ? { ...l, seatsPurchased: l.seatsActive } : l));
    } else if (recId === "rec-2") {
      setLicenses(prev => prev.map(l => l.id === "canva" ? { ...l, seatsPurchased: l.seatsActive } : l));
    } else if (recId === "rec-3") {
      setLicenses(prev => prev.map(l => l.id === "zoom" ? { ...l, seatsPurchased: l.seatsActive } : l));
    }

    toast.success(`Applied: "${title}". Saved $${savings}/mo!`, {
      icon: <Sparkles className="w-5.5 h-5.5 text-amber-500 fill-amber-500" />
    });
  };

  // Add a brand new custom corporate license
  const handleAddLicenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLicName.trim()) {
      toast.error("Please enter a tool or vendor name");
      return;
    }

    const purchasedNum = parseInt(newLicPurchased) || 0;
    const activeNum = parseInt(newLicActive) || 0;
    const priceNum = parseFloat(newLicPrice) || 0;

    if (activeNum > purchasedNum) {
      toast.error("Active seats cannot exceed total purchased seats!");
      return;
    }

    const newLicId = Math.random().toString(36).substring(7);
    const newLic: License = {
      id: newLicId,
      name: newLicName.trim(),
      category: newLicCategory,
      department: newLicDept,
      seatsPurchased: purchasedNum,
      seatsActive: activeNum,
      pricePerSeat: priceNum,
      logo: newLicName.charAt(0).toUpperCase()
    };

    setLicenses(prev => [...prev, newLic]);
    toast.success(`SaaS License for "${newLicName}" added and audited!`);
    
    // Reset Form
    setNewLicName("");
    setNewLicPurchased("10");
    setNewLicActive("8");
    setNewLicPrice("15");
    setAddLicenseOpen(false);
  };

  // Add custom flagged employee card charge
  const handleAddChargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChargeEmployee.trim()) {
      toast.error("Please enter employee name");
      return;
    }
    if (!newChargeService.trim()) {
      toast.error("Please enter software name");
      return;
    }

    const amtNum = parseFloat(newChargeAmount) || 0;

    const newCharge: FlaggedCharge = {
      id: Math.random().toString(36).substring(7),
      employee: newChargeEmployee.trim(),
      dept: newChargeDept,
      service: newChargeService.trim(),
      amount: amtNum,
      date: "Just now",
      status: "pending"
    };

    setFlaggedCharges(prev => [newCharge, ...prev]);
    toast.success(`Simulated flagged charge for "${newChargeService}" logged!`);
    
    // Reset Form
    setNewChargeEmployee("");
    setNewChargeService("");
    setNewChargeAmount("19");
    setAddChargeOpen(false);
  };

  // Remove corporate license
  const handleDeleteLicense = (id: string, name: string) => {
    setLicenses(prev => prev.filter(lic => lic.id !== id));
    setEmployeeSeats(prev => prev.filter(s => s.toolId !== id));
    toast.success(`Removed "${name}" from corporate list.`);
  };

  // Provision an active seat
  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicenseId) {
      toast.error("Please select a corporate tool");
      return;
    }
    if (!employeeName.trim()) {
      toast.error("Please provide employee name");
      return;
    }
    if (!employeeEmail.trim()) {
      toast.error("Please provide employee email");
      return;
    }

    const lic = licenses.find(l => l.id === selectedLicenseId);
    if (!lic) return;

    setLicenses(prev => 
      prev.map(l => {
        if (l.id === selectedLicenseId) {
          const nextActive = l.seatsActive + 1;
          const nextPurchased = nextActive > l.seatsPurchased ? nextActive : l.seatsPurchased;
          return {
            ...l,
            seatsActive: nextActive,
            seatsPurchased: nextPurchased
          };
        }
        return l;
      })
    );

    const newSeat: EmployeeSeat = {
      id: Math.random().toString(36).substring(7),
      name: employeeName.trim(),
      email: employeeEmail.trim(),
      department: lic.department,
      toolName: lic.name,
      toolId: lic.id,
      provisionedAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    };

    setEmployeeSeats(prev => [...prev, newSeat]);
    toast.success(`Successfully provisioned seat license to ${employeeEmail}!`);
    
    setEmployeeName("");
    setEmployeeEmail("");
    setProvisionOpen(false);
  };

  // Deprovision a seat
  const handleDeprovision = (seatId: string, name: string, toolId: string, toolName: string) => {
    setEmployeeSeats(prev => prev.filter(s => s.id !== seatId));
    setLicenses(prev => prev.map(lic => {
      if (lic.id === toolId) {
        return {
          ...lic,
          seatsActive: Math.max(0, lic.seatsActive - 1)
        };
      }
      return lic;
    }));
    toast.success(`Deprovisioned ${name} from ${toolName}. Active seat count updated!`);
  };

  // Action on corporate card flagged charges
  const handleCardCharge = (id: string, action: "approved" | "dismissed", service: string, amount: number, dept: string) => {
    setFlaggedCharges(prev => prev.filter(c => c.id !== id));
    
    if (action === "approved") {
      const newLic: License = {
        id: Math.random().toString(36).substring(7),
        name: service,
        category: "Individual SaaS",
        department: dept,
        seatsPurchased: 1,
        seatsActive: 1,
        pricePerSeat: amount,
        logo: service.charAt(0).toUpperCase()
      };
      setLicenses(prev => [...prev, newLic]);
      toast.success(`Consolidated "${service}" charge! Automatically imported into corporate audit log.`);
    } else {
      toast.info(`Dismissed transaction from audit.`);
    }
  };

  const filteredSeats = employeeSeats.filter(seat => 
    seat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seat.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seat.toolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        
        {/* Business Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold border-none text-[9px] uppercase px-2 py-0.5 rounded-full">
                Business Workspace
              </Badge>
              <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Erold Rayan Ventures Inc.
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mt-1 tracking-tight flex items-center gap-2">
              Corporate Spending Suite
            </h1>
            <p className="text-muted-foreground text-sm">
              Consolidate software seats, audit utilization rates, and eliminate duplicate SaaS licenses.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Button 
              variant="outline"
              disabled={isOptimizing || wastedMonthlySpend === 0}
              onClick={handleAutoOptimize}
              className="gap-2 border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 font-bold"
            >
              <Sparkles className={`w-4 h-4 text-purple-600 ${isOptimizing ? "animate-spin" : ""}`} />
              <span>{isOptimizing ? "Optimizing..." : "AI Auto-Optimize"}</span>
            </Button>
            
            <Button 
              onClick={() => {
                if (licenses.length === 0) {
                  toast.error("Please add at least one corporate license tool first!");
                  return;
                }
                setSelectedLicenseId(licenses[0].id);
                setProvisionOpen(true);
              }}
              variant="outline"
              className="gap-2 border-slate-200 font-bold"
            >
              <UserCheck className="w-4 h-4" /> Provision Seat
            </Button>

            <Button onClick={() => setAddLicenseOpen(true)} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-md">
              <Plus className="w-4 h-4" /> Add Corporate License
            </Button>
          </div>
        </div>

        {/* Dynamic High-Level Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Spend */}
          <Card className="border border-purple-100/80 shadow-sm relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Total Monthly Spend</p>
              <div className="text-3xl font-black text-[#7C3AED] mt-1">
                ${totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                <span>Aggregated billing costs</span>
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Waste Leakage */}
          <Card className={`border shadow-sm transition-all duration-300 ${wastedMonthlySpend > 0 ? "border-amber-200 bg-amber-50/30" : "border-emerald-100 bg-emerald-50/20"}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Unused Seat Leaks</p>
                {wastedMonthlySpend > 0 && (
                  <Badge variant="outline" className="border-amber-300 text-amber-800 bg-amber-100 animate-pulse text-[8px] font-bold">
                    Audit Available
                  </Badge>
                )}
              </div>
              <div className={`text-3xl font-black mt-1 ${wastedMonthlySpend > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                ${wastedMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {wastedMonthlySpend > 0 ? (
                  <span>Saving available by trimming <strong>{licenses.reduce((acc, l) => acc + (l.seatsPurchased - l.seatsActive), 0)}</strong> idle licenses.</span>
                ) : (
                  <span className="text-emerald-700 font-medium">🎉 Zero seat leakages detected. Perfect efficiency!</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Utilization Percentage */}
          <Card className="border border-purple-100/80 shadow-sm bg-white">
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Seat Utilization Rate</p>
              <div className="text-3xl font-black text-foreground mt-1">
                {totalMonthlySpend > 0 ? ((activeSeatsSpend / totalMonthlySpend) * 100).toFixed(0) : "0"}%
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${totalMonthlySpend > 0 ? (activeSeatsSpend / totalMonthlySpend) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Managed Seats */}
          <Card className="border border-purple-100/80 shadow-sm bg-white">
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Provisioned Employees</p>
              <div className="text-3xl font-black text-foreground mt-1">
                {totalEmployeesCount} Seats Allocated
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Spanning <strong>{activeCount}</strong> SaaS tools</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Budgets & Spend Limits */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Division Budget Allocation & Spending Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {Object.entries(DEPT_BUDGETS).map(([dept, limit]) => {
              const currentSpend = licenses
                .filter(lic => lic.department === dept)
                .reduce((sum, lic) => sum + lic.seatsPurchased * lic.pricePerSeat, 0);
              const pct = Math.min(100, Math.round((currentSpend / limit) * 100));
              const isOver = currentSpend > limit;
              const isWarning = currentSpend > limit * 0.8 && currentSpend <= limit;

              return (
                <Card key={dept} className={`border shadow-sm transition-all duration-300 relative overflow-hidden bg-white ${isOver ? "border-red-200 bg-red-50/10" : "border-slate-100"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">{dept}</span>
                      {isOver ? (
                        <Badge className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 border-none">Over Budget</Badge>
                      ) : isWarning ? (
                        <Badge className="bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 border-none">Warning</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border-none">Healthy</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-lg font-black text-foreground">${currentSpend.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">/ ${limit}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${isOver ? "bg-red-500 animate-pulse" : isWarning ? "bg-amber-500" : "bg-purple-600"}`} 
                        style={{ width: `${pct || 2}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-2 font-medium">
                      {isOver 
                        ? `Exceeded limit by $${(currentSpend - limit).toLocaleString()}!` 
                        : `$${(limit - currentSpend).toLocaleString()} remaining`}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Empty State vs Dynamic content */}
        {licenses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200/60 rounded-3xl p-16 text-center bg-purple-50/10"
          >
            <div className="w-16 h-16 bg-purple-100 text-[#7C3AED] rounded-2xl flex items-center justify-center shadow-inner mb-5">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-purple-950 mb-1">Corporate SaaS Audit starts clean!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-6">
              Track business subscription seat sizes, department spending ratios, and optimize license leaks. 
              Click below to add your first active corporate license.
            </p>
            <Button onClick={() => setAddLicenseOpen(true)} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6">
              <Plus className="w-4 h-4" /> Add Your First Corporate License
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Pie Chart and AI Advisor details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Department Allocation Chart */}
              <Card className="lg:col-span-7 border border-purple-100/80 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Spend Allocation by Business Division</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium">Department-level recurring cost share breakdown</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 flex justify-center items-center h-[280px]">
                  {pieChartData.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Add license costs to render chart allocation</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* AI seat advisor recommendations */}
              <Card className="lg:col-span-5 border border-purple-100/80 shadow-sm bg-white flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-purple-600" /> AI Optimization Recommendations
                  </CardTitle>
                  <CardDescription className="text-xs">Actionable seat-pruning alerts to conserve corporate spending</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2">
                    {aiRecommendations.map((rec) => (
                      <div key={rec.id} className={`p-3 rounded-xl border text-xs transition-colors flex items-center justify-between gap-3 ${rec.applied ? "bg-slate-50 border-slate-200 opacity-60" : "bg-purple-50/30 border-purple-100"}`}>
                        <div className="space-y-0.5 text-left">
                          <p className="font-bold text-slate-800 flex items-center gap-1">
                            {rec.applied ? (
                              <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                            )}
                            <span className={rec.applied ? "line-through text-slate-500" : ""}>{rec.title}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{rec.details}</p>
                          {!rec.applied && (
                            <p className="text-[10px] text-emerald-600 font-extrabold mt-1">Instant Saving: +${rec.savings}/mo</p>
                          )}
                        </div>
                        
                        {!rec.applied && (
                          <Button 
                            size="sm"
                            onClick={() => handleApplyRecommendation(rec.id, rec.savings, rec.title)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] py-1 px-2.5 h-auto rounded-lg shrink-0 shadow-sm"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Current Cost:</span>
                      <span className="font-bold text-slate-800">${totalMonthlySpend.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Optimized Cost:</span>
                      <span className="font-bold text-purple-700">${activeSeatsSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="font-bold text-emerald-700">Available Savings:</span>
                      <span className="font-black text-emerald-600">+${wastedMonthlySpend.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table and Seat Directory Tab Panel */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2 gap-4">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab("licenses")}
                    className={`text-sm font-extrabold pb-2 border-b-2 transition-all leading-none ${activeTab === "licenses" ? "border-purple-600 text-purple-700" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    SaaS License Audit ({licenses.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab("directory")}
                    className={`text-sm font-extrabold pb-2 border-b-2 transition-all leading-none ${activeTab === "directory" ? "border-purple-600 text-purple-700" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    Employee Seat Directory ({employeeSeats.length})
                  </button>
                </div>
                
                {activeTab === "directory" && (
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search employee or tool..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                    />
                  </div>
                )}
              </div>

              {activeTab === "licenses" ? (
                <Card className="border border-purple-100/80 shadow-sm bg-white">
                  <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-muted-foreground font-semibold bg-slate-50/50">
                          <th className="p-3">Service Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Division</th>
                          <th className="p-3 text-center">Active Seats</th>
                          <th className="p-3 text-center">Purchased Seats</th>
                          <th className="p-3 text-center">Price / Seat</th>
                          <th className="p-3 text-right">Idle Cost Leak</th>
                          <th className="p-3 text-right">Total Bill</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {licenses.map((lic) => {
                          const idleCount = lic.seatsPurchased - lic.seatsActive;
                          const idleCost = idleCount * lic.pricePerSeat;
                          const totalCost = lic.seatsPurchased * lic.pricePerSeat;
                          
                          return (
                            <tr key={lic.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-purple-100/80 text-[#7C3AED] flex items-center justify-center font-black shadow-sm text-[10px]">
                                  {lic.logo}
                                </span>
                                <span className="font-bold text-foreground">{lic.name}</span>
                              </td>
                              <td className="p-3 text-muted-foreground">{lic.category}</td>
                              <td className="p-3">
                                <Badge variant="outline" className="border-purple-200 text-purple-800 bg-purple-50 text-[9px] font-bold">
                                  {lic.department}
                                </Badge>
                              </td>
                              <td className="p-3 text-center text-foreground font-bold">{lic.seatsActive}</td>
                              <td className="p-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded font-bold ${idleCount > 0 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                                  {lic.seatsPurchased}
                                </span>
                              </td>
                              <td className="p-3 text-center text-muted-foreground">${lic.pricePerSeat}/mo</td>
                              <td className={`p-3 text-right font-bold ${idleCost > 0 ? "text-amber-600" : "text-muted-foreground/40"}`}>
                                {idleCost > 0 ? `$${idleCost.toLocaleString()}/mo` : "None"}
                              </td>
                              <td className="p-3 text-right font-black text-foreground">${totalCost.toLocaleString()}</td>
                              <td className="p-3 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteLicense(lic.id, lic.name)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 h-auto rounded-lg"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-purple-100/80 shadow-sm bg-white">
                  <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-muted-foreground font-semibold bg-slate-50/50">
                          <th className="p-3">Employee Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Allocated Tool</th>
                          <th className="p-3">Provisioned Date</th>
                          <th className="p-3">Last Active</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {filteredSeats.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-muted-foreground">
                              No active seat allocations matching query.
                            </td>
                          </tr>
                        ) : (
                          filteredSeats.map((seat) => (
                            <tr key={seat.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3 font-bold text-foreground">{seat.name}</td>
                              <td className="p-3 text-muted-foreground font-normal">{seat.email}</td>
                              <td className="p-3">
                                <Badge variant="outline" className="border-purple-200 text-purple-800 bg-purple-50 text-[9px] font-bold">
                                  {seat.department}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="font-semibold text-slate-700">{seat.toolName}</span>
                              </td>
                              <td className="p-3 text-muted-foreground font-normal">{seat.provisionedAt}</td>
                              <td className="p-3 text-muted-foreground font-normal">{seat.lastActive}</td>
                              <td className="p-3 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeprovision(seat.id, seat.name, seat.toolId, seat.toolName)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 py-1 px-2.5 h-auto rounded-lg text-[10px] font-bold"
                                >
                                  Deprovision
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* Corporate Card flagged charges activity log */}
        <Card className="border border-purple-100/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="text-left">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-600" /> Corporate Cards Flagged Charges
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium">Newly identified subscription signatures flagged on individual employee expense cards</CardDescription>
            </div>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setAddChargeOpen(true)}
              className="gap-1.5 border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 text-[11px] font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Flag Custom Charge
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {flaggedCharges.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-100 rounded-xl bg-slate-50/20">
                <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-2.5" />
                <p className="text-xs font-bold text-slate-800">All employee card expense scans are cleared!</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">No unauthorized or duplicate employee software licenses found. Click "Flag Custom Charge" to simulate one.</p>
              </div>
            ) : (
              flaggedCharges.map((charge) => (
                <div key={charge.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 text-xs gap-3 hover:border-purple-200 transition-colors bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600 uppercase border border-slate-200">
                      {charge.employee.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-foreground">{charge.employee} <span className="text-muted-foreground font-normal">({charge.dept})</span></p>
                      <p className="text-[10px] text-muted-foreground">{charge.date} · Synced charge for <strong>{charge.service}</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <span className="font-bold text-foreground">${charge.amount.toFixed(2)}/mo</span>
                    
                    <div className="flex items-center gap-1.5">
                      <Button 
                        size="sm"
                        onClick={() => handleCardCharge(charge.id, "approved", charge.service, charge.amount, charge.dept)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] py-1 px-2.5 h-auto rounded"
                      >
                        Consolidate
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCardCharge(charge.id, "dismissed", charge.service, charge.amount, charge.dept)}
                        className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] py-1 px-2.5 h-auto rounded"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>

      {/* Add Corporate License Dialog */}
      <AnimatePresence>
        {addLicenseOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-purple-100 shadow-2xl relative text-left"
            >
              <h3 className="font-black text-lg mb-1 text-purple-950 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" /> Add Corporate SaaS License
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Introduce custom subscription constraints to monitor active seat efficiency.</p>

              <form onSubmit={handleAddLicenseSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Tool / Vendor Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. GitHub Enterprise, Slack, Zoom"
                    value={newLicName}
                    onChange={(e) => setNewLicName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Category</label>
                    <input 
                      type="text"
                      placeholder="e.g. Design, Communication"
                      value={newLicCategory}
                      onChange={(e) => setNewLicCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Division Share</label>
                    <select 
                      value={newLicDept}
                      onChange={(e) => setNewLicDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR & Admin">HR & Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Seats Purchased</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      value={newLicPurchased}
                      onChange={(e) => setNewLicPurchased(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Seats Active</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={newLicActive}
                      onChange={(e) => setNewLicActive(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Price / Seat ($)</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={newLicPrice}
                      onChange={(e) => setNewLicPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end pt-3">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setAddLicenseOpen(false)}
                    className="text-slate-600 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Add Corporate Subscription
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Flag Employee Card Charge Dialog */}
      <AnimatePresence>
        {addChargeOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-purple-100 shadow-2xl relative text-left"
            >
              <h3 className="font-black text-lg mb-1 text-purple-950 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" /> Flag Corporate Card Transaction
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Simulate a newly identified subscription transaction flagged on individual employee card statements.</p>

              <form onSubmit={handleAddChargeSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Employee Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. John Doe, Alice Smith"
                    value={newChargeEmployee}
                    onChange={(e) => setNewChargeEmployee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Department</label>
                    <select 
                      value={newChargeDept}
                      onChange={(e) => setNewChargeDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR & Admin">HR & Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Monthly Spend ($)</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      value={newChargeAmount}
                      onChange={(e) => setNewChargeAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">SaaS Tool Synced</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. GitHub Copilot, Midjourney Pro, Canva"
                    value={newChargeService}
                    onChange={(e) => setNewChargeService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-3">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setAddChargeOpen(false)}
                    className="text-slate-600 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Flag Card Charge
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Seat Allocation Provision Modal */}
      <AnimatePresence>
        {provisionOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-purple-100 shadow-2xl relative text-left"
            >
              <h3 className="font-black text-lg mb-1 text-purple-950 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" /> Allocate Corporate Seat
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Provision a new seat license from the company pool to an active employee.</p>

              <form onSubmit={handleProvisionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Select SaaS Tool</label>
                  <select 
                    value={selectedLicenseId}
                    onChange={(e) => setSelectedLicenseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {licenses.map(lic => (
                      <option key={lic.id} value={lic.id}>{lic.name} (${lic.pricePerSeat}/seat)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Employee Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Alice Vance"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Employee Email</label>
                  <input 
                    type="email"
                    required
                    placeholder="name@eroldrayan.com"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-3">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setProvisionOpen(false)}
                    className="text-slate-600 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Provision License Seat
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
