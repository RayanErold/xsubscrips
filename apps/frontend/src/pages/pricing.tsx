import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { BrandLogo } from "@/pages/landing";
import { Navbar } from "@/components/navbar";

type Feature = { text: string; soon?: boolean };

const pricingPlans: {
  name: string; monthly: number; yearly: number; description: string;
  features: Feature[]; cta: string; highlighted: boolean;
}[] = [
  {
    name: "Free Starter",
    monthly: 0,
    yearly: 0,
    description: "Everything you need to start tracking and stop the obvious leaks.",
    features: [
      { text: "Track up to 10 subscriptions" },
      { text: "Email renewal reminders" },
      { text: "In-app trial & price alerts" },
      { text: "Manual receipt logging" },
      { text: "Spend dashboard & breakdowns" },
      { text: "CSV data export" },
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: 8,
    yearly: 5,
    description: "Automated defense for individuals who never want a surprise charge.",
    features: [
      { text: "Everything in Free" },
      { text: "Unlimited subscription tracking" },
      { text: "AI receipt parsing (Gemini)" },
      { text: "Advanced spend analytics" },
      { text: "Priority email support" },
      { text: "AI duplicate & optimization alerts", soon: true },
      { text: "Price-hike & multi-channel alerts", soon: true },
      { text: "Automatic bank sync (Plaid)", soon: true },
    ],
    cta: "Start 14-day free trial",
    highlighted: true,
  },
  {
    name: "Business",
    monthly: 20,
    yearly: 13,
    description: "Total SaaS clarity for teams that want to cut spend together.",
    features: [
      { text: "Everything in Pro" },
      { text: "Shared team workspaces", soon: true },
      { text: "Up to 10 team seats", soon: true },
      { text: "Role-based permissions", soon: true },
      { text: "Shadow-IT & duplicate app audit", soon: true },
      { text: "PDF savings reports", soon: true },
      { text: "Dedicated account manager", soon: true },
    ],
    cta: "Explore Business",
    highlighted: false,
  },
];

type Cell = boolean | string;
const matrix: { feature: string; free: Cell; pro: Cell; business: Cell; soon?: boolean }[] = [
  { feature: "Tracked subscriptions", free: "Up to 10", pro: "Unlimited", business: "Unlimited" },
  { feature: "Email renewal reminders", free: true, pro: true, business: true },
  { feature: "In-app trial & price alerts", free: true, pro: true, business: true },
  { feature: "Spend analytics & breakdowns", free: "Basic", pro: "Advanced", business: "Advanced" },
  { feature: "CSV data export", free: true, pro: true, business: true },
  { feature: "AI receipt parsing (Gemini)", free: false, pro: true, business: true },
  { feature: "Priority support", free: false, pro: true, business: true },
  { feature: "AI duplicate & optimization alerts", free: false, pro: true, business: true, soon: true },
  { feature: "Price-hike & multi-channel (SMS/push) alerts", free: false, pro: true, business: true, soon: true },
  { feature: "Automatic bank sync (Plaid)", free: false, pro: true, business: true, soon: true },
  { feature: "Team workspaces & seats", free: false, pro: false, business: true, soon: true },
  { feature: "Role-based permissions", free: false, pro: false, business: true, soon: true },
  { feature: "PDF savings reports", free: false, pro: false, business: true, soon: true },
];

const faqs = [
  { q: "Do I need to connect my bank account or share passwords?", a: "No. Xsubscrips works from receipts, invoices, and manual entries — no banking credentials required. (Optional automatic bank sync via Plaid is coming soon and will always be opt-in.)" },
  { q: "Which features are available today?", a: "Manual subscription tracking, AI receipt parsing, email renewal reminders, in-app trial & price alerts, spend analytics, and CSV export are live now. Anything marked “Coming soon” — bank sync, SMS/push alerts, AI optimization, and team features — is in active development and will roll out to your plan automatically." },
  { q: "What happens when my free trial ends?", a: "You'll be reminded before any trial or renewal converts into a charge, so you're never caught off guard by a forgotten recurring cost." },
  { q: "Can I cancel or change plans anytime?", a: "Yes — upgrade, downgrade, or cancel anytime from your account settings. No hidden cancellation hoops." },
];

function SoonChip() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-1.5 py-0.5">
      <Clock className="w-2.5 h-2.5" /> Soon
    </span>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  useEffect(() => {
    document.title = "Xsubscrips — Simple, transparent pricing";
  }, []);

  const renderCell = (val: Cell, soon?: boolean, dark?: boolean) => {
    if (typeof val === "string") {
      return <span className={`font-mono font-bold ${dark ? "text-white" : "text-slate-900"}`}>{val}</span>;
    }
    if (val) {
      return (
        <span className="inline-flex items-center justify-center gap-1.5">
          <Check className={`w-4 h-4 ${dark ? "text-white" : "text-slate-900"}`} />
          {soon && <SoonChip />}
        </span>
      );
    }
    return <X className="w-4 h-4 mx-auto text-slate-300" />;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden antialiased">
      {/* Nav */}
      <Navbar />

      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full mb-4">Simple & transparent</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-[-0.03em] leading-[0.98]">Fair pricing. No surprises.</h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto mt-4 leading-relaxed">Start free, or upgrade for automated tracking. You only ever pay for what actually ships — anything marked <span className="font-semibold text-slate-700">“Coming soon”</span> unlocks on your plan the moment it's live.</p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full p-1.5">
            <button onClick={() => setIsYearly(false)} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!isYearly ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Monthly</button>
            <button onClick={() => setIsYearly(true)} className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isYearly ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
              Yearly
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isYearly ? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}>Save 37%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plan cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {pricingPlans.map((plan) => {
            const price = plan.monthly === 0 ? "$0" : `$${isYearly ? plan.yearly : plan.monthly}`;
            const periodLabel = plan.monthly === 0 ? "forever" : "/mo";
            const yearlyNote = isYearly && plan.monthly > 0 ? `$${plan.yearly * 12} billed annually` : null;
            const dark = plan.highlighted;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className={`rounded-3xl border p-8 flex flex-col relative ${dark
                  ? "bg-slate-950 border-slate-950 text-white shadow-2xl md:-translate-y-2 md:scale-[1.02] z-10"
                  : "bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"}`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-slate-900 border border-slate-200 px-3 py-1 text-[10px] font-bold rounded-full shadow-sm">Recommended</Badge>
                )}
                <div className="mb-6">
                  <h2 className={`text-lg font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>{plan.name}</h2>
                  <div className="mt-3 flex items-baseline">
                    <span className={`text-5xl font-black font-mono tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>{price}</span>
                    <span className={`ml-1.5 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{periodLabel}</span>
                  </div>
                  <p className={`text-xs font-bold mt-1 h-4 ${dark ? "text-slate-300" : "text-slate-500"}`}>{yearlyNote || ""}</p>
                  <p className={`text-sm mt-3 leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{plan.description}</p>
                </div>

                <Link href="/login?mode=signup" className="mb-7">
                  <Button className={`w-full h-11 text-sm font-bold rounded-full transition-all hover:scale-[1.02] ${dark
                    ? "bg-white hover:bg-slate-100 text-slate-900 shadow-lg"
                    : "bg-slate-900 hover:bg-black text-white shadow-sm"}`}>
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className={`flex items-start gap-2.5 text-sm ${dark ? "text-slate-200" : "text-slate-700"}`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${dark ? "text-white" : "text-slate-900"}`} />
                      <span className="flex items-center gap-1.5 flex-wrap">
                        {f.text}
                        {f.soon && <SoonChip />}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> <SoonChip /> features are in active development and unlock automatically when they ship — you're never charged for what isn't live.
        </p>
      </section>

      {/* Comparison matrix */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Compare every plan</h2>
          <p className="text-sm text-slate-500 mt-2">Exactly what's included today — and what's on the way.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm text-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-900">Feature</th>
                <th className="p-4 font-bold text-slate-700 text-center w-32">Free</th>
                <th className="p-4 font-bold text-white text-center w-32 bg-slate-950">Pro</th>
                <th className="p-4 font-bold text-slate-700 text-center w-32">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row) => (
                <tr key={row.feature}>
                  <td className="p-4 font-semibold text-slate-800">
                    <span className="flex items-center gap-2">{row.feature}{row.soon && <SoonChip />}</span>
                  </td>
                  <td className="p-4 text-center">{renderCell(row.free)}</td>
                  <td className="p-4 text-center bg-slate-950/[0.03]">{renderCell(row.pro, row.soon)}</td>
                  <td className="p-4 text-center">{renderCell(row.business, row.soon)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pricing questions</h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-2xl bg-white px-5 shadow-sm">
              <AccordionTrigger className="text-left text-[15px] font-bold text-slate-900 hover:no-underline py-5">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-5">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="relative rounded-[32px] bg-slate-950 px-6 py-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
            style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">Start free. Upgrade when it pays off.</h2>
            <p className="text-slate-300 text-sm sm:text-base mb-7">No credit card required. Free forever plan, no bank login ever.</p>
            <Link href="/login?mode=signup">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 gap-2 px-8 h-12 rounded-full font-bold shadow-xl transition-all hover:scale-[1.03]">Get started for free <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold">
            <BrandLogo size={22} />
            Xsubscrips
          </div>
          <p className="font-medium">© {new Date().getFullYear()} Xsubscrips. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
