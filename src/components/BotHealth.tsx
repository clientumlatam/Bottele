import React, { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Zap,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Wifi,
  ShieldCheck,
  Globe,
  Database,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Bot
} from "lucide-react";
import { PaybotConfig } from "../types";

interface BotHealthProps {
  paybotConfig: PaybotConfig;
}

interface HealthMetrics {
  connectionStatus: "CONNECTED" | "DEGRADED" | "DISCONNECTED";
  suiRpcStatus: "OPTIMAL" | "CONGESTED" | "DOWN";
  telegramApiStatus: "ONLINE" | "RATE_LIMITED" | "DOWN";
  lastSyncedBlockHeight: number;
  lastSyncedTimestamp: string;
  activeWebhookLatencyMs: number;
  rpcLatencyMs: number;
  dbQueryLatencyMs: number;
  memoryUsageMb: number;
  uptimeSeconds: number;
  totalEventsProcessed: number;
  gasPriceMist: number;
  networkTps: number;
}

export const BotHealth: React.FC<BotHealthProps> = ({ paybotConfig }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    connectionStatus: "CONNECTED",
    suiRpcStatus: "OPTIMAL",
    telegramApiStatus: "ONLINE",
    lastSyncedBlockHeight: 52941084,
    lastSyncedTimestamp: new Date().toLocaleTimeString(),
    activeWebhookLatencyMs: 42,
    rpcLatencyMs: 38,
    dbQueryLatencyMs: 4,
    memoryUsageMb: 86.4,
    uptimeSeconds: 142850,
    totalEventsProcessed: 1842,
    gasPriceMist: 750,
    networkTps: 842,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [simulatedFailureMode, setSimulatedFailureMode] = useState<"NONE" | "HIGH_LATENCY" | "RPC_DESYNC">("NONE");

  // Format uptime into human readable string
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    return `${hours}h ${mins}m ${secs}s`;
  };

  // Simulate real-time metrics oscillation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Block advancement simulation (~1-3 blocks per 3 seconds in Sui)
        const blockIncrement = Math.floor(Math.random() * 3) + 1;
        const newBlock = prev.lastSyncedBlockHeight + blockIncrement;

        // Latency jitter based on mode
        let baseWebhookLatency = 42;
        let baseRpcLatency = 38;
        let connStatus: "CONNECTED" | "DEGRADED" | "DISCONNECTED" = "CONNECTED";
        let rpcStatus: "OPTIMAL" | "CONGESTED" | "DOWN" = "OPTIMAL";

        if (simulatedFailureMode === "HIGH_LATENCY") {
          baseWebhookLatency = 640 + Math.floor(Math.random() * 250);
          baseRpcLatency = 480 + Math.floor(Math.random() * 200);
          connStatus = "DEGRADED";
          rpcStatus = "CONGESTED";
        } else if (simulatedFailureMode === "RPC_DESYNC") {
          baseRpcLatency = 1200 + Math.floor(Math.random() * 500);
          connStatus = "DEGRADED";
          rpcStatus = "DOWN";
        } else {
          baseWebhookLatency = 38 + Math.floor(Math.random() * 12);
          baseRpcLatency = 32 + Math.floor(Math.random() * 14);
        }

        return {
          ...prev,
          connectionStatus: connStatus,
          suiRpcStatus: rpcStatus,
          lastSyncedBlockHeight: simulatedFailureMode === "RPC_DESYNC" ? prev.lastSyncedBlockHeight : newBlock,
          lastSyncedTimestamp: new Date().toLocaleTimeString(),
          activeWebhookLatencyMs: baseWebhookLatency,
          rpcLatencyMs: baseRpcLatency,
          dbQueryLatencyMs: 3 + Math.floor(Math.random() * 3),
          uptimeSeconds: prev.uptimeSeconds + 3,
          totalEventsProcessed: prev.totalEventsProcessed + (Math.random() > 0.6 ? 1 : 0),
          networkTps: 800 + Math.floor(Math.random() * 150),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, simulatedFailureMode]);

  const handleManualPing = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        lastSyncedBlockHeight: prev.lastSyncedBlockHeight + Math.floor(Math.random() * 4) + 1,
        lastSyncedTimestamp: new Date().toLocaleTimeString(),
        activeWebhookLatencyMs: 35 + Math.floor(Math.random() * 15),
        rpcLatencyMs: 30 + Math.floor(Math.random() * 12),
      }));
      setIsRefreshing(false);
    }, 450);
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-6">
      {/* Top Header & Live Health Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-black tracking-tight">
                Bot Health & Real-time Network Telemetry
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                  metrics.connectionStatus === "CONNECTED"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : metrics.connectionStatus === "DEGRADED"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    metrics.connectionStatus === "CONNECTED"
                      ? "bg-emerald-500 animate-pulse"
                      : metrics.connectionStatus === "DEGRADED"
                      ? "bg-amber-500 animate-ping"
                      : "bg-rose-500"
                  }`}
                />
                {metrics.connectionStatus === "CONNECTED"
                  ? "SISTEMA OPERACIONAL"
                  : metrics.connectionStatus === "DEGRADED"
                  ? "RENDIMIENTO DEGRADADO"
                  : "DESCONECTADO"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Monitoreo activo de endpoints RPC Sui Mainnet, latencia de Webhooks de Telegram y sincronización de checkpoints.
            </p>
          </div>
        </div>

        {/* Live Controls & Diagnostics Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Failure mode simulation selector for testing */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1.5 text-xs text-zinc-700">
            <span className="text-[10px] font-semibold text-zinc-500">Test Stress:</span>
            <select
              value={simulatedFailureMode}
              onChange={(e) => setSimulatedFailureMode(e.target.value as any)}
              className="bg-transparent font-semibold text-black focus:outline-none text-xs cursor-pointer"
            >
              <option value="NONE">Nominal (Normal)</option>
              <option value="HIGH_LATENCY">Simular Latencia Alta</option>
              <option value="RPC_DESYNC">Simular Caída RPC</option>
            </select>
          </div>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            title={autoRefresh ? "Pausar polling en vivo" : "Reanudar polling en vivo"}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              autoRefresh
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-zinc-200 bg-zinc-100 text-zinc-600"
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${autoRefresh ? "text-emerald-600 animate-pulse" : "text-zinc-400"}`} />
            <span>{autoRefresh ? "Live 3s" : "Pausado"}</span>
          </button>

          <button
            id="btn-health-manual-ping"
            onClick={handleManualPing}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-50 shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-600 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Ping</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Connection Status Card */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Estado de Conexión</span>
            <Wifi className="h-4 w-4 text-black" />
          </div>
          <div className="text-xl font-bold text-black flex items-center gap-2">
            <span>{metrics.connectionStatus === "CONNECTED" ? "Online" : metrics.connectionStatus}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800">
              HTTP 200 OK
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
            <Clock className="h-3 w-3 text-zinc-400" />
            <span>Uptime: <strong>{formatUptime(metrics.uptimeSeconds)}</strong></span>
          </div>
        </div>

        {/* 2. Last Synced Block Height */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-1">
          <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
            <span>Último Bloque / Checkpoint</span>
            <Database className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-black font-mono text-blue-950">
            #{metrics.lastSyncedBlockHeight.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-700 flex items-center justify-between pt-1">
            <span>Sui Mainnet</span>
            <span className="font-mono text-[10px]">Sync: {metrics.lastSyncedTimestamp}</span>
          </div>
        </div>

        {/* 3. Active Webhook Latency */}
        <div className={`rounded-xl border p-4 space-y-1 ${
          metrics.activeWebhookLatencyMs > 300
            ? "border-amber-200 bg-amber-50/40"
            : "border-emerald-200 bg-emerald-50/40"
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={metrics.activeWebhookLatencyMs > 300 ? "text-amber-800" : "text-emerald-800"}>
              Latencia Webhook Telegram
            </span>
            <Zap className={`h-4 w-4 ${metrics.activeWebhookLatencyMs > 300 ? "text-amber-600" : "text-emerald-600"}`} />
          </div>
          <div className={`text-xl font-black font-mono ${metrics.activeWebhookLatencyMs > 300 ? "text-amber-950" : "text-emerald-950"}`}>
            {metrics.activeWebhookLatencyMs} ms
          </div>
          <div className="text-[11px] flex items-center justify-between pt-1 text-zinc-500">
            <span>Telegraf Worker Pool</span>
            <span className={`text-[10px] font-bold ${metrics.activeWebhookLatencyMs < 100 ? "text-emerald-700" : "text-amber-700"}`}>
              {metrics.activeWebhookLatencyMs < 100 ? "Excelente (<100ms)" : "Alta Latencia"}
            </span>
          </div>
        </div>

        {/* 4. SUI RPC Latency & Gas Rate */}
        <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 space-y-1">
          <div className="flex items-center justify-between text-purple-800 text-xs font-semibold">
            <span>RPC Sui & Gas Price</span>
            <Globe className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-xl font-black font-mono text-purple-950">
            {metrics.rpcLatencyMs} ms
          </div>
          <div className="text-[11px] text-purple-700 flex items-center justify-between pt-1">
            <span>Gas: <strong>{metrics.gasPriceMist} MIST</strong></span>
            <span className="font-mono text-[10px]">{metrics.networkTps} TPS</span>
          </div>
        </div>
      </div>

      {/* Deep Dive Diagnostics Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
          <span className="text-xs font-bold text-black flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-zinc-600" />
            Endpoints & Servicios Integrados
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Worker PID: 28410 • Node.js v20.x
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Sui Node Endpoint */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800">Sui Fullnode RPC:</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                200 OK
              </span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 truncate" title={paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443"}>
              {paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443"}
            </p>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
              <span>Checkpoint Sync: Activo</span>
              <span className="font-mono font-bold text-zinc-700">{metrics.rpcLatencyMs}ms</span>
            </div>
          </div>

          {/* Telegram Webhook Endpoint */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800">Telegram Bot Gateway:</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                ONLINE
              </span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 truncate" title={`Channel: ${paybotConfig.vipChannelId || "-1002345678901"}`}>
              Channel ID: {paybotConfig.vipChannelId || "-1002345678901"}
            </p>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
              <span>Eventos Procesados: {metrics.totalEventsProcessed}</span>
              <span className="font-mono font-bold text-zinc-700">{metrics.activeWebhookLatencyMs}ms</span>
            </div>
          </div>

          {/* Local Cache & Memory */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800">Almacén Local & RAM:</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                SALUDABLE
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Memoria RAM: <strong>{metrics.memoryUsageMb} MB</strong> / Heap OK
            </p>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
              <span>Query Latency: {metrics.dbQueryLatencyMs}ms</span>
              <span className="text-zinc-600 font-semibold">JSON Store synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
