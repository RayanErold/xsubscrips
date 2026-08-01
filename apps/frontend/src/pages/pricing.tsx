import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, Zap, Sparkles, ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/pages/landing";

const pricingPlans = [
  {
    name: "Free Starter",
    monthly: 0,
    yearly: 0,
    period: "forever",
    description: "Ideal for basic subscription tracking and personal expense clarity.",
    features: [
      "Track up to 10 subscriptions",
      "Standard trial conversion alerts",
      "Manual receipt logging",
      "Basic spending breakdowns",
      "CSV Data Export included",
      "Mobile responsive web vault"
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro Control",
    monthly: 8,
    yearly: 5,
    period: "per month",
    description: "The ultimate vault for active individuals wanting automated trial defense.",
    features: [
      "Unlimited subscription tracking",
      "Automatic Bank Syncing (Plaid integration)",
      "AI Smart Optimization Alerts (surfaces duplicates & unused tools)",
      "AI receipt parsing (Google Gemini AI)",
      "Price hike & stealth charge detection",
      "Advanced multi-channel alerts (Email, Web, SMS)",
      "Predictive 12-month spend analytics",
      "Custom categories & CSV/PDF export",
      "Priority 24/7 customer support"
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
  },
];

const faqs = [
  {
    q: "Do I need to connect my bank account or share passwords?",
    a: "No! Xsubscrips requires zero bank logins or credential access. You can upload invoice receipt PDFs, drop confirmation emails, or manually log recurring charges in under 10 seconds."
  },
  {
    q: "How does the AI receipt scanner work?",
    a: "Our Google Gemini AI engine automatically parses uploaded invoice files or email receipts, identifying the exact software name, billing cycle, renewal date, and hidden tax charges with 99.8% precision."
  },
  {
    q: "What happens when my free trial ends?",
    a: "We notify you 48 hours before any free trial converts into a paid renewal. You will never be caught off guard by a forgotten recurring charge."
  },
  {
    q: "Can I cancel my Pro plan at any time?",
    a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with one click. No hidden cancellation hoops."
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Xsubscrips - Simple & Transparent Pricing Plans";
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-indigo-900/60 selection:text-indigo-100 pb-20 dark">
      {/* Background ambient light mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-900/80 bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <BrandLogo size={32} />
              <span className="text-xl font-extrabold tracking-tight text-white">
                Xsubscrips
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <a href="/#product" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:inline-block">
              Product
            </a>
            <a href="/#how-it-works" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:inline-block">
              How it Works
            </a>
            <Link href="/pricing">
              <span className="text-xs font-bold text-indigo-400 transition-colors cursor-pointer hidden sm:inline-block">
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

      {/* Pricing Hero Header */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="outline" className="text-indigo-400 border-indigo-900/40 bg-indigo-950/40 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-4">
            💎 Simple & Transparent
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Fair Pricing. No Hidden Surprises.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-3 font-normal">
            Start for free, or upgrade to Pro to unlock automated AI receipt parsing and trial conversion defense.
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-8 inline-flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!isYearly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isYearly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              Billed Yearly
              <span className="text-[9px] bg-emerald-555 text-white px-2 py-0.5 rounded-full font-bold">Save 37%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-4xl mx-auto px-6 pb-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const price = plan.monthly === 0 ? "$0" : `$${isYearly ? plan.yearly : plan.monthly}`;
            const periodLabel = plan.monthly === 0 ? "forever" : "per month";
            const yearlyNote = isYearly && plan.monthly > 0 ? `$${plan.yearly * 12} billed annually` : null;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col justify-between transition-all bg-slate-900/20 ${plan.highlighted
                  ? "border-indigo-500/80 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative scale-[1.02] z-10 bg-slate-900/30"
                  : "border-slate-800/80 shadow-sm hover:border-slate-700"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white border-none px-3 py-1 text-[10px] font-bold rounded-full shadow-sm">
                    👑 Recommended Choice
                  </Badge>
                )}
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-extrabold text-white">{plan.name}</h2>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-4xl font-black text-white font-mono tracking-tight">{price}</span>
                      <span className="text-slate-500 ml-1.5 text-xs">/{periodLabel}</span>
                    </div>
                    {yearlyNote && (
                      <p className="text-xs text-indigo-400 font-bold mt-1">{yearlyNote}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">{plan.description}</p>
                  </div>
                  
                  <hr className="border-slate-800/80 mb-6" />

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/login?mode=signup">
                  <Button
                    className={`w-full py-6 text-xs font-bold rounded-xl transition-all ${
                      plan.highlighted 
                        ? "bg-indigo-600 hover:bg-indigo-550 text-white shadow-md shadow-indigo-600/20" 
                        : "border-slate-800 hover:bg-slate-900 text-slate-300 bg-slate-950/40"
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

      {/* Feature Comparison Matrix */}
      <section className="max-w-4xl mx-auto px-6 py-12 relative z-10 border-t border-slate-900">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-white">Compare Plan Capabilities</h2>
          <p className="text-xs text-slate-400 mt-1">Detailed feature comparison between Free Starter & Pro Control.</p>
        </div>

        <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-sm text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-850">
                <th className="p-4 font-bold text-white">Feature</th>
                <th className="p-4 font-bold text-slate-350 text-center w-36">Free Starter</th>
                <th className="p-4 font-bold text-indigo-400 text-center w-36 bg-indigo-950/10">Pro Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              <tr>
                <td className="p-4 font-semibold text-slate-300">Tracked Subscriptions</td>
                <td className="p-4 text-center font-mono text-slate-400">Up to 10</td>
                <td className="p-4 text-center font-mono font-bold text-indigo-400 bg-indigo-950/5">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Automatic Bank Syncing</td>
                <td className="p-4 text-center text-slate-650"><X className="w-4 h-4 mx-auto text-slate-600" /></td>
                <td className="p-4 text-center bg-indigo-950/5"><Check className="w-4 h-4 mx-auto text-indigo-400 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">AI Smart Optimization & Duplicate Alerts</td>
                <td className="p-4 text-center text-slate-650"><X className="w-4 h-4 mx-auto text-slate-600" /></td>
                <td className="p-4 text-center bg-indigo-950/5"><Check className="w-4 h-4 mx-auto text-indigo-400 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">AI Invoice Receipt Parsing (Gemini)</td>
                <td className="p-4 text-center text-slate-650"><X className="w-4 h-4 mx-auto text-slate-600" /></td>
                <td className="p-4 text-center bg-indigo-950/5"><Check className="w-4 h-4 mx-auto text-indigo-400 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Trial Expiration Reminders</td>
                <td className="p-4 text-center text-slate-400">Standard Email</td>
                <td className="p-4 text-center font-bold text-indigo-400 bg-indigo-950/5">Priority Multi-Channel (Email, SMS)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Stealth Charge & Price Hike Alert</td>
                <td className="p-4 text-center text-slate-650"><X className="w-4 h-4 mx-auto text-slate-600" /></td>
                <td className="p-4 text-center bg-indigo-950/5"><Check className="w-4 h-4 mx-auto text-indigo-400 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">CSV Data Export</td>
                <td className="p-4 text-center font-bold text-slate-400 font-mono">CSV Included</td>
                <td className="p-4 text-center font-bold text-indigo-400 bg-indigo-950/5 font-mono">CSV & PDF Reports</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-1">Everything you need to know about Xsubscrips pricing.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/20 border border-slate-800 rounded-xl overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs text-white flex items-center justify-between gap-2"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? "rotate-180 text-indigo-400" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 relative z-10 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-550">
          <div className="flex items-center gap-2 text-white font-extrabold">
            <BrandLogo size={24} />
            Xsubscrips Pricing
          </div>
          <p className="font-medium">
            © {new Date().getFullYear()} Xsubscrips. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
