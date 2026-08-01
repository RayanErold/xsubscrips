import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BarChart2, Bell, CreditCard, Shield, TrendingDown, 
  CheckCircle2, Zap, Clock, Play, Pause, RotateCcw, Sparkles, 
  UploadCloud, Check, Laptop, Smartphone, Plus, Mail, Lock, 
  ChevronRight, AlertTriangle, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(99,102,241,0.25)]">
      <defs>
        <linearGradient id="logo-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="logo-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
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

const softwareCatalog = [
  { id: "netflix", name: "Netflix Premium", price: "$15.49", period: "mo", category: "Entertainment", logo: "/logos/netflix.svg", status: "Price Hike Alert (+ $2.00)", statusType: "warning", renewal: "In 3 days" },
  { id: "chatgpt", name: "ChatGPT Plus", price: "$20.00", period: "mo", category: "AI & Tools", logo: "/logos/chatgpt.svg", status: "Active Subscription", statusType: "active", renewal: "June 12" },
  { id: "claude", name: "Claude AI Pro", price: "$20.00", period: "mo", category: "AI & Tools", logo: "/logos/claude.svg", status: "Trial Expiring in 48h", statusType: "trial", renewal: "June 1" },
  { id: "figma", name: "Figma Professional", price: "$15.00", period: "mo", category: "Design", logo: "/logos/figma.svg", status: "Active (Billed Yearly)", statusType: "active", renewal: "Sept 18" },
  { id: "spotify", name: "Spotify Family", price: "$10.99", period: "mo", category: "Entertainment", logo: "/logos/spotify.svg", status: "Active", statusType: "active", renewal: "June 28" },
  { id: "youtube", name: "YouTube Premium", price: "$13.99", period: "mo", category: "Entertainment", logo: "/logos/youtube.svg", status: "Active", statusType: "active", renewal: "June 15" },
  { id: "github", name: "GitHub Pro", price: "$4.00", period: "mo", category: "Developer", logo: "/logos/github.svg", status: "Active", statusType: "active", renewal: "July 01" },
  { id: "apple", name: "Apple One Premier", price: "$37.95", period: "mo", category: "Services", logo: "/logos/apple.svg", status: "Review Recommended", statusType: "warning", renewal: "June 05" },
];

const features = [
  {
    icon: CreditCard,
    title: "Instant Subscription Discovery",
    description: "Keep all your software subscriptions in one clean vault. Monitor pricing, billing cycles, and active seats without manual spreadsheets.",
  },
  {
    icon: Bell,
    title: "Predictive Trial Alarms",
    description: "Never pay for another forgotten trial. Receive smart multi-channel alerts well before a free trial converts into a paid renewal.",
  },
  {
    icon: BarChart2,
    title: "Spend Analytics & Projections",
    description: "Compact interactive charts break down your recurring expenses by category, billing frequency, and 3-year projected overhead.",
  },
  {
    icon: TrendingDown,
    title: "Gemini AI Cost Auditing",
    description: "Leverage Google Gemini AI to analyze your invoice receipts, surface duplicate tools, and highlight instant cancel-to-save targets.",
  },
];

const stats = [
  { value: "$892", label: "Average annual user savings" },
  { value: "14,200+", label: "Active accounts monitored" },
  { value: "10 secs", label: "Setup time to first audit" },
];

