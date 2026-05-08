import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Bell, CreditCard, Shield, TrendingDown, CheckCircle2, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: CreditCard,
    title: "Track Everything",
    description: "All your subscriptions in one place. Never lose track of what you're paying for and when.",
  },
  {
    icon: Bell,
    title: "Trial Reminders",
    description: "Know exactly when free trials end. Cancel before you get charged, every time.",
  },
  {
    icon: BarChart2,
    title: "Spend Analytics",
    description: "Visual breakdowns of your subscription spending by category and over time.",
  },
  {
    icon: TrendingDown,
    title: "Find Savings",
    description: "Spot unused or redundant subscriptions and cut costs with confidence.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Up to 10 subscriptions", "Trial tracking", "Basic analytics", "Email reminders"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4",
    period: "per month",
    description: "For power users",
    features: ["Unlimited subscriptions", "Advanced analytics", "Priority reminders", "CSV export", "Dark mode"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
];

const stats = [
  { value: "$892", label: "Average yearly savings" },
  { value: "12.4", label: "Average subscriptions per user" },
  { value: "3 mins", label: "Time to set up" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <BarChart2 className="w-5 h-5" />
            SubsTrack
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6 text-primary border-primary/20 bg-primary/5">
            Free to use — no credit card required
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Manage subscriptions.<br />
            <span className="text-primary">Save money.</span> Stress less.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The average person wastes $348 a year on forgotten subscriptions. SubsTrack shows you exactly what you're paying for — and when to cancel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-base px-8">
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* App Preview Banner */}
      <section className="bg-primary/5 border-y border-primary/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">Built for clarity</p>
          <h2 className="text-2xl font-semibold text-foreground">All your recurring costs. One clean view.</h2>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to stay in control</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Simple tools that give you clarity over your subscription spending.
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
                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Set up in minutes</h2>
            <p className="text-muted-foreground text-lg">No bank connections. No data sharing. Just you and your subscriptions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { icon: Zap, step: "1", title: "Add your subscriptions", desc: "Enter each subscription manually. Takes about 30 seconds per service." },
              { icon: Clock, step: "2", title: "Track trials & renewals", desc: "See exactly when trials expire and when renewals are coming up." },
              { icon: TrendingDown, step: "3", title: "Spot what to cut", desc: "Analytics surface what you're actually spending and where to save." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Simple pricing</h2>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <Badge className="mb-4 bg-primary text-primary-foreground">Most Popular</Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Stop paying for things you don't use.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of people who've taken back control of their subscription spending.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                Start Tracking Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <BarChart2 className="w-4 h-4" />
            SubsTrack
          </div>
          <p className="text-sm text-muted-foreground">
            Built to help you spend smarter.
          </p>
        </div>
      </footer>
    </div>
  );
}
