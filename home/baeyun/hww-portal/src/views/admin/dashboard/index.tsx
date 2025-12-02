import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Avatar,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton, Alert } from "@material-ui/lab";
import { Line } from "react-chartjs-2";
import {
  MousePointer as MousePointerIcon,
  Activity as ActivityIcon,
  BarChart as BarChartIcon,
  DollarSign as DollarSignIcon
} from "react-feather";

import Page from "../../../components/Page";

const AdminDashboardView = () => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Dashboard />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default AdminDashboardView;

function Dashboard() {
  const [preset, setPreset] = useState<DateRangePreset>("7d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const { start, end } = useMemo(
    () => getDateRange(preset, customStart, customEnd),
    [preset, customStart, customEnd]
  );

  const { data, loading, error, refetch } = useAnalyticsData({ start, end });

  // Theme + responsive settings for better chart UX (Chart.js 2.9.4 compatible)
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));

  const chartOptions = useMemo(
    () => buildLineOptions(theme, data?.timeseries || [], downSm),
    [theme, data?.timeseries, downSm]
  );

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4">Analytics Dashboard</Typography>
        <DateRangeControls
          preset={preset}
          setPreset={setPreset}
          customStart={customStart}
          customEnd={customEnd}
          setCustomStart={setCustomStart}
          setCustomEnd={setCustomEnd}
          onApply={() => refetch()}
        />
      </Box>

      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <KpiRow loading={loading} summary={data?.summary} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="h6">Clicks over time</Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatRangeLabel(start, end)}
                </Typography>
              </Box>
              <Divider />
              <Box mt={2} style={{ height: 260 }}>
                {loading ? (
                  <Skeleton variant="rect" width="100%" height={220} />
                ) : data?.timeseries?.length ? (
                  <Line
                    data={(canvas) =>
                      toLineChartDataWithGradient(
                        canvas as HTMLCanvasElement,
                        data.timeseries,
                        theme
                      )
                    }
                    options={{
                      ...chartOptions,
                      tooltips: {
                        ...chartOptions.tooltips,
                        mode: "index" as const,
                      },
                      hover: {
                        ...chartOptions.hover,
                        mode: "index" as const,
                      },
                    }}
                    height={220}
                  />
                ) : (
                  <Typography color="textSecondary">
                    No data for selected range.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={6} xs={12}>
          <BreakdownCard
            title="Top Links"
            loading={loading}
            rows={data?.topLinks}
            emptyLabel="No link data for selected range."
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BreakdownCard
            title="Top Referrers"
            loading={loading}
            rows={data?.topReferrers}
            emptyLabel="No referrer data for selected range."
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BreakdownCard
            title="Top Countries"
            loading={loading}
            rows={data?.topCountries}
            emptyLabel="No country data for selected range."
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function DateRangeControls({
  preset,
  setPreset,
  customStart,
  customEnd,
  setCustomStart,
  setCustomEnd,
  onApply,
}: {
  preset: DateRangePreset;
  setPreset: (p: DateRangePreset) => void;
  customStart: string;
  customEnd: string;
  setCustomStart: (v: string) => void;
  setCustomEnd: (v: string) => void;
  onApply: () => void;
}) {
  return (
    <Box display="flex" alignItems="center">
      <TextField
        select
        variant="outlined"
        size="small"
        label="Range"
        value={preset}
        onChange={(e) => setPreset(e.target.value as DateRangePreset)}
        style={{ minWidth: 140, marginRight: 12 }}
      >
        <MenuItem value="24h">Last 24 hours</MenuItem>
        <MenuItem value="7d">Last 7 days</MenuItem>
        <MenuItem value="30d">Last 30 days</MenuItem>
        <MenuItem value="90d">Last 90 days</MenuItem>
        <MenuItem value="custom">Custom</MenuItem>
      </TextField>

      {preset === "custom" && (
        <>
          <TextField
            type="date"
            variant="outlined"
            size="small"
            label="Start"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8 }}
          />
          <TextField
            type="date"
            variant="outlined"
            size="small"
            label="End"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 12 }}
          />
          <Button variant="outlined" size="small" onClick={onApply}>
            Apply
          </Button>
        </>
      )}
    </Box>
  );
}