export default function Landing() {
  const [subCount, setSubCount] = useState(6);
  const [heroEmail, setHeroEmail] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState("All");

  // Dynamic 3D Tilt State for the Dashboard Simulator
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / 35);
    setRotateY(x / 35);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    // SEO setup
    document.title = "Xsubscrips - Premium SaaS Subscription Control & Auditing";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Stop paying for forgotten subscriptions. Optimize recurring software costs with Gemini AI invoice auditing, predictive trial alarms, and compact spend analytics.");
    }

    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeroSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEmail) {
      window.location.href = `/login?email=${encodeURIComponent(heroEmail)}&mode=signup`;
    } else {
      window.location.href = `/login?mode=signup`;
    }
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  // Video simulation states
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 45 seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 1.5x, 2x
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = 45; // 45 seconds total duration

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
  const potentialSavings = subCount * 15.50 * 12 * 0.28;
  const lifetimeSavings = potentialSavings * 3;

  const filteredCatalog = catalogFilter === "All" 
    ? softwareCatalog 
    : softwareCatalog.filter(item => item.category === catalogFilter);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden font-sans relative selection:bg-indigo-900/60 selection:text-indigo-100 pb-20 dark">
      {/* Background vector grid and glowing ambient blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute top-[300px] right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-7000" />
      <div className="absolute top-[800px] left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-900/80 bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <BrandLogo size={32} />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Xsubscrips
            </span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/40 border-indigo-800/40">
              SaaS Control
            </Badge>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#product" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:inline-block">
              Product
            </a>
            <a href="#how-it-works" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:inline-block">
              How it Works
            </a>
            <Link href="/pricing">
              <span className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:inline-block">
                Pricing
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white font-semibold text-xs border border-transparent hover:bg-slate-900/40">
                  Sign In
                </Button>
              </Link>
              <Link href="/login?mode=signup">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 font-bold px-4 rounded-xl text-xs">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (Premium SaaS Dark Design) */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16 text-center relative z-10">
        {/* Floating subscription icons around the hero */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
          {/* Netflix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1, y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-[120px] left-[10%] w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/10 blur-[0.5px]"
          >
            <img src="/logos/netflix.svg" alt="Netflix" className="w-8 h-8 object-contain" />
          </motion.div>
          {/* Figma */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1, y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[220px] right-[8%] w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/10"
          >
            <img src="/logos/figma.svg" alt="Figma" className="w-6 h-6 object-contain" />
          </motion.div>
          {/* ChatGPT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.28, scale: 1, y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-[220px] left-[12%] w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/10"
          >
            <img src="/logos/chatgpt.svg" alt="ChatGPT" className="w-6 h-6 object-contain" />
          </motion.div>
          {/* Claude */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1, y: [0, 12, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            className="absolute bottom-[160px] right-[14%] w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/10 blur-[0.5px]"
          >
            <img src="/logos/claude.svg" alt="Claude" className="w-8 h-8 object-contain" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 mb-6 shadow-[0_0_15px_rgba(99,102,241,0.15)] relative overflow-hidden group hover:border-slate-700 transition-colors">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Intelligent Software Subscription Auditing</span>
            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7.5xl font-extrabold tracking-tight leading-[1.05] mb-6 text-white max-w-4xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block"
            >
              Stop Paying For
            </motion.span>{" "}
            <br />
            <motion.span 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(99,102,241,0.15)]"
            >
              Subscriptions You Forgot.
            </motion.span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            The average person wastes over <strong className="font-semibold text-indigo-400">$348 a year</strong> on silent price hikes, forgotten free trials, and unused software. Gain 100% pricing transparency today.
          </p>

          {/* High-Converting 1-Step Email Capture Form */}
          <form onSubmit={handleHeroSignUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-4 relative z-20">
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-505" />
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={heroEmail}
                onChange={(e) => setHeroEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-slate-900/60 border-slate-800 text-white shadow-sm text-xs focus-visible:ring-indigo-500 placeholder:text-slate-500"
                required
              />
            </div>
            <Button size="lg" type="submit" className="w-full sm:w-auto shrink-0 h-12 bg-indigo-600 hover:bg-indigo-505 text-white font-bold px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] text-xs gap-2">
              Start Free <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* 1-Click Google OAuth Option */}
          <div className="flex items-center justify-center gap-3 mb-6 relative z-20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGoogleAuth}
              className="rounded-xl border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold gap-2 py-2 px-4 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign Up with Google in 1-Click
            </Button>
          </div>

          {/* Microcopy Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" /> Free Forever Plan</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" /> No Credit Card Required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" /> Instant Setup</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 mt-14 max-w-3xl mx-auto border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.3)] relative z-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono tracking-tight">{stat.value}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Infinite Logo Marquee Section */}
      <section className="border-y border-slate-905 bg-slate-950/40 py-6 overflow-hidden relative z-10 mask-marquee">
        <div className="animate-marquee flex gap-12 items-center whitespace-nowrap">
          {[...softwareCatalog, ...softwareCatalog, ...softwareCatalog].map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center shrink-0">
                <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Software Transparency Showcase (Real Brands & Real Costs Grid) */}
      <section id="product" className="max-w-6xl mx-auto px-6 py-14 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="outline" className="text-indigo-400 border-indigo-900/40 bg-indigo-955/40 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-2">
              🏷️ Full Software Transparency
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real Software. Real Costs. Zero Surprises.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-normal">
              Track active software subscriptions, detect stealth price hikes, and get alerted before free trials turn into charges.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Entertainment", "AI & Tools", "Design", "Developer"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCatalogFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  catalogFilter === cat
                    ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Software Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCatalog.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xs flex items-center justify-center shrink-0">
                      <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white leading-tight">{item.name}</h4>
                      <span className="text-[10px] text-slate-550 font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-900 rounded-lg p-2.5 mb-3 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Billing Rate</span>
                  <div className="text-right">
                    <span className="text-sm font-black text-white font-mono">{item.price}</span>
                    <span className="text-[10px] text-slate-550">/{item.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-550 font-medium">Renewal Date:</span>
                  <span className="font-bold text-slate-300 font-mono">{item.renewal}</span>
                </div>
                
                <div className="flex items-center gap-1 text-[9px] font-bold">
                  {item.statusType === "warning" && (
                    <span className="text-amber-400 bg-amber-505/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 w-full justify-center">
                      <AlertTriangle className="w-2.5 h-2.5" /> {item.status}
                    </span>
                  )}
                  {item.statusType === "trial" && (
                    <span className="text-purple-400 bg-purple-505/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 w-full justify-center">
                      <Clock className="w-2.5 h-2.5" /> {item.status}
                    </span>
                  )}
                  {item.statusType === "active" && (
                    <span className="text-emerald-400 bg-emerald-505/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 w-full justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500/80" /> {item.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Refined Small Font Dashboard UI Showcase (Interactive Video Simulation with 3D Tilt) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-14 relative z-10">
        <div className="text-center mb-8">
          <Badge variant="outline" className="text-indigo-400 border-indigo-900/40 bg-indigo-955/40 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-2">
            🖥️ Compact SaaS Command Center
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Density Control, Tailored for Clarity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1 font-normal">
            Refined micro-typography and structured tables give you instant visibility without cumbersome scrolling.
          </p>
        </div>

        {/* 3D Tilt Wrapper */}
        <motion.div
          className="w-full max-w-5xl mx-auto"
          style={{ perspective: 1000 }}
        >
          {/* Video Player Shell - Premium Dark SaaS Theme */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="w-full border border-slate-800/80 bg-slate-950/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group"
          >
            {/* Ambient overlay glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
            
            {/* Header Bar */}
            <div className="bg-slate-900/70 border-b border-slate-800/60 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 font-medium relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-805" />
                </div>
                <span className="ml-2 px-2 py-0.5 bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 rounded text-[9px] uppercase font-bold tracking-wider">Live Simulation</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-550 font-mono">⏱️ {formatTimer(currentTime)} / 0:45</span>
                <Smartphone className="w-3.5 h-3.5 text-indigo-405" />
              </div>
            </div>

            {/* Player Main Layout */}
            <div className="grid md:grid-cols-12 min-h-[460px] relative z-10">
              
              {/* Steps Navigation Column */}
              <div className="md:col-span-4 bg-slate-900/20 border-r border-slate-900/80 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Interactive Workflow</p>
                  <div className="space-y-2">
                    {[
                      { label: "1. AI Invoice Scanning", icon: UploadCloud, time: "0s - 15s", desc: "Drag receipt PDFs to extract billing cycles with 99.8% precision." },
                      { label: "2. Compact Spend Vault", icon: BarChart2, time: "15s - 30s", desc: "Dense subscription metrics with real-time savings projections." },
                      { label: "3. Renewal & Price Alarms", icon: Bell, time: "30s - 45s", desc: "Receive automated alerts before free trials auto-convert." }
                    ].map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = activeStep === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleStepClick(idx)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            isActive 
                              ? "bg-slate-900 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.06)] text-white" 
                              : "bg-slate-950/30 border-slate-900 text-slate-500 hover:bg-slate-900/30 hover:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-600"}`} />
                              <span className={`text-xs font-bold ${isActive ? "text-indigo-400" : "text-slate-300"}`}>{step.label}</span>
                            </div>
                            <span className="text-[9px] text-slate-505 font-mono">{step.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{step.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-900/40 text-[10px] text-indigo-300 leading-snug flex gap-2 items-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Click any step or scrub the timeline below to preview.</span>
                </div>
              </div>

              {/* Dashboard Mock Canvas (Small Font Size UI) */}
              <div className="md:col-span-8 bg-[#0b0f19] p-4 flex items-center justify-center relative overflow-hidden select-none">
                
                {/* Active step 0 scan layout */}
                {activeStep === 0 && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 z-20 backdrop-blur-xs">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-48 bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden shadow-2xl"
                    >
                      <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
                      <p className="text-[9px] font-bold text-center text-white">Analyzing Invoice.pdf</p>
                      <p className="text-[7px] text-slate-500 text-center mt-0.5">Gemini AI parsing details...</p>
                      
                      {/* Laser scan line */}
                      <motion.div
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_8px_#6366f1] z-10 pointer-events-none"
                      />
                      
                      {/* Simulated items parsed */}
                      <div className="mt-3 space-y-1">
                        <div className="h-2 bg-slate-800 rounded animate-pulse w-3/4 mx-auto" />
                        <div className="h-2 bg-slate-800 rounded animate-pulse w-1/2 mx-auto" />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Active step 2 trial alarm layout */}
                {activeStep === 2 && (
                  <div className="absolute top-4 right-4 z-20 max-w-[150px]">
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-slate-900 border border-indigo-500/30 rounded-lg p-2 shadow-2xl flex items-start gap-1.5"
                    >
                      <div className="w-4 h-4 rounded-full bg-indigo-955 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 animate-bounce">
                        <Bell className="w-2.5 h-2.5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-white leading-tight">Trial Expiring</p>
                        <p className="text-[6.5px] text-slate-400">Claude AI converts in 48h ($20.00)</p>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="w-full h-full bg-slate-900/50 rounded-xl border border-slate-800 shadow-sm flex flex-col text-left overflow-hidden min-h-[380px]">
                  {/* Mock Window Top Bar */}
                  <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BrandLogo size={16} />
                      <span className="font-extrabold text-[9px] text-white tracking-tight">Xsubscrips Client Workspace</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-4 rounded bg-slate-955 border border-slate-800 px-1.5 flex items-center justify-between text-[7px] text-slate-500">
                        <span>Search apps...</span>
                        <kbd className="text-[6px] bg-slate-900 px-0.5 rounded text-slate-505 font-mono">⌘K</kbd>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-indigo-900/60 text-indigo-300 font-bold text-[7px] flex items-center justify-center border border-indigo-505/20">ER</div>
                    </div>
                  </div>

                  {/* Body Area: Sidebar + Content */}
                  <div className="flex-1 flex text-[9px]">
                    {/* Miniature Sidebar (Small Fonts) */}
                    <div className="w-24 border-r border-slate-800 bg-slate-955/20 p-1.5 space-y-0.5 shrink-0 hidden sm:block">
                      {[
                        { label: "Dashboard", icon: Laptop, active: true },
                        { label: "Subscriptions", icon: BarChart2, active: false },
                        { label: "Trials Monitor", icon: Clock, active: false },
                        { label: "Settings", icon: Shield, active: false },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[8px] font-bold transition-all ${item.active ? "bg-indigo-955/60 text-indigo-400 border border-indigo-900/40" : "text-slate-505 hover:text-slate-300"}`}>
                            <Icon className="w-2.5 h-2.5" />
                            <span>{item.label}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Main Dashboard Canvas (Refined Small Fonts) */}
                    <div className="flex-1 p-3 space-y-2.5 relative overflow-hidden flex flex-col justify-between">
                      
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                        <div>
                          <h4 className="text-[10px] font-extrabold text-white leading-none">Subscription Command Center</h4>
                          <p className="text-[7px] text-slate-500 mt-0.5 font-mono">Active Account: personal_vault_01</p>
                        </div>
                        
                        <button className="flex items-center gap-1 bg-indigo-600 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm">
                          <Plus className="w-2 h-2" />
                          <span>Add App</span>
                        </button>
                      </div>

                      {/* 4 Compact Metric Cards (Small fonts) */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                        <div className="bg-slate-955/50 border border-slate-800 rounded-lg p-1.5 text-left">
                          <p className="text-[6px] text-slate-500 font-bold uppercase tracking-wider">Monthly Spend</p>
                          <div className="text-[10px] font-black text-white font-mono mt-0.5">
                            {activeStep === 0 ? "$368.30" : activeStep === 1 ? (currentTime < 22 ? "$368.30" : "$383.79") : (currentTime < 38 ? "$383.79" : "$368.30")}
                          </div>
                          <p className="text-[6px] text-slate-500 mt-0.5 font-mono">
                            {activeStep === 1 && currentTime >= 22 ? (
                              <span className="text-red-400 font-bold">+$15.49 added</span>
                            ) : activeStep === 2 && currentTime >= 38 ? (
                              <span className="text-emerald-400 font-bold">-$15.49 saved!</span>
                            ) : (
                              <span>$4,420/yr projected</span>
                            )}
                          </p>
                        </div>

                        <div className="bg-slate-955/50 border border-slate-800 rounded-lg p-1.5 text-left">
                          <p className="text-[6px] text-slate-500 font-bold uppercase tracking-wider">Active Apps</p>
                          <div className="text-[10px] font-black text-white font-mono mt-0.5">
                            {activeStep === 0 ? "8 active" : activeStep === 1 ? (currentTime < 22 ? "8 active" : "9 active") : (currentTime < 38 ? "9 active" : "8 active")}
                          </div>
                          <p className="text-[6px] text-slate-500 mt-0.5">Auto-monitored</p>
                        </div>

                        <div className="bg-slate-955/50 border border-slate-800 rounded-lg p-1.5 text-left">
                          <p className="text-[6px] text-slate-500 font-bold uppercase tracking-wider">Ending Trials</p>
                          <div className="text-[10px] font-black text-indigo-400 font-mono mt-0.5">1 pending</div>
                          <p className="text-[6px] text-amber-400 font-bold mt-0.5">Alert in 48h</p>
                        </div>

                        <div className="bg-slate-955/50 border border-slate-800 rounded-lg p-1.5 text-left">
                          <p className="text-[6px] text-slate-550 font-bold uppercase tracking-wider">Renewals</p>
                          <div className="text-[10px] font-black text-white font-mono mt-0.5">6 upcoming</div>
                          <p className="text-[6px] text-indigo-450 font-bold mt-0.5">Next 30 days</p>
                        </div>
                      </div>

                      {/* Micro Software Rows (Small fonts & compact layout) */}
                      <div className="space-y-1 flex-1 mt-1">
                        <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>Monitored Subscriptions</span>
                          <span className="text-indigo-400 cursor-pointer">View All ➔</span>
                        </div>

                        <div className="space-y-1 max-h-[110px] overflow-y-auto pr-0.5">
                          <div className="flex items-center justify-between p-1.5 bg-slate-955/40 rounded-lg border border-slate-800 text-[8px] shadow-2xs">
                            <div className="flex items-center gap-1.5">
                              <img src="/logos/chatgpt.svg" alt="ChatGPT" className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                              <div>
                                <p className="font-bold text-white leading-none">ChatGPT Plus</p>
                                <p className="text-[6px] text-slate-500">June 12, 2026 · <span className="text-emerald-400 font-medium">Active</span></p>
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <p className="font-bold text-white">$20.00</p>
                              <p className="text-[6px] text-slate-500">monthly</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-1.5 bg-slate-955/40 rounded-lg border border-slate-800 text-[8px] shadow-2xs">
                            <div className="flex items-center gap-1.5">
                              <img src="/logos/apple.svg" alt="Apple" className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                              <div>
                                <p className="font-bold text-white leading-none">Apple One Premier</p>
                                <p className="text-[6px] text-slate-500">June 05, 2026 · <span className="text-amber-400 font-medium">Review Seat</span></p>
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <p className="font-bold text-white">$37.95</p>
                              <p className="text-[6px] text-slate-550">monthly</p>
                            </div>
                          </div>

                          <AnimatePresence>
                            {((activeStep === 1 && currentTime >= 22) || (activeStep === 2 && currentTime < 38)) ? (
                              <motion.div 
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex items-center justify-between p-1.5 bg-indigo-955/40 rounded-lg border border-indigo-900/40 text-[8px] shadow-2xs"
                              >
                                <div className="flex items-center gap-1.5">
                                  <img src="/logos/netflix.svg" alt="Netflix" className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                                  <div>
                                    <div className="flex items-center gap-1">
                                      <p className="font-bold text-indigo-400 leading-none">Netflix Premium</p>
                                      <span className="bg-indigo-900/50 text-indigo-300 text-[5px] px-1 rounded font-bold">New Scan</span>
                                    </div>
                                    <p className="text-[6px] text-slate-550">June 25, 2026 · in 32 days</p>
                                  </div>
                                </div>
                                <div className="text-right font-mono">
                                  <p className="font-bold text-indigo-450 animate-pulse">$15.49</p>
                                  <p className="text-[6px] text-indigo-400">monthly</p>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controller Bar */}
            <div className="bg-slate-900/60 border-t border-slate-905 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-sm transition-all"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                </button>
                <button 
                  onClick={() => setCurrentTime(0)}
                  className="w-7 h-7 bg-slate-900 border border-slate-800 text-indigo-400 hover:bg-slate-800 rounded-full flex items-center justify-center shadow-xs"
                  title="Restart"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <div className="text-xs font-semibold text-slate-400 font-mono">
                  {formatTimer(currentTime)} / 0:45
                </div>
              </div>

              {/* Scrubber */}
              <div className="flex-1 w-full mx-0 sm:mx-4 flex items-center gap-2">
                <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full"
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
              </div>

              {/* Speed pills */}
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      playbackSpeed === speed 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-14 relative z-10">
        <div className="text-center mb-10">
          <Badge variant="outline" className="text-indigo-400 border-indigo-900/40 bg-indigo-955/40 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-2">
            💎 Core Capabilities
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed to save you time and capital
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1 font-normal">
            Take complete control of recurring spend with tools custom-built to intercept and audit subscription fees.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Invoice Scanner (Col Span 2) */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900/60 to-slate-950 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group flex flex-col md:flex-row justify-between gap-6 overflow-hidden min-h-[220px]">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-955/40 border border-indigo-900/40 flex items-center justify-center text-indigo-400 mb-4">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Gemini AI Invoice Receipt Parsing</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  Leverage Google Gemini AI to analyze your invoice receipts automatically. Simply drag invoices into your vault to extract subscription terms, price changes, and renewal dates with 99.8% precision.
                </p>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-4 block">100% Automated Scanning</span>
            </div>
            
            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center bg-slate-955/50 border border-slate-900 rounded-xl p-4 relative overflow-hidden min-h-[140px] md:max-w-[200px]">
              <div className="text-center relative">
                <UploadCloud className="w-8 h-8 text-indigo-505/80 mx-auto animate-pulse" />
                <p className="text-[9px] font-bold text-white mt-2">invoice_june.pdf</p>
                <div className="h-1 w-16 bg-indigo-900 rounded-full mx-auto mt-1 overflow-hidden relative">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-indigo-400"
                  />
                </div>
              </div>
              {/* Glowing laser scan overlay */}
              <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent border-y border-indigo-500/10 animate-pulse" />
            </div>
          </div>

          {/* Card 2: Trial Conversion Alarms (Col Span 1) */}
          <div className="md:col-span-1 bg-gradient-to-br from-slate-900/60 to-slate-950 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-955/40 border border-purple-900/40 flex items-center justify-center text-purple-400 mb-4">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Predictive Trial Defense</h3>
              <p className="text-xs text-slate-450 mt-2 leading-relaxed font-normal">
                Never pay for another forgotten free trial. Receive automated SMS, web push, and email alerts 48 hours before your card is billed.
              </p>
            </div>

            {/* Illustration */}
            <div className="mt-4 pt-4 border-t border-slate-900/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Multi-Channel Alerts</span>
              <div className="flex gap-1.5 items-center">
                <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded-full font-mono">SMS</span>
                <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded-full font-mono">Email</span>
              </div>
            </div>
          </div>

          {/* Card 3: Spend Analytics & Projections (Col Span 1) */}
          <div className="md:col-span-1 bg-gradient-to-br from-slate-900/60 to-slate-950 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-955/40 border border-cyan-900/40 flex items-center justify-center text-cyan-400 mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Compact Spend Vault</h3>
              <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                Review key analytics, annual projections, and pricing breakdowns by category on a sleek, high-density dashboard built for transparency.
              </p>
            </div>

            {/* Illustration */}
            <div className="mt-4 pt-4 border-t border-slate-900/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Analytics Engine</span>
              <span className="text-[9px] text-slate-500 font-mono">3-Year Projections</span>
            </div>
          </div>

          {/* Card 4: Shadow IT Auditing (Col Span 2) */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900/60 to-slate-950 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group flex flex-col md:flex-row justify-between gap-6 overflow-hidden min-h-[220px]">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-955/40 border border-emerald-900/40 flex items-center justify-center text-emerald-400 mb-4">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Shadow IT & Duplicate Audits</h3>
                <p className="text-xs text-slate-455 mt-2 leading-relaxed">
                  Identify overlap and duplicate SaaS licenses automatically. The auditor cross-references features between active platforms (e.g. surfacing when team members pay for duplicate Canva and Figma accounts).
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mt-4 block">Smart Overlap Prevention</span>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex flex-col justify-center bg-slate-955/50 border border-slate-900 rounded-xl p-4 min-h-[140px] md:max-w-[200px] gap-2">
              <div className="flex items-center justify-between border border-red-500/20 bg-red-500/5 p-1.5 rounded-lg text-[8px]">
                <span className="text-slate-300 font-bold">Duplicate App</span>
                <span className="text-red-400 font-mono">Figma / Sketch</span>
              </div>
              <div className="flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5 p-1.5 rounded-lg text-[8px]">
                <span className="text-slate-300 font-bold">Optimization</span>
                <span className="text-emerald-400 font-mono">Cancel Sketch (+$15/mo)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Estimator (Brand New Premium UI Block) */}
      <section className="max-w-6xl mx-auto px-6 py-14 relative z-10 border-t border-slate-900/80">
        <div className="bg-gradient-to-br from-slate-900/50 via-slate-900/20 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Background decorative glows */}
          <div className="absolute -bottom-20 -left-20 w-88 h-88 bg-indigo-500/5 rounded-full blur-[80px]" />
          
          <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Slider controls */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <Badge className="bg-indigo-950 border border-indigo-800/40 text-indigo-400 px-3 py-1 text-[10px] font-bold rounded-full mb-3">
                  💰 Calculator
                </Badge>
                <h3 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight">
                  How much capital are you leaking?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal leading-relaxed">
                  Most power users and active teams underestimate their recurring software footprint by over 40%. Drag the slider to input your estimated active subscriptions.
                </p>
              </div>

              {/* Slider panel */}
              <div className="bg-slate-955/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Estimated Software Subscriptions</span>
                  <span className="text-lg font-black text-indigo-400 font-mono">{subCount} apps</span>
                </div>
                
                <div className="py-2">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={subCount}
                    onChange={(e) => setSubCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-2 font-mono">
                    <span>1 App</span>
                    <span>15 Apps</span>
                    <span>30 Apps</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations Panel */}
            <div className="md:col-span-5 bg-indigo-955/20 border border-indigo-900/30 rounded-2xl p-6 flex flex-col justify-between gap-6 min-h-[260px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Savings Breakdown</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline border-b border-indigo-900/20 pb-2">
                    <span className="text-xs text-slate-400 font-medium">Est. Monthly Cost</span>
                    <span className="text-sm font-bold text-white font-mono">${estimatedCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-indigo-900/20 pb-2">
                    <span className="text-xs text-slate-400 font-medium">Estimated 28% AI Leakage</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">${(estimatedCost * 0.28).toFixed(2)} /mo</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-350 font-bold">Annual Savings Target</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">${potentialSavings.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-955/40 p-4 rounded-xl border border-slate-900 text-[10px] text-slate-400 leading-normal flex gap-2 items-center">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>3-Year Reclaimed Cash Projection: <strong className="text-white font-mono">${lifetimeSavings.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Data Protection (Dark Theme) */}
      <section className="bg-slate-950 border-y border-slate-900 py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="text-indigo-400 border-indigo-900/40 bg-indigo-955/40 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-2">
              🔒 Bank-Grade Integrity
            </Badge>
            <h3 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight">Bank-Grade Security & Zero Bank Credential Risk</h3>
            <p className="text-xs text-slate-450 mt-1">Your privacy and data ownership are protected by design.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3 p-5 bg-slate-900/20 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors">
              <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">256-Bit Bank Grade Encryption</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">All invoice and user data is encrypted end-to-end in transit and at rest.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-slate-900/20 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Zero Bank Logins Required</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">No direct bank logins or credentials required. Keep your sensitive passwords private.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-slate-900/20 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Supabase Row Level Security</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Database tables strictly isolated per user UID to guarantee total database privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section (Dark Mode Upgrade) */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10 text-center">
        <div className="bg-gradient-to-br from-slate-900/60 via-slate-900/20 to-slate-950 border border-slate-850 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 max-w-xl">
            <Badge variant="outline" className="text-indigo-400 border-indigo-900/40 bg-indigo-955/40 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full">
              💎 Transparent Pricing
            </Badge>
            <h3 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight leading-none">
              Start Free Forever. Upgrade When You Scale.
            </h3>
            <p className="text-xs sm:text-sm text-slate-455 font-normal leading-relaxed">
              Explore our simple plans with zero hidden fees. Includes Starter Free ($0) and Pro Control with AI receipt parsing.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
            <Link href="/pricing">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs px-6 py-5 rounded-xl shadow-lg shadow-indigo-500/10 gap-2 transition-transform hover:scale-[1.02]">
                View Full Pricing & Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner (Premium Dark Theme) */}
      <section className="py-24 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge className="bg-indigo-955 border border-indigo-800/40 text-indigo-400 px-3 py-1 text-[10px] font-bold rounded-full mb-4">
            🚀 Instant 10-Second Setup
          </Badge>
          <h2 className="text-3xl sm:text-5.5xl font-black tracking-tight leading-[1.1] mb-5">
            Stop Paying For Software <br />You Don't Use.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed mb-8">
            Join thousands of smart spenders using Xsubscrips daily to audit invoice receipts and reclaim cash flow.
          </p>
          <div>
            <Link href="/login?mode=signup">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-950 gap-2 px-8 py-5 rounded-xl font-bold text-xs shadow-xl transition-all hover:scale-[1.02]">
                Get Started for Free <ArrowRight className="w-4 h-4 text-slate-950" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Conversion Floating Banner */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/90 border border-slate-800 backdrop-blur-lg p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-white"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-955 border border-indigo-900/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Stop silent subscription charges</p>
                <p className="text-[10px] text-slate-500">Free forever • Setup in 10 secs</p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => { window.location.href = `/login?mode=signup`; }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shrink-0 gap-1"
            >
              Try Free <ArrowRight className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-955 border-t border-slate-900 py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-white font-extrabold">
            <BrandLogo size={24} />
            Xsubscrips SaaS Control
          </div>
          <p className="font-medium">
            Designed for total software subscription transparency. © {new Date().getFullYear()} Xsubscrips. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
