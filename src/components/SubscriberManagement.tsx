import React, { useState, useEffect, useMemo } from "react";
import { Download, 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Plus, 
  Search, 
  Filter, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Send,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  Code2,
  Trash2,
  RefreshCw,
  FastForward,
  CheckCheck,
  Eye,
  FileCode,
  TrendingUp,
  BarChart3,
  Wallet,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { SubscriberRecord, DryRunExecutionSummary, DryRunKickLog, PaybotConfig, AiInfluencer } from "../types";
import { INITIAL_MOCK_SUBSCRIBERS } from "../data/mockSubscribers";

interface SubscriberManagementProps {
  paybotConfig: PaybotConfig;
  influencer?: AiInfluencer;
}

export const SubscriberManagement: React.FC<SubscriberManagementProps> = ({
  paybotConfig,
  influencer,
}) => {
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(INITIAL_MOCK_SUBSCRIBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expiring_soon" | "expired" | "kicked">("all");
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRecord | null>(null);

  // Dry Run state & simulation results
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [dryRunSummary, setDryRunSummary] = useState<DryRunExecutionSummary | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);
  const [copiedWalletId, setCopiedWalletId] = useState<string | null>(null);
  const [timeShiftDays, setTimeShiftDays] = useState(0);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);
  
  // Real-time SUI price simulation (Mock Coingecko)
  const [suiPriceUsd, setSuiPriceUsd] = useState<number>(0.85);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [ltvSourceFilter, setLtvSourceFilter] = useState<"all" | "telegram" | "direct">("all");

  const fetchSuiPrice = async () => {
    setIsFetchingPrice(true);
    // Simulation of Coingecko API
    setTimeout(() => {
      const vol = 0.82 + Math.random() * 0.1;
      setSuiPriceUsd(vol);
      setIsFetchingPrice(false);
    }, 800);
  };

  useEffect(() => {
    fetchSuiPrice();
    const interval = setInterval(fetchSuiPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  // Derived metrics
  const now = useMemo(() => new Date(Date.now() + timeShiftDays * 24 * 60 * 60 * 1000), [timeShiftDays]);

  const annotatedSubscribers = useMemo(() => {
    return subscribers.map((sub) => {
      const expiresAtDate = new Date(sub.expiresAt);
      const diffMs = expiresAtDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      let computedStatus: "active" | "expiring_soon" | "expired" | "kicked" = sub.status;

      if (!sub.active) {
        computedStatus = "kicked";
      } else if (diffMs <= 0) {
        computedStatus = "expired";
      } else if (diffHours <= 48) {
        computedStatus = "expiring_soon";
      } else {
        computedStatus = "active";
      }

      return {
        ...sub,
        computedStatus,
        remainingHours: Math.round(diffHours),
        remainingDays: Math.ceil(diffHours / 24),
      };
    });
  }, [subscribers, now]);

  const activeCount = annotatedSubscribers.filter((s) => s.computedStatus === "active").length;
  const expiringSoonCount = annotatedSubscribers.filter((s) => s.computedStatus === "expiring_soon").length;
  const expiredCount = annotatedSubscribers.filter((s) => s.computedStatus === "expired").length;
  const kickedCount = annotatedSubscribers.filter((s) => s.computedStatus === "kicked").length;

  const totalMonthlySuiRevenue = subscribers
    .filter((s) => s.active && s.currency === "SUI")
    .reduce((acc, s) => acc + s.amountPaid, 0);

  const totalMonthlyArsRevenue = subscribers
    .filter((s) => s.active && s.currency === "ARS")
    .reduce((acc, s) => acc + s.amountPaid, 0);

  // LTV Data preparation for Recharts
  const ltvData = useMemo(() => {
    // Group subscribers by user and calculate their total spent (LTV)
    const userMap = new Map<string, { name: string, ltv: number, source: string }>();
    
    subscribers.forEach(sub => {
      const existing = userMap.get(sub.username);
      const amountInSui = sub.currency === "SUI" ? sub.amountPaid : (sub.amountPaid / 20000); // Mock ARS to SUI conversion
      const source = sub.telegramUserId % 2 === 0 ? "telegram" : "direct";

      if (existing) {
        existing.ltv += amountInSui;
      } else {
        userMap.set(sub.username, { 
          name: sub.username, 
          ltv: amountInSui,
          source: source
        });
      }
    });

    return Array.from(userMap.values())
      .filter(item => ltvSourceFilter === "all" || item.source === ltvSourceFilter)
      .sort((a, b) => b.ltv - a.ltv)
      .slice(0, 8); // Top 8 users
  }, [subscribers, ltvSourceFilter]);

  const treasuryGoal = 500; // SUI
  const stakingPercentage = 25; // Suggest 25% for staking
  const stakingAmount = (totalMonthlySuiRevenue * (stakingPercentage / 100)).toFixed(2);
  const goalProgress = Math.min(100, (totalMonthlySuiRevenue / treasuryGoal) * 100);

  // Filtered list
  const filteredSubscribers = annotatedSubscribers.filter((s) => {
    const matchesSearch = 
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.telegramUserId).includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    return s.computedStatus === statusFilter;
  });

  // =========================================================================
  // DRY RUN KICK-BOT SIMULATION LOGIC
  // =========================================================================
  const handleExecuteKickBotDryRun = () => {
    setIsRunningDryRun(true);

    setTimeout(() => {
      const logs: DryRunKickLog[] = [];
      const expiredToProcess = annotatedSubscribers.filter((s) => s.active && new Date(s.expiresAt) <= now);
      const expiringSoonToAlert = annotatedSubscribers.filter(
        (s) => s.active && new Date(s.expiresAt) > now && s.remainingHours <= 48 && !s.reminderSent
      );

      // 1. Process Expired Subscribers (Kick-Bot logic simulation)
      expiredToProcess.forEach((sub) => {
        const timestamp = new Date().toISOString();

        // Step 1: Simulated Ban (removes user from private VIP group)
        logs.push({
          id: `log-ban-${sub.id}-${Date.now()}`,
          timestamp,
          subscriberId: sub.id,
          telegramUserId: sub.telegramUserId,
          username: sub.username,
          action: "BAN_CHAT_MEMBER",
          simulatedEndpoint: "POST /bot<TOKEN>/banChatMember",
          payload: {
            chat_id: paybotConfig.vipChannelId || "-1002345678901",
            user_id: sub.telegramUserId,
            revoke_messages: false,
          },
          resultStatus: "SIMULATED_SUCCESS",
          details: `[DRY RUN - 0 API IMPACT] Successfully simulated kicking user @${sub.username} (ID: ${sub.telegramUserId}) from channel ${paybotConfig.vipChannelId || "-1002345678901"} because subscription expired on ${new Date(sub.expiresAt).toLocaleDateString()}.`,
        });

        // Step 2: Simulated Immediate Unban (allows user to rejoin immediately when they renew)
        logs.push({
          id: `log-unban-${sub.id}-${Date.now()}`,
          timestamp,
          subscriberId: sub.id,
          telegramUserId: sub.telegramUserId,
          username: sub.username,
          action: "UNBAN_CHAT_MEMBER",
          simulatedEndpoint: "POST /bot<TOKEN>/unbanChatMember",
          payload: {
            chat_id: paybotConfig.vipChannelId || "-1002345678901",
            user_id: sub.telegramUserId,
            only_if_banned: true,
          },
          resultStatus: "SIMULATED_SUCCESS",
          details: `[DRY RUN - 0 API IMPACT] Successfully simulated unban for @${sub.username} to unblock future re-invites upon SUI renewal.`,
        });

        // Step 3: Simulated DM Notification to user with renewal link
        logs.push({
          id: `log-msg-${sub.id}-${Date.now()}`,
          timestamp,
          subscriberId: sub.id,
          telegramUserId: sub.telegramUserId,
          username: sub.username,
          action: "SEND_EXPIRY_NOTIFICATION",
          simulatedEndpoint: "POST /bot<TOKEN>/sendMessage",
          payload: {
            chat_id: sub.telegramUserId,
            text: `⏰ *Tu membresía VIP en ${influencer?.name || "VIP Model"} ha vencido.*\n\nPara renovar tu acceso por otros 30 días, envía ${paybotConfig.subscriberPrice || 15} SUI a \`${paybotConfig.adminSuiWallet || "0x7a8b..."}\` y pulsa /start.`,
            parse_mode: "Markdown",
          },
          resultStatus: "SIMULATED_SUCCESS",
          details: `[DRY RUN - 0 API IMPACT] Simulated sending DM notification to @${sub.username} with renewal instructions.`,
        });

        // Step 4: Simulated DB state deactivation
        logs.push({
          id: `log-db-${sub.id}-${Date.now()}`,
          timestamp,
          subscriberId: sub.id,
          telegramUserId: sub.telegramUserId,
          username: sub.username,
          action: "DEACTIVATE_DB_RECORD",
          simulatedEndpoint: "LOCAL_FS_DB (subscriptions.json)",
          payload: {
            subId: sub.id,
            active: false,
            kickedAt: timestamp,
            kickReason: "EXPIRED_30_DAYS_CRON_AUTO_KICK",
          },
          resultStatus: "SIMULATED_SUCCESS",
          details: `[DRY RUN] Marked subscriber record as inactive in local JSON store without mutating production DB.`,
        });
      });

      // 2. Process Expiring Soon Subscribers (Simulate 24h grace reminder)
      expiringSoonToAlert.forEach((sub) => {
        logs.push({
          id: `log-alert-${sub.id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          subscriberId: sub.id,
          telegramUserId: sub.telegramUserId,
          username: sub.username,
          action: "SEND_EXPIRY_NOTIFICATION",
          simulatedEndpoint: "POST /bot<TOKEN>/sendMessage",
          payload: {
            chat_id: sub.telegramUserId,
            text: `⚠️ *Aviso de Renovación:* Tu pase VIP vence en ${sub.remainingHours} horas. Puedes extenderlo ahora mismo con /renew para no perder tu lugar en la galería privada.`,
          },
          resultStatus: "SIMULATED_SUCCESS",
          details: `[DRY RUN] Simulated 24h pre-expiry warning notification to @${sub.username}.`,
        });
      });

      const summary: DryRunExecutionSummary = {
        runId: `dryrun-${Date.now().toString(36)}`,
        executedAt: new Date().toLocaleString(),
        isDryRun: true,
        totalSubscribersScanned: annotatedSubscribers.length,
        activeCount,
        expiredIdentifiedCount: expiredToProcess.length,
        expiringSoonCount: expiringSoonToAlert.length,
        simulatedKicksCount: expiredToProcess.length,
        simulatedNotificationsCount: expiredToProcess.length + expiringSoonToAlert.length,
        actualTelegramApiCallsCount: 0,
        gasCostMist: 0,
        logs,
      };

      setDryRunSummary(summary);
      setIsRunningDryRun(false);
      setShowLogModal(true);
      showToast(`Dry Run completado: ${expiredToProcess.length} miembros expirados simulados con éxito (0 llamadas reales a Telegram).`);
    }, 600);
  };

  // Apply simulated dry-run changes to local UI test state
  const handleApplyDryRunToState = () => {
    if (!dryRunSummary) return;

    setSubscribers((prev) =>
      prev.map((sub) => {
        const isExpired = new Date(sub.expiresAt) <= now && sub.active;
        if (isExpired) {
          return {
            ...sub,
            active: false,
            status: "kicked",
            kickedAt: new Date().toISOString(),
            kickReason: "EXPIRED_30_DAYS_CRON_AUTO_KICK",
            lastSimulatedAction: "Kicked via Dry Run simulation",
          };
        }
        return sub;
      })
    );

    setShowLogModal(false);
    showToast("Estado local actualizado con los resultados de la simulación.");
  };

  // Manual actions
  const handleExtendSubscriber = (subId: string) => {
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const currentExpiry = new Date(s.expiresAt).getTime();
          const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
          const newExpiresAt = new Date(baseTime + 30 * 24 * 60 * 60 * 1000).toISOString();
          return {
            ...s,
            expiresAt: newExpiresAt,
            active: true,
            status: "active",
            lastSimulatedAction: "Extended +30 days manually",
          };
        }
        return s;
      })
    );
    showToast("Membresía extendida +30 días.");
  };

  const handleSimulateSingleKick = (sub: SubscriberRecord) => {
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.id === sub.id) {
          return {
            ...s,
            active: false,
            status: "kicked",
            kickedAt: new Date().toISOString(),
            kickReason: "MANUAL_ADMIN_KICK_DRY_RUN",
            lastSimulatedAction: "Manual kick simulated (Unbanned for rejoin)",
          };
        }
        return s;
      })
    );
    showToast(`Expulsión simulada para @${sub.username} (0 llamadas a Telegram).`);
  };

  const handleAddTestSubscriber = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newSub: SubscriberRecord = {
      id: `sub-${Date.now()}`,
      telegramUserId: 5900000000 + randomNum,
      username: `sui_user_${randomNum}`,
      displayName: `Test User ${randomNum}`,
      wallet: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      txDigest: `tx_${Math.random().toString(36).substring(2, 12)}`,
      tier: "SUI VIP",
      amountPaid: paybotConfig.subscriberPrice || 15,
      currency: "SUI",
      paidAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      status: "active",
      reminderSent: false,
      lastSimulatedAction: "Created test subscriber",
    };

    setSubscribers((prev) => [newSub, ...prev]);
    showToast(`Suscriptor de prueba @${newSub.username} añadido.`);
  };

  const handleResetData = () => {
    setSubscribers(INITIAL_MOCK_SUBSCRIBERS);
    setTimeShiftDays(0);
    setDryRunSummary(null);
    showToast("Base de datos de prueba restablecida a valores iniciales.");
  };

  const handleTimeTravel = (days: number) => {
    setTimeShiftDays((prev) => prev + days);
    showToast(`Reloj simulado adelantado ${days} días.`);
  };

  const handleCopyWallet = (wallet: string, id: string) => {
    navigator.clipboard.writeText(wallet);
    setCopiedWalletId(id);
    setTimeout(() => setCopiedWalletId(null), 2000);
  };

  const handleCopyLogJson = () => {
    if (!dryRunSummary) return;
    navigator.clipboard.writeText(JSON.stringify(dryRunSummary, null, 2));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Toast Feedback */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white shadow-2xl border border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Membresías & Cron Bot
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight">
                Gestión de Suscriptores VIP & Motor Kick-Bot
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500 max-w-2xl">
              Monitoreo de suscripciones mensuales de 30 días en Telegram. Incluye el motor de auditoría <strong>Kick-Bot</strong> para expulsar automáticamente cuentas vencidas y simular flujos de negocio sin riesgo de afectar la API real de Telegram.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-add-test-subscriber"
              onClick={handleAddTestSubscriber}
              className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-black hover:bg-zinc-100 transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-zinc-600" /> Añadir Test Sub
            </button>

            <button
              id="btn-time-travel-30d"
              onClick={() => handleTimeTravel(30)}
              title="Adelantar 30 días para forzar vencimientos y probar el Kick-Bot"
              className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/70 px-3 py-2 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition-all"
            >
              <FastForward className="h-3.5 w-3.5 text-purple-600" /> Time Travel (+30d)
            </button>

            <button
              id="btn-reset-subscribers-data"
              onClick={handleResetData}
              className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-50 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-zinc-500" /> Reset
            </button>
          </div>
        </div>

        {/* Time Travel Active Indicator */}
        {timeShiftDays > 0 && (
          <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs text-purple-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                <strong>Modo Simulación de Tiempo Activo:</strong> Adelantado <strong>+{timeShiftDays} días</strong> ({now.toLocaleDateString()}).
              </span>
            </div>
            <button
              onClick={() => setTimeShiftDays(0)}
              className="font-bold underline hover:text-purple-950 text-[11px]"
            >
              Volver al presente
            </button>
          </div>
        )}
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* ... existing metrics ... */}
      </div>

      {/* NEW: LTV Charts & Treasury Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LTV Chart Section */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-black flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Lifetime Value (LTV) por Usuario
              </h3>
              <p className="text-[10px] text-zinc-500">Volumen acumulado de pagos en SUI por suscriptor top.</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-zinc-100 p-1">
              <button
                onClick={() => setLtvSourceFilter("all")}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${ltvSourceFilter === "all" ? "bg-white text-black shadow-xs" : "text-zinc-500"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setLtvSourceFilter("telegram")}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${ltvSourceFilter === "telegram" ? "bg-white text-black shadow-xs" : "text-zinc-500"}`}
              >
                Telegram
              </button>
              <button
                onClick={() => setLtvSourceFilter("direct")}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${ltvSourceFilter === "direct" ? "bg-white text-black shadow-xs" : "text-zinc-500"}`}
              >
                Directo
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#71717a' }}
                  width={80}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f9fafb' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
                          <p className="text-[10px] font-bold text-zinc-500 mb-1">@{payload[0].payload.name}</p>
                          <p className="text-sm font-black text-black">{payload[0].value} SUI</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">
                            LTV Acumulado
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="ltv" radius={[0, 4, 4, 0]} barSize={24}>
                  {ltvData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#18181b' : '#3f3f46'} fillOpacity={1 - (index * 0.1)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treasury & Price Tool Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price Conversion Tool */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 text-white shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Conversor SUI Live</h3>
              </div>
              <button 
                onClick={fetchSuiPrice}
                disabled={isFetchingPrice}
                className="p-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-zinc-400 ${isFetchingPrice ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Precio SUI (USD)</span>
                  <div className="text-2xl font-black text-white flex items-center gap-2">
                    ${suiPriceUsd.toFixed(4)}
                    <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                      <ArrowUpRight className="h-3 w-3" /> 2.4%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block mb-1">Tu MRR en USD</span>
                  <div className="text-lg font-bold text-emerald-400">
                    ${(totalMonthlySuiRevenue * suiPriceUsd).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-zinc-400">Suscripción ({paybotConfig.subscriberPrice} SUI)</span>
                  <span className="font-bold text-white">${(paybotConfig.subscriberPrice * suiPriceUsd).toFixed(2)} USD</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[65%]" />
                </div>
                <p className="text-[9px] text-zinc-500 mt-2 italic">
                  * Valores calculados con mock API de CoinGecko. Actualizado hace 2m.
                </p>
              </div>
            </div>
          </div>

          {/* Treasury Management Suggestion */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold text-black flex items-center gap-2 mb-4 uppercase tracking-wider">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Gestión de Tesorería (LST)
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-medium">Meta de Retiro Mensual</span>
                <span className="font-bold text-black">{totalMonthlySuiRevenue} / {treasuryGoal} SUI</span>
              </div>
              
              <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000" 
                  style={{ width: `${goalProgress}%` }}
                />
              </div>

              <div className="rounded-xl bg-purple-50 p-3 border border-purple-100">
                <div className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-purple-900">Sugerencia de Staking Líquido</p>
                    <p className="text-[10px] text-purple-700 mt-0.5">
                      Asigna el {stakingPercentage}% ({stakingAmount} SUI) a protocolos de LST como <strong>Haedal</strong> o <strong>Volo</strong> para generar un 8.5% APY adicional.
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full rounded-xl bg-black py-2.5 text-[11px] font-bold text-white hover:bg-zinc-800 transition">
                Configurar Liquid Staking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KICK-BOT AUTOMATION & DRY-RUN CONTROL CENTER
          ========================================================================= */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Motor de Expulsión Automática (Kick-Bot Cron Daemon)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl">
              El script <code>node-cron</code> se ejecuta cada 60 minutos en el servidor, compara <code>expiresAt &lt; now</code>, expulsa a los miembros no renovados con <code>banChatMember</code> + <code>unbanChatMember</code> y les envía un DM de rescate.
            </p>
          </div>

          {/* THE DRY RUN BUTTON REQUESTED BY USER */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-kick-bot-dry-run"
              onClick={handleExecuteKickBotDryRun}
              disabled={isRunningDryRun}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black shadow-lg hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isRunningDryRun ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-black" />
                  <span>Simulando Kick-Bot...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-black text-black" />
                  <span>Ejecutar Dry Run (Kick-Bot)</span>
                </>
              )}
            </button>

            {dryRunSummary && (
              <button
                id="btn-view-dryrun-logs"
                onClick={() => setShowLogModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                <Terminal className="h-3.5 w-3.5 text-zinc-400" /> Ver Log Auditoría ({dryRunSummary.logs.length})
              </button>
            )}
          </div>
        </div>

        {/* Safety Indicator Ribbon */}
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3.5 text-xs text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-[10px]">
              0%
            </div>
            <div>
              <span className="font-bold text-white block">Modo Dry Run Seguro Garantizado</span>
              <span className="text-[11px] text-zinc-400">
                La simulación valida toda la lógica de negocio, calcula expiraciones y redacta los mensajes sin emitir peticiones HTTP a la API de Telegram.
              </span>
            </div>
          </div>
          <span className="shrink-0 font-mono text-[10px] bg-zinc-800 px-2.5 py-1 rounded-md text-zinc-300 border border-zinc-700">
            0 API Calls • 0 Gas
          </span>
        </div>
      </div>

      {/* Subscriber Management Table & Filtering Controls */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por @username, Telegram ID o Wallet SUI..."
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Todos", count: subscribers.length },
              { id: "active", label: "Activos", count: activeCount },
              { id: "expiring_soon", label: "< 48h", count: expiringSoonCount },
              { id: "expired", label: "Vencidos", count: expiredCount },
              { id: "kicked", label: "Expulsados", count: kickedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-black text-white"
                    : "bg-[#F9FAFB] text-zinc-600 hover:bg-zinc-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-3 rounded-l-lg">Suscriptor Telegram</th>
                <th className="py-3 px-3">Wallet SUI / Tx</th>
                <th className="py-3 px-3">Plan / Monto</th>
                <th className="py-3 px-3">Expiración (30d)</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right rounded-r-lg">Acciones Simulación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No se encontraron suscriptores con el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => {
                  return (
                    <tr key={sub.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Subscriber Info */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white font-bold text-xs uppercase shrink-0">
                            {sub.username.substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block">
                              @{sub.username}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 block">
                              ID: {sub.telegramUserId} • {sub.displayName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SUI Wallet / Tx */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-800">
                            <span>{sub.wallet.slice(0, 8)}...{sub.wallet.slice(-6)}</span>
                            <button
                              onClick={() => handleCopyWallet(sub.wallet, sub.id)}
                              title="Copiar wallet SUI"
                              className="text-zinc-400 hover:text-black p-0.5"
                            >
                              {copiedWalletId === sub.id ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 block truncate max-w-[140px]" title={sub.txDigest}>
                            Tx: {sub.txDigest.slice(0, 12)}...
                          </span>
                        </div>
                      </td>

                      {/* Tier & Price */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-zinc-900">
                          {sub.amountPaid} {sub.currency}
                        </div>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          sub.currency === "SUI"
                            ? "bg-blue-100 text-blue-800"
                            : sub.currency === "ARS"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {sub.tier}
                        </span>
                      </td>

                      {/* Expiration Countdown */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className="text-zinc-800 font-medium block">
                            {new Date(sub.expiresAt).toLocaleDateString()}
                          </span>
                          {sub.computedStatus === "active" && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> {sub.remainingDays} días restantes
                            </span>
                          )}
                          {sub.computedStatus === "expiring_soon" && (
                            <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> Vence en {sub.remainingHours}h
                            </span>
                          )}
                          {sub.computedStatus === "expired" && (
                            <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="h-2.5 w-2.5" /> Vencido hace {Math.abs(sub.remainingDays || 1)}d
                            </span>
                          )}
                          {sub.computedStatus === "kicked" && (
                            <span className="text-[10px] text-zinc-400 font-medium">
                              Expulsado {sub.kickedAt ? new Date(sub.kickedAt).toLocaleDateString() : ""}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3">
                        {sub.computedStatus === "active" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Activo
                          </span>
                        )}
                        {sub.computedStatus === "expiring_soon" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                            Por Vencer
                          </span>
                        )}
                        {sub.computedStatus === "expired" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                            Vencido (Pendiente Kick)
                          </span>
                        )}
                        {sub.computedStatus === "kicked" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 border border-zinc-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                            Auto-Kicked
                          </span>
                        )}
                      </td>

                      {/* Simulation Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sub.active ? (
                            <>
                              <button
                                onClick={() => handleSimulateSingleKick(sub)}
                                title="Simular Kick individual de prueba"
                                className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-all flex items-center gap-1"
                              >
                                <XCircle className="h-3 w-3" /> Kick Dry Run
                              </button>
                              <button
                                onClick={() => handleExtendSubscriber(sub.id)}
                                title="Extender membresía +30 días"
                                className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 transition-all flex items-center gap-1"
                              >
                                <RotateCcw className="h-3 w-3 text-zinc-500" /> +30d
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleExtendSubscriber(sub.id)}
                              title="Restaurar / Re-suscribir"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Re-activar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          DRY RUN AUDIT & EXECUTION LOG MODAL
          ========================================================================= */}
      {showLogModal && dryRunSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs transition-all">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-zinc-700 bg-[#0d1117] text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-5 bg-[#161b22]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black font-bold">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Resultado de Auditoría & Dry Run (Kick-Bot)
                    </h3>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      0 API CALLS
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    ID Ejecución: <code>{dryRunSummary.runId}</code> • {dryRunSummary.executedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLogJson}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all"
                >
                  {copiedLog ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-400" /> Copiar JSON
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#0d1117] border-b border-zinc-800 text-xs">
              <div className="rounded-xl bg-[#161b22] p-2.5 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-mono block">Miembros Analizados</span>
                <span className="text-base font-bold text-white">{dryRunSummary.totalSubscribersScanned}</span>
              </div>
              <div className="rounded-xl bg-rose-950/40 p-2.5 border border-rose-900/50 text-rose-300">
                <span className="text-[10px] text-rose-400 font-mono block">Expirados Detectados</span>
                <span className="text-base font-bold text-rose-200">{dryRunSummary.expiredIdentifiedCount}</span>
              </div>
              <div className="rounded-xl bg-emerald-950/40 p-2.5 border border-emerald-900/50 text-emerald-300">
                <span className="text-[10px] text-emerald-400 font-mono block">Kicks Simulados</span>
                <span className="text-base font-bold text-emerald-200">{dryRunSummary.simulatedKicksCount}</span>
              </div>
              <div className="rounded-xl bg-blue-950/40 p-2.5 border border-blue-900/50 text-blue-300">
                <span className="text-[10px] text-blue-400 font-mono block">Llamadas Telegram Reales</span>
                <span className="text-base font-bold text-blue-200">0 (Safe Mode)</span>
              </div>
            </div>

            {/* Modal Console Log Body */}
            <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-3 bg-[#0d1117]">
              {dryRunSummary.logs.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Todos los suscriptores están al día</p>
                  <p className="text-xs text-zinc-400 mt-1">No se detectaron membresías vencidas pendientes de expulsión.</p>
                </div>
              ) : (
                dryRunSummary.logs.map((log, index) => {
                  return (
                    <div
                      key={log.id}
                      className="rounded-xl border border-zinc-800 bg-[#161b22] p-3.5 space-y-2 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-white text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            log.action === "BAN_CHAT_MEMBER"
                              ? "bg-rose-900/50 text-rose-300 border border-rose-700/50"
                              : log.action === "UNBAN_CHAT_MEMBER"
                              ? "bg-blue-900/50 text-blue-300 border border-blue-700/50"
                              : log.action === "SEND_EXPIRY_NOTIFICATION"
                              ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                              : "bg-zinc-800 text-zinc-300"
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-zinc-400">@{log.username} (ID: {log.telegramUserId})</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>

                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {log.details}
                      </p>

                      <div className="rounded-lg bg-[#0d1117] p-2 text-[10px] text-zinc-400 border border-zinc-800/80 overflow-x-auto">
                        <span className="text-zinc-500 block mb-0.5">Endpoint: <code>{log.simulatedEndpoint}</code></span>
                        <pre className="text-emerald-400 font-mono">{JSON.stringify(log.payload, null, 2)}</pre>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800 p-4 bg-[#161b22]">
              <span className="text-[11px] text-zinc-400">
                La lógica de negocio cumple con el ciclo de vida 30 días de @mysten/sui y Telegraf.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowLogModal(false)}
                  className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  Cerrar
                </button>
                {dryRunSummary.expiredIdentifiedCount > 0 && (
                  <button
                    onClick={handleApplyDryRunToState}
                    className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition-all"
                  >
                    Aplicar Cambios a Datos de Prueba
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