function KpiRow({ loading, summary }: { loading: boolean; summary?: Summary }) {
  const theme = useTheme();
  const items = [
    { label: "Clicks", icon: MousePointerIcon, value: summary?.clicks ?? 0 },
    { label: "Leads", icon: ActivityIcon, value: summary?.leads ?? 0 },
    { label: "Sales", icon: BarChartIcon, value: summary?.sales ?? 0 },
    {
      label: "Sales Amount",
      icon: DollarSignIcon,
      value: summary ? `$${summary.saleAmount.toFixed(2)}` : "$0.00",
    },
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.label} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent style={{ paddingTop: 12, paddingBottom: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                  color="textSecondary" variant="overline"
                  style={{ letterSpacing: 0.6, fontSize: 14 }}
                >
                  {item.label}
                </Typography>
                <Avatar
                  variant="rounded"
                  color="secondary"
                  style={{ backgroundColor: theme.palette.secondary.main, height: 36, width: 36 }}
                >
                  <item.icon size={18} />
                </Avatar>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={80} height={32} />
              ) : (
                <Typography color="textPrimary"
                  variant="h3" style={{ lineHeight: 1.1, fontSize: 42, fontWeight: "bold" }}>
                  {formatNumber(item.value)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function BreakdownCard({
  title,
  rows,
  loading,
  emptyLabel,
}: {
  title: string;
  rows?: BreakdownRow[];
  loading: boolean;
  emptyLabel: string;
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        {loading ? (
          <>
            <Skeleton variant="rect" height={36} />
            <Box mt={1}>
              <Skeleton variant="rect" height={36} />
            </Box>
            <Box mt={1}>
              <Skeleton variant="rect" height={36} />
            </Box>
          </>
        ) : rows && rows.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">
                  <Tooltip title="Unique visitors for this row">
                    <span>Uniques</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={`${r.label}-${idx}`}>
                  <TableCell
                    style={{
                      maxWidth: 260,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {(title !== "Top Countries" && r.label) || (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={`https://flagcdn.com/${r.label.toLowerCase()}.svg`}
                          width="30"
                          style={{ borderRadius: 3 }}
                          alt={r.label}
                        />
                        <span
                          aria-label={r.label}
                          style={{ verticalAlign: "middle", marginLeft: 8 }}
                        >
                          {r.label}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(r.clicks)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(r.leads ?? 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="textSecondary">{emptyLabel}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

function useAnalyticsData({ start, end }: { start: string; end: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summary, combined] = await Promise.all([
        analyticsService.fetchSummary({ start, end }),
        analyticsService.fetchTimeSeriesCombined({ start, end }),
      ]);

      const timeseries = combined.points ?? [];
      let topLinks: BreakdownRow[] = [];
      let topReferrers: BreakdownRow[] = [];
      let topCountries: BreakdownRow[] = [];

      if (combined.events && combined.events.length > 0) {
        topLinks = aggregateEventsToTopLinks(combined.events);
        topReferrers = aggregateEventsToTopReferrers(combined.events);
        topCountries = aggregateEventsToTopCountries(combined.events);
      } else {
        // Fallback if backend returns only aggregated points (no raw events)
        const [links, refs, countries] = await Promise.all([
          analyticsService.fetchBreakdown({ start, end, by: "link" }),
          analyticsService.fetchBreakdown({ start, end, by: "referrer" }),
          analyticsService.fetchBreakdown({ start, end, by: "country" }),
        ]);
        topLinks = links;
        topReferrers = refs;
        topCountries = countries;
      }

      setData({
        summary,
        timeseries,
        topLinks,
        topReferrers,
        topCountries,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  return { data, loading, error, refetch: fetchAll };
}

const analyticsService = {
  async fetchSummary({
    start,
    end,
  }: {
    start: string;
    end: string;
  }): Promise<Summary> {
    const res = await apiGet(
      `/analytics/summary?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&event=clicks&interval=24h`
    );
    if (!res || res.mock) {
      return mockSummary();
    }
    return {
      clicks: res.clicks ?? 0,
      leads: res.leads ?? 0,
      sales: res.sales ?? 0,
      saleAmount: res.saleAmount ?? 0,
    };
  },

  // Single call that returns both raw events (when available) and aggregated points
  async fetchTimeSeriesCombined({
    start,
    end,
  }: {
    start: string;
    end: string;
  }): Promise<TimeSeriesCombined> {
    const res = await apiGet(
      `/analytics/timeseries?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&event=clicks&interval=24h`
    );

    if (!res || res.mock) {
      return {
        events: [],
        points: mockTimeSeries(start, end),
      };
    }

    // If the API returns an array, assume it's raw events
    if (Array.isArray(res)) {
      const events = res as DubEvent[];
      return {
        events,
        points: aggregateEventsToDailyPoints(events, start, end),
      };
    }

    // Common wrapper: { data: [...] }
    if (Array.isArray((res as any).data)) {
      const events = (res as any).data as DubEvent[];
      return {
        events,
        points: aggregateEventsToDailyPoints(events, start, end),
      };
    }

    // Backward compatibility: aggregated shape with points
    if (Array.isArray((res as any).points)) {
      const points: TimeSeriesPoint[] = ((res as any).points || []).map((p: any) => ({
        date: p.date,
        clicks: p.clicks ?? 0,
        leads: p.leads ?? undefined,
        sales: p.sales ?? undefined,
      }));
      return {
        events: [],
        points,
      };
    }

    // Fallback
    return { events: [], points: [] };
  },

  async fetchBreakdown({
    start,
    end,
    by,
  }: {
    start: string;
    end: string;
    by: "link" | "referrer" | "country";
  }): Promise<BreakdownRow[]> {
    const res = await apiGet(
      `/analytics/breakdown?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&by=${encodeURIComponent(by)}&limit=10`
    );
    if (!res || res.mock) {
      return mockBreakdown(by);
    }
    return (res.rows || []).map((r: any) => ({
      label: r.label,
      clicks: r.clicks ?? 0,
      leads: r.leads ?? 0,
    }));
  },
};

// Point the frontend at your Laravel API (same origin assumed; adjust if needed)
const baseUrl = "/api";

async function apiGet(path: string): Promise<any> {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (e) {
    // Return a mock flag to keep the UI working in development if backend is down
    return { mock: true };
  }
}

function getDateRange(
  preset: DateRangePreset,
  customStart: string,
  customEnd: string
) {
  const today = new Date();
  const endDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  let startDate = new Date(endDate);

  if (preset === "7d") startDate.setUTCDate(endDate.getUTCDate() - 6);
  if (preset === "30d") startDate.setUTCDate(endDate.getUTCDate() - 29);
  if (preset === "90d") startDate.setUTCDate(endDate.getUTCDate() - 89);
  if (preset === "custom") {
    const s = customStart ? new Date(customStart) : endDate;
    const e = customEnd ? new Date(customEnd) : endDate;
    return { start: toISODate(s), end: toISODate(e) };
  }

  return { start: toISODate(startDate), end: toISODate(endDate) };
}

function toISODate(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatRangeLabel(start: string, end: string) {
  return `${start} → ${end}`;
}

function formatNumber(v: number | string) {
  if (typeof v === "string") return v;
  return new Intl.NumberFormat().format(v);
}

// Nicer label formatting for x-axis ticks and tooltips
function formatDayLabel(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(d);
}

function formatTooltipDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function getMax(points: TimeSeriesPoint[]) {
  return points.reduce((m, p) => Math.max(m, p.clicks), 0);
}

function niceCeil(v: number) {
  if (v <= 10) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / pow) * pow;
}

// Chart data with theme-driven gradient fill (Chart.js 2.9.4 compatible)
function toLineChartDataWithGradient(
  canvas: HTMLCanvasElement,
  points: TimeSeriesPoint[],
  theme: any
) {
  const ctx = canvas.getContext("2d")!;
  const height = canvas.height || 260;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, fade(theme.palette.primary.main, 0.28));
  gradient.addColorStop(1, fade(theme.palette.primary.main, 0.02));

  return {
    labels: points.map((p) => p.date),
    datasets: [
      {
        label: "Clicks",
        data: points.map((p) => p.clicks),
        borderColor: theme.palette.primary.main,
        backgroundColor: gradient,
        borderWidth: 2,
        lineTension: 0.25,
        pointRadius: 1.5,
        pointHoverRadius: 4,
        pointHitRadius: 12,
        fill: true,
      },
    ],
  };
}

// Cleaner chart options with nicer grid, ticks, and tooltips (Chart.js 2.9.4)
function buildLineOptions(theme: any, points: TimeSeriesPoint[], downSm: boolean) {
  const textColor = theme.palette.text.secondary;
  const gridColor = fade(theme.palette.text.primary, 0.08);
  const max = getMax(points);
  const suggestedMax = niceCeil(max * 1.15);
  const maxTicks = downSm ? 5 : 9;

  return {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    layout: { padding: { left: 2, right: 10, top: 6, bottom: 0 } },
    elements: {
      point: {
        borderWidth: 0,
      },
    },
    hover: { intersect: false, mode: "index" },
    tooltips: {
      mode: "index",
      intersect: false,
      backgroundColor: theme.palette.grey[900],
      titleFontSize: 12,
      bodyFontSize: 12,
      xPadding: 10,
      yPadding: 10,
      cornerRadius: 6,
      displayColors: false,
      callbacks: {
        title: (items: any[]) => {
          const idx = items?.[0]?.index ?? 0;
          const date = points[idx]?.date;
          return date ? formatTooltipDate(date) : "";
        },
        label: (item: any) => `Clicks: ${formatNumber(Number(item.value))}`,
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            color: gridColor,
            zeroLineColor: gridColor,
          },
          ticks: {
            fontColor: textColor,
            maxTicksLimit: maxTicks,
            callback: (value: any) => formatDayLabel(String(value)),
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            color: gridColor,
            zeroLineColor: gridColor,
            drawBorder: false,
          },
          ticks: {
            fontColor: textColor,
            beginAtZero: true,
            suggestedMax,
            maxTicksLimit: 6,
            callback: (value: any) =>
              typeof value === "number" ? formatNumber(Math.round(value)) : value,
          },
        },
      ],
    },
  };
}

// Helpers to support new timeseries shape (array of raw click events)
function eachDayISO(start: string, end: string) {
  const from = new Date(start);
  const to = new Date(end);
  const days: string[] = [];
  const d = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
  );
  const endUTC = new Date(
    Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate())
  );
  while (d <= endUTC) {
    days.push(toISODate(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

function aggregateEventsToDailyPoints(
  events: any[],
  start: string,
  end: string
): TimeSeriesPoint[] {
  const counts = new Map<string, number>();

  for (const e of events) {
    // Use precise ISO if available; otherwise fallback to top-level timestamp
    const ts: string | undefined = e?.click?.timestamp || e?.timestamp;
    if (!ts) continue;
    const day = toISODate(new Date(ts));
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const days = eachDayISO(start, end);
  return days.map((day) => ({
    date: day,
    clicks: counts.get(day) ?? 0,
  }));
}

function aggregateEventsToTopLinks(events: any[]): BreakdownRow[] {
  const counts = new Map<string, { clicks: number; leads: number }>();

  for (const e of events) {
    const link = e?.link;
    if (!link) continue;
    const label = e.client_business_name || link.title || link.key || link.url || "Unknown";
    const entry = counts.get(label) || { clicks: 0, leads: 0 };
    entry.clicks += 1;
    if (e?.click?.trigger === "lead") {
      entry.leads += 1;
    }
    counts.set(label, entry);
  }

  const rows: BreakdownRow[] = [];
  for (const [label, { clicks, leads }] of Array.from(counts)) {
    rows.push({ label, clicks, leads });
  }
  rows.sort((a, b) => b.clicks - a.clicks);
  return rows.slice(0, 10);
}

function aggregateEventsToTopReferrers(events: any[]): BreakdownRow[] {
  const counts = new Map<string, { clicks: number; leads: number }>();

  for (const e of events) {
    const referrer = e?.click?.referer || "Unknown";
    const entry = counts.get(referrer) || { clicks: 0, leads: 0 };
    entry.clicks += 1;
    if (e?.click?.trigger === "lead") {
      entry.leads += 1;
    }
    counts.set(referrer, entry);
  }

  const rows: BreakdownRow[] = [];
  for (const [label, { clicks, leads }] of Array.from(counts)) {
    rows.push({ label, clicks, leads });
  }
  rows.sort((a, b) => b.clicks - a.clicks);
  return rows.slice(0, 10);
}

function aggregateEventsToTopCountries(events: any[]): BreakdownRow[] {
  const counts = new Map<string, { clicks: number; leads: number }>();

  for (const e of events) {
    const country = e?.click?.country || "Unknown";
    const entry = counts.get(country) || { clicks: 0, leads: 0 };
    entry.clicks += 1;
    if (e?.click?.trigger === "lead") {
      entry.leads += 1;
    }
    counts.set(country, entry);
  }

  const rows: BreakdownRow[] = [];
  for (const [label, { clicks, leads }] of Array.from(counts)) {
    rows.push({ label, clicks, leads });
  }
  rows.sort((a, b) => b.clicks - a.clicks);
  return rows.slice(0, 10);
}

function mockSummary(): Summary {
  return {
    clicks: 18423,
    leads: 13210,
    sales: 734,
    saleAmount: 3.24,
  };
}

function mockTimeSeries(start: string, end: string): TimeSeriesPoint[] {
  const from = new Date(start);
  const to = new Date(end);
  const days = Math.floor((+to - +from) / (24 * 3600 * 1000)) + 1;
  const arr: TimeSeriesPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setUTCDate(from.getUTCDate() + i);
    arr.push({
      date: toISODate(d),
      clicks: Math.max(
        0,
        Math.round(300 + 100 * Math.sin(i / 3) + (Math.random() - 0.5) * 80)
      ),
    });
  }
  return arr;
}

function mockBreakdown(by: "link" | "referrer" | "country"): BreakdownRow[] {
  const seeds: Record<typeof by, string[]> = {
    link: [
      "summer-sale",
      "landing",
      "promo-2025",
      "blog-post",
      "newsletter",
      "black-friday",
      "signup",
      "release-notes",
    ],
    referrer: [
      "google.com",
      "twitter.com",
      "linkedin.com",
      "producthunt.com",
      "direct",
      "newsletter",
    ],
    country: ["US", "GB", "DE", "IN", "CA", "AU", "FR", "BR"],
  };
  return seeds[by].slice(0, 8).map((label, i) => ({
    label,
    clicks: 5000 - i * 420 + Math.round(Math.random() * 120),
    leads: 4000 - i * 350 + Math.round(Math.random() * 80),
  }));
}

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

// Types

type DubEvent = {
  event: "click",
  timestamp: string,
  click: {
    id: string,
    timestamp: string,
    url: string,
    country: string,
    city: string,
    region: string,
    continent: string,
    device: string,
    browser: string,
    os: string,
    trigger: string,
    referer: string,
    refererUrl: string,
    qr: boolean,
    ip: string
  },
  link: {
    id: string,
    domain: string,
    key: string,
    url: string,
    trackConversion: boolean,
    externalId: string,
    tenantId: string,
    programId: string,
    partnerId: string,
    archived: boolean,
    expiresAt: string,
    expiredUrl: string,
    password: string,
    proxy: boolean,
    title: string,
    description: string,
    image: string,
    video: string,
    rewrite: boolean,
    doIndex: boolean,
    ios: string,
    android: string,
    geo: {},
    publicStats: boolean,
    tags: [
      {
        id: string,
        name: string,
        color: string
      }
    ],
    folderId: string,
    webhookIds: [
      string
    ],
    comments: string,
    shortLink: string,
    qrCode: string,
    utm_source: string,
    utm_medium: string,
    utm_campaign: string,
    utm_term: string,
    utm_content: string,
    testVariants: [
      {
        url: string,
        percentage: number
      },
      {
        url: string,
        percentage: number
      }
    ],
    testStartedAt: string,
    testCompletedAt: string,
    userId: string,
    workspaceId: string,
    clicks: number,
    leads: number,
    conversions: number,
    sales: number,
    saleAmount: number,
    lastClicked: string,
    createdAt: string,
    updatedAt: string,
    tagId: string,
    projectId: string
  },
  click_id: string,
  link_id: string,
  domain: string,
  key: string,
  url: string,
  continent: string,
  country: string,
  city: string,
  device: string,
  browser: string,
  os: string,
  qr: number,
  ip: string
}

type DateRangePreset =
  | "24h"
  | "7d"
  | "30d"
  | "90d"
  | "1y"
  | "mtd"
  | "qtd"
  | "ytd"
  | "all"
  | "custom";

type Summary = {
  clicks: number;
  leads: number;
  sales: number;
  saleAmount: number;
};

type TimeSeriesPoint = {
  date: string;
  clicks: number;
  leads?: number;
  sales?: number;
};

type BreakdownRow = {
  label: string;
  clicks: number;
  leads?: number;
};

type AnalyticsData = {
  summary: Summary;
  timeseries: TimeSeriesPoint[];
  topLinks: BreakdownRow[];
  topReferrers: BreakdownRow[];
  topCountries: BreakdownRow[];
};

type TimeSeriesCombined = {
  events: DubEvent[];
  points: TimeSeriesPoint[];
};
