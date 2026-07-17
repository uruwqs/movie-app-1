import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coffee,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Sun,
  Thermometer,
  TrendingUp,
  Volume2,
  Wifi,
  Wind,
} from "lucide-react";
// @ts-ignore - image imports
// @ts-ignore - image imports
// @ts-ignore - image imports
import atriumLogo from "@/imports/logo.png";

type FeedbackTag = "Too Hot" | "Too Cold" | "Too Noisy" | "Perfect";
type ChartTab = "Temperature" | "Noise" | "Brightness";
type ConnectionState = "loading" | "ready" | "error";

type StudyWindow = {
  title: string;
  subtitle: string;
  time: string;
  score: number;
  accent: string;
  badge?: string;
  image: string;
};

type HistoryRow = {
  id: number;
  timestamp: string;
  location: string;
  temp: number;
  noise: number;
  brightness: number;
};

const monthlyTrendData = [
  { month: "Sep", atrium: 21.2, outside: 14.4 },
  { month: "Oct", atrium: 22.8, outside: 15.0 },
  { month: "Nov", atrium: 23.5, outside: 16.4 },
  { month: "Dec", atrium: 22.1, outside: 12.7 },
  { month: "Jan", atrium: 20.9, outside: 11.1 },
  { month: "Feb", atrium: 22.4, outside: 13.5 },
  { month: "Mar", atrium: 23.8, outside: 17.2 },
  { month: "Apr", atrium: 24.1, outside: 18.8 },
  { month: "May", atrium: 23.5, outside: 14.0 },
];

const studyWindows: StudyWindow[] = [
  {
    title: "Golden Hour",
    subtitle: "Perfect light and calm acoustic conditions",
    time: "14:00 – 17:00",
    score: 96,
    accent: "#facc15",
    badge: "Golden Hour",
    image: atriumLogo,
  },
  {
    title: "Quiet Focus",
    subtitle: "Low noise with balanced daylight",
    time: "09:00 – 11:00",
    score: 88,
    accent: "#4D7EBD",
    image: atriumLogo,
  },
  {
    title: "Late Evening",
    subtitle: "Cool and steady after peak traffic",
    time: "20:00 – 22:00",
    score: 82,
    accent: "#22c55e",
    image: atriumLogo,
  },
];

const historyRows: HistoryRow[] = [
  {
    id: 1,
    timestamp: "2026-05-23 14:30",
    location: "Atrium",
    temp: 23.5,
    noise: 35,
    brightness: 820,
  },
  {
    id: 2,
    timestamp: "2026-05-23 12:10",
    location: "Outside",
    temp: 14.0,
    noise: 41,
    brightness: 760,
  },
  {
    id: 3,
    timestamp: "2026-05-22 18:40",
    location: "Atrium",
    temp: 21.2,
    noise: 29,
    brightness: 540,
  },
  {
    id: 4,
    timestamp: "2026-05-21 09:15",
    location: "Outside",
    temp: 13.6,
    noise: 46,
    brightness: 900,
  },
  {
    id: 5,
    timestamp: "2026-05-20 16:00",
    location: "Atrium",
    temp: 24.8,
    noise: 38,
    brightness: 780,
  },
  {
    id: 6,
    timestamp: "2026-05-20 07:30",
    location: "Outside",
    temp: 8.2,
    noise: 32,
    brightness: 210,
  },
];

const feedbackTags: FeedbackTag[] = [
  "Too Hot",
  "Too Cold",
  "Too Noisy",
  "Perfect",
];

function GlassCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/70 bg-white/65 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl ${className}`}
      style={{
        background: "rgba(241, 245, 249, 0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Header({ lastUpdated }: { lastUpdated: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#4D7EBD]/20 bg-white/80 shadow-sm overflow-hidden">
            <img
              src={atriumLogo}
              alt="Atrium Logo"
              className="h-13 w-13 object-cover"
            />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">
              Atrium Climate
            </p>
            <p className="text-xs text-slate-500">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <Wifi size={14} />
          <span className="hidden sm:inline">Live</span>
        </div>
      </div>
    </header>
  );
}

function ComfortRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#facc15"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold text-slate-900">{score}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          Comfort
        </span>
      </div>
    </div>
  );
}

function StudyCard({ item }: { item: StudyWindow }) {
  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="relative h-32 w-full overflow-hidden rounded-t-[1.75rem]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {item.subtitle}
            </p>
          </div>
          {item.badge ? (
            <span className="rounded-full border border-[#facc15]/35 bg-[#facc15]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#92400e]">
              {item.badge}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <Wind size={14} className="text-slate-500" />
          <span>{item.time}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${item.score}%`, background: item.accent }}
          />
        </div>
      </div>
    </GlassCard>
  );
}

function TemperatureAlertCard() {
  const [expanded, setExpanded] = useState(false);
  const indoor = 24;
  const outdoor = 37;
  const gap = Math.abs(outdoor - indoor);

  return (
    <div
      className="w-full overflow-hidden rounded-[2rem] border border-[#f97316]/25 bg-[#f97316] shadow-[0_18px_48px_rgba(249,115,22,0.22)] transition-all duration-300"
      style={{
        minHeight: expanded ? "auto" : "280px",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-start justify-between gap-3 p-6 text-left text-white transition-all duration-200 hover:opacity-90"
        aria-expanded={expanded}
      >
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-100">
            Thermal gap
          </p>
          <h3 className="mt-3 text-lg font-semibold sm:text-xl">
            Extreme Temperature Contrast Alert
          </h3>
          <div className="mt-4">
            <p className="text-3xl font-semibold sm:text-4xl">Δ {gap}°C</p>
            <p className="mt-2 text-sm text-orange-50">
              Outside {outdoor}°C • Inside {indoor}°C
            </p>
          </div>
        </div>
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown size={16} />
        </div>
      </button>

      {expanded ? (
        <div className="overflow-hidden border-t border-white/20 px-6 py-4 text-sm text-orange-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="font-semibold">Thermal Gap Scale</p>
          <ul className="mt-3 space-y-2 leading-relaxed">
            <li>
              🟡 <strong>Δ 6°</strong> — Minor gap. Stay attentive outdoors.
            </li>
            <li>
              🟠 <strong>Δ 9°</strong> — Significant gap. Adapt for a few
              minutes before stepping out.
            </li>
            <li>
              🔴 <strong>Δ 15°</strong> — Extreme contrast. High stress risk.
              Adapt gradually.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed font-medium">
            Medical note: headaches, dizziness, and heart strain can be
            triggered by sudden exposure. Individuals with cardiovascular
            conditions should avoid rapid transitions.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function BeverageCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard className="overflow-hidden p-0 transition-all duration-300">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors duration-200 hover:bg-white/40"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4D7EBD]/15">
            <Coffee size={16} className="text-[#4D7EBD]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Smart beverage matcher
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Fresh and cooling for the current temperature.
            </p>
          </div>
        </div>
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200/50 transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown size={14} className="text-slate-600" />
        </div>
      </button>

      {expanded ? (
        <div className="overflow-hidden border-t border-white/70 bg-white/30 px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Yuzu Lime Lemonade
                </p>
                <p className="mt-1 text-xs text-slate-500">From Drinkit Cafe</p>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                2,350 ₸
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#4D7EBD]/30 bg-[#4D7EBD]/10 px-3 py-2 text-xs font-semibold text-[#4D7EBD]">
              <Sparkles size={12} />
              Refreshing cold drink recommended
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              High indoor temperature detected. A chilled, hydrating beverage
              will help regulate your core temperature and maintain focus during
              study sessions.
            </p>
          </div>
          <button
            type="button"
            className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-[1rem] bg-[#facc15] px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(250,204,21,0.2)]"
          >
            Get at Cafe
          </button>
        </div>
      ) : null}
    </GlassCard>
  );
}

function TrendPanel() {
  const uid = useId();
  const gradientId = `gradient-${uid.replace(/:/g, "")}`;

  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            Monthly trends
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            Atrium vs Outdoors
          </h3>
        </div>
        <div className="rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-600">
          Last 9 months
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyTrendData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 12,
                color: "#0f172a",
              }}
            />
            <Area
              type="monotone"
              dataKey="atrium"
              stroke="#facc15"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
            />
            <Area
              type="monotone"
              dataKey="outside"
              stroke="#4D7EBD"
              strokeWidth={2.2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function HistoryPanel() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("loading");
  const [dateStart, setDateStart] = useState("2026-05-01");
  const [dateEnd, setDateEnd] = useState("2026-05-23");
  const [location, setLocation] = useState("All");
  const [filterMode, setFilterMode] = useState<
    "None" | "Noise" | "Brightness" | "Temp Range"
  >("None");
  const [filterValue, setFilterValue] = useState("Low");
  const [sortConfig, setSortConfig] = useState<{
    key: "time" | "temperature";
    direction: "asc" | "desc";
  }>({ key: "time", direction: "desc" });

  useEffect(() => {
    const timer = window.setTimeout(() => setConnectionState("ready"), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const rows = useMemo(() => {
    const filtered = historyRows.filter((row) => {
      const rowDate = row.timestamp.slice(0, 10);
      const afterStart = !dateStart || rowDate >= dateStart;
      const beforeEnd = !dateEnd || rowDate <= dateEnd;
      const locationMatch = location === "All" || row.location === location;

      let filterMatch = true;
      if (filterMode === "Noise") {
        const thresholds: Record<string, [number, number]> = {
          Low: [0, 32],
          Medium: [33, 39],
          High: [40, 100],
        };
        const [min, max] = thresholds[filterValue] ?? [0, 100];
        filterMatch = row.noise >= min && row.noise <= max;
      }
      if (filterMode === "Brightness") {
        const thresholds: Record<string, [number, number]> = {
          Low: [0, 400],
          Medium: [401, 700],
          High: [701, 1000],
        };
        const [min, max] = thresholds[filterValue] ?? [0, 1000];
        filterMatch = row.brightness >= min && row.brightness <= max;
      }
      if (filterMode === "Temp Range") {
        const thresholds: Record<string, [number, number]> = {
          Cool: [-20, 15],
          Comfortable: [15.1, 22],
          Warm: [22.1, 40],
        };
        const [min, max] = thresholds[filterValue] ?? [-20, 40];
        filterMatch = row.temp >= min && row.temp <= max;
      }

      return afterStart && beforeEnd && locationMatch && filterMatch;
    });

    return filtered.sort((a, b) => {
      if (sortConfig.key === "time") {
        const compare = a.timestamp.localeCompare(b.timestamp);
        return sortConfig.direction === "asc" ? compare : -compare;
      }
      const compare = a.temp - b.temp;
      return sortConfig.direction === "asc" ? compare : -compare;
    });
  }, [
    dateEnd,
    dateStart,
    filterMode,
    filterValue,
    location,
    sortConfig.direction,
    sortConfig.key,
  ]);

  const sortButton = (key: "time" | "temperature") => (
    <button
      type="button"
      onClick={() =>
        setSortConfig((current) => ({
          key,
          direction:
            current.key === key && current.direction === "asc" ? "desc" : "asc",
        }))
      }
      className="min-h-[44px] rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700"
    >
      {key === "time" ? "Time" : "Temp"}{" "}
      {sortConfig.key === key && sortConfig.direction === "asc" ? "↑" : "↓"}
    </button>
  );

  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/70 bg-white/40 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Measurement history
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              Logged readings & filters
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortButton("time")}
            {sortButton("temperature")}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="rounded-[1rem] border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Date range
            </span>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateStart}
                onChange={(event) => setDateStart(event.target.value)}
                className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
              />
              <input
                type="date"
                value={dateEnd}
                onChange={(event) => setDateEnd(event.target.value)}
                className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
              />
            </div>
          </label>

          <label className="rounded-[1rem] border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Location
            </span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
            >
              <option value="All">All</option>
              <option value="Atrium">Atrium</option>
              <option value="Outside">Outside</option>
            </select>
          </label>

          <div className="rounded-[1rem] border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Additional filter
            </span>
            <div className="flex flex-wrap gap-2">
              {(["None", "Noise", "Brightness", "Temp Range"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFilterMode(option);
                      if (option === "None") setFilterValue("Low");
                    }}
                    className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-semibold ${filterMode === option ? "bg-[#facc15] text-slate-900" : "bg-slate-100 text-slate-700"}`}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          </div>

          {filterMode !== "None" ? (
            <label className="rounded-[1rem] border border-white/70 bg-white/70 p-3 text-sm text-slate-700">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                {filterMode}
              </span>
              <select
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
              >
                {filterMode === "Noise" ? (
                  <>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </>
                ) : null}
                {filterMode === "Brightness" ? (
                  <>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </>
                ) : null}
                {filterMode === "Temp Range" ? (
                  <>
                    <option value="Cool">Cool</option>
                    <option value="Comfortable">Comfortable</option>
                    <option value="Warm">Warm</option>
                  </>
                ) : null}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        {connectionState === "loading" ? (
          <div className="space-y-3">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="h-12 animate-pulse rounded-[1rem] border border-slate-200 bg-slate-100/80"
              />
            ))}
          </div>
        ) : null}

        {connectionState === "error" ? (
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-100/80 p-6 text-center text-slate-700">
            <p className="text-lg font-semibold text-slate-900">
              Connection unavailable
            </p>
            <p className="mt-2 text-sm">
              The latest measurements could not be fetched.
            </p>
            <button
              type="button"
              onClick={() => setConnectionState("ready")}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#facc15] px-4 py-2 text-sm font-semibold text-slate-900"
            >
              <RefreshCw size={14} />
              Retry Connection
            </button>
          </div>
        ) : null}

        {connectionState === "ready" && rows.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center text-slate-600">
            <p className="text-lg font-semibold text-slate-900">
              No data found for selected date
            </p>
            <p className="mt-2 text-sm">
              Try widening the date range or clearing the extra filter.
            </p>
          </div>
        ) : null}

        {connectionState === "ready" && rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.25rem] border border-white/70">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50/70 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Temp (°C)</th>
                  <th className="px-4 py-3 font-semibold">Noise</th>
                  <th className="px-4 py-3 font-semibold">Brightness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70 text-slate-700">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">{row.timestamp}</td>
                    <td className="px-4 py-3">{row.location}</td>
                    <td className="px-4 py-3 font-semibold">
                      {row.temp.toFixed(1)}
                    </td>
                    <td className="px-4 py-3">{row.noise} dB</td>
                    <td className="px-4 py-3">{row.brightness} lux</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}

function FeedbackCenter() {
  const [selected, setSelected] = useState<FeedbackTag | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setSelected(null);
    setComment("");
  }

  const tagStyles: Record<
    FeedbackTag,
    { bg: string; text: string; border: string }
  > = {
    "Too Hot": {
      bg: "rgba(249,115,22,0.12)",
      text: "#c2410c",
      border: "rgba(249,115,22,0.25)",
    },
    "Too Cold": {
      bg: "rgba(14,165,233,0.12)",
      text: "#0369a1",
      border: "rgba(14,165,233,0.25)",
    },
    "Too Noisy": {
      bg: "rgba(148,163,184,0.18)",
      text: "#475569",
      border: "rgba(148,163,184,0.3)",
    },
    Perfect: {
      bg: "rgba(34,197,94,0.14)",
      text: "#15803d",
      border: "rgba(34,197,94,0.25)",
    },
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#facc15]/20">
          <MessageSquare size={16} className="text-[#ca8a04]" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            Report center
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            Share a quick climate note
          </h3>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {feedbackTags.map((tag) => {
          const active = selected === tag;
          const colors = tagStyles[tag];
          return (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setSelected((value) => (value === tag ? null : tag))
              }
              className="min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-all"
              style={
                active
                  ? {
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }
                  : {
                      background: "rgba(255,255,255,0.7)",
                      color: "#475569",
                      border: "1px solid rgba(148,163,184,0.2)",
                    }
              }
            >
              {tag}
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Add a note (optional)..."
        rows={3}
        className="mt-4 w-full resize-none rounded-[1rem] border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#facc15]"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selected}
        className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-semibold transition-all"
        style={
          selected
            ? {
                background: "#facc15",
                color: "#1f2937",
                boxShadow: "0 10px 24px rgba(250,204,21,0.2)",
              }
            : {
                background: "rgba(226,232,240,0.7)",
                color: "#94a3b8",
                cursor: "not-allowed",
              }
        }
      >
        {submitted ? <CheckCircle2 size={16} /> : null}
        {submitted ? "Report Created Successfully!" : "Submit Report"}
      </button>

      {submitted ? (
        <div className="mt-4 flex items-center gap-2 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} />
          Feedback stored. Thanks for helping the Atrium stay comfortable.
        </div>
      ) : null}
    </GlassCard>
  );
}

export default function App() {
  const [time] = useState(() =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => setConnectionState("ready"), 800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#ffffff] text-slate-900"
      style={{
        fontFamily:
          "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Header lastUpdated="May 23, 14:30" />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                <Thermometer size={15} className="text-[#facc15]" />
                Atrium Atmosphere
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="text-5xl font-semibold text-slate-900 sm:text-6xl">
                  23.5
                </span>
                <span className="pb-2 text-2xl font-medium text-slate-500">
                  °C
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#facc15]/25 bg-[#facc15]/15 px-3 py-1.5 text-sm font-semibold text-[#92400e]">
                  Optimal Conditions
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-600">
                  Atrium 23.5°C • Outside 14.0°C
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-500">Outside</span>
                <span className="font-semibold text-slate-900">14.0°C</span>
                <span className="h-4 w-px bg-slate-300" />
                <span className="flex items-center gap-1 font-semibold text-[#facc15]">
                  <ArrowUp size={14} />
                  9.5°C warmer inside
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <ComfortRing score={94} />
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                Excellent comfort
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Best study windows
            </h2>
            <ChevronRight size={15} className="text-slate-400" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {studyWindows.map((item) => (
              <StudyCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Smart recommendations
            </h2>
            <ChevronRight size={15} className="text-slate-400" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <BeverageCard />

            <GlassCard className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#facc15]/15">
                  <Calendar size={16} className="text-[#ca8a04]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Study support summary
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Based on recent Telegram sensor data and historical comfort
                    patterns.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Comfort score
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    94%
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Sensor stream
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    847
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <TemperatureAlertCard />
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                <BarChart3 size={14} className="text-[#facc15]" />
                Live sensor snapshot
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Temperature
                    </span>
                    <span className="text-sm font-semibold text-[#facc15]">
                      23.5°C
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[78%] rounded-full bg-[#facc15]" />
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Ambient light
                    </span>
                    <span className="text-sm font-semibold text-[#4D7EBD]">
                      800 lux
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[82%] rounded-full bg-[#4D7EBD]" />
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Noise
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      35 dB
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[70%] rounded-full bg-slate-500" />
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Flow
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      Stable
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[90%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 space-y-5">
          <TrendPanel />
          <HistoryPanel />
          <FeedbackCenter />
        </div>
      </main>
    </div>
  );
}
