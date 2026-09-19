import React, { useState } from "react";
import { DollarSign, TrendingUp, ShieldCheck, Zap, Users, ArrowUpRight, CreditCard, Layers } from "lucide-react";

export const RevenueCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"SUI" | "MERCADOPAGO">("SUI");

  // Shared Funnel Inputs
  const [monthlySocialViews, setMonthlySocialViews] = useState(250000);
  const [trafficToFreeTgPercent, setTrafficToFreeTgPercent] = useState(3.5);
  const [freeToVipPercent, setFreeToVipPercent] = useState(4.0);

  // SUI Blockchain Specific Inputs
  const [suiPriceUsd, setSuiPriceUsd] = useState(3.20);
  const [subPriceSui, setSubPriceSui] = useState(15);

  // MercadoPago Local Fiat Inputs
  const [fiatCurrency, setFiatCurrency] = useState<"ARS" | "BRL" | "MXN" | "CLP">("ARS");
  const [subPriceFiat, setSubPriceFiat] = useState(18500);
  const [fiatToUsdRate, setFiatToUsdRate] = useState(1240); // 1 USD = 1240 ARS
  const [mpFeePercent, setMpFeePercent] = useState(5.3); // MP fee (~4.39% + IVA)

  // Calculated Shared Funnel Metrics
  const freeTelegramJoins = Math.floor((monthlySocialViews * (trafficToFreeTgPercent / 100)));
  const monthlyVipSubscribers = Math.floor((freeTelegramJoins * (freeToVipPercent / 100)));

  // SUI Calculations
  const monthlyRevenueSui = monthlyVipSubscribers * subPriceSui;
  const monthlyRevenueUsdFromSui = monthlyRevenueSui * suiPriceUsd;
  const web2PlatformFeeUsd = monthlyRevenueUsdFromSui * 0.20;
  const web2ProcessorFeeUsd = monthlyRevenueUsdFromSui * 0.04;
  const annualSavedWithSui = (web2PlatformFeeUsd + web2ProcessorFeeUsd) * 12;

  // MercadoPago Calculations
  const grossMonthlyRevenueFiat = monthlyVipSubscribers * subPriceFiat;
  const mpFeesFiat = grossMonthlyRevenueFiat * (mpFeePercent / 100);
  const netMonthlyRevenueFiat = grossMonthlyRevenueFiat - mpFeesFiat;
  const grossMonthlyRevenueUsdMp = grossMonthlyRevenueFiat / (fiatToUsdRate || 1);
  const netMonthlyRevenueUsdMp = netMonthlyRevenueFiat / (fiatToUsdRate || 1);
  const web2CutFiat = grossMonthlyRevenueFiat * 0.20; // 20% OnlyFans cut
  const annualSavedWithMpFiat = (web2CutFiat - mpFeesFiat) * 12;
  const annualSavedWithMpUsd = annualSavedWithMpFiat / (fiatToUsdRate || 1);

  return (
    <div className="space-y-6">
      {/* Header with Dual Tabs */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Economía & MRR
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight">
                Calculadora de Ingresos y Proyecciones de Monetización
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Proyectá la facturación mensual recurrente tanto en <strong>Sui Blockchain (Web3)</strong> como en <strong>Moneda Local con Mercado Pago</strong>.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="inline-flex rounded-xl bg-[#F9FAFB] p-1 border border-[#E5E7EB] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("SUI")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "SUI"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sui Web3 (SUI/USDC)</span>
            </button>
            <button
              onClick={() => setActiveTab("MERCADOPAGO")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "MERCADOPAGO"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-blue-600"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Mercado Pago ({fiatCurrency})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-black flex items-center gap-2 tracking-tight">
            <Users className="h-4 w-4 text-black" /> Métricas del Embudo e Insumos de Conversión
          </h3>

          <div className="space-y-4 text-xs">
            {/* Range 1: Social views */}
            <div>
              <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                <span>Impresiones Mensuales en Redes (Reels/TikTok):</span>
                <span className="font-mono text-black font-bold">{monthlySocialViews.toLocaleString()} vistas</span>
              </div>
              <input
                type="range"
                min={20000}
                max={2000000}
                step={10000}
                value={monthlySocialViews}
                onChange={(e) => setMonthlySocialViews(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Range 2: Free TG Conversion */}
            <div>
              <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                <span>Conversión al Canal Gratuito de Telegram (%):</span>
                <span className="font-mono text-black font-bold">{trafficToFreeTgPercent}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={trafficToFreeTgPercent}
                onChange={(e) => setTrafficToFreeTgPercent(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Range 3: Free to VIP Conversion */}
            <div>
              <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                <span>Conversión de Canal Gratuito a VIP (%):</span>
                <span className="font-mono text-black font-bold">{freeToVipPercent}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={freeToVipPercent}
                onChange={(e) => setFreeToVipPercent(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Dynamic Inputs Based on Active Tab */}
            {activeTab === "SUI" ? (
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E7EB]">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Precio Suscripción VIP (SUI):
                  </label>
                  <input
                    type="number"
                    value={subPriceSui}
                    onChange={(e) => setSubPriceSui(Number(e.target.value) || 1)}
                    className="w-full font-mono rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Cotización Estimada SUI / USD:
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={suiPriceUsd}
                    onChange={(e) => setSuiPriceUsd(Number(e.target.value) || 1)}
                    className="w-full font-mono rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-blue-200 bg-blue-50/40 p-3 rounded-xl border">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-blue-950 block mb-1">
                      Moneda Local Mercado Pago:
                    </label>
                    <select
                      value={fiatCurrency}
                      onChange={(e) => {
                        const curr = e.target.value as any;
                        setFiatCurrency(curr);
                        if (curr === "ARS") {
                          setSubPriceFiat(18500);
                          setFiatToUsdRate(1240);
                        } else if (curr === "BRL") {
                          setSubPriceFiat(85);
                          setFiatToUsdRate(5.6);
                        } else if (curr === "MXN") {
                          setSubPriceFiat(350);
                          setFiatToUsdRate(19.5);
                        } else if (curr === "CLP") {
                          setSubPriceFiat(16500);
                          setFiatToUsdRate(940);
                        }
                      }}
                      className="w-full font-bold text-xs rounded-lg border border-blue-200 bg-white px-3 py-2 text-zinc-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="ARS">ARS (Pesos Argentinos)</option>
                      <option value="BRL">BRL (Reais Brasil)</option>
                      <option value="MXN">MXN (Pesos Mexicanos)</option>
                      <option value="CLP">CLP (Pesos Chilenos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-blue-950 block mb-1">
                      Precio Suscripción ({fiatCurrency}):
                    </label>
                    <input
                      type="number"
                      value={subPriceFiat}
                      onChange={(e) => setSubPriceFiat(Number(e.target.value) || 100)}
                      className="w-full font-mono rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-blue-950 block mb-1">
                      Tipo de Cambio {fiatCurrency} / USD:
                    </label>
                    <input
                      type="number"
                      value={fiatToUsdRate}
                      onChange={(e) => setFiatToUsdRate(Number(e.target.value) || 1)}
                      className="w-full font-mono rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-blue-950 block mb-1">
                      Comisión Mercado Pago (%):
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={mpFeePercent}
                      onChange={(e) => setMpFeePercent(Number(e.target.value) || 4.39)}
                      className="w-full font-mono rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Financial Projections Column */}
        <div className="lg:col-span-6 space-y-6">
          {activeTab === "SUI" ? (
            /* TAB 1: SUI BLOCKCHAIN PROJECTIONS */
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-black flex items-center gap-2 tracking-tight">
                <TrendingUp className="h-4 w-4 text-black" />
                Proyección de Ingresos en Sui Blockchain (Web3)
              </h3>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    Suscriptores VIP Activos
                  </span>
                  <div className="mt-1 text-2xl font-black text-black">
                    {monthlyVipSubscribers.toLocaleString()}
                    <span className="text-xs font-normal text-zinc-500 ml-1">usuarios</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">De {freeTelegramJoins.toLocaleString()} miembros gratis</p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    Facturación Mensual SUI
                  </span>
                  <div className="mt-1 text-2xl font-black text-black">
                    ${Math.round(monthlyRevenueUsdFromSui).toLocaleString()}
                    <span className="text-xs font-semibold text-cyan-700 block">
                      ≈ {monthlyRevenueSui.toLocaleString()} SUI
                    </span>
                  </div>
                </div>
              </div>

              {/* Web2 Fee Comparison */}
              <div className="rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E7EB] space-y-2 text-xs">
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Comisiones Web2 (OnlyFans/Cafecito 20% + 4% Procesador):</span>
                  <span className="font-mono text-zinc-800 font-semibold">
                    -${Math.round(web2PlatformFeeUsd + web2ProcessorFeeUsd).toLocaleString()} /mes
                  </span>
                </div>
                <div className="flex justify-between items-center text-black font-bold pt-2 border-t border-[#E5E7EB]">
                  <span className="flex items-center gap-1 text-black">
                    <ShieldCheck className="h-4 w-4 text-green-600" /> Dinero Ahorrado al Año con Bot en Sui:
                  </span>
                  <span className="font-mono text-green-600 text-sm">
                    +${Math.round(annualSavedWithSui).toLocaleString()} / año
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: MERCADO PAGO FIAT PROJECTIONS */
            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-blue-950 flex items-center gap-2 tracking-tight">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Proyección de Ingresos en Moneda Local ({fiatCurrency}) con Mercado Pago
              </h3>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    Facturación Bruta ({fiatCurrency})
                  </span>
                  <div className="mt-1 text-2xl font-black text-blue-950">
                    ${grossMonthlyRevenueFiat.toLocaleString("es-AR")}
                    <span className="text-xs font-semibold text-zinc-500 block">
                      ≈ ${Math.round(grossMonthlyRevenueUsdMp).toLocaleString()} USD / mes
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
                  <span className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
                    Cobro Neto Estimado (post MP)
                  </span>
                  <div className="mt-1 text-2xl font-black text-green-900">
                    ${Math.round(netMonthlyRevenueFiat).toLocaleString("es-AR")}
                    <span className="text-xs font-semibold text-green-700 block">
                      ≈ ${Math.round(netMonthlyRevenueUsdMp).toLocaleString()} USD limpios
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Fee Comparison Box */}
              <div className="rounded-xl bg-blue-50/40 p-4 border border-blue-100 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Comisión Mercado Pago ({mpFeePercent}%):</span>
                  <span className="font-mono text-zinc-900 font-semibold">
                    -${Math.round(mpFeesFiat).toLocaleString("es-AR")} {fiatCurrency} /mes
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Corte de Plataformas Web2 (20% OnlyFans/Cafecito):</span>
                  <span className="font-mono text-red-600 font-semibold">
                    -${Math.round(web2CutFiat).toLocaleString("es-AR")} {fiatCurrency} /mes
                  </span>
                </div>
                <div className="flex justify-between items-center text-blue-950 font-bold pt-2 border-t border-blue-200">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-blue-600" /> Ahorro Anual Netos cobrando directo con Bot MP:
                  </span>
                  <span className="font-mono text-green-600 text-sm">
                    +${Math.round(annualSavedWithMpFiat).toLocaleString("es-AR")} {fiatCurrency} (≈ ${Math.round(annualSavedWithMpUsd).toLocaleString()} USD)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
