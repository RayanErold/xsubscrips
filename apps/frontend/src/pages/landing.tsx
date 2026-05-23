import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BarChart2, Bell, CreditCard, Shield, TrendingDown, 
  CheckCircle2, Zap, Clock, Play, Pause, RotateCcw, Sparkles, 
  UploadCloud, Laptop, Smartphone, Check, Eye, LayoutDashboard, List, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: CreditCard,
    title: "Track Everything Instantly",
    description: "Keep all your subscriptions in one central vault. Monitor what you're paying for, billing cycles, and active periods without the clutter.",
  },
  {
    icon: Bell,
    title: "Predictive Trial Reminders",
    description: "Never pay for another forgotten free trial. Receive intelligent alerts well before any trial converts into a paid subscription.",
  },
  {
    icon: BarChart2,
    title: "Spend Analytics & Insights",
    description: "Beautiful interactive charts break down your recurring expenses by category, billing cycle, and long-term spending projection.",
  },
  {
    icon: TrendingDown,
    title: "AI Cost Optimization",
    description: "Leverage Google Gemini AI to analyze your subscription overhead, surface duplicates, and locate immediate opportunities to trim expenses.",
  },
];

const pricingPlans = [
  {
    name: "Free Starter",
    monthly: 0,
    yearly: 0,
    period: "forever",
    description: "Great for basic subscription tracking",
    features: [
      "Track up to 10 subscriptions",
      "Standard trial notifications",
      "Manual receipt logging",
      "Basic spending breakdowns"
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro Control",
    monthly: 8,
    yearly: 5,
    period: "per month",
    description: "The ultimate vault for active individual accounts",
    features: [
      "Unlimited subscription tracking",
      "Vibrant AI receipt scanning",
      "Advanced multi-channel alerts",
      "Predictive spend analytics",
      "Secure custom categories",
      "Interactive data exporting"
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Business Suite",
    monthly: 20,
    yearly: 13,
    period: "per month",
    description: "For teams, families, and businesses wanting collective clarity",
    features: [
      "Everything included in Pro",
      "Shared workspaces for up to 10 members",
      "Role-based administrative tools",
      "Priority API connections",
      "Tailored corporate cost audits",
      "24/7 Dedicated account manager"
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const stats = [
  { value: "$892", label: "Average yearly savings" },
  { value: "12.4", label: "Subscriptions monitored" },
  { value: "3 mins", label: "Setup to tracking" },
];

export default function Landing() {
  const [isYearly, setIsYearly] = useState(false);

  // Video simulation states
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 45 seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 1.5x, 2x
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = 45; // 45 seconds total duration

  // Manage simulation tick
  useEffect(() => {
    if (isPlaying) {
      simulationRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= totalDuration) {
            return 0; // Loop simulation
          }
          return Number((prevTime + 0.5 * playbackSpeed).toFixed(1));
        });
      }, 500);
    } else {
      if (simulationRef.current) clearInterval(simulationRef.current);
    }

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const activeStep = 
    currentTime < 15 ? 0 : 
    currentTime < 30 ? 1 : 2;

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 0) setCurrentTime(0);
    if (stepIndex === 1) setCurrentTime(15);
    if (stepIndex === 2) setCurrentTime(30);
  };

  const formatTimer = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#FBF9FF] text-[#1D1030] selection:bg-[#EBDDFF] selection:text-[#5B21B6] overflow-x-hidden font-sans">
      {/* Background visual elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#C084FC] to-[#818CF8] opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-10 w-[600px] h-[600px] bg-gradient-to-br from-[#E879F9] to-[#C084FC] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#EBDDFF] bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-[#C084FC] rounded-xl flex items-center justify-center transition-all group-hover:scale-105 shadow-md shadow-[#7C3AED]/20">
              <span className="text-white text-lg font-bold italic tracking-tighter">X</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] bg-clip-text text-transparent">
              Xsubscrips
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#5B21B6] hover:bg-[#EBDDFF]/30 font-medium">Log In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-[#7C3AED]/10 font-semibold px-4 rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 text-[#7C3AED] border-[#EBDDFF] bg-[#F5EEFF] px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm">
            ✨ Intelligent Subscription Management with Gemini AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-[#1D1030]">
            Take Control of Your <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C084FC] bg-clip-text text-transparent">
              Recurring Spending.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B5A84] max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            The average person wastes over <strong className="font-semibold text-[#7C3AED]">$348 a year</strong> on forgotten trials and silent subscription creep. Scan invoices, analyze your trends, and cancel before you get charged.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white gap-2 text-base px-8 py-6 rounded-xl shadow-lg shadow-[#7C3AED]/25 transition-all hover:scale-[1.02]">
                Start Saving Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-[#EBDDFF] hover:bg-[#EBDDFF]/20 text-[#5B21B6] bg-white text-base px-8 py-6 rounded-xl font-medium shadow-sm transition-all">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto border border-[#EBDDFF] bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center relative">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xs md:text-sm text-[#6B5A84] mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Dynamic App Video Simulation Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-10">
          <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-none px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
            🎥 Interactive Simulation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1030] tracking-tight">
            See the App in Action under 60 Seconds
          </h2>
          <p className="text-[#6B5A84] max-w-xl mx-auto mt-2 text-sm md:text-base">
            Watch our automated simulation walk you through receipt scanning, real-time analytics updates, and renewal alarms.
          </p>
        </div>

        {/* Video Player Shell */}
        <div className="w-full max-w-5xl mx-auto border-4 border-white bg-white rounded-2xl shadow-2xl overflow-hidden relative border-t-2 border-[#EBDDFF]">
          
          {/* Header Panel */}
          <div className="bg-[#F5EEFF] border-b border-[#EBDDFF] px-4 py-3 flex items-center justify-between text-xs text-[#5B21B6] font-medium">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="ml-2 px-2 py-0.5 bg-[#7C3AED] text-white rounded text-[10px] uppercase font-bold tracking-wider animate-pulse">Demo Video simulation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">⏱️ Quick Tour: {formatTimer(currentTime)} / 0:45</span>
              <Smartphone className="w-4 h-4 text-[#7C3AED]" />
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid md:grid-cols-12 min-h-[480px]">
            
            {/* Steps Left Panel */}
            <div className="md:col-span-4 bg-[#FAF7FF] border-r border-[#EBDDFF] p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">Demo Navigation</p>
                <div className="space-y-3">
                  {[
                    { label: "Step 1: AI Receipt Scanner", icon: UploadCloud, time: "0s - 15s", desc: "Drag, scan, and let Google Gemini AI pull subscription data instantly." },
                    { label: "Step 2: Interactive Spending Vault", icon: BarChart2, time: "15s - 30s", desc: "Watch the dashboard sync and calculate savings projection." },
                    { label: "Step 3: Intelligent Alert Alarms", icon: Bell, time: "30s - 45s", desc: "Receive automated notifications on phone or email before renewals." }
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = activeStep === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleStepClick(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isActive 
                            ? "bg-white border-[#7C3AED] shadow-md shadow-[#7C3AED]/5 translate-x-1" 
                            : "bg-transparent border-[#EBDDFF]/60 hover:bg-[#EBDDFF]/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-[#6B5A84]"}`} />
                            <span className={`text-xs font-bold ${isActive ? "text-[#7C3AED]" : "text-[#1D1030]"}`}>{step.label}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">{step.time}</span>
                        </div>
                        <p className="text-[11px] text-[#6B5A84] leading-relaxed line-clamp-2">{step.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#F5EEFF] p-3 rounded-lg border border-[#EBDDFF] text-[11px] text-[#5B21B6] leading-relaxed flex gap-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span>Interact by clicking the timeline scrub bar below to jump to any feature.</span>
              </div>
            </div>

            {/* Stage Right Screen Simulation */}
            <div className="md:col-span-8 bg-[#FAF7FF] p-4 flex items-center justify-center relative overflow-hidden min-h-[440px] border-b md:border-b-0 border-[#EBDDFF]">
              
              {/* Purple glowing bubble inside canvas */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#7C3AED] opacity-[0.07] rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#C084FC] opacity-[0.05] rounded-full blur-[80px] pointer-events-none" />

              <div className="w-full h-full bg-white rounded-xl border border-[#EBDDFF] shadow-2xl flex flex-col text-left overflow-hidden select-none relative z-10 min-h-[380px]">
                {/* Mock App Window Header Bar */}
                <div className="bg-[#FDFBFF] border-b border-[#EBDDFF] px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-gradient-to-br from-[#7C3AED] to-[#C084FC] rounded flex items-center justify-center shadow-sm shadow-[#7C3AED]/20">
                      <span className="text-white text-[10px] font-black italic tracking-tighter">X</span>
                    </div>
                    <span className="font-extrabold text-[10px] bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] bg-clip-text text-transparent">Xsubscrips Client</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-4 rounded bg-[#F5EEFF] border border-[#EBDDFF] px-1 flex items-center justify-between text-[6px] text-[#6B5A84]">
                      <span>Search...</span>
                      <kbd className="text-[5px] bg-white px-0.5 rounded border border-[#EBDDFF]">⌘K</kbd>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] font-bold text-[7px] flex items-center justify-center border border-[#7C3AED]/20">JD</div>
                  </div>
                </div>

                {/* Mock App Window Body with Sidebar + Main Content Grid */}
                <div className="flex-1 flex min-h-[300px]">
                  {/* Miniature Left Sidebar */}
                  <div className="w-20 border-r border-[#EBDDFF] bg-[#FAF7FF]/50 p-1.5 space-y-0.5 shrink-0 hidden sm:block">
                    {[
                      { label: "Dashboard", icon: LayoutDashboard, active: true },
                      { label: "Subscriptions", icon: List, active: false },
                      { label: "Trials Monitor", icon: Clock, active: false },
                      { label: "Cost Analytics", icon: BarChart2, active: false },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[7px] font-extrabold transition-all ${item.active ? "bg-[#7C3AED]/10 text-[#7C3AED]" : "text-[#6B5A84]"}`}>
                          <Icon className="w-2.5 h-2.5" />
                          <span>{item.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Miniature Main Content Area */}
                  <div className="flex-1 p-3.5 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    
                    {/* Dashboard Title & Top Actions Bar */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[10px] font-black text-[#1D1030] leading-none">Dashboard Overview</h4>
                        <p className="text-[6px] text-[#6B5A84] mt-0.5">Automated command center</p>
                      </div>
                      
                      {/* "+ Add Subscription" button which is CLICKED during Step 1 */}
                      <motion.button 
                        animate={activeStep === 0 && currentTime < 4 ? { scale: [1, 1.04, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`flex items-center gap-0.5 bg-[#7C3AED] text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-sm hover:bg-[#6D28D9] ${activeStep === 0 && currentTime < 4 ? "ring-2 ring-[#7C3AED]/20" : ""}`}
                      >
                        <Plus className="w-2 h-2" />
                        <span>Add Subscription</span>
                      </motion.button>
                    </div>

                    {/* 4 Cards Grid Mock */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                      {/* Card 1: Spend */}
                      <div className="bg-white border border-[#EBDDFF] rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-[#6B5A84] font-bold uppercase">Monthly Spend</p>
                        <div className="text-[11px] font-black text-[#7C3AED] mt-0.5 transition-all duration-300">
                          {activeStep === 0 ? "$368.30" : activeStep === 1 ? (currentTime < 22 ? "$368.30" : "$383.79") : (currentTime < 38 ? "$383.79" : "$368.30")}
                        </div>
                        <p className="text-[5px] text-muted-foreground mt-0.5 leading-none">
                          {activeStep === 1 && currentTime >= 22 ? (
                            <span className="text-red-500 font-bold">+$15.49 added</span>
                          ) : activeStep === 2 && currentTime >= 38 ? (
                            <span className="text-green-600 font-bold">-$15.49 saved!</span>
                          ) : (
                            <span>$4,420/yr projected</span>
                          )}
                        </p>
                      </div>

                      {/* Card 2: Count */}
                      <div className="bg-white border border-[#EBDDFF] rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-[#6B5A84] font-bold uppercase">Active Subs</p>
                        <div className="text-[11px] font-black text-[#1D1030] mt-0.5">
                          {activeStep === 0 ? "8 active" : activeStep === 1 ? (currentTime < 22 ? "8 active" : "9 active") : (currentTime < 38 ? "9 active" : "8 active")}
                        </div>
                        <p className="text-[5px] text-[#6B5A84] mt-0.5">Auto-monitored</p>
                      </div>

                      {/* Card 3: Trials Ending */}
                      <div className="bg-white border border-[#EBDDFF] rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-[#6B5A84] font-bold uppercase">Ending Soon</p>
                        <div className="text-[11px] font-black text-[#1D1030] mt-0.5">0 trials</div>
                        <p className="text-[5px] text-amber-600 font-bold mt-0.5">Within 7 days</p>
                      </div>

                      {/* Card 4: Upcoming Renewals */}
                      <div className="bg-white border border-[#EBDDFF] rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-[#6B5A84] font-bold uppercase">Upcoming Renewals</p>
                        <div className="text-[11px] font-black text-[#1D1030] mt-0.5">
                          {activeStep === 0 ? "6 upcoming" : activeStep === 1 ? (currentTime < 22 ? "6 upcoming" : "7 upcoming") : (currentTime < 38 ? "7 upcoming" : "6 upcoming")}
                        </div>
                        <p className="text-[5px] text-purple-600 font-bold mt-0.5">Next 30 days</p>
                      </div>
                    </div>

                    {/* Main renewals list showing real layout */}
                    <div className="space-y-1.5 flex-1 mt-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[8px] font-black text-[#1D1030]">Upcoming Renewals</h5>
                        <span className="text-[6px] text-[#7C3AED] font-bold">View All ➔</span>
                      </div>

                      <div className="space-y-1 overflow-y-auto max-h-[110px] pr-0.5">
                        {/* Subscription List Items */}
                        <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-[#EBDDFF] text-[7px] shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#EBDDFF] text-[#7C3AED] flex items-center justify-center font-bold text-[7px]">P</span>
                            <div>
                              <p className="font-bold text-[#1D1030]">Planet Fitness</p>
                              <p className="text-[5px] text-[#6B5A84]">May 27, 2026 · <span className="text-red-500 font-medium">in 3 days</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#1D1030]">$15.99</p>
                            <p className="text-[5px] text-[#6B5A84]">monthly</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-[#EBDDFF] text-[7px] shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#EBDDFF] text-[#7C3AED] flex items-center justify-center font-bold text-[7px]">G</span>
                            <div>
                              <p className="font-bold text-[#1D1030]">Google AI Pro (5 TB)</p>
                              <p className="text-[5px] text-[#6B5A84]">May 27, 2026 · <span className="text-red-500 font-medium">in 3 days</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#1D1030]">$1.99</p>
                            <p className="text-[5px] text-[#6B5A84]">monthly</p>
                          </div>
                        </div>

                        {/* Dynamic simulated Netflix scan/cancel item */}
                        <AnimatePresence>
                          {((activeStep === 1 && currentTime >= 22) || (activeStep === 2 && currentTime < 38)) ? (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="flex items-center justify-between p-1.5 bg-gradient-to-r from-[#F5EEFF] to-[#FAF7FF] rounded-lg border border-[#7C3AED] text-[7px] shadow-sm shadow-[#7C3AED]/5"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-[7px]">N</span>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <p className="font-bold text-[#7C3AED]">Netflix Premium</p>
                                    <span className="bg-[#7C3AED]/20 text-[#7C3AED] text-[4px] px-0.5 rounded font-extrabold uppercase">New AI Scan</span>
                                  </div>
                                  <p className="text-[5px] text-[#6B5A84]">June 25, 2026 · in 32 days</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#7C3AED] animate-pulse">$15.49</p>
                                <p className="text-[5px] text-[#7C3AED]">monthly</p>
                              </div>
                            </motion.div>
                          ) : null}

                          {activeStep === 2 && currentTime >= 38 ? (
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center justify-between p-1.5 bg-green-50 rounded-lg border border-green-200 text-[7px] shadow-sm"
                            >
                              <div className="flex items-center gap-1.5 opacity-55">
                                <span className="w-3.5 h-3.5 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-[7px]">N</span>
                                <div>
                                  <p className="font-bold text-green-800 line-through">Netflix Premium</p>
                                  <p className="text-[5px] text-green-700">Canceled successfully</p>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-1">
                                <span className="bg-green-100 text-green-800 text-[5px] px-1 py-0.5 rounded font-extrabold uppercase">Canceled & Saved!</span>
                                <p className="font-bold text-green-800">$15.49</p>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Scan Modal Overlay (Active only during Step 1, starting at 4s) */}
                <AnimatePresence>
                  {activeStep === 0 && currentTime >= 4 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4 z-20"
                    >
                      <motion.div 
                        initial={{ y: 20, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.95 }}
                        className="bg-white rounded-xl p-3.5 w-full max-w-[240px] border border-[#EBDDFF] shadow-2xl relative text-left"
                      >
                        {/* Gemini AI Scan Overlay banner */}
                        <div className="absolute -top-2 right-2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-[5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles className="w-2 h-2 animate-spin" /> Gemini AI Engine
                        </div>

                        <h3 className="font-extrabold text-[8px] mb-2 text-[#5B21B6] flex items-center gap-1 leading-none">
                          <UploadCloud className="w-3 h-3 text-[#7C3AED]" /> AI Invoice Scanner
                        </h3>

                        <div className="border border-dashed border-[#EBDDFF] rounded-lg p-2.5 bg-[#FAF7FF] text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[90px]">
                          {currentTime >= 4 && currentTime < 8 ? (
                            <div className="flex flex-col items-center">
                              <UploadCloud className="w-4 h-4 text-[#7C3AED] mb-1 animate-bounce" />
                              <p className="text-[7px] font-bold text-[#1D1030]">Uploading Invoice...</p>
                              <p className="text-[5px] text-[#6B5A84] mt-0.5">netflix_receipt_2026.pdf</p>
                            </div>
                          ) : currentTime >= 8 && currentTime < 12 ? (
                            <div className="w-full relative flex flex-col items-center">
                              {/* Miniature invoice */}
                              <div className="w-14 h-16 bg-white border border-[#EBDDFF] shadow-sm rounded p-1 text-left text-[3px] space-y-0.5 relative">
                                <div className="w-5 h-0.5 bg-[#7C3AED]/20 rounded" />
                                <div className="w-10 h-0.5 bg-[#6B5A84]/20 rounded" />
                                <hr className="border-[#EBDDFF] my-0.5" />
                                <div className="flex justify-between font-bold text-[3px] text-[#1D1030] pt-0.5">
                                  <span>NETFLIX PREMIUM</span>
                                  <span>$15.49</span>
                                </div>
                                <div className="w-6 h-0.5 bg-[#6B5A84]/20 rounded" />
                                {/* Scanning moving laser */}
                                <motion.div 
                                  animate={{ y: [0, 55, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9333EA] to-transparent shadow-[0_0_6px_#9333EA] z-10"
                                />
                              </div>
                              <p className="text-[6px] font-bold text-[#7C3AED] mt-1.5 animate-pulse">Extracting with Gemini AI...</p>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-full space-y-1 text-left"
                            >
                              <div className="bg-[#F5EEFF] p-1 rounded border border-[#EBDDFF] flex items-center justify-between text-[6px]">
                                <span className="text-[#6B5A84]">Service Name:</span>
                                <span className="font-bold text-[#5B21B6] flex items-center gap-0.5"><Check className="w-2 h-2 text-green-500" /> Netflix</span>
                              </div>
                              <div className="bg-[#F5EEFF] p-1 rounded border border-[#EBDDFF] flex items-center justify-between text-[6px]">
                                <span className="text-[#6B5A84]">Monthly Cost:</span>
                                <span className="font-bold text-[#5B21B6]">$15.49 / mo</span>
                              </div>
                              <div className="text-[5px] text-green-600 font-bold bg-green-50 p-0.5 rounded text-center border border-green-200 animate-pulse">
                                🎉 Extracted with 99.8% Accuracy!
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulated iPhone Push Alert Overlay (Active only during Step 3) */}
                <AnimatePresence>
                  {activeStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-auto"
                    >
                      <div className="bg-[#1D1030] text-white border-2 border-slate-700/60 rounded-xl p-3 shadow-2xl relative overflow-hidden flex flex-col gap-1.5 w-full max-w-[210px]">
                        {/* Small notch header */}
                        <div className="w-12 h-2 bg-black/60 rounded-full mx-auto mb-0.5 flex items-center justify-center">
                          <span className="w-1 h-0.5 rounded-full bg-slate-800" />
                        </div>

                        <div className="text-center pb-1 border-b border-white/10 flex items-center justify-between">
                          <span className="text-[6px] text-slate-300 font-medium">📱 Smart Alarm Notification</span>
                          <span className="text-[5px] bg-[#7C3AED] px-1 rounded text-[4px] font-bold">LIVE PREVIEW</span>
                        </div>

                        {currentTime < 38 ? (
                          <motion.div 
                            key="iphone-alert-incoming"
                            className="space-y-1.5 text-left"
                          >
                            <p className="text-[7px] font-bold text-[#EBDDFF] flex items-center gap-0.5">
                              <Bell className="w-2 h-2 text-[#C084FC] animate-bounce" />
                              <span>UPCOMING RENEWAL REMINDER</span>
                            </p>
                            <p className="text-[7px] text-slate-200 leading-normal">
                              Your Netflix Premium subscription renewing in <strong className="text-[#C084FC]">48 hours</strong> will charge <strong className="text-white">$15.49</strong>.
                            </p>
                            
                            {/* Click button with animated simulated mouse click indicator! */}
                            <button 
                              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[7px] font-bold py-1 rounded shadow-md transition-all flex items-center justify-center gap-1 relative overflow-hidden border border-white/15"
                            >
                              <span>⚡ Auto-Cancel Subscription</span>
                              {/* Pulsing ring around the mouse pointer */}
                              <div className="absolute right-2 w-2.5 h-2.5 rounded-full border border-white bg-white/20 animate-ping" />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="iphone-alert-cancelled"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-1 py-1"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                            <h5 className="font-bold text-[8px] text-green-300 leading-none">Auto-Cancellation Approved</h5>
                            <p className="text-[6px] text-slate-300 leading-normal">
                              Cancel request processed. Saved <strong>$15.49/mo</strong> successfully!
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Video Controller Dashboard bottom */}
          <div className="bg-[#FAF7FF] border-t border-[#EBDDFF] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button 
                onClick={() => setCurrentTime(0)}
                className="w-8 h-8 bg-white border border-[#EBDDFF] hover:bg-[#FAF7FF] text-[#5B21B6] rounded-full flex items-center justify-center transition-all"
                title="Restart Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="text-xs font-semibold text-[#6B5A84] font-mono">
                {formatTimer(currentTime)} / 0:45
              </div>
            </div>

            {/* Timline scrubber container */}
            <div className="flex-1 w-full mx-0 sm:mx-6 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#6B5A84] font-mono">0:00</span>
              <div className="relative flex-1 h-2 bg-[#EBDDFF] rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#7C3AED] to-[#C084FC] rounded-full"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max={totalDuration} 
                  step="0.5"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-[10px] font-bold text-[#6B5A84] font-mono">0:45</span>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-[#6B5A84] uppercase tracking-wider">Speed:</span>
              <div className="inline-flex rounded-lg bg-[#EBDDFF]/40 p-0.5">
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-md text-[10px] font-extrabold transition-all ${
                      playbackSpeed === speed 
                        ? "bg-[#7C3AED] text-white" 
                        : "text-[#5B21B6] hover:bg-[#EBDDFF]/60"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features redesign */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-none px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
            🎯 Platform Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1D1030]">Everything You Need to Cut Costs</h2>
          <p className="text-lg text-[#6B5A84] max-w-xl mx-auto mt-3 font-light">
            Simple, automated, secure tracking tools that put money back into your wallet.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-[#EBDDFF] bg-white p-6 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5EEFF] to-[#FAF7FF] border border-[#EBDDFF] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6 text-[#7C3AED] group-hover:text-white transition-all" />
                </div>
                <h3 className="font-extrabold text-base text-[#1D1030] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B5A84] leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Modern Workflow Visualizer */}
      <section className="bg-gradient-to-b from-[#FAF7FF] to-white py-24 border-y border-[#EBDDFF] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#7C3AED]/[0.01] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-none px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
              ⚡ Effortless Setup
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1D1030]">Redefining Subscription Auditing</h2>
            <p className="text-lg text-[#6B5A84] max-w-xl mx-auto mt-3 font-light">
              No direct bank logins required. Keep your sensitive data local, protected, and fully within your control.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto relative">
            
            {/* Background line connector */}
            <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-0.5 bg-[#EBDDFF]" />

            {[
              { icon: Zap, step: "1", title: "Scan or Add Invoices", desc: "Drag subscription emails, scan photo receipts with Gemini AI, or drop recurring charges into your account." },
              { icon: Clock, step: "2", title: "Automated Tracking Alarm", desc: "Our platform continuously forecasts billing dates, trial periods, and tracks any price increases." },
              { icon: TrendingDown, step: "3", title: "Cancel and Save Money", desc: "Instantly cancel unwanted services with ease, keeping your hard-earned cash in your wallet." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center relative z-10 group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-[#7C3AED]/20 group-hover:scale-105 transition-all">
                    {item.step}
                  </div>
                  <h3 className="font-extrabold text-lg text-[#1D1030] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#6B5A84] leading-relaxed px-2">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Redesign */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-12">
          <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-none px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
            💎 Plans & Pricing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1D1030]">Transparent, Value-Driven Plans</h2>
          <p className="text-lg text-[#6B5A84] mt-2 mb-8 font-light">Cancel anytime. Build control of your money in minutes.</p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 bg-[#EBDDFF]/30 border border-[#EBDDFF] rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${!isYearly ? "bg-white text-[#7C3AED] shadow-md" : "text-[#6B5A84] hover:text-[#5B21B6]"
                }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 ${isYearly ? "bg-white text-[#7C3AED] shadow-md" : "text-[#6B5A84] hover:text-[#5B21B6]"
                }`}
            >
              Billed Yearly
              <span className="text-[10px] bg-[#7C3AED] text-white px-2 py-0.5 rounded-full font-semibold">Save 37%</span>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {pricingPlans.map((plan) => {
            const price = plan.monthly === 0 ? "$0" : `$${isYearly ? plan.yearly : plan.monthly}`;
            const periodLabel = plan.monthly === 0 ? "forever" : "per month";
            const yearlyNote = isYearly && plan.monthly > 0 ? `$${plan.yearly * 12} billed annually` : null;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 ${plan.highlighted
                  ? "border-[#7C3AED] bg-white shadow-xl shadow-[#7C3AED]/5 relative scale-[1.03] z-10"
                  : "border-[#EBDDFF] bg-white hover:border-[#7C3AED]/40 hover:shadow-lg"
                  }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white border-none px-4 py-1 text-xs font-semibold rounded-full shadow-md">
                    👑 Most Popular Choice
                  </Badge>
                )}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-[#1D1030]">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-4xl md:text-5xl font-black text-[#1D1030] tracking-tight">{price}</span>
                      <span className="text-[#6B5A84] ml-1.5 text-sm">/{periodLabel}</span>
                    </div>
                    {yearlyNote && (
                      <p className="text-xs text-[#7C3AED] font-semibold mt-1.5">{yearlyNote}</p>
                    )}
                    <p className="text-xs text-[#6B5A84] mt-3 font-normal leading-relaxed">{plan.description}</p>
                  </div>
                  
                  <hr className="border-[#EBDDFF] mb-6" />

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-xs text-[#1D1030] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/login">
                  <Button
                    className={`w-full py-6 text-xs font-bold rounded-xl transition-all ${
                      plan.highlighted 
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white shadow-md shadow-[#7C3AED]/20 hover:scale-[1.02]" 
                        : "border-[#EBDDFF] hover:bg-[#FAF7FF] text-[#5B21B6] bg-transparent"
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Redesigned CTA Banner */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] text-white">
        <div className="absolute inset-0 bg-[#FAF7FF]/[0.02] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Badge className="bg-white/10 hover:bg-white/10 text-white border border-white/20 px-3 py-1 text-xs font-semibold rounded-full">
              🚀 Start in Less Than 3 Minutes
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Stop Paying For Services <br />You Don't Use.
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of smart spenders who use Xsubscrips daily to audit their subscription invoices and claim back their cash flow.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="bg-white hover:bg-slate-50 text-[#5B21B6] hover:text-[#4C1D95] gap-2 px-10 py-6 rounded-xl font-bold shadow-2xl transition-all hover:scale-[1.02]">
                  Get Started for Free <ArrowRight className="w-5 h-5 text-[#5B21B6]" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Redesigned Footer */}
      <footer className="bg-white border-t border-[#EBDDFF] py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[#1D1030] font-extrabold">
            <div className="w-7 h-7 bg-gradient-to-br from-[#7C3AED] to-[#C084FC] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold italic tracking-tighter">X</span>
            </div>
            Xsubscrips
          </div>
          <p className="text-xs text-[#6B5A84] font-medium">
            Designed to help you budget smarter. © {new Date().getFullYear()} Xsubscrips. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
