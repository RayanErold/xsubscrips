import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, Zap, Sparkles, HelpCircle, ChevronDown, Check, X } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Background ambient light mesh */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/60 to-purple-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <BrandLogo size={32} />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Xsubscrips
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <a href="/#product" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer hidden sm:inline-block">
              Product
            </a>
            <a href="/#how-it-works" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer hidden sm:inline-block">
              How it Works
            </a>
            <Link href="/pricing">
              <span className="text-xs font-bold text-indigo-600 transition-colors cursor-pointer hidden sm:inline-block">
                Pricing
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-semibold text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/login?mode=signup">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 font-bold px-4 rounded-xl text-xs">
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
          <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-4">
            💎 Simple & Transparent
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fair Pricing. No Hidden Surprises.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-3 font-normal">
            Start for free, or upgrade to Pro to unlock automated AI receipt parsing and trial conversion defense.
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-8 inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!isYearly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isYearly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Billed Yearly
              <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Save 37%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards Grid (2 Plans Only - Starter & Pro) */}
      <section className="max-w-4xl mx-auto px-6 pb-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const price = plan.monthly === 0 ? "$0" : `$${isYearly ? plan.yearly : plan.monthly}`;
            const periodLabel = plan.monthly === 0 ? "forever" : "per month";
            const yearlyNote = isYearly && plan.monthly > 0 ? `$${plan.yearly * 12} billed annually` : null;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col justify-between transition-all bg-white ${plan.highlighted
                  ? "border-indigo-600 shadow-xl relative scale-[1.02] z-10"
                  : "border-slate-200 shadow-sm hover:border-slate-300"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white border-none px-3 py-1 text-[10px] font-bold rounded-full shadow-sm">
                    👑 Recommended Choice
                  </Badge>
                )}
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-extrabold text-slate-900">{plan.name}</h2>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">{price}</span>
                      <span className="text-slate-500 ml-1.5 text-xs">/{periodLabel}</span>
                    </div>
                    {yearlyNote && (
                      <p className="text-xs text-indigo-600 font-bold mt-1">{yearlyNote}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{plan.description}</p>
                  </div>
                  
                  <hr className="border-slate-100 mb-6" />

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/login?mode=signup">
                  <Button
                    className={`w-full py-6 text-xs font-bold rounded-xl transition-all ${
                      plan.highlighted 
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-800 bg-white"
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
      <section className="max-w-4xl mx-auto px-6 py-12 relative z-10 border-t border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Compare Plan Capabilities</h2>
          <p className="text-xs text-slate-500 mt-1">Detailed feature comparison between Free Starter & Pro Control.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-900">Feature</th>
                <th className="p-4 font-bold text-slate-700 text-center w-36">Free Starter</th>
                <th className="p-4 font-bold text-indigo-600 text-center w-36 bg-indigo-50/50">Pro Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-semibold text-slate-800">Tracked Subscriptions</td>
                <td className="p-4 text-center font-mono text-slate-600">Up to 10</td>
                <td className="p-4 text-center font-mono font-bold text-indigo-600 bg-indigo-50/20">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">Automatic Bank Syncing (Plaid)</td>
                <td className="p-4 text-center text-slate-400"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-indigo-50/20"><Check className="w-4 h-4 mx-auto text-indigo-600 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">AI Smart Optimization & Duplicate Alerts</td>
                <td className="p-4 text-center text-slate-400"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-indigo-50/20"><Check className="w-4 h-4 mx-auto text-indigo-600 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">AI Invoice Receipt Parsing (Gemini)</td>
                <td className="p-4 text-center text-slate-400"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-indigo-50/20"><Check className="w-4 h-4 mx-auto text-indigo-600 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">Trial Expiration Reminders</td>
                <td className="p-4 text-center text-slate-600">Standard Email</td>
                <td className="p-4 text-center font-bold text-indigo-600 bg-indigo-50/20">Priority Multi-Channel (Email, SMS)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">Stealth Charge & Price Hike Alert</td>
                <td className="p-4 text-center text-slate-400"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-indigo-50/20"><Check className="w-4 h-4 mx-auto text-indigo-600 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">CSV Data Export</td>
                <td className="p-4 text-center font-bold text-slate-700 font-mono">CSV Included</td>
                <td className="p-4 text-center font-bold text-indigo-600 bg-indigo-50/20 font-mono">CSV & PDF Reports</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Everything you need to know about Xsubscrips pricing.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-2"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-indigo-600" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 relative z-10 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold">
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
