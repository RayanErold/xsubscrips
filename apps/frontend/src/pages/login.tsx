import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/pages/landing";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const modeParam = params.get("mode");
    if (emailParam) setEmail(emailParam);
    if (modeParam === "signup") setIsSignUp(true);
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            ab_variant: localStorage.getItem("ab-test-hero_v2") || "A",
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (data.session) {
          toast({
            title: "Welcome!",
            description: "Your account has been created.",
          });
          setLocation("/dashboard");
        } else {
          toast({
            title: "Check your email",
            description: "We sent you a confirmation link to complete your sign up.",
          });
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        setLocation("/dashboard");
      }
    }
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: "google") => {
    setOauthLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setOauthLoading(null);
      toast({
        title: "OAuth login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background ambient light mesh */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/60 to-purple-100/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-100/40 to-indigo-100/50 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Nav */}
      <header className="max-w-md mx-auto w-full pt-4 pb-2 flex items-center justify-between z-10">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <BrandLogo size={28} />
            <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Xsubscrips
            </span>
          </div>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900 gap-1.5 rounded-xl">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Button>
        </Link>
      </header>

      {/* Main White Auth Card */}
      <main className="w-full max-w-md mx-auto my-auto bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20 text-white">
            <BrandLogo size={32} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isSignUp ? "Start managing & auditing subscriptions free" : "Sign in to access your subscription control vault"}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div className="flex gap-3">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="firstName" className="text-xs font-bold text-slate-700">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Alex"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-slate-50 border-slate-300 text-slate-900 h-11 rounded-xl text-xs focus-visible:ring-indigo-600 placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="lastName" className="text-xs font-bold text-slate-700">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Morgan"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-slate-50 border-slate-300 text-slate-900 h-11 rounded-xl text-xs focus-visible:ring-indigo-600 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-300 text-slate-900 h-11 rounded-xl text-xs focus-visible:ring-indigo-600 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
              {!isSignUp && (
                <button type="button" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-300 text-slate-900 h-11 rounded-xl text-xs focus-visible:ring-indigo-600 placeholder:text-slate-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-[0.99] mt-2"
            disabled={loading}
          >
            {loading 
              ? (isSignUp ? "Creating account..." : "Signing in...") 
              : (isSignUp ? "Create Free Account" : "Sign In")}
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            disabled={oauthLoading === "google"}
            className="w-full h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
          >
            <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-500 font-medium">
          {isSignUp ? "Already have an account?" : "New to Xsubscrips?"}{" "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-bold hover:underline"
          >
            {isSignUp ? "Sign In" : "Create account"}
          </button>
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-[11px] text-slate-400 z-10">
        © {new Date().getFullYear()} Xsubscrips. Bank-Grade RLS Data Encryption.
      </footer>
    </div>
  );
}
