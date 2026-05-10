import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn, Mail, Eye, EyeOff } from "lucide-react";

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

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (otpSent) {
      // Verify OTP
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      });

      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "You are now logged in.",
        });
        setLocation("/dashboard");
      }
    } else {
      // Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Failed to send code",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setOtpSent(true);
        toast({
          title: "Code sent!",
          description: "Check your email for your 6-digit login code.",
        });
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
    // Note: on success the browser redirects, so we don't reset oauthLoading
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
            disabled={oauthLoading !== null}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
            {oauthLoading === "google" ? "Redirecting..." : "Continue with Google"}
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
          {!otpSent ? (
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
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  We've sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Verification Code</Label>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="text-center tracking-[1em] font-mono text-xl bg-white/50 dark:bg-black/50 border-white/20 h-14 rounded-xl focus:ring-primary focus:border-primary"
                  required
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="link"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-muted-foreground hover:text-primary"
              >
                Use a different email
              </Button>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-medium shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading 
              ? (otpSent ? "Verifying..." : "Sending code...") 
              : (otpSent ? "Verify & Login" : "Send Login Code")}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Secure, passwordless login with X Subscrips
        </p>
      </div>
    </div>
  );
}
