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

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(124,58,237,0.25)]">
      <defs>
        <linearGradient id="logo-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logo-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path 
        d="M26 22 L46 50 L26 78 L38 78 L58 50 L38 22 Z" 
        fill="url(#logo-violet)" 
        className="opacity-95" 
      />
      <path 
        d="M74 22 L54 50 L74 78 L62 78 L42 50 L62 22 Z" 
        fill="url(#logo-cyan)" 
        className="opacity-90" 
      />
    </svg>
  );
}

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
  const [subCount, setSubCount] = useState(6);

  const webCards = [
    // --- Inner/Middle Ring (Dark squares with color logos) ---
    { id: "netflix", x: -95, y: -65, type: "square", bg: "bg-black", content: <img src="/logos/netflix.png" alt="Netflix" className="w-8 h-8 object-contain" /> },
    { id: "spotify", x: 105, y: -60, type: "square", bg: "bg-[#09090b]", content: (
      <svg className="w-8 h-8 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.136-.668.471-.744 3.856-.88 7.15-.506 9.82 1.13.295.178.387.563.206.86zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.67-1.114 8.24-.57 11.34 1.33.367.226.488.707.262 1.074zm.11-2.828C14.384 8.78 8.444 8.584 5 9.63c-.527.16-1.09-.14-1.25-.667-.16-.527.14-1.09.667-1.25 3.97-1.205 10.53-.98 14.61 1.448.475.282.63.896.348 1.37-.282.475-.896.63-1.37.348z" />
      </svg>
    )},
    { id: "hulu", x: -145, y: -20, type: "square", bg: "bg-[#09090b]", content: (
      <img src="/logos/hulu.png" alt="Hulu" className="w-8 h-4 object-contain" />
    )},
    { id: "disney", x: 110, y: 70, type: "square", bg: "bg-[#050e30]", border: "border-blue-900/40", content: (
      <span className="text-cyan-400 font-extrabold italic tracking-wider text-[9px] uppercase">Disney+</span>
    )},
    { id: "hbomax", x: 195, y: 35, type: "square", bg: "bg-gradient-to-br from-indigo-900 to-purple-950", border: "border-indigo-500/20", content: (
      <span className="text-white font-black tracking-tighter text-[9px] uppercase">HBO Max</span>
    )},
    { id: "m365", x: 175, y: -65, type: "square", bg: "bg-[#1f1f1f]", content: (
      <svg className="w-6 h-6 text-[#EB3C00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.5 2L2 6.5v11L12.5 22 22 17.5v-11L12.5 2z" />
      </svg>
    )},
    
    // --- Wide White Cards (Main focus cards) ---
    { id: "youtube-wide", x: -180, y: -155, type: "wide", bg: "bg-white", content: <img src="/logos/youtube.png" alt="YouTube" className="h-6 object-contain" /> },
    { id: "claude-wide", x: 180, y: -155, type: "wide", bg: "bg-white", content: (
      <div className="flex flex-col items-center justify-center scale-90 -space-y-0.5 mt-0.5">
        <svg className="w-9 h-9 text-[#cc6543]" viewBox="0 0 100 100" fill="currentColor">
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d="M 49 43 C 48 41, 45 30, 45 22 C 45 13, 47.5 9, 50 9 C 52.5 9, 55 13, 55 22 C 55 30, 52 41, 51 43 Z"
              transform={`rotate(${i * 40} 50 50)`}
            />
          ))}
        </svg>
        <span className="text-[#191919] font-serif font-bold text-xs tracking-tight">Claude</span>
      </div>
    )},
    { id: "peloton-wide", x: -185, y: 165, type: "wide", bg: "bg-white", content: (
      <div className="flex items-center gap-1.5">
        <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        </svg>
        <span className="text-black font-black tracking-widest text-[9px] uppercase">Peloton</span>
      </div>
    )},
    { id: "amazon-wide", x: 185, y: 165, type: "wide", bg: "bg-white", content: (
      <div className="flex flex-col items-center justify-center scale-95">
        <span className="text-black font-black italic text-xs leading-none">prime</span>
        <svg className="w-10 h-1.5 text-[#ff9900]" viewBox="0 0 50 10" fill="none">
          <path d="M2 2 C 15 8, 35 8, 48 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    )},

    // --- Outer Ring (White square icons) ---
    { id: "ms-cloud", x: 260, y: -110, type: "square-white", bg: "bg-white", content: (
      <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
        <div className="bg-[#F25022] w-2.5 h-2.5" />
        <div className="bg-[#7FBA00] w-2.5 h-2.5" />
        <div className="bg-[#00A4EF] w-2.5 h-2.5" />
        <div className="bg-[#FFB900] w-2.5 h-2.5" />
      </div>
    )},
    { id: "adobe", x: 290, y: -10, type: "square-white", bg: "bg-white", content: (
      <svg className="w-6 h-6 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.5 2h9v20h-9zM9.5 2h-9v20h9zM12 8.5l4 9.5h-8z" />
      </svg>
    )},
    { id: "peloton-icon", x: 265, y: 90, type: "square-white", bg: "bg-white", content: (
      <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
      </svg>
    )},
    { id: "chatgpt-sq", x: -250, y: -110, type: "square-white", bg: "bg-white", content: (
      <img src="/logos/chatgpt.png" alt="ChatGPT" className="w-7 h-7 object-contain" />
    )},
    { id: "azure", x: -270, y: -10, type: "square-white", bg: "bg-white", content: (
      <svg className="w-5 h-5 text-[#0089D6]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 8.5v7L12 22l10-6.5v-7L12 2z" />
      </svg>
    )},
    { id: "google-drive", x: -245, y: 70, type: "square-white", bg: "bg-white", content: (
      <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    )},
    { id: "ms-four", x: -250, y: 125, type: "square-white", bg: "bg-white", content: (
      <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
        <div className="bg-[#F25022] w-2.5 h-2.5" />
        <div className="bg-[#7FBA00] w-2.5 h-2.5" />
        <div className="bg-[#00A4EF] w-2.5 h-2.5" />
        <div className="bg-[#FFB900] w-2.5 h-2.5" />
      </div>
    )},
    { id: "figma-sq", x: -110, y: -120, type: "square-white", bg: "bg-white", content: (
      <img src="/logos/figma.png" alt="Figma" className="w-7 h-7 object-contain" />
    )},
    { id: "github-sq", x: -110, y: 120, type: "square-white", bg: "bg-white", content: (
      <img src="/logos/github.png" alt="GitHub" className="w-7 h-7 object-contain" />
    )},
    { id: "vimeo-sq", x: 0, y: 180, type: "square", bg: "bg-white", content: (
      <img src="/logos/vimeo.png" alt="Vimeo" className="w-7 h-3 object-contain" />
    )}
  ];

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

  // Savings Calculator Math
  const estimatedCost = subCount * 15.50;
  const potentialSavings = subCount * 15.50 * 12 * 0.28; // 28% typical underutilization / forgotten trials savings
  const lifetimeSavings = potentialSavings * 3;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans relative selection:bg-primary/20 selection:text-primary">
      {/* Background visual element mesh glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-primary/8 to-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[600px] right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <BrandLogo size={32} />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Xsubscrips
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">Log In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-semibold px-4 rounded-lg">
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
          <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm">
            ✨ Intelligent Subscription Auditing with Gemini AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
            Take Control of Your <br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Recurring Spending.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            The average person wastes over <strong className="font-semibold text-primary">$348 a year</strong> on forgotten trials and silent subscription creep. Scan invoices, forecast trends, and cancel before you get charged.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white gap-2 text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                Start Saving Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-border hover:bg-muted/40 text-foreground bg-background text-base px-8 py-6 rounded-xl font-medium shadow-sm transition-all">
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
          className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto border border-border/40 bg-card/45 backdrop-blur-md rounded-2xl p-6 shadow-md"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center relative">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>      {/* Interactive Hub web System (Subscription Galaxy) */}
      <section className="py-20 border-y border-border/40 bg-card/5 relative overflow-hidden select-none flex flex-col items-center justify-center min-h-[640px] md:min-h-[720px] lg:min-h-[820px]">
        {/* Top Header Caption */}
        <div className="text-center relative z-30 mb-6">
          <p className="text-[11px] md:text-xs font-mono font-medium tracking-[0.25em] text-muted-foreground/60 uppercase">
            MANAGE ALL YOUR SUBSCRIPTIONS IN ONE PLACE
          </p>
        </div>

        {/* Orbit/Spoke Area */}
        <div className="relative w-[1000px] h-[520px] scale-[0.6] sm:scale-[0.75] md:scale-[0.88] lg:scale-100 transition-all origin-center select-none overflow-visible flex items-center justify-center">
          {/* SVG Spokes and Orbit circles in background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 520">
            {/* Concentric helper dashed circles matching the background structure */}
            <circle cx={500} cy={260} r={130} fill="none" stroke="rgba(167, 139, 250, 0.08)" strokeDasharray="4 4" strokeWidth="1" />
            <circle cx={500} cy={260} r={220} fill="none" stroke="rgba(167, 139, 250, 0.05)" strokeDasharray="4 4" strokeWidth="1" />
            <circle cx={500} cy={260} r={310} fill="none" stroke="rgba(167, 139, 250, 0.02)" strokeDasharray="4 4" strokeWidth="1" />
            
            {/* Direct spokes/lines from center (500, 260) to each card (500+x, 260+y) */}
            {webCards.map((card) => (
              <line 
                key={`line-${card.id}`}
                x1={500} 
                y1={260} 
                x2={500 + card.x} 
                y2={260 + card.y} 
                stroke="rgba(167, 139, 250, 0.28)" 
                strokeWidth="1.25" 
              />
            ))}
          </svg>

          {/* Center Hub: Xsubscrips */}
          <div className="absolute left-[500px] top-[260px] -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-[#120F26] via-[#1A153B] to-[#0A071A] rounded-3xl flex flex-col items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.45)] border border-purple-500/25 z-30 cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_75px_rgba(124,58,237,0.6)] transition-all duration-300">
            <BrandLogo size={52} />
            <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest mt-2">Xsubscrips</span>
          </div>

          {/* Floating Logo Cards */}
          {webCards.map((card, idx) => {
            const floatClass = idx % 3 === 0 
              ? "animate-hub-float-1" 
              : idx % 3 === 1 
              ? "animate-hub-float-2" 
              : "animate-hub-float-3";
            return (
              <div
                key={card.id}
                className="absolute z-20 pointer-events-auto"
                style={{
                  left: `${500 + card.x}px`,
                  top: `${260 + card.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Float animated wrapper */}
                <div className={floatClass}>
                  {/* Actual Card Body */}
                  <div 
                    className={`flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] shadow-md ${
                      card.type === "wide" 
                        ? "w-[155px] h-[72px] rounded-2xl p-3 border border-slate-200" 
                        : card.type === "square-white"
                        ? "w-14 h-14 rounded-2xl p-2 border border-slate-200/80"
                        : `w-14 h-14 rounded-2xl p-2 border ${card.border || "border-white/10"}`
                    } ${card.bg}`}
                  >
                    {card.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text Footer */}
        <div className="text-center relative z-30 mt-6">
          <p className="text-xs md:text-sm font-medium tracking-wider text-muted-foreground/60 uppercase">
            XSUBSCRIPS: Unified Subscription Management
          </p>
        </div>

        {/* Sparkle Icon (bottom right corner) */}
        <div className="absolute bottom-16 right-16 md:right-24 text-muted-foreground/15 pointer-events-none animate-pulse">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          </svg>
        </div>
      </section>

      {/* Dynamic App Video Simulation Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-10">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
            🎥 Interactive Simulation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            See the App in Action under 60 Seconds
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-sm md:text-base">
            Watch our automated simulation walk you through receipt scanning, real-time analytics updates, and renewal alarms.
          </p>
        </div>

        {/* Video Player Shell */}
        <div className="w-full max-w-5xl mx-auto border-4 border-border bg-card rounded-2xl shadow-2xl overflow-hidden relative">
          
          {/* Header Panel */}
          <div className="bg-muted/40 border-b border-border px-4 py-3 flex items-center justify-between text-xs text-primary font-medium">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/75" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/75" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/75" />
              </div>
              <span className="ml-2 px-2 py-0.5 bg-primary text-white rounded text-[10px] uppercase font-bold tracking-wider animate-pulse">Demo Video simulation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-muted-foreground">⏱️ Quick Tour: {formatTimer(currentTime)} / 0:45</span>
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid md:grid-cols-12 min-h-[480px]">
            
            {/* Steps Left Panel */}
            <div className="md:col-span-4 bg-muted/10 border-r border-border p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Demo Navigation</p>
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
                            ? "bg-card border-primary shadow-md shadow-primary/5 translate-x-1" 
                            : "bg-transparent border-border/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-foreground"}`}>{step.label}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">{step.time}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{step.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-[11px] text-primary leading-relaxed flex gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>Interact by clicking the timeline scrub bar below to jump to any feature.</span>
              </div>
            </div>

            {/* Stage Right Screen Simulation */}
            <div className="md:col-span-8 bg-muted/5 p-4 flex items-center justify-center relative overflow-hidden min-h-[440px] border-b md:border-b-0 border-border">
              
              {/* Glowing bubbles inside canvas */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="w-full h-full bg-card rounded-xl border border-border shadow-2xl flex flex-col text-left overflow-hidden select-none relative z-10 min-h-[380px]">
                {/* Mock App Window Header Bar */}
                <div className="bg-muted/20 border-b border-border px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-gradient-to-br from-primary to-purple-500 rounded flex items-center justify-center shadow-sm shadow-primary/20">
                      <span className="text-white text-[10px] font-black italic tracking-tighter">X</span>
                    </div>
                    <span className="font-extrabold text-[10px] text-foreground">Xsubscrips Client</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-4 rounded bg-muted/40 border border-border px-1 flex items-center justify-between text-[6px] text-muted-foreground">
                      <span>Search...</span>
                      <kbd className="text-[5px] bg-card px-0.5 rounded border border-border">⌘K</kbd>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-primary/10 text-primary font-bold text-[7px] flex items-center justify-center border border-primary/20">JD</div>
                  </div>
                </div>

                {/* Mock App Window Body with Sidebar + Main Content Grid */}
                <div className="flex-1 flex min-h-[300px]">
                  {/* Miniature Left Sidebar */}
                  <div className="w-20 border-r border-border bg-muted/10 p-1.5 space-y-0.5 shrink-0 hidden sm:block">
                    {[
                      { label: "Dashboard", icon: LayoutDashboard, active: true },
                      { label: "Subscriptions", icon: List, active: false },
                      { label: "Trials Monitor", icon: Clock, active: false },
                      { label: "Cost Analytics", icon: BarChart2, active: false },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[7px] font-extrabold transition-all ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
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
                        <h4 className="text-[10px] font-black text-foreground leading-none">Dashboard Overview</h4>
                        <p className="text-[6px] text-muted-foreground mt-0.5">Automated command center</p>
                      </div>
                      
                      <motion.button 
                        animate={activeStep === 0 && currentTime < 4 ? { scale: [1, 1.04, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`flex items-center gap-0.5 bg-primary text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-sm hover:bg-primary/95 ${activeStep === 0 && currentTime < 4 ? "ring-2 ring-primary/20" : ""}`}
                      >
                        <Plus className="w-2 h-2" />
                        <span>Add Subscription</span>
                      </motion.button>
                    </div>

                    {/* 4 Cards Grid Mock */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                      {/* Card 1: Spend */}
                      <div className="bg-card border border-border rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-muted-foreground font-bold uppercase">Monthly Spend</p>
                        <div className="text-[11px] font-black text-primary mt-0.5 transition-all duration-300">
                          {activeStep === 0 ? "$368.30" : activeStep === 1 ? (currentTime < 22 ? "$368.30" : "$383.79") : (currentTime < 38 ? "$383.79" : "$368.30")}
                        </div>
                        <p className="text-[5px] text-muted-foreground mt-0.5 leading-none">
                          {activeStep === 1 && currentTime >= 22 ? (
                            <span className="text-red-500 font-bold">+$15.49 added</span>
                          ) : activeStep === 2 && currentTime >= 38 ? (
                            <span className="text-green-500 font-bold">-$15.49 saved!</span>
                          ) : (
                            <span>$4,420/yr projected</span>
                          )}
                        </p>
                      </div>

                      {/* Card 2: Count */}
                      <div className="bg-card border border-border rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-muted-foreground font-bold uppercase">Active Subs</p>
                        <div className="text-[11px] font-black text-foreground mt-0.5">
                          {activeStep === 0 ? "8 active" : activeStep === 1 ? (currentTime < 22 ? "8 active" : "9 active") : (currentTime < 38 ? "9 active" : "8 active")}
                        </div>
                        <p className="text-[5px] text-muted-foreground mt-0.5">Auto-monitored</p>
                      </div>

                      {/* Card 3: Trials Ending */}
                      <div className="bg-card border border-border rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-muted-foreground font-bold uppercase">Ending Soon</p>
                        <div className="text-[11px] font-black text-foreground mt-0.5">0 trials</div>
                        <p className="text-[5px] text-amber-500 font-bold mt-0.5">Within 7 days</p>
                      </div>

                      {/* Card 4: Upcoming Renewals */}
                      <div className="bg-card border border-border rounded-lg p-2 text-left relative overflow-hidden shadow-sm">
                        <p className="text-[6px] text-muted-foreground font-bold uppercase">Upcoming Renewals</p>
                        <div className="text-[11px] font-black text-foreground mt-0.5">
                          {activeStep === 0 ? "6 upcoming" : activeStep === 1 ? (currentTime < 22 ? "6 upcoming" : "7 upcoming") : (currentTime < 38 ? "7 upcoming" : "6 upcoming")}
                        </div>
                        <p className="text-[5px] text-purple-400 font-bold mt-0.5">Next 30 days</p>
                      </div>
                    </div>

                    {/* Main renewals list showing real layout */}
                    <div className="space-y-1.5 flex-1 mt-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[8px] font-black text-foreground">Upcoming Renewals</h5>
                        <span className="text-[6px] text-primary font-bold">View All ➔</span>
                      </div>

                      <div className="space-y-1 overflow-y-auto max-h-[110px] pr-0.5">
                        <div className="flex items-center justify-between p-1.5 bg-card rounded-lg border border-border text-[7px] shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[7px]">P</span>
                            <div>
                              <p className="font-bold text-foreground">Planet Fitness</p>
                              <p className="text-[5px] text-muted-foreground">May 27, 2026 · <span className="text-red-500 font-medium">in 3 days</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">$15.99</p>
                            <p className="text-[5px] text-muted-foreground">monthly</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-1.5 bg-card rounded-lg border border-border text-[7px] shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <img src="/logos/apple.png" alt="Apple" className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                            <div>
                              <p className="font-bold text-foreground">Apple One Premier</p>
                              <p className="text-[5px] text-muted-foreground">May 27, 2026 · <span className="text-red-500 font-medium">in 3 days</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">$37.95</p>
                            <p className="text-[5px] text-muted-foreground">monthly</p>
                          </div>
                        </div>

                        <AnimatePresence>
                          {((activeStep === 1 && currentTime >= 22) || (activeStep === 2 && currentTime < 38)) ? (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="flex items-center justify-between p-1.5 bg-gradient-to-r from-primary/5 to-cyan-500/5 rounded-lg border border-primary text-[7px] shadow-sm"
                            >
                              <div className="flex items-center gap-1.5">
                                <img src="/logos/netflix.png" alt="Netflix" className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                                <div>
                                  <div className="flex items-center gap-1">
                                    <p className="font-bold text-primary">Netflix Premium</p>
                                    <span className="bg-primary/20 text-primary text-[4px] px-0.5 rounded font-extrabold uppercase">New AI Scan</span>
                                  </div>
                                  <p className="text-[5px] text-muted-foreground">June 25, 2026 · in 32 days</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary animate-pulse">$15.49</p>
                                <p className="text-[5px] text-primary">monthly</p>
                              </div>
                            </motion.div>
                          ) : null}

                          {activeStep === 2 && currentTime >= 38 ? (
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center justify-between p-1.5 bg-green-500/5 rounded-lg border border-green-500/20 text-[7px] shadow-sm"
                            >
                              <div className="flex items-center gap-1.5 opacity-55">
                                <img src="/logos/netflix.png" alt="Netflix" className="w-3.5 h-3.5 rounded object-contain shrink-0 filter grayscale" />
                                <div>
                                  <p className="font-bold text-green-500 line-through">Netflix Premium</p>
                                  <p className="text-[5px] text-green-400">Canceled successfully</p>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-1">
                                <span className="bg-green-500/10 text-green-400 text-[5px] px-1 py-0.5 rounded font-extrabold uppercase">Canceled & Saved!</span>
                                <p className="font-bold text-green-500">$15.49</p>
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
                      className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4 z-20"
                    >
                      <motion.div 
                        initial={{ y: 20, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.95 }}
                        className="bg-card rounded-xl p-3.5 w-full max-w-[240px] border border-border shadow-2xl relative text-left"
                      >
                        <div className="absolute -top-2 right-2 bg-gradient-to-r from-primary to-purple-600 text-white text-[5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles className="w-2 h-2 animate-spin" /> Gemini AI Engine
                        </div>

                        <h3 className="font-extrabold text-[8px] mb-2 text-primary flex items-center gap-1 leading-none">
                          <UploadCloud className="w-3 h-3 text-primary" /> AI Invoice Scanner
                        </h3>

                        <div className="border border-dashed border-border rounded-lg p-2.5 bg-muted/10 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[90px]">
                          {currentTime >= 4 && currentTime < 8 ? (
                            <div className="flex flex-col items-center">
                              <UploadCloud className="w-4 h-4 text-primary mb-1 animate-bounce" />
                              <p className="text-[7px] font-bold text-foreground">Uploading Invoice...</p>
                              <p className="text-[5px] text-muted-foreground mt-0.5">netflix_receipt_2026.pdf</p>
                            </div>
                          ) : currentTime >= 8 && currentTime < 12 ? (
                            <div className="w-full relative flex flex-col items-center">
                              <div className="w-14 h-16 bg-card border border-border shadow-sm rounded p-1 text-left text-[3px] space-y-0.5 relative">
                                <div className="w-5 h-0.5 bg-primary/20 rounded" />
                                <div className="w-10 h-0.5 bg-muted-foreground/20 rounded" />
                                <hr className="border-border my-0.5" />
                                <div className="flex justify-between font-bold text-[3px] text-foreground pt-0.5">
                                  <span>NETFLIX PREMIUM</span>
                                  <span>$15.49</span>
                                </div>
                                <div className="w-6 h-0.5 bg-muted-foreground/20 rounded" />
                                <motion.div 
                                  animate={{ y: [0, 55, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_6px_#7c3aed] z-10"
                                />
                              </div>
                              <p className="text-[6px] font-bold text-primary mt-1.5 animate-pulse">Extracting with Gemini AI...</p>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-full space-y-1 text-left"
                            >
                              <div className="bg-muted/20 p-1 rounded border border-border flex items-center justify-between text-[6px]">
                                <span className="text-muted-foreground">Service Name:</span>
                                <span className="font-bold text-primary flex items-center gap-1"><img src="/logos/netflix.png" alt="Netflix" className="w-2.5 h-2.5 rounded object-contain shrink-0" /> Netflix</span>
                              </div>
                              <div className="bg-muted/20 p-1 rounded border border-border flex items-center justify-between text-[6px]">
                                <span className="text-muted-foreground">Monthly Cost:</span>
                                <span className="font-bold text-primary">$15.49 / mo</span>
                              </div>
                              <div className="text-[5px] text-green-400 font-bold bg-green-500/5 p-0.5 rounded text-center border border-green-500/20 animate-pulse">
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
                      <div className="bg-[#09090b] text-white border-2 border-border/80 rounded-xl p-3 shadow-2xl relative overflow-hidden flex flex-col gap-1.5 w-full max-w-[210px]">
                        <div className="w-12 h-2 bg-black/60 rounded-full mx-auto mb-0.5 flex items-center justify-center">
                          <span className="w-1 h-0.5 rounded-full bg-slate-800" />
                        </div>

                        <div className="text-center pb-1 border-b border-white/10 flex items-center justify-between">
                          <span className="text-[6px] text-slate-300 font-medium">📱 Smart Alarm Notification</span>
                          <span className="text-[5px] bg-primary px-1 rounded text-[4px] font-bold">LIVE PREVIEW</span>
                        </div>

                        {currentTime < 38 ? (
                          <motion.div 
                            key="iphone-alert-incoming"
                            className="space-y-1.5 text-left"
                          >
                            <p className="text-[7px] font-bold text-primary flex items-center gap-0.5">
                              <Bell className="w-2 h-2 text-primary animate-bounce" />
                              <span>UPCOMING RENEWAL REMINDER</span>
                            </p>
                            <p className="text-[7px] text-slate-200 leading-normal">
                              Your Netflix Premium subscription renewing in <strong className="text-primary">48 hours</strong> will charge <strong className="text-white">$15.49</strong>.
                            </p>
                            
                            <button 
                              className="w-full bg-primary hover:bg-primary/90 text-white text-[7px] font-bold py-1 rounded shadow-md transition-all flex items-center justify-center gap-1 relative overflow-hidden border border-white/10"
                            >
                              <span>⚡ Auto-Cancel Subscription</span>
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
          <div className="bg-muted/10 border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button 
                onClick={() => setCurrentTime(0)}
                className="w-8 h-8 bg-card border border-border hover:bg-muted/40 text-primary rounded-full flex items-center justify-center transition-all"
                title="Restart Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="text-xs font-semibold text-muted-foreground font-mono">
                {formatTimer(currentTime)} / 0:45
              </div>
            </div>

            {/* Timeline scrubber container */}
            <div className="flex-1 w-full mx-0 sm:mx-6 flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground font-mono">0:00</span>
              <div className="relative flex-1 h-2 bg-muted border border-border rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary to-cyan-400 rounded-full"
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
              <span className="text-[10px] font-bold text-muted-foreground font-mono">0:45</span>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speed:</span>
              <div className="inline-flex rounded-lg bg-muted border border-border p-0.5">
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-md text-[10px] font-extrabold transition-all ${
                      playbackSpeed === speed 
                        ? "bg-primary text-white" 
                        : "text-muted-foreground hover:text-foreground"
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

      {/* Bento Grid Feature Showcase */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
            🎯 Platform Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Everything You Need to Cut Costs</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-3 font-light">
            Simple, automated, secure tracking tools that put money back into your wallet.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Card 1: AI Invoice Scanner (2 Columns wide) */}
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <UploadCloud className="w-6 h-6 group-hover:text-white transition-all" />
              </div>
              <h3 className="font-extrabold text-xl text-foreground mb-2">AI Invoice Scan & Auditing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Simply drag and drop receipt emails or invoices. Our Google Gemini AI parser extracts the exact billing terms, renewal cycle, and price changes with 99.8% precision.
              </p>
            </div>

            {/* Scan animation mockup graphic */}
            <div className="mt-6 border border-border/80 bg-muted/10 rounded-xl p-3 flex items-center justify-between text-xs text-muted-foreground relative overflow-hidden">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-primary animate-bounce" />
                <span className="font-mono text-[10px]">netflix_receipt.pdf</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-[10px] text-green-400 font-bold">Successfully Parsed</span>
              </div>
              <div className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            </div>
          </div>

          {/* Card 2: Trial Reminders (1 Column wide) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group duration-300 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <Bell className="w-6 h-6 group-hover:text-white transition-all" />
              </div>
              <h3 className="font-extrabold text-xl text-foreground mb-2">Trial Conversions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive notifications well before any trial automatically converts into a paid renewal.
              </p>
            </div>

            <div className="mt-6 bg-[#09090b] border border-border rounded-xl p-3 shadow-md flex gap-2 items-start relative select-none">
              <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0 p-0.5">
                <svg className="w-full h-full text-[#cc6543]" viewBox="0 0 100 100" fill="currentColor">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <path
                      key={i}
                      d="M 49 43 C 48 41, 45 30, 45 22 C 45 13, 47.5 9, 50 9 C 52.5 9, 55 13, 55 22 C 55 30, 52 41, 51 43 Z"
                      transform={`rotate(${i * 40} 50 50)`}
                    />
                  ))}
                </svg>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center text-[7px] text-muted-foreground">
                  <span>📱 Claude AI Pro Alert</span>
                  <span className="text-primary font-bold">48h alert</span>
                </div>
                <p className="text-[10px] font-bold text-white leading-none">Anthropic Claude Pro Renewing</p>
                <p className="text-[8px] text-muted-foreground leading-tight font-light">Your $20.00/mo trial expires in 2 days. Cancel automatically?</p>
              </div>
            </div>
          </div>

          {/* Card 3: Spend Vault (1 Column wide) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group duration-300 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <CreditCard className="w-6 h-6 group-hover:text-white transition-all" />
              </div>
              <h3 className="font-extrabold text-xl text-foreground mb-2">Smart Spend Vault</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your subscription details securely archived in one dashboard, calculating totals in real-time.
              </p>
            </div>

            {/* List mockup */}
            <div className="mt-6 space-y-1.5">
              {[
                { name: "ChatGPT Plus", val: "$20.00", progress: "w-[80%] bg-primary", img: "/logos/chatgpt.png" },
                { name: "Figma Pro", val: "$15.00", progress: "w-[40%] bg-cyan-400", img: "/logos/figma.png" },
                { name: "YouTube Premium", val: "$13.99", progress: "w-[95%] bg-red-500", img: "/logos/youtube.png" }
              ].map((item, idx) => (
                <div key={idx} className="bg-muted/20 border border-border/80 rounded-lg p-2 flex items-center justify-between text-[9px] gap-2">
                  <img src={item.img} alt={item.name} className="w-5 h-5 rounded object-contain shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between font-bold text-foreground mb-1">
                      <span className="truncate">{item.name}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.progress}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Savings Calculator (2 Columns wide) */}
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <TrendingDown className="w-6 h-6 group-hover:text-white transition-all" />
              </div>
              <h3 className="font-extrabold text-xl text-foreground mb-2">Cost Savings Planner</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estimate how much silent subscription creep is costing you, and unlock immediate savings opportunities.
              </p>
            </div>

            {/* Savings Calculator Widget */}
            <div className="mt-6 border border-border bg-muted/10 rounded-xl p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>How many subscriptions do you pay for?</span>
                  <span className="text-primary font-mono text-sm">{subCount} subscriptions</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="2"
                    max="25"
                    value={subCount}
                    onChange={(e) => setSubCount(Number(e.target.value))}
                    className="w-full h-2 bg-border border border-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/80 text-center">
                <div className="p-2 bg-card rounded-lg border border-border">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Estimated Cost</p>
                  <p className="text-sm font-black text-foreground font-mono mt-0.5">${estimatedCost.toFixed(2)}/mo</p>
                </div>
                <div className="p-2 bg-card rounded-lg border border-border">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Forgotten Waste</p>
                  <p className="text-sm font-black text-red-400 font-mono mt-0.5">${potentialSavings.toFixed(0)}/yr</p>
                </div>
                <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-[8px] text-primary uppercase font-bold">Potential Savings</p>
                  <p className="text-sm font-black text-cyan-400 font-mono mt-0.5">${lifetimeSavings.toFixed(0)} / 3yrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Visualizer */}
      <section className="bg-gradient-to-b from-card/30 to-background py-24 border-y border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
              ⚡ Effortless Setup
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Redefining Subscription Auditing</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-3 font-light">
              No direct bank logins required. Keep your sensitive data local, protected, and fully within your control.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-border/60" />

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
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
                    {item.step}
                  </div>
                  <h3 className="font-extrabold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-2">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full mb-3">
            💎 Plans & Pricing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Transparent, Value-Driven Plans</h2>
          <p className="text-lg text-muted-foreground mt-2 mb-8 font-light">Cancel anytime. Build control of your money in minutes.</p>
          
          <div className="inline-flex items-center gap-2 bg-muted/60 border border-border rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${!isYearly ? "bg-card text-primary shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 ${isYearly ? "bg-card text-primary shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Billed Yearly
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Save 37%</span>
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
                  ? "border-primary bg-card shadow-xl shadow-primary/5 relative scale-[1.03] z-10"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                  }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white border-none px-4 py-1 text-xs font-semibold rounded-full shadow-md">
                    👑 Most Popular Choice
                  </Badge>
                )}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-4xl md:text-5xl font-black text-foreground tracking-tight">{price}</span>
                      <span className="text-muted-foreground ml-1.5 text-sm">/{periodLabel}</span>
                    </div>
                    {yearlyNote && (
                      <p className="text-xs text-primary font-semibold mt-1.5">{yearlyNote}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3 font-normal leading-relaxed">{plan.description}</p>
                  </div>
                  
                  <hr className="border-border mb-6" />

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/login">
                  <Button
                    className={`w-full py-6 text-xs font-bold rounded-xl transition-all ${
                      plan.highlighted 
                        ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/95 hover:to-purple-500 text-white shadow-md shadow-primary/20 hover:scale-[1.02]" 
                        : "border-border hover:bg-muted/40 text-primary bg-transparent"
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

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary via-purple-900 to-zinc-950 text-white border-t border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
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
                <Button size="lg" className="bg-white hover:bg-slate-50 text-primary hover:text-primary/90 gap-2 px-10 py-6 rounded-xl font-bold shadow-2xl transition-all hover:scale-[1.02]">
                  Get Started for Free <ArrowRight className="w-5 h-5 text-primary" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-foreground font-extrabold">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-white text-sm font-bold italic tracking-tighter">X</span>
            </div>
            Xsubscrips
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Designed to help you budget smarter. © {new Date().getFullYear()} Xsubscrips. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
