import React, { useState, useEffect, useCallback } from "react";
import { Wallet, RefreshCw, ExternalLink, ArrowUpRight, ShieldCheck, DollarSign, CheckCircle2, AlertCircle, CreditCard, Sparkles } from "lucide-react";

interface WalletBalanceCheckerProps {
  adminSuiWallet: string;
  suiRpcUrl: string;
  tokenType?: "SUI" | "USDC";
  subscriberPrice?: number;
  arsSubscriberPrice?: number;
}

export const WalletBalanceChecker: React.FC<WalletBalanceCheckerProps> = ({
  adminSuiWallet,
  suiRpcUrl,
  tokenType = "SUI",
  subscriberPrice = 15,
  arsSubscriberPrice = 18500,
}) => {
  const [loading, setLoading] = useState(false);
  const [balanceSui, setBalanceSui] = useState<number | null>(428.5);
  const [isLiveRpc, setIsLiveRpc] = useState(false);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  
  // Market conversion rates
  const suiUsdPrice = 1.62;
  const usdArsPrice = 1240;

  const fetchSuiBalance = useCallback(async () => {
    if (!adminSuiWallet || !adminSuiWallet.startsWith("0x")) {
      setRpcError("Dirección SUI no válida. Formato esperado: 0x...");
      setIsLiveRpc(false);
      return;
    }

    setLoading(true);
    setRpcError(null);

    try {
      const response = await fetch(suiRpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_getBalance",
          params: [adminSuiWallet, "0x2::sui::SUI"],
        }),
      });

      const data = await response.json();

      if (data && data.result && data.result.totalBalance !== undefined) {
        const mistValue = BigInt(data.result.totalBalance);
        const suiValue = Number(mistValue) / 1e9;
        setBalanceSui(suiValue);
        setIsLiveRpc(true);
        setLastUpdated(new Date());
      } else if (data.error) {
        setRpcError(`Error RPC: ${data.error.message || "Respuesta inválida"}`);
        setIsLiveRpc(false);
      } else {
        // RPC might require CORS or specific params, fallback gracefully
        setIsLiveRpc(false);
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      console.log("Sui RPC balance fetch fallback active:", err);
      setRpcError("No se pudo conectar al RPC Mainnet. Mostrando balance local sim.");
      setIsLiveRpc(false);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [adminSuiWallet, suiRpcUrl]);

  useEffect(() => {
    fetchSuiBalance();
  }, [fetchSuiBalance]);

  const currentSui = balanceSui ?? 0;
  const totalUsd = currentSui * suiUsdPrice;
  const totalArs = totalUsd * usdArsPrice;
  const estimatedSubs = Math.floor(currentSui / (subscriberPrice || 15));

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-black p-2 text-white">
            <Wallet className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight">
              Verificador de Saldo Sui RPC & Monetización
            </h3>
            <p className="text-[11px] text-zinc-500">
              Estado financiero en tiempo real de la wallet receptora del Paybot
            </p>
          </div>
        </div>

        <button
          id="btn-refresh-sui-balance"
          onClick={fetchSuiBalance}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-100 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-cyan-600" : ""}`} />
          <span>Refrescar</span>
        </button>
      </div>

      {/* Wallet Address & Status Bar */}
      <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-zinc-500 shrink-0">Admin Wallet:</span>
          <span className="font-mono text-black font-medium truncate max-w-[200px] sm:max-w-xs">
            {adminSuiWallet || "0x..."}
          </span>
          <a
            href={`https://suiscan.xyz/mainnet/account/${adminSuiWallet}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver en SuiScan"
            className="text-zinc-400 hover:text-black transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          {isLiveRpc ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Conectado Mainnet RPC
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              <AlertCircle className="h-3 w-3" />
              RPC Standby / Sim.
            </span>
          )}
          {lastUpdated && (
            <span className="text-[10px] text-zinc-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {rpcError && (
        <div className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>{rpcError}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: SUI Balance */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] font-semibold">
            <span>Saldo Acumulado SUI</span>
            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[9px] text-cyan-800 font-bold">
              Layer 1
            </span>
          </div>
          <div className="mt-1.5 text-xl font-black text-black tracking-tight flex items-baseline gap-1">
            {currentSui.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            <span className="text-xs font-bold text-cyan-600">SUI</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-medium">
            ≈ ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </div>
        </div>

        {/* Metric 2: Mercado Pago ARS */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] font-semibold">
            <span>Equivalente Mercado Pago</span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] text-blue-800 font-bold flex items-center gap-0.5">
              <CreditCard className="h-2.5 w-2.5" /> MP ARS
            </span>
          </div>
          <div className="mt-1.5 text-xl font-black text-blue-900 tracking-tight">
            ${totalArs.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
            <span className="text-xs font-bold text-zinc-500 ml-1">ARS</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-medium">
            ≈ ${arsSubscriberPrice.toLocaleString("es-AR")} ARS / suscripción
          </div>
        </div>

        {/* Metric 3: Subscriptions Count */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] font-semibold">
            <span>Suscripciones VIP Estimadas</span>
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] text-green-800 font-bold">
              VIP Channel
            </span>
          </div>
          <div className="mt-1.5 text-xl font-black text-green-700 tracking-tight">
            {estimatedSubs} <span className="text-xs font-bold text-zinc-500">suscriptores</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-medium">
            basado en {subscriberPrice} SUI / mes
          </div>
        </div>
      </div>

      {/* Mercado Pago Argentina Integration Highlight Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-900 via-sky-900 to-black p-4 text-white space-y-2 border border-blue-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider border border-cyan-400/30">
              Integración Mercado Pago Argentina
            </span>
            <span className="text-[10px] text-blue-200">Cobros en ARS + SUI Web3</span>
          </div>
          <Sparkles className="h-4 w-4 text-cyan-300" />
        </div>
        <p className="text-xs text-blue-100 leading-relaxed">
          Permite a tus usuarios argentinos pagar en pesos argentinos (ARS) mediante <strong>Mercado Pago (QR, Checkout Pro o Alias)</strong>. El Webhook de Node.js procesa la notificación IPN e interactúa con la API de Telegram para emitir el enlace de acceso VIP de 1 solo uso automáticamente.
        </p>
      </div>
    </div>
  );
};
