import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Sliders, 
  CreditCard, 
  CheckCircle2, 
  Calculator,
  ArrowUpRight,
  Flame,
  HelpCircle
} from "lucide-react";
import { PaybotConfig, AiInfluencer } from "../types";

interface ProjectedEarningsWidgetProps {
  paybotConfig?: PaybotConfig;
  onUpdateConfig?: (newConfig: PaybotConfig) => void;
  currentInfluencer?: AiInfluencer;
}

type ScenarioPreset = "conservative" | "moderate" | "viral";

export const ProjectedEarningsWidget: React.FC<ProjectedEarningsWidgetProps> = ({
  paybotConfig,
  onUpdateConfig,
  currentInfluencer,
}) => {
  // Input parameters (hydrated from paybotConfig if present, or solid presets)
  const [monthlyViews, setMonthlyViews] = useState<number>(
    paybotConfig?.estimatedMonthlyTraffic || 250000
  );
  const [freeTgRate, setFreeTgRate] = useState<number>(
    paybotConfig?.freeTelegramConversionRate || 3.5
  );
  const [vipConversionRate, setVipConversionRate] = useState<number>(
    paybotConfig?.vipConversionRate || 4.0
  );
  const [subscriberPrice, setSubscriberPrice] = useState<number>(
    paybotConfig?.subscriberPrice || (currentInfluencer?.recommendedPricing?.sui || 15)
  );
  const [tokenType, setTokenType] = useState<"SUI" | "USDC">(
    paybotConfig?.tokenType || "SUI"
  );
  const [suiPriceUsd, setSuiPriceUsd] = useState<number>(
    paybotConfig?.suiTokenPriceUsd || 3.20
  );
  
  // Fiat (Mercado Pago) mode toggles
  const [currencyMode, setCurrencyMode] = useState<"crypto" | "fiat">("crypto");
  const [arsPrice, setArsPrice] = useState<number>(
    paybotConfig?.arsSubscriberPrice || (currentInfluencer?.recommendedPricing?.ars || 18500)
  );
  const [arsToUsdRate, setArsToUsdRate] = useState<number>(1240);
  const [mpFeeRate, setMpFeeRate] = useState<number>(4.39);

  const [activePreset, setActivePreset] = useState<ScenarioPreset | "custom">("moderate");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state when incoming paybotConfig updates externally
  useEffect(() => {
    if (paybotConfig) {
      if (paybotConfig.subscriberPrice && paybotConfig.subscriberPrice !== subscriberPrice) {
        setSubscriberPrice(paybotConfig.subscriberPrice);
      }
      if (paybotConfig.tokenType) {
        setTokenType(paybotConfig.tokenType);
      }
      if (paybotConfig.suiTokenPriceUsd) {
        setSuiPriceUsd(paybotConfig.suiTokenPriceUsd);
      }
      if (paybotConfig.arsSubscriberPrice) {
        setArsPrice(paybotConfig.arsSubscriberPrice);
      }
    }
  }, [paybotConfig?.subscriberPrice, paybotConfig?.tokenType]);

  // Handle Preset Selection
  const applyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset);
    if (preset === "conservative") {
      setMonthlyViews(100000);
      setFreeTgRate(2.5);
      setVipConversionRate(2.5);
    } else if (preset === "moderate") {
      setMonthlyViews(250000);
      setFreeTgRate(3.5);
      setVipConversionRate(4.0);
    } else if (preset === "viral") {
      setMonthlyViews(1000000);
      setFreeTgRate(5.0);
      setVipConversionRate(5.5);
    }
  };

  // Funnel calculations
  const freeTelegramMembers = Math.round(monthlyViews * (freeTgRate / 100));
  const activeVipSubscribers = Math.round(freeTelegramMembers * (vipConversionRate / 100));

  // Crypto Calculations (SUI or USDC)
  const monthlyRevenueToken = activeVipSubscribers * subscriberPrice;
  const monthlyRevenueUsd = tokenType === "SUI" ? monthlyRevenueToken * suiPriceUsd : monthlyRevenueToken;
  const annualRevenueUsd = monthlyRevenueUsd * 12;
  const web2TakeCutUsd = monthlyRevenueUsd * 0.20; // 20% platform cut on traditional platforms
  const annualWeb2SavedUsd = (monthlyRevenueUsd * 0.24) * 12; // 20% cut + 4% chargeback/processing

  // Fiat Calculations (Mercado Pago)
  const monthlyGrossFiat = activeVipSubscribers * arsPrice;
  const mpFeeAmountFiat = monthlyGrossFiat * (mpFeeRate / 100);
  const monthlyNetFiat = monthlyGrossFiat - mpFeeAmountFiat;
  const monthlyGrossFiatUsd = monthlyGrossFiat / (arsToUsdRate || 1);
  const monthlyNetFiatUsd = monthlyNetFiat / (arsToUsdRate || 1);
  const annualNetFiatUsd = monthlyNetFiatUsd * 12;

  // Sync to parent config handler
  const handleSaveToPaybotConfig = () => {
    if (onUpdateConfig && paybotConfig) {
      onUpdateConfig({
        ...paybotConfig,
        subscriberPrice,
        tokenType,
        estimatedMonthlyTraffic: monthlyViews,
        freeTelegramConversionRate: freeTgRate,
        vipConversionRate,
        suiTokenPriceUsd: suiPriceUsd,
        arsSubscriberPrice: arsPrice,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div id="projected-monthly-earnings-widget" className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
      {/* Widget Header & Scenario Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white">
              <Calculator className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Projected Monthly Earnings & Funnel Yield Calculator
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
              Live Dynamic Model
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Calculá el retorno proyectado del embudo basado en tu precio por suscriptor (
            <span className="font-semibold text-zinc-800">
              {subscriberPrice} {tokenType} / mes
            </span>
            ) y tasas de conversión reales de tráfico orgánico.
          </p>
        </div>

        {/* Currency & Preset Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-zinc-100 p-1 border border-zinc-200 text-xs">
            <button
              id="btn-currency-crypto"
              onClick={() => setCurrencyMode("crypto")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all text-[11px] ${
                currencyMode === "crypto"
                  ? "bg-black text-white shadow-2xs"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Sui Web3</span>
            </button>
            <button
              id="btn-currency-fiat"
              onClick={() => setCurrencyMode("fiat")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all text-[11px] ${
                currencyMode === "fiat"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-blue-600"
              }`}
            >
              <CreditCard className="h-3 w-3" />
              <span>Mercado Pago</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-lg border border-zinc-200 text-xs">
            <span className="text-[10px] font-bold text-zinc-600 px-1 uppercase tracking-wider">
              Escenario:
            </span>
            <button
              onClick={() => applyPreset("conservative")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activePreset === "conservative"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Conservador
            </button>
            <button
              onClick={() => applyPreset("moderate")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activePreset === "moderate"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Moderado
            </button>
            <button
              onClick={() => applyPreset("viral")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activePreset === "viral"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Viral Blast
            </button>
          </div>
        </div>
      </div>

      {/* Visual Step-by-Step Funnel Yield Ribbon */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2.5">
          Flujo de Conversión del Embudo Paso a Paso
        </span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Top of funnel */}
          <div className="rounded-lg bg-white p-3 border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold mb-1">
              <span>Paso 1: Impresiones</span>
              <span className="rounded bg-pink-100 text-pink-800 text-[9px] font-bold px-1.5 py-0.2">
                Reels / TikTok
              </span>
            </div>
            <div className="text-base font-black text-zinc-900">
              {monthlyViews.toLocaleString()}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Vistas de video 9:16 virales</p>
          </div>

          {/* Step 2: Middle of funnel */}
          <div className="rounded-lg bg-white p-3 border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold mb-1">
              <span>Paso 2: Comunidad</span>
              <span className="rounded bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2">
                {freeTgRate}% conv.
              </span>
            </div>
            <div className="text-base font-black text-blue-950">
              {freeTelegramMembers.toLocaleString()}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Miembros canal Telegram gratis</p>
          </div>

          {/* Step 3: Bottom of funnel */}
          <div className="rounded-lg bg-white p-3 border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold mb-1">
              <span>Paso 3: Suscriptores VIP</span>
              <span className="rounded bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.2">
                {vipConversionRate}% conv.
              </span>
            </div>
            <div className="text-base font-black text-purple-950">
              {activeVipSubscribers.toLocaleString()}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Pagando {subscriberPrice} {tokenType}/mes</p>
          </div>

          {/* Step 4: MRR Revenue */}
          <div className="rounded-lg bg-black text-white p-3 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-300 font-semibold mb-1">
              <span>Paso 4: Ingresos MRR</span>
              <span className="rounded bg-emerald-400 text-black text-[9px] font-black px-1.5 py-0.2">
                100% Retenido
              </span>
            </div>
            <div className="text-base font-black text-white flex items-baseline gap-1">
              {currencyMode === "crypto" ? (
                <>
                  <span>${Math.round(monthlyRevenueUsd).toLocaleString()}</span>
                  <span className="text-[10px] font-semibold text-cyan-300">USD/mes</span>
                </>
              ) : (
                <>
                  <span>${Math.round(monthlyNetFiat).toLocaleString("es-AR")}</span>
                  <span className="text-[10px] font-semibold text-blue-300">ARS neto</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              {currencyMode === "crypto"
                ? `≈ ${monthlyRevenueToken.toLocaleString()} ${tokenType}/mes`
                : `≈ $${Math.round(monthlyNetFiatUsd).toLocaleString()} USD limpios`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Projected Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Funnel Sliders & Price Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-zinc-700" />
              Parámetros Variables del Embudo
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">Modo Interactivo</span>
          </div>

          <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-xs">
            {/* Slider 1: Traffic / Views */}
            <div>
              <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                <span>Vistas Mensuales (Reels / TikTok):</span>
                <span className="font-mono text-zinc-950 font-bold">
                  {monthlyViews.toLocaleString()} vistas
                </span>
              </div>
              <input
                id="range-monthly-views"
                type="range"
                min={20000}
                max={2000000}
                step={10000}
                value={monthlyViews}
                onChange={(e) => {
                  setMonthlyViews(Number(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                <span>20k vistas</span>
                <span>500k vistas</span>
                <span>2M vistas</span>
              </div>
            </div>

            {/* Slider 2: Conversion to Free Telegram Community */}
            <div>
              <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                <span>Tráfico que entra al Canal Gratuito (%):</span>
                <span className="font-mono text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {freeTgRate}%
                </span>
              </div>
              <input
                id="range-free-tg-rate"
                type="range"
                min={1}
                max={10}
                step={0.25}
                value={freeTgRate}
                onChange={(e) => {
                  setFreeTgRate(Number(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                <span>1% (Conservador)</span>
                <span>3.5% (Promedio)</span>
                <span>10% (Alta retención)</span>
              </div>
            </div>

            {/* Slider 3: Conversion from Free TG to VIP Paid */}
            <div>
              <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                <span>Conversión de Gratis a VIP de Pago (%):</span>
                <span className="font-mono text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {vipConversionRate}%
                </span>
              </div>
              <input
                id="range-vip-conversion-rate"
                type="range"
                min={0.5}
                max={15}
                step={0.25}
                value={vipConversionRate}
                onChange={(e) => {
                  setVipConversionRate(Number(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                <span>0.5%</span>
                <span>4.0% (Estándar)</span>
                <span>15% (Audiencia fanática)</span>
              </div>
            </div>

            {/* Dynamic Price Adjuster linked to PaybotConfig */}
            <div className="pt-3 border-t border-zinc-200">
              {currencyMode === "crypto" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">
                      Precio de Suscripción ({tokenType}):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="input-subscriber-price"
                        type="number"
                        min={1}
                        value={subscriberPrice}
                        onChange={(e) => {
                          setSubscriberPrice(Number(e.target.value) || 1);
                          setActivePreset("custom");
                        }}
                        className="w-full font-mono font-bold rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-black focus:outline-none"
                      />
                      <select
                        value={tokenType}
                        onChange={(e) => setTokenType(e.target.value as "SUI" | "USDC")}
                        className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none"
                      >
                        <option value="SUI">SUI</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">
                      Cotización {tokenType} / USD:
                    </label>
                    <input
                      id="input-sui-price-usd"
                      type="number"
                      step={0.1}
                      disabled={tokenType === "USDC"}
                      value={tokenType === "USDC" ? 1 : suiPriceUsd}
                      onChange={(e) => setSuiPriceUsd(Number(e.target.value) || 1)}
                      className="w-full font-mono rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-black focus:outline-none disabled:bg-zinc-100 disabled:text-zinc-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-blue-950 block mb-1">
                      Precio Suscripción ARS:
                    </label>
                    <input
                      id="input-ars-price"
                      type="number"
                      value={arsPrice}
                      onChange={(e) => setArsPrice(Number(e.target.value) || 100)}
                      className="w-full font-mono font-bold rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-blue-950 block mb-1">
                      Tipo de Cambio ARS/USD:
                    </label>
                    <input
                      id="input-ars-usd-rate"
                      type="number"
                      value={arsToUsdRate}
                      onChange={(e) => setArsToUsdRate(Number(e.target.value) || 1)}
                      className="w-full font-mono rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sync to PaybotConfig Button */}
            {onUpdateConfig && (
              <button
                id="btn-sync-earnings-to-paybot"
                onClick={handleSaveToPaybotConfig}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-2.5 px-4 text-xs font-bold text-white shadow-2xs hover:bg-zinc-800 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>¡Precio de {subscriberPrice} {tokenType} Guardado en PaybotConfig!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Aplicar Este Precio al Bot de Telegram (paybotConfig)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Projected Financial Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Desglose Financiero y Proyección Anual (ARR)
          </span>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xs">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Ingreso Mensual (MRR)
                </span>
                <div className="mt-1 text-2xl font-black text-zinc-950">
                  {currencyMode === "crypto"
                    ? `$${Math.round(monthlyRevenueUsd).toLocaleString()}`
                    : `$${Math.round(monthlyNetFiatUsd).toLocaleString()}`}
                  <span className="text-xs font-semibold text-zinc-500 ml-1">USD</span>
                </div>
                <span className="text-[11px] font-semibold text-cyan-700 block mt-0.5">
                  {currencyMode === "crypto"
                    ? `≈ ${monthlyRevenueToken.toLocaleString()} ${tokenType}/mes`
                    : `≈ $${Math.round(monthlyNetFiat).toLocaleString("es-AR")} ARS neto`}
                </span>
              </div>

              <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Proyección Anual (ARR)
                </span>
                <div className="mt-1 text-2xl font-black text-emerald-700">
                  ${Math.round(currencyMode === "crypto" ? annualRevenueUsd : annualNetFiatUsd).toLocaleString()}
                  <span className="text-xs font-semibold text-emerald-600 ml-1">USD</span>
                </div>
                <span className="text-[11px] font-semibold text-zinc-500 block mt-0.5">
                  12 meses de retención recurrente
                </span>
              </div>
            </div>

            {/* Micro Metrics Rows */}
            <div className="space-y-2 text-xs divide-y divide-zinc-100">
              <div className="flex justify-between items-center pt-1.5 text-zinc-600">
                <span>Suscriptores VIP Activos:</span>
                <span className="font-mono font-bold text-zinc-900">
                  {activeVipSubscribers.toLocaleString()} miembros
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5 text-zinc-600">
                <span>Ingreso Promedio por Miembro Gratuito (ARPU):</span>
                <span className="font-mono font-bold text-zinc-900">
                  ${(monthlyRevenueUsd / (freeTelegramMembers || 1)).toFixed(2)} USD / lead
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5 text-zinc-600">
                <span>Comisión de Plataforma Sui Web3:</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  0% (100% fondos directos)
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5 text-zinc-600">
                <span>Ahorro Anual vs OnlyFans (20% fee + 4% chargebacks):</span>
                <span className="font-mono font-bold text-emerald-700">
                  +${Math.round(annualWeb2SavedUsd).toLocaleString()} USD ahorrados
                </span>
              </div>
            </div>

            {/* Value Proposition Callout */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p>
                  <strong>Zero Intermediarios:</strong> Al utilizar el Bot de Pagos en Sui conectado a tu canal de Telegram, todo el dinero fluye instantáneamente a tu billetera privada sin retenciones de 30 días ni riesgo de baneo de cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
