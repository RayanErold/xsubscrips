import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function BrandLogo({ size = 30 }: { size?: number }) {
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

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isPricing = location === "/pricing";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <BrandLogo size={30} />
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Xsubscrips</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <a href={isPricing ? "/#features" : "#features"} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
          <a href={isPricing ? "/#demo" : "#demo"} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Demo</a>
          <a href={isPricing ? "/#faq" : "#faq"} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
          <Link href="/pricing">
            <span className={`px-3 py-2 text-sm cursor-pointer transition-colors ${isPricing ? "font-semibold text-slate-900" : "font-medium text-slate-600 hover:text-slate-900"}`}>
              Pricing
            </span>
          </Link>
          <div className="w-px h-5 bg-slate-200 mx-1.5" />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-medium">Sign in</Button>
          </Link>
          <Link href="/login?mode=signup">
            <Button size="sm" className="bg-slate-900 hover:bg-black text-white shadow-sm font-semibold px-4 rounded-full gap-1.5">
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link href="/login?mode=signup">
            <Button size="sm" className="bg-slate-900 hover:bg-black text-white shadow-sm font-semibold px-3 rounded-full text-xs gap-1">
              Get started <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
          <button
            onClick={toggleMenu}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Pop-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop shadow overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black z-40 sm:hidden"
              onClick={closeMenu}
            />

            {/* Menu container */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute left-0 right-0 top-16 bg-white border-b border-slate-200 shadow-xl z-50 overflow-hidden sm:hidden"
            >
              <div className="px-6 py-5 space-y-4 flex flex-col">
                <a
                  href={isPricing ? "/#features" : "#features"}
                  onClick={closeMenu}
                  className="text-base font-semibold text-slate-700 hover:text-slate-900 py-1 transition-colors border-b border-slate-50"
                >
                  Features
                </a>
                <a
                  href={isPricing ? "/#demo" : "#demo"}
                  onClick={closeMenu}
                  className="text-base font-semibold text-slate-700 hover:text-slate-900 py-1 transition-colors border-b border-slate-50"
                >
                  Demo
                </a>
                <a
                  href={isPricing ? "/#faq" : "#faq"}
                  onClick={closeMenu}
                  className="text-base font-semibold text-slate-700 hover:text-slate-900 py-1 transition-colors border-b border-slate-50"
                >
                  FAQ
                </a>
                <Link href="/pricing" onClick={closeMenu}>
                  <span className={`text-base py-1 cursor-pointer transition-colors block border-b border-slate-50 ${isPricing ? "font-bold text-slate-950" : "font-semibold text-slate-700 hover:text-slate-900"}`}>
                    Pricing
                  </span>
                </Link>

                <div className="pt-2 flex flex-col gap-2.5">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full h-11 rounded-full text-slate-700 border-slate-300 font-semibold">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/login?mode=signup" onClick={closeMenu}>
                    <Button className="w-full h-11 rounded-full bg-slate-900 hover:bg-black text-white font-semibold">
                      Get started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
