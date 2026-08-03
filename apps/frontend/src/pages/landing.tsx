import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BarChart2, Bell, CreditCard, Shield, TrendingDown,
  CheckCircle2, Clock, Play, Pause, RotateCcw, Sparkles,
  UploadCloud, LayoutDashboard, List, Plus, Mail, Lock, Star, TrendingUp,
  AlertTriangle, ScanLine, PiggyBank, Quote, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { supabase } from "@/lib/supabaseClient";

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="transition-all duration-300 drop-shadow-[0_2px_6px_rgba(15,23,42,0.2)]">
      <defs>
        <linearGradient id="logo-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="logo-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <path d="M26 22 L46 50 L26 78 L38 78 L58 50 L38 22 Z" fill="url(#logo-violet)" className="opacity-95" />
      <path d="M74 22 L54 50 L74 78 L62 78 L42 50 L62 22 Z" fill="url(#logo-cyan)" className="opacity-90" />
    </svg>
  );
}

// Scroll reveal preset
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const marqueeLogos = [
  "netflix", "spotify", "youtube", "chatgpt", "claude",
  "figma", "github", "notion", "slack", "adobe", "apple",
];

const phoneSubs = [
  { logo: "netflix", name: "Netflix", meta: "Renews Jun 25", price: "$15.49", flag: true },
  { logo: "spotify", name: "Spotify", meta: "Renews Jun 28", price: "$10.99", flag: false },
  { logo: "chatgpt", name: "ChatGPT Plus", meta: "Renews Jun 12", price: "$20.00", flag: false },
  { logo: "figma", name: "Figma", meta: "Trial ends 48h", price: "$0.00", flag: false },
];

const stats = [
  { value: "$892", label: "Avg. annual savings / user" },
  { value: "14,200+", label: "Accounts monitored" },
  { value: "4.9★", label: "Average user rating" },
  { value: "10 sec", label: "To first audit" },
];

const steps = [
  { icon: ScanLine, title: "Connect or scan", desc: "Forward a receipt, drop a PDF invoice, or add apps manually. AI reads the billing details in seconds." },
  { icon: LayoutDashboard, title: "See everything", desc: "Every subscription, renewal, and price change lands in one clean command center — no spreadsheets." },
  { icon: PiggyBank, title: "Save on autopilot", desc: "Get alerts before trials convert and price hikes hit, then cancel the dead weight in a click." },
];

const testimonials = [
  { quote: "Found three subscriptions I'd completely forgotten about in the first five minutes. It paid for itself instantly.", name: "Jordan D.", role: "Freelance designer", initials: "JD" },
  { quote: "The trial alerts alone have saved me hundreds. I no longer get surprise charges from stuff I tried once.", name: "Priya S.", role: "Product manager", initials: "PS" },
  { quote: "Finally a clear picture of what our team actually pays for. We cut 40% of our SaaS spend in a month.", name: "Marcus L.", role: "Startup founder", initials: "ML" },
];

const faqs = [
  { q: "Do I have to connect my bank account?", a: "Never. Xsubscrips works from receipts, invoices, and manual entries — no banking credentials required. Your sensitive logins stay private." },
  { q: "How does the AI find my subscriptions?", a: "Forward an email receipt or drop a PDF invoice and our AI extracts the service, price, and billing cycle automatically. You can also add anything by hand in seconds." },
  { q: "Is there really a free plan?", a: "Yes — the free plan is free forever and lets you track your core subscriptions, get renewal reminders, and see your spend. Upgrade only when you want AI parsing and predictive alerts." },
  { q: "How do trial alerts work?", a: "When you add a free trial, we track its conversion date and warn you across email and push well before it turns into a paid charge — so you decide, not the calendar." },
  { q: "Is my data secure?", a: "All data is encrypted end-to-end in transit and at rest with 256-bit encryption, and every record is isolated per user with row-level security." },
];

