import {
  AlarmClockCheck,
  Ban,
  BedDouble,
  BookOpen,
  Box,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Cog,
  CreditCard,
  Database,
  FileAudio,
  FileSearch,
  FileText,
  Filter,
  FlaskConical,
  Flame,
  Gauge,
  GitFork,
  GitMerge,
  Globe,
  HeartPulse,
  Layers,
  MapPin,
  Mic,
  Monitor,
  Network,
  PenLine,
  Pill,
  Radio,
  Receipt,
  RefreshCw,
  Route,
  ScanText,
  ShieldCheck,
  ShoppingBasket,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Store,
  Target,
  TerminalSquare,
  UserCheck,
  Users,
  Wifi,
  WifiOff,
  Wrench,
  Zap,
} from "lucide-react";

/**
 * Resolves a diagram stage to a meaningful icon — by stage id first, then by
 * label keywords — so every architecture pipeline reads visually, the way the
 * approved reference does. Falls back to a neutral box.
 */

const BY_ID: Record<string, React.ElementType> = {
  // ShieldDNS funnel
  request: Globe,
  whitelist: ShieldCheck,
  cache: Flame,
  blacklist: Ban,
  bloom: Filter,
  trie: Network,
  verdict: CheckCircle2,
  // MeetingMind stream
  media: FileAudio,
  transcribe: Mic,
  diarise: Users,
  summarise: Sparkles,
  index: Database,
  knowledge: BookOpen,
  approve: UserCheck,
  // CommerceOS lattice
  engine: Cog,
  t1: Shirt,
  t2: ShoppingBasket,
  t3: Pill,
  t4: Store,
  // No-Code ERP projection
  command: TerminalSquare,
  validate: ShieldCheck,
  event: Zap,
  stream: Layers,
  projection: RefreshCw,
  state: Database,
  // Construction ERP clusters
  "a-write": PenLine,
  "a-offline": WifiOff,
  reconnect: Wifi,
  sync: RefreshCw,
  reconcile: GitMerge,
  "b-write": PenLine,
  // Airsume / OCR review
  document: FileText,
  preprocess: SlidersHorizontal,
  ocr: ScanText,
  extract: FileSearch,
  confidence: Gauge,
  match: Target,
  score: Gauge,
  review: UserCheck,
  // Medical hub
  patient: HeartPulse,
  lab: FlaskConical,
  pharmacy: Pill,
  ward: BedDouble,
  billing: Receipt,
  staff: Users,
  // TrafficVision spatial
  city: Building2,
  intersection: GitFork,
  road: Route,
  lane: Target,
  // CarWash journey
  book: CalendarCheck,
  location: MapPin,
  service: Wrench,
  pay: CreditCard,
  live: Radio,
  done: CheckCircle2,
};

const BY_KEYWORD: [RegExp, React.ElementType][] = [
  [/request|dns|http|url/i, Globe],
  [/whitelist|allow|shield|secure|auth/i, ShieldCheck],
  [/cache|hot/i, Flame],
  [/blacklist|block|ban/i, Ban],
  [/bloom|filter/i, Filter],
  [/trie|graph|network/i, Network],
  [/audio|video|media/i, FileAudio],
  [/transcri|speech|voice|mic/i, Mic],
  [/speaker|diaris|user|people|team/i, Users],
  [/summar|ai|llm|ground/i, Sparkles],
  [/index|database|storage|state|record/i, Database],
  [/knowledge|hub|book/i, BookOpen],
  [/approve|human|review/i, UserCheck],
  [/tenant|store|shop/i, Store],
  [/command|terminal/i, TerminalSquare],
  [/valid/i, ShieldCheck],
  [/event|zap|trigger/i, Zap],
  [/stream|layer|queue/i, Layers],
  [/project|replay|sync|reconnect/i, RefreshCw],
  [/write|edit|local/i, PenLine],
  [/offline|disconnect/i, WifiOff],
  [/online|connect/i, Wifi],
  [/merge|conflict|reconcil/i, GitMerge],
  [/document|resume|file|pdf/i, FileText],
  [/preprocess|normali/i, SlidersHorizontal],
  [/ocr|scan|recogni/i, ScanText],
  [/extract|parse|search/i, FileSearch],
  [/confidence|score|gauge|metric/i, Gauge],
  [/patient|emr|clinical|health/i, HeartPulse],
  [/lab/i, FlaskConical],
  [/pharma|drug|medic/i, Pill],
  [/ward|bed|nursing/i, BedDouble],
  [/bill|invoice|payment|pay|checkout/i, CreditCard],
  [/receipt|finance/i, Receipt],
  [/city|building/i, Building2],
  [/intersect|fork/i, GitFork],
  [/road|route/i, Route],
  [/book|schedul|calendar|slot/i, CalendarCheck],
  [/location|map|address|geo/i, MapPin],
  [/service|wash|wrench/i, Wrench],
  [/live|track|realtime|status/i, Radio],
  [/done|complete|finish|check/i, CheckCircle2],
  [/device|desktop|monitor/i, Monitor],
  [/timer|sla|escalat/i, AlarmClockCheck],
];

export function stageIcon(id: string, label: string): React.ElementType {
  if (BY_ID[id]) return BY_ID[id];
  for (const [re, icon] of BY_KEYWORD) {
    if (re.test(id) || re.test(label)) return icon;
  }
  return Box;
}

/** Icon tile + label — the node primitive every diagram grammar shares. */
export function IconNode({
  id,
  label,
  detail,
  color,
  size = "md",
  filled = false,
  className,
}: {
  id: string;
  label: string;
  detail?: string;
  color: string;
  size?: "sm" | "md";
  filled?: boolean;
  className?: string;
}) {
  const Icon = stageIcon(id, label);
  const tile = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const icon = size === "sm" ? 16 : 20;
  return (
    <div className={`flex flex-col items-center gap-1.5 text-center ${className ?? ""}`}>
      <span
        className={`grid ${tile} shrink-0 place-items-center rounded-xl border transition-transform`}
        style={{
          background: filled ? color : `${color}1a`,
          borderColor: filled ? color : `${color}55`,
          color: filled ? "rgb(var(--c-surface))" : color,
          boxShadow: `0 0 18px -6px ${color}66`,
        }}
      >
        <Icon size={icon} aria-hidden />
      </span>
      <span className="max-w-[6.5rem] font-mono text-[0.62rem] leading-tight">{label}</span>
      {detail && (
        <span className="max-w-[7.5rem] text-[0.58rem] leading-snug text-muted">{detail}</span>
      )}
    </div>
  );
}
