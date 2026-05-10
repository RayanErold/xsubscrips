import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "sonner";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Subscriptions from "@/pages/subscriptions";
import Trials from "@/pages/trials";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000, // 1 minute
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// Configure persistence
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
});

import Login from "@/pages/login";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "wouter";

import { LoadingScreen } from "@/components/loading-screen";

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!session) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
};

function Router() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/subscriptions"><ProtectedRoute component={Subscriptions} /></Route>
      <Route path="/trials"><ProtectedRoute component={Trials} /></Route>
      <Route path="/analytics"><ProtectedRoute component={Analytics} /></Route>
      <Route path="/settings"><ProtectedRoute component={Settings} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <Sonner richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
