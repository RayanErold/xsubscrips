import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Plus, DollarSign, Users, ShieldAlert, Zap, 
  Trash2, Check, ArrowUpRight, TrendingUp, TrendingDown, Sparkles, Building, ChevronRight, UserCheck, Trash, CreditCard
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

// Set to completely empty as requested by the user
const defaultFlaggedCharges: FlaggedCharge[] = [];

export default function BusinessSuite() {
  // Load initial data from localStorage if available, else start completely clean
  const [licenses, setLicenses] = useState<License[]>(() => {
    const saved = localStorage.getItem("xsubscrips_corporate_licenses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
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
  const totalEmployeesCount = licenses.reduce((acc, lic) => acc + lic.seatsActive, 0);

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
          seatsPurchased: lic.seatsActive // Bring purchased seats to active seats count
        }))
      );
      setIsOptimizing(false);
      toast.success(`AI Seat Optimization completed! Pruned idle seat counts, saving $${wastedMonthlySpend.toLocaleString()}/mo instantly!`, {
        duration: 4000,
        icon: <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
      });
    }, 2000);
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

    const newLic: License = {
      id: Math.random().toString(36).substring(7),
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
    toast.success(`Removed "${name}" from corporate list.`);
  };

  // Provision an active seat
  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicenseId) {
      toast.error("Please select a corporate tool");
      return;
    }
    if (!employeeEmail) {
      toast.error("Please provide employee email");
      return;
    }

    setLicenses(prev => 
      prev.map(lic => {
        if (lic.id === selectedLicenseId) {
          const nextActive = lic.seatsActive + 1;
          const nextPurchased = nextActive > lic.seatsPurchased ? nextActive : lic.seatsPurchased;
          return {
            ...lic,
            seatsActive: nextActive,
            seatsPurchased: nextPurchased
          };
        }
        return lic;
      })
    );

    toast.success(`Successfully provisioned seat license to ${employeeEmail}!`);
    setEmployeeEmail("");
    setProvisionOpen(false);
  };

  // Action on corporate card flagged charges
  const handleCardCharge = (id: string, action: "approved" | "dismissed", service: string, amount: number, dept: string) => {
    setFlaggedCharges(prev => prev.filter(c => c.id !== id));
    
    if (action === "approved") {
      // Simulate adding custom license automatically from flagged cards!
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
                <span>Aggregated corporate billing costs</span>
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
              <p className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Monitored Licences</p>
              <div className="text-3xl font-black text-foreground mt-1">
                {activeCount} Active Tools
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Spanning <strong>{totalEmployeesCount}</strong> provisioned accounts</span>
              </p>
            </CardContent>
          </Card>
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
                    <ShieldAlert className="w-4 h-4 text-purple-600" /> Smart Seat Optimization Recommendations
                  </CardTitle>
                  <CardDescription className="text-xs">Based on user logins and application active utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="bg-[#FAF7FF] border border-[#EBDDFF] rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-purple-900 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> Gemini AI License Advice
                    </p>
                    {wastedMonthlySpend > 0 ? (
                      <span>We found <strong>{licenses.reduce((acc, l) => acc + (l.seatsPurchased - l.seatsActive), 0)} unutilized seats</strong> across your managed subscriptions. Auto-prune purchased licensing boundaries to match actual employee counts, trimming your bill by <strong>${wastedMonthlySpend.toLocaleString()}/mo</strong> immediately.</span>
                    ) : (
                      <span>Excellent! <strong>100% active seat saturation rate</strong> verified across your current profile stack. No license cost leakage detected.</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Audit Savings Projection</h4>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-xs">
                      <span className="text-slate-600">Current Cost:</span>
                      <span className="font-bold text-slate-800">${totalMonthlySpend.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-xs">
                      <span className="text-slate-600">Optimized Cost:</span>
                      <span className="font-bold text-purple-700">${activeSeatsSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="font-bold text-emerald-700">Immediate Savings:</span>
                      <span className="font-black text-emerald-600">+${wastedMonthlySpend.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Table */}
            <Card className="border border-purple-100/80 shadow-sm bg-white">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">SaaS License & Seat Allocation Audit</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Manage active seats vs purchased seats for corporate tools.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-muted-foreground font-semibold">
                      <th className="py-2.5 pb-3">Service Name</th>
                      <th className="py-2.5 pb-3">Category</th>
                      <th className="py-2.5 pb-3">Division</th>
                      <th className="py-2.5 pb-3 text-center">Active Seats</th>
                      <th className="py-2.5 pb-3 text-center">Purchased Seats</th>
                      <th className="py-2.5 pb-3 text-center">Price / Seat</th>
                      <th className="py-2.5 pb-3 text-right">Idle Cost Leak</th>
                      <th className="py-2.5 pb-3 text-right">Total Bill</th>
                      <th className="py-2.5 pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {licenses.map((lic) => {
                      const idleCount = lic.seatsPurchased - lic.seatsActive;
                      const idleCost = idleCount * lic.pricePerSeat;
                      const totalCost = lic.seatsPurchased * lic.pricePerSeat;
                      
                      return (
                        <tr key={lic.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-purple-100/80 text-[#7C3AED] flex items-center justify-center font-black shadow-sm text-[10px]">
                              {lic.logo}
                            </span>
                            <span className="font-bold text-foreground">{lic.name}</span>
                          </td>
                          <td className="py-3 text-muted-foreground">{lic.category}</td>
                          <td className="py-3">
                            <Badge variant="outline" className="border-purple-200 text-purple-800 bg-purple-50 text-[9px] font-bold">
                              {lic.department}
                            </Badge>
                          </td>
                          <td className="py-3 text-center text-foreground font-bold">{lic.seatsActive}</td>
                          <td className="py-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-bold ${idleCount > 0 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                              {lic.seatsPurchased}
                            </span>
                          </td>
                          <td className="py-3 text-center text-muted-foreground">${lic.pricePerSeat}/mo</td>
                          <td className={`py-3 text-right font-bold ${idleCost > 0 ? "text-amber-600" : "text-muted-foreground/40"}`}>
                            {idleCost > 0 ? `$${idleCost.toLocaleString()}/mo` : "None"}
                          </td>
                          <td className="py-3 text-right font-black text-foreground">${totalCost.toLocaleString()}</td>
                          <td className="py-3 text-center">
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
          </>
        )}

        {/* Corporate Card flagged charges activity log */}
        <Card className="border border-purple-100/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
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
                    <div>
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
