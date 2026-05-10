import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { supabase } from "./lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:8081");
setBaseUrl(API_URL);

let cachedSession: any = null;

setAuthTokenGetter(async () => {
  // If we have a fresh session in memory, return it
  if (cachedSession?.access_token && (cachedSession.expires_at * 1000) > Date.now()) {
    return cachedSession.access_token;
  }

  const { data: { session } } = await supabase.auth.getSession();
  cachedSession = session;
  return session?.access_token || null;
});

// Update cache on auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session;
});

createRoot(document.getElementById("root")!).render(<App />);
