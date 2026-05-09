import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn, Mail, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting email auth...", { email, isSignUp });
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
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

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "OAuth login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/50 to-background relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md backdrop-blur-xl bg-background/60 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Sign up to start tracking subscriptions" : "Sign in to manage your subscriptions"}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <Button
            variant="outline"
            className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all text-foreground h-12"
            onClick={() => handleOAuthLogin("google")}
          >
            <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all text-foreground h-12"
            onClick={() => handleOAuthLogin("apple")}
          >
            <FaApple className="w-5 h-5 mr-3" />
            Continue with Apple
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 backdrop-blur-md px-4 text-muted-foreground rounded-full">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          {isSignUp && (
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white/50 dark:bg-black/50 border-white/20 h-12 rounded-xl focus:ring-primary focus:border-primary"
                  required={isSignUp}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-white/50 dark:bg-black/50 border-white/20 h-12 rounded-xl focus:ring-primary focus:border-primary"
                  required={isSignUp}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-black/50 border-white/20 h-12 rounded-xl focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <a href="#" className="text-sm text-primary hover:underline font-medium">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 dark:bg-black/50 border-white/20 h-12 rounded-xl focus:ring-primary focus:border-primary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-medium shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading 
              ? (isSignUp ? "Creating account..." : "Signing in...") 
              : (isSignUp ? "Create Account" : "Sign in")}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
