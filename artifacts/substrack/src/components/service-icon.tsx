import { cn } from "@/lib/utils";

const SERVICE_MAP: Record<string, { bg: string; text: string; label: string }> = {
  // Entertainment
  netflix: { bg: "#E50914", text: "#ffffff", label: "N" },
  "youtube premium": { bg: "#FF0000", text: "#ffffff", label: "YT" },
  "youtube music": { bg: "#FF0000", text: "#ffffff", label: "YT" },
  hulu: { bg: "#1CE783", text: "#000000", label: "h" },
  "disney+": { bg: "#113CCF", text: "#ffffff", label: "D+" },
  "disney plus": { bg: "#113CCF", text: "#ffffff", label: "D+" },
  "apple tv+": { bg: "#555555", text: "#ffffff", label: "" },
  "apple tv plus": { bg: "#555555", text: "#ffffff", label: "" },
  "hbo max": { bg: "#5822B4", text: "#ffffff", label: "HBO" },
  "max": { bg: "#0033FF", text: "#ffffff", label: "Max" },
  "paramount+": { bg: "#0064FF", text: "#ffffff", label: "P+" },
  peacock: { bg: "#000000", text: "#ffffff", label: "P" },
  crunchyroll: { bg: "#F47521", text: "#ffffff", label: "CR" },
  "amazon prime": { bg: "#00A8E0", text: "#ffffff", label: "a" },
  "prime video": { bg: "#00A8E0", text: "#ffffff", label: "a" },
  fubo: { bg: "#E4131B", text: "#ffffff", label: "fubo" },

  // Music
  spotify: { bg: "#1DB954", text: "#000000", label: "S" },
  "apple music": { bg: "#FC3C44", text: "#ffffff", label: "" },
  tidal: { bg: "#000000", text: "#ffffff", label: "T" },
  deezer: { bg: "#A238FF", text: "#ffffff", label: "D" },
  pandora: { bg: "#3668FF", text: "#ffffff", label: "P" },
  "amazon music": { bg: "#00A8E0", text: "#ffffff", label: "a♪" },

  // Productivity
  notion: { bg: "#000000", text: "#ffffff", label: "N" },
  "notion plus": { bg: "#000000", text: "#ffffff", label: "N" },
  slack: { bg: "#4A154B", text: "#ffffff", label: "S" },
  zoom: { bg: "#2D8CFF", text: "#ffffff", label: "Z" },
  "microsoft 365": { bg: "#D83B01", text: "#ffffff", label: "M" },
  microsoft: { bg: "#00A4EF", text: "#ffffff", label: "M" },
  "google workspace": { bg: "#4285F4", text: "#ffffff", label: "G" },
  "google one": { bg: "#4285F4", text: "#ffffff", label: "G" },
  dropbox: { bg: "#0061FF", text: "#ffffff", label: "Db" },
  "dropbox plus": { bg: "#0061FF", text: "#ffffff", label: "Db" },
  evernote: { bg: "#00A82D", text: "#ffffff", label: "E" },
  asana: { bg: "#F06A6A", text: "#ffffff", label: "A" },
  trello: { bg: "#0052CC", text: "#ffffff", label: "T" },
  jira: { bg: "#0052CC", text: "#ffffff", label: "J" },
  confluence: { bg: "#0052CC", text: "#ffffff", label: "C" },
  airtable: { bg: "#18BFFF", text: "#ffffff", label: "At" },
  clickup: { bg: "#7B68EE", text: "#ffffff", label: "Cu" },
  "linear": { bg: "#5E6AD2", text: "#ffffff", label: "L" },
  basecamp: { bg: "#1D2D35", text: "#ffffff", label: "B" },

  // Design
  figma: { bg: "#F24E1E", text: "#ffffff", label: "F" },
  "figma professional": { bg: "#F24E1E", text: "#ffffff", label: "F" },
  canva: { bg: "#00C4CC", text: "#ffffff", label: "C" },
  "canva pro": { bg: "#00C4CC", text: "#ffffff", label: "C" },
  adobe: { bg: "#FF0000", text: "#ffffff", label: "A" },
  "adobe creative cloud": { bg: "#FF0000", text: "#ffffff", label: "Ai" },
  sketch: { bg: "#F7B500", text: "#000000", label: "S" },
  "invision": { bg: "#FF3366", text: "#ffffff", label: "Inv" },
  framer: { bg: "#0055FF", text: "#ffffff", label: "Fr" },
  miro: { bg: "#FFD02F", text: "#000000", label: "Mi" },

  // Cloud / Dev
  aws: { bg: "#FF9900", text: "#000000", label: "AWS" },
  "amazon web services": { bg: "#FF9900", text: "#000000", label: "AWS" },
  github: { bg: "#24292E", text: "#ffffff", label: "GH" },
  gitlab: { bg: "#FC6D26", text: "#ffffff", label: "GL" },
  vercel: { bg: "#000000", text: "#ffffff", label: "▲" },
  netlify: { bg: "#00C7B7", text: "#ffffff", label: "N" },
  heroku: { bg: "#6762A6", text: "#ffffff", label: "H" },
  digitalocean: { bg: "#0080FF", text: "#ffffff", label: "DO" },
  linode: { bg: "#02B159", text: "#ffffff", label: "L" },
  cloudflare: { bg: "#F6821F", text: "#ffffff", label: "CF" },
  datadog: { bg: "#632CA6", text: "#ffffff", label: "DD" },
  sentry: { bg: "#362D59", text: "#ffffff", label: "S" },

  // Security
  "1password": { bg: "#1A8CFF", text: "#ffffff", label: "1P" },
  lastpass: { bg: "#D32D27", text: "#ffffff", label: "LP" },
  bitwarden: { bg: "#175DDC", text: "#ffffff", label: "BW" },
  nordvpn: { bg: "#4687FF", text: "#ffffff", label: "N" },
  nordpass: { bg: "#4687FF", text: "#ffffff", label: "NP" },
  expressvpn: { bg: "#DA3940", text: "#ffffff", label: "E" },

  // Fitness / Wellness
  peloton: { bg: "#E52114", text: "#ffffff", label: "P" },
  headspace: { bg: "#F47D31", text: "#ffffff", label: "Hs" },
  calm: { bg: "#4E7BEE", text: "#ffffff", label: "C" },
  noom: { bg: "#6AA84F", text: "#ffffff", label: "No" },
  "apple fitness+": { bg: "#FC3C44", text: "#ffffff", label: "" },
  strava: { bg: "#FC4C02", text: "#ffffff", label: "S" },
  whoop: { bg: "#000000", text: "#ffffff", label: "W" },

  // News / Education
  "new york times": { bg: "#000000", text: "#ffffff", label: "NYT" },
  nyt: { bg: "#000000", text: "#ffffff", label: "NYT" },
  "the economist": { bg: "#E3120B", text: "#ffffff", label: "Ec" },
  medium: { bg: "#000000", text: "#ffffff", label: "M" },
  substack: { bg: "#FF6719", text: "#ffffff", label: "SS" },
  coursera: { bg: "#0056D2", text: "#ffffff", label: "Co" },
  duolingo: { bg: "#58CC02", text: "#ffffff", label: "D" },
  skillshare: { bg: "#FF9900", text: "#000000", label: "Sk" },
  "linkedin premium": { bg: "#0A66C2", text: "#ffffff", label: "in" },
  masterclass: { bg: "#000000", text: "#ffffff", label: "MC" },

  // Gaming
  "xbox game pass": { bg: "#107C10", text: "#ffffff", label: "X" },
  "xbox": { bg: "#107C10", text: "#ffffff", label: "X" },
  "playstation plus": { bg: "#003087", text: "#ffffff", label: "PS" },
  "nintendo switch online": { bg: "#E60012", text: "#ffffff", label: "N" },
  "ea play": { bg: "#F4A81D", text: "#000000", label: "EA" },
  "ubisoft+": { bg: "#0070D1", text: "#ffffff", label: "U+" },
};

function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getServiceStyle(name: string) {
  const key = name.toLowerCase().trim();
  if (SERVICE_MAP[key]) return SERVICE_MAP[key];

  // Partial match for common brands
  for (const [mapKey, val] of Object.entries(SERVICE_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return val;
  }

  // Auto-generate from name
  const hue = stringToHue(name);
  const saturation = 65 + (hue % 20);
  const lightness = 40 + (hue % 15);
  const bg = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const label = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return { bg, text: "#ffffff", label };
}

interface ServiceIconProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs rounded-lg",
  md: "w-10 h-10 text-sm rounded-xl",
  lg: "w-12 h-12 text-base rounded-2xl",
};

export function ServiceIcon({ name, size = "md", className }: ServiceIconProps) {
  const style = getServiceStyle(name);
  const label =
    style.label ||
    name
      .split(/\s+/)
      .slice(0, 1)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") ||
    "?";

  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold shrink-0 select-none",
        SIZE_CLASSES[size],
        className,
      )}
      style={{ backgroundColor: style.bg, color: style.text }}
      title={name}
    >
      <span className="leading-none tracking-tight">{label}</span>
    </div>
  );
}