export default function Landing() {
  const [heroEmail, setHeroEmail] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [subCount, setSubCount] = useState(6);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "Xsubscrips — Stop the silent subscription leak";
  }, []);

  const handleHeroSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = heroEmail
      ? `/login?email=${encodeURIComponent(heroEmail)}&mode=signup`
      : `/login?mode=signup`;
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  // Interactive dashboard simulation
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = 45;

  useEffect(() => {
    if (isPlaying) {
      simulationRef.current = setInterval(() => {
        setCurrentTime((prev) => (prev >= totalDuration ? 0 : Number((prev + 0.5 * playbackSpeed).toFixed(1))));
      }, 500);
    } else if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const activeStep = currentTime < 15 ? 0 : currentTime < 30 ? 1 : 2;
  const handleStepClick = (i: number) => setCurrentTime(i * 15);
  const formatTimer = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60) < 10 ? "0" : ""}${Math.floor(t % 60)}`;

  const monthlySpend = subCount * 15.5;
  const annualSavings = Math.round(subCount * 15.5 * 12 * 0.28);
  const chartBars = [42, 55, 48, 63, 58, 71, 66, 82, 74, 90, 85, 97];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans relative selection:bg-slate-900 selection:text-white antialiased">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <BrandLogo size={30} />
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Xsubscrips</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="#features" className="hidden sm:inline-block px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#demo" className="hidden sm:inline-block px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Demo</a>
            <a href="#faq" className="hidden sm:inline-block px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
            <Link href="/pricing">
              <span className="hidden sm:inline-block px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Pricing</span>
            </Link>
            <div className="w-px h-5 bg-slate-200 mx-1.5 hidden sm:block" />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-medium">Sign in</Button>
            </Link>
            <Link href="/login?mode=signup">
              <Button size="sm" className="bg-slate-900 hover:bg-black text-white shadow-sm font-semibold px-4 rounded-full gap-1.5">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — split with phone */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-24 w-[560px] h-[560px] bg-[radial-gradient(circle,_rgba(15,23,42,0.06),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.6] [mask-image:radial-gradient(75%_60%_at_50%_15%,black,transparent)]"
            style={{ backgroundImage: "linear-gradient(to right, rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.045) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1.5 pr-3.5 py-1.5 mb-6 shadow-sm">
              <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                <Sparkles className="w-3 h-3" /> New
              </span>
              <span className="text-xs font-semibold text-slate-600">AI-powered subscription auditing</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-[-0.03em] leading-[0.98] mb-5 text-slate-900">
              Stop the silent
              <br />
              <span className="relative inline-block text-slate-900">
                subscription leak.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 -bottom-1 h-[6px] w-full origin-left bg-slate-900/10 rounded-full"
                />
              </span>
            </h1>

            <p className="text-lg text-slate-500 max-w-xl mb-8 leading-relaxed">
              The average person quietly loses <strong className="font-semibold text-slate-900">$348 a year</strong> to price hikes, forgotten trials, and apps they never use. Xsubscrips finds every dollar in seconds.
            </p>

            <form onSubmit={handleHeroSignUp} className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-md mb-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" placeholder="Enter your email" value={heroEmail} onChange={(e) => setHeroEmail(e.target.value)}
                  className="pl-11 h-12 rounded-full bg-white border-slate-300 text-slate-900 shadow-sm text-sm focus-visible:ring-slate-900 placeholder:text-slate-400" required />
              </div>
              <Button size="lg" type="submit" className="shrink-0 h-12 bg-slate-900 hover:bg-black text-white font-semibold px-6 rounded-full shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] gap-2">
                Start free <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button type="button" variant="outline" size="sm" onClick={handleGoogleAuth}
                className="rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium gap-2 h-10 px-5 shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-900" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-900" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-900" /> No bank login</span>
            </div>
          </motion.div>

          {/* Right — Phone mockup */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="relative flex justify-center">
            <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.10),_transparent_70%)] blur-2xl" />

            {/* Floating chips */}
            <div className="absolute top-6 -left-2 sm:left-2 z-30 animate-hub-float-1">
              <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-xl px-3 py-2">
                <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center"><Bell className="w-3 h-3 text-white" /></div>
                <span className="text-[11px] font-bold text-slate-800">New charge found</span>
              </div>
            </div>
            <div className="absolute bottom-24 -right-2 sm:right-0 z-30 animate-hub-float-2">
              <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-xl px-3 py-2">
                <TrendingDown className="w-4 h-4 text-slate-900" />
                <span className="text-[11px] font-bold text-slate-800">Saved $47 this mo.</span>
              </div>
            </div>

            {/* Phone */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 w-[272px] rounded-[2.9rem] bg-slate-950 p-2.5 shadow-[0_50px_90px_-24px_rgba(2,6,23,0.55)] border border-slate-800"
            >
              {/* Dynamic island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 border border-slate-800" />
              {/* Screen */}
              <div className="rounded-[2.35rem] bg-slate-50 overflow-hidden h-[556px] relative">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-4 pb-1 text-[10px] font-semibold text-slate-900">
                  <span className="font-mono">9:41</span>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-2 rounded-[2px] border border-slate-400" />
                    <span className="w-1 h-2 rounded-[1px] bg-slate-900" />
                  </div>
                </div>

                {/* App header */}
                <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BrandLogo size={18} />
                    <span className="text-sm font-extrabold tracking-tight text-slate-900">Xsubscrips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center"><Search className="w-3.5 h-3.5 text-slate-500" /></div>
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">ER</div>
                  </div>
                </div>

                {/* Total card */}
                <div className="px-4">
                  <div className="rounded-3xl bg-slate-950 text-white p-4 shadow-lg relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Monthly spend</p>
                        <span className="text-[9px] font-bold bg-white/10 border border-white/15 rounded-full px-2 py-0.5">−28%</span>
                      </div>
                      <p className="text-3xl font-extrabold font-mono tracking-tight mt-1">$368.30</p>
                      <div className="flex items-end gap-1 h-8 mt-3">
                        {chartBars.map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 + i * 0.04 }}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-white/25 to-white"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* List */}
                <div className="px-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracked subscriptions</p>
                    <span className="text-[10px] font-bold text-slate-900">8 active</span>
                  </div>
                  <div className="space-y-2">
                    {phoneSubs.map((s, i) => (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                        className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                            <img src={`/logos/${s.logo}.svg`} alt={s.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 leading-tight truncate">{s.name}</p>
                            <p className={`text-[10px] leading-tight truncate ${s.flag ? "text-slate-900 font-semibold" : "text-slate-400"}`}>
                              {s.flag && "⚠ "}{s.meta}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 font-mono shrink-0">{s.price}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Push notification */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [-20, 8, 8, -20] }}
                  transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, times: [0, 0.1, 0.9, 1], ease: "easeInOut" }}
                  className="absolute top-14 left-3 right-3 z-40"
                >
                  <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur rounded-2xl border border-slate-200 shadow-2xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-white" /></div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">Price hike detected</p>
                      <p className="text-[10px] text-slate-500 leading-tight truncate">Netflix +$2.00 · renews in 3 days</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logo marquee */}
      <section className="relative z-10 py-8 border-y border-slate-100 bg-slate-50/60">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
          Tracks every app you already pay for
        </p>
        <div className="mask-marquee overflow-hidden">
          <div className="animate-marquee gap-4">
            {[...marqueeLogos, ...marqueeLogos].map((logo, i) => (
              <div key={`${logo}-${i}`} className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <img src={`/logos/${logo}.svg`} alt={logo} className="w-8 h-8 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-14">
        <motion.div {...reveal} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center rounded-2xl border border-slate-200 bg-white shadow-sm px-3 py-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1.5 leading-snug">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* BENTO FEATURES */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div {...reveal} className="max-w-2xl mb-10">
          <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-3">Everything you need</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-[-0.02em] leading-tight">One system to catch every wasted dollar</h2>
          <p className="text-base text-slate-500 mt-3 leading-relaxed">From silent price hikes to trials on the edge of converting — Xsubscrips watches the details so your money stays yours.</p>
        </motion.div>

        <motion.div {...reveal} className="grid md:grid-cols-6 gap-4">
          <div className="md:col-span-4 group relative bg-slate-950 text-white rounded-3xl p-7 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.06] rounded-full blur-3xl" />
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-4">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">Spend analytics & projections</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-6">See recurring costs broken down by category and billing cycle, with a 3-year projection of where it's all headed.</p>
              <div className="flex items-end gap-1.5 h-20">
                {chartBars.map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex-1 rounded-t bg-gradient-to-t from-white/20 to-white" />
                ))}
              </div>
            </div>
          </div>

          {[
            { icon: Bell, title: "Predictive trial alarms", desc: "Get warned across email and push before a free trial quietly converts into a charge.", span: "md:col-span-2" },
            { icon: CreditCard, title: "One vault for it all", desc: "Every subscription, price, and renewal date in one clean workspace — zero spreadsheets.", span: "md:col-span-2" },
            { icon: TrendingDown, title: "AI cost auditing", desc: "AI reads your receipts, flags duplicate tools, and surfaces exactly what's worth cancelling.", span: "md:col-span-2" },
            { icon: Shield, title: "Bank-grade & private", desc: "256-bit encryption, per-user isolation, and no bank logins ever required.", span: "md:col-span-2" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`${f.span} group bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300`}>
                <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md shadow-slate-900/10 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-3">How it works</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-[-0.02em] leading-tight">From chaos to clarity in three steps</h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }} className="relative text-center">
                <div className="relative z-10 mx-auto w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-slate-900" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE DEMO (monochrome dark player) */}
      <section id="demo" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-3">Live product tour</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-[-0.02em] leading-tight">Watch a receipt become real savings</h2>
          <p className="text-base text-slate-500 mt-3 leading-relaxed">Scrub the timeline: a scanned invoice turns into tracked spend, live projections, and a renewal alert — in under a minute.</p>
        </motion.div>

        <motion.div {...reveal} className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-x-10 -top-8 -bottom-8 bg-[radial-gradient(60%_50%_at_50%_40%,_rgba(15,23,42,0.18),_transparent_70%)] blur-2xl pointer-events-none" />
          <div className="relative rounded-[26px] border border-white/10 bg-slate-950 shadow-[0_40px_100px_-24px_rgba(2,6,23,0.65)] overflow-hidden ring-1 ring-black/5">
            {/* Chrome */}
            <div className="bg-slate-900/80 border-b border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 max-w-xs w-full bg-slate-800/70 border border-white/10 rounded-lg px-3 py-1 text-[11px] text-slate-400">
                  <Lock className="w-3 h-3 text-slate-300" />
                  <span className="font-mono truncate">app.xsubscrips.com/dashboard</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 text-slate-200 border border-white/15 rounded-md text-[9px] uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
              </span>
            </div>

            <div className="grid md:grid-cols-12 min-h-[480px]">
              {/* Steps */}
              <div className="md:col-span-4 bg-slate-900/40 border-r border-white/10 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interactive workflow</p>
                  <div className="space-y-2">
                    {[
                      { label: "Scan invoices", icon: UploadCloud, time: "0–15s", desc: "Drop receipt PDFs to extract billing cycles automatically." },
                      { label: "See your spend", icon: BarChart2, time: "15–30s", desc: "Dense metrics with real-time savings projections." },
                      { label: "Get alerts", icon: Bell, time: "30–45s", desc: "Automated warnings before free trials auto-convert." },
                    ].map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = activeStep === idx;
                      return (
                        <button key={idx} onClick={() => handleStepClick(idx)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all ${isActive ? "bg-white/5 border-white/25 ring-1 ring-white/10 shadow-lg" : "bg-transparent border-transparent hover:bg-white/[0.03]"}`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`flex items-center justify-center w-6 h-6 rounded-lg ${isActive ? "bg-white text-slate-900" : "bg-slate-800 text-slate-500"}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-400"}`}>{step.label}</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">{step.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal pl-8">{step.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[11px] text-slate-300 leading-snug flex gap-2 items-center">
                  <Sparkles className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Click any step or scrub the timeline to explore.</span>
                </div>
              </div>

              {/* Dashboard mock */}
              <div className="md:col-span-8 p-4 relative overflow-hidden select-none bg-[radial-gradient(120%_120%_at_100%_0%,_rgba(255,255,255,0.05),_transparent_45%)]">
                <div className="w-full h-full bg-slate-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col text-left overflow-hidden min-h-[420px]">
                  <div className="bg-slate-900/90 border-b border-white/10 px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BrandLogo size={16} />
                      <span className="font-bold text-[10px] text-white tracking-tight">Xsubscrips workspace</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-5 rounded-md bg-slate-800 border border-white/10 px-2 flex items-center justify-between text-[8px] text-slate-500">
                        <span>Search apps…</span>
                        <kbd className="text-[7px] bg-slate-700 px-1 rounded text-slate-300 font-mono">⌘K</kbd>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-white/15 text-white font-bold text-[8px] flex items-center justify-center border border-white/20">ER</div>
                    </div>
                  </div>

                  <div className="flex-1 flex text-[9px]">
                    <div className="w-24 border-r border-white/10 bg-slate-900/60 p-1.5 space-y-0.5 shrink-0 hidden sm:block">
                      {[
                        { label: "Dashboard", icon: LayoutDashboard, active: true },
                        { label: "Subscriptions", icon: List, active: false },
                        { label: "Trials", icon: Clock, active: false },
                        { label: "Analytics", icon: BarChart2, active: false },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[9px] font-semibold transition-all ${item.active ? "bg-white/10 text-white border border-white/15" : "text-slate-500"}`}>
                            <Icon className="w-3 h-3" />
                            <span>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex-1 p-3 space-y-2.5 relative overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div>
                          <h4 className="text-[11px] font-extrabold text-white leading-none">Command Center</h4>
                          <p className="text-[8px] text-slate-500 mt-1 font-mono">personal_vault_01</p>
                        </div>
                        <button className="flex items-center gap-1 bg-white text-slate-900 text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                          <Plus className="w-2.5 h-2.5" /> Add app
                        </button>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-2">
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Monthly spend</p>
                          <div className="text-[12px] font-black text-white font-mono mt-0.5">
                            {activeStep === 0 ? "$368.30" : activeStep === 1 ? (currentTime < 22 ? "$368.30" : "$383.79") : (currentTime < 38 ? "$383.79" : "$368.30")}
                          </div>
                          <p className="text-[7px] mt-0.5 font-mono">
                            {activeStep === 1 && currentTime >= 22 ? <span className="text-slate-300 font-bold">+$15.49 added</span>
                              : activeStep === 2 && currentTime >= 38 ? <span className="text-white font-bold">−$15.49 saved</span>
                                : <span className="text-slate-500">$4,420/yr</span>}
                          </p>
                        </div>
                        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-2">
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Active apps</p>
                          <div className="text-[12px] font-black text-white font-mono mt-0.5">{activeStep === 0 ? "8" : activeStep === 1 ? (currentTime < 22 ? "8" : "9") : (currentTime < 38 ? "9" : "8")}</div>
                          <p className="text-[7px] text-slate-500 mt-0.5">Auto-monitored</p>
                        </div>
                        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-2">
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Trials ending</p>
                          <div className="text-[12px] font-black text-white font-mono mt-0.5">1</div>
                          <p className="text-[7px] text-slate-400 font-bold mt-0.5">Alert in 48h</p>
                        </div>
                        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-2">
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Renewals</p>
                          <div className="text-[12px] font-black text-white font-mono mt-0.5">6</div>
                          <p className="text-[7px] text-slate-400 font-bold mt-0.5">Next 30 days</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/40 border border-white/10 rounded-xl p-2.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Spend trend</span>
                          </div>
                          <span className="flex items-center gap-1 text-[8px] font-bold text-slate-300 font-mono"><TrendingUp className="w-2.5 h-2.5" /> 12-month</span>
                        </div>
                        <div className="flex items-end justify-between gap-1 h-14">
                          {chartBars.map((h, i) => {
                            const lit = i <= (currentTime / totalDuration) * chartBars.length;
                            return <div key={i} className={`flex-1 rounded-t-sm transition-all duration-500 ${lit ? "bg-gradient-to-t from-slate-500 to-white" : "bg-slate-700/60"}`} style={{ height: `${h}%` }} />;
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>Monitored subscriptions</span>
                          <span className="text-slate-300 cursor-pointer">View all →</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-xl border border-white/10 text-[9px]">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded bg-white/90 p-0.5 flex items-center justify-center shrink-0"><img src="/logos/chatgpt.svg" alt="ChatGPT" className="w-full h-full object-contain" /></div>
                              <div>
                                <p className="font-bold text-white leading-none">ChatGPT Plus</p>
                                <p className="text-[7px] text-slate-500 mt-0.5">Jun 12, 2026 · <span className="text-slate-300 font-medium">Active</span></p>
                              </div>
                            </div>
                            <div className="text-right font-mono"><p className="font-bold text-white">$20.00</p><p className="text-[7px] text-slate-500">monthly</p></div>
                          </div>
                          <AnimatePresence>
                            {((activeStep === 1 && currentTime >= 22) || (activeStep === 2 && currentTime < 38)) ? (
                              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                className="flex items-center justify-between p-2 bg-white/10 rounded-xl border border-white/20 text-[9px]">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded bg-white/90 p-0.5 flex items-center justify-center shrink-0"><img src="/logos/netflix.svg" alt="Netflix" className="w-full h-full object-contain" /></div>
                                  <div>
                                    <div className="flex items-center gap-1"><p className="font-bold text-white leading-none">Netflix Premium</p><span className="bg-white/15 text-white text-[6px] px-1 rounded font-bold">New</span></div>
                                    <p className="text-[7px] text-slate-400 mt-0.5">Jun 25, 2026 · in 32 days</p>
                                  </div>
                                </div>
                                <div className="text-right font-mono"><p className="font-bold text-white">$15.49</p><p className="text-[7px] text-slate-300">monthly</p></div>
                              </motion.div>
                            ) : (
                              <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-xl border border-white/10 text-[9px]">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded bg-white/90 p-0.5 flex items-center justify-center shrink-0"><img src="/logos/apple.svg" alt="Apple" className="w-full h-full object-contain" /></div>
                                  <div>
                                    <p className="font-bold text-white leading-none">Apple One Premier</p>
                                    <p className="text-[7px] text-slate-500 mt-0.5">Jun 05, 2026 · <span className="text-slate-300 font-medium">Review</span></p>
                                  </div>
                                </div>
                                <div className="text-right font-mono"><p className="font-bold text-white">$37.95</p><p className="text-[7px] text-slate-500">monthly</p></div>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controller */}
            <div className="bg-slate-900/80 border-t border-white/10 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-9 h-9 bg-white hover:bg-slate-200 text-slate-900 rounded-full flex items-center justify-center shadow-lg transition-all">
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-900" /> : <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5" />}
                </button>
                <button onClick={() => setCurrentTime(0)} className="w-8 h-8 bg-slate-800 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-slate-700" title="Restart">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <div className="text-xs font-semibold text-slate-400 font-mono">{formatTimer(currentTime)} / 0:45</div>
              </div>
              <div className="flex-1 w-full sm:mx-4 flex items-center gap-2">
                <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                  <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-slate-400 to-white rounded-full" style={{ width: `${(currentTime / totalDuration) * 100}%` }} />
                  <input type="range" min="0" max={totalDuration} step="0.5" value={currentTime} onChange={(e) => setCurrentTime(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 1.5, 2].map((speed) => (
                  <button key={speed} onClick={() => setPlaybackSpeed(speed)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${playbackSpeed === speed ? "bg-white text-slate-900" : "bg-slate-800 border border-white/10 text-slate-400 hover:bg-slate-700"}`}>{speed}x</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SAVINGS CALCULATOR */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div {...reveal} className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.06] rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Savings calculator</p>
              <h3 className="text-2xl font-extrabold tracking-tight mb-6">How much are you leaving on the table?</h3>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-slate-300">Subscriptions you pay for</span>
                <span className="font-bold text-white font-mono text-lg">{subCount}</span>
              </div>
              <input type="range" min="1" max="30" value={subCount} onChange={(e) => setSubCount(Number(e.target.value))} className="w-full accent-white cursor-pointer" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Est. monthly spend</p>
                  <p className="text-2xl font-black font-mono mt-1">${monthlySpend.toFixed(0)}</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Potential yearly savings</p>
                  <p className="text-2xl font-black font-mono mt-1 text-white">${annualSavings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-center shadow-sm">
            <PiggyBank className="w-10 h-10 text-slate-900 mb-4" />
            <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Most users save in week one</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">The moment you can see every subscription in one place, the wasted ones become obvious. Cancelling is one click.</p>
            <Link href="/login?mode=signup">
              <Button className="bg-slate-900 hover:bg-black text-white font-semibold rounded-full h-11 px-6 gap-2 shadow-md transition-all hover:scale-[1.02]">Start saving free <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-3">Loved by smart spenders</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-[-0.02em] leading-tight">People who stopped overpaying</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all flex flex-col">
              <Quote className="w-7 h-7 text-slate-200 mb-3" />
              <div className="flex mb-3">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="w-4 h-4 fill-slate-900 text-slate-900" />)}</div>
              <p className="text-[15px] font-medium text-slate-700 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">{t.initials}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <motion.div {...reveal} className="text-center mb-10">
          <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-3">FAQ</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-[-0.02em] leading-tight">Questions, answered</h2>
        </motion.div>
        <motion.div {...reveal}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-2xl bg-white px-5 shadow-sm">
                <AccordionTrigger className="text-left text-[15px] font-bold text-slate-900 hover:no-underline py-5">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* CTA (black) */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div {...reveal} className="relative rounded-[32px] bg-slate-950 px-6 py-16 sm:py-20 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
            style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/[0.06] rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/[0.06] rounded-full blur-3xl" />
          <div className="relative max-w-2xl mx-auto">
            <Badge className="bg-white/10 text-white border border-white/20 px-3 py-1 text-[10px] font-bold rounded-full mb-5 backdrop-blur-sm">10-second setup</Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-white">Plug the leak. Keep your money.</h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">Join thousands of smart spenders using Xsubscrips to audit receipts and reclaim their cash flow — free forever.</p>
            <Link href="/login?mode=signup">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 gap-2 px-8 h-12 rounded-full font-bold shadow-xl transition-all hover:scale-[1.03]">Get started for free <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Sticky bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-white/95 border border-slate-200 backdrop-blur-lg p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0"><Sparkles className="w-4 h-4" /></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Stop silent charges</p>
                <p className="text-[11px] text-slate-500">Free forever · Setup in 10s</p>
              </div>
            </div>
            <Button size="sm" onClick={() => { window.location.href = `/login?mode=signup`; }} className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 h-9 rounded-full shadow-sm shrink-0 gap-1">Try free <ArrowRight className="w-3 h-3" /></Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold">
            <BrandLogo size={22} />
            Xsubscrips
          </div>
          <p className="font-medium text-center">Total transparency for every subscription. © {new Date().getFullYear()} Xsubscrips. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
