import { useState } from "react";
import { cn } from "@/lib/utils";

const DOMAIN_MAP: Record<string, string> = {
  // Entertainment / Video
  "netflix": "netflix.com",
  "hulu": "hulu.com",
  "disney+": "disneyplus.com",
  "disney plus": "disneyplus.com",
  "hbo max": "max.com",
  "max": "max.com",
  "apple tv+": "tv.apple.com",
  "apple tv plus": "tv.apple.com",
  "paramount+": "paramountplus.com",
  "paramount plus": "paramountplus.com",
  "peacock": "peacocktv.com",
  "crunchyroll": "crunchyroll.com",
  "amazon prime": "amazon.com",
  "prime video": "primevideo.com",
  "fubo": "fubo.tv",
  "youtube premium": "youtube.com",
  "youtube music": "music.youtube.com",
  "discovery+": "discoveryplus.com",

  // Music
  "spotify": "spotify.com",
  "apple music": "music.apple.com",
  "tidal": "tidal.com",
  "deezer": "deezer.com",
  "pandora": "pandora.com",
  "amazon music": "music.amazon.com",
  "soundcloud": "soundcloud.com",
  "qobuz": "qobuz.com",

  // Productivity / Office
  "notion": "notion.so",
  "notion plus": "notion.so",
  "slack": "slack.com",
  "zoom": "zoom.us",
  "microsoft 365": "microsoft.com",
  "microsoft": "microsoft.com",
  "google workspace": "workspace.google.com",
  "google one": "one.google.com",
  "dropbox": "dropbox.com",
  "dropbox plus": "dropbox.com",
  "evernote": "evernote.com",
  "asana": "asana.com",
  "trello": "trello.com",
  "jira": "atlassian.com",
  "confluence": "atlassian.com",
  "airtable": "airtable.com",
  "clickup": "clickup.com",
  "linear": "linear.app",
  "basecamp": "basecamp.com",
  "monday.com": "monday.com",
  "monday": "monday.com",
  "todoist": "todoist.com",
  "notion ai": "notion.so",
  "obsidian": "obsidian.md",
  "bear": "bear.app",
  "craft": "craft.do",
  "1password": "1password.com",
  "lastpass": "lastpass.com",
  "bitwarden": "bitwarden.com",
  "dashlane": "dashlane.com",
  "keeper": "keepersecurity.com",

  // Design
  "figma": "figma.com",
  "figma professional": "figma.com",
  "canva": "canva.com",
  "canva pro": "canva.com",
  "adobe": "adobe.com",
  "adobe creative cloud": "adobe.com",
  "adobe acrobat": "adobe.com",
  "adobe premiere": "adobe.com",
  "sketch": "sketch.com",
  "invision": "invisionapp.com",
  "framer": "framer.com",
  "miro": "miro.com",
  "loom": "loom.com",
  "zeplin": "zeplin.io",
  "abstract": "abstract.com",

  // Cloud / Dev / Tech
  "aws": "aws.amazon.com",
  "amazon web services": "aws.amazon.com",
  "github": "github.com",
  "gitlab": "gitlab.com",
  "vercel": "vercel.com",
  "netlify": "netlify.com",
  "heroku": "heroku.com",
  "digitalocean": "digitalocean.com",
  "linode": "linode.com",
  "cloudflare": "cloudflare.com",
  "datadog": "datadoghq.com",
  "sentry": "sentry.io",
  "mongodb": "mongodb.com",
  "supabase": "supabase.com",
  "firebase": "firebase.google.com",
  "planetscale": "planetscale.com",
  "railway": "railway.app",
  "render": "render.com",
  "fly.io": "fly.io",
  "docker": "docker.com",
  "jetbrains": "jetbrains.com",
  "github copilot": "github.com",
  "openai": "openai.com",
  "chatgpt": "openai.com",
  "anthropic": "anthropic.com",
  "midjourney": "midjourney.com",

  // Security / VPN
  "nordvpn": "nordvpn.com",
  "nordpass": "nordpass.com",
  "expressvpn": "expressvpn.com",
  "surfshark": "surfshark.com",
  "protonvpn": "protonvpn.com",
  "proton mail": "proton.me",
  "proton": "proton.me",

  // Fitness / Health
  "peloton": "onepeloton.com",
  "headspace": "headspace.com",
  "calm": "calm.com",
  "noom": "noom.com",
  "strava": "strava.com",
  "whoop": "whoop.com",
  "fitbit premium": "fitbit.com",
  "apple fitness+": "fitness.apple.com",
  "myfitnesspal": "myfitnesspal.com",

  // News / Education
  "new york times": "nytimes.com",
  "nyt": "nytimes.com",
  "the economist": "economist.com",
  "medium": "medium.com",
  "substack": "substack.com",
  "coursera": "coursera.org",
  "duolingo": "duolingo.com",
  "skillshare": "skillshare.com",
  "linkedin premium": "linkedin.com",
  "linkedin": "linkedin.com",
  "masterclass": "masterclass.com",
  "udemy": "udemy.com",
  "pluralsight": "pluralsight.com",
  "brilliant": "brilliant.org",
  "khan academy": "khanacademy.org",

  // Gaming
  "xbox game pass": "xbox.com",
  "xbox": "xbox.com",
  "playstation plus": "playstation.com",
  "nintendo switch online": "nintendo.com",
  "ea play": "ea.com",
  "ubisoft+": "ubisoft.com",
  "steam": "store.steampowered.com",
  "battle.net": "battle.net",

  // Finance
  "quickbooks": "quickbooks.intuit.com",
  "mint": "mint.com",
  "ynab": "ynab.com",
  "personal capital": "personalcapital.com",

  // Communication
  "discord nitro": "discord.com",
  "discord": "discord.com",
  "telegram premium": "telegram.org",
  "whatsapp": "whatsapp.com",
  "skype": "skype.com",

  // Misc / Storage
  "icloud": "icloud.com",
  "google drive": "drive.google.com",
  "onedrive": "onedrive.live.com",
  "box": "box.com",
  "backblaze": "backblaze.com",
};

function getDomain(name: string): string | null {
  const key = name.toLowerCase().trim();
  if (DOMAIN_MAP[key]) return DOMAIN_MAP[key];
  // Partial match
  for (const [mapKey, domain] of Object.entries(DOMAIN_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return domain;
  }
  return null;
}

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getFallbackStyle(name: string) {
  const hue = stringToHue(name);
  const bg = `hsl(${hue}, 65%, 45%)`;
  const label = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
  return { bg, label };
}

const SIZE_CLASSES = {
  sm: { outer: "w-8 h-8 rounded-lg", inner: "w-5 h-5", text: "text-xs" },
  md: { outer: "w-10 h-10 rounded-xl", inner: "w-7 h-7", text: "text-xs" },
  lg: { outer: "w-12 h-12 rounded-2xl", inner: "w-8 h-8", text: "text-sm" },
};

interface ServiceIconProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ServiceIcon({ name, size = "md", className }: ServiceIconProps) {
  const domain = getDomain(name);
  const sizes = SIZE_CLASSES[size];
  const fallback = getFallbackStyle(name);
  const [imgFailed, setImgFailed] = useState(false);

  if (domain && !imgFailed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900 border border-border overflow-hidden",
          sizes.outer,
          className,
        )}
      >
        <img
          src={getFaviconUrl(domain)}
          alt={name}
          className={cn("object-contain", sizes.inner)}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold shrink-0 select-none text-white",
        sizes.outer,
        sizes.text,
        className,
      )}
      style={{ backgroundColor: fallback.bg }}
      title={name}
    >
      {fallback.label || "?"}
    </div>
  );
}
