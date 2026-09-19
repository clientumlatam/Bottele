import React, { useState, useMemo } from "react";
import { QrCode, Copy, Check, Download, ExternalLink, CreditCard, Sparkles, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

interface MercadoPagoQrGeneratorProps {
  priceArs?: number;
  currency?: string;
  accessToken?: string;
  publicKey?: string;
  collectorId?: string;
  influencerName?: string;
}

export const MercadoPagoQrGenerator: React.FC<MercadoPagoQrGeneratorProps> = ({
  priceArs = 18500,
  currency = "ARS",
  accessToken = "APP_USR-789123456789-082816-ae9834...",
  publicKey = "APP_USR-f34a81b9-2c6e-41d5-8910-91a2...",
  collectorId = "129845673",
  influencerName = "Elena Rostova",
}) => {
  const [copiedBase64, setCopiedBase64] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<"IDLE" | "PROCESSING" | "APPROVED">("IDLE");

  // Construct mock Mercado Pago preference URL
  const prefId = useMemo(() => {
    return `MP-PREF-${Math.floor(100000000 + Math.random() * 900000000)}`;
  }, []);

  const mpCheckoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${prefId}&collector_id=${collectorId}&public_key=${encodeURIComponent(
    publicKey
  )}`;

  // Generate Base64 SVG Data URL representing the Mercado Pago QR Code
  const base64QrImage = useMemo(() => {
    // Generate an SVG string with Mercado Pago branding colors (Blue #009EE3) and QR pattern
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" rx="20" fill="#FFFFFF"/>
  <rect x="15" y="15" width="270" height="270" rx="14" fill="#F8FAFC" stroke="#009EE3" stroke-width="2" stroke-dasharray="6 4"/>
  
  <!-- Outer Frame Corners -->
  <path d="M 35 65 V 45 H 65" fill="none" stroke="#009EE3" stroke-width="6" stroke-linecap="round"/>
  <path d="M 235 65 V 45 H 205" fill="none" stroke="#009EE3" stroke-width="6" stroke-linecap="round"/>
  <path d="M 35 235 V 255 H 65" fill="none" stroke="#009EE3" stroke-width="6" stroke-linecap="round"/>
  <path d="M 235 235 V 255 H 205" fill="none" stroke="#009EE3" stroke-width="6" stroke-linecap="round"/>

  <!-- QR Finder Pattern Top-Left -->
  <rect x="45" y="45" width="60" height="60" rx="8" fill="#009EE3"/>
  <rect x="55" y="55" width="40" height="40" rx="4" fill="#FFFFFF"/>
  <rect x="65" y="65" width="20" height="20" rx="2" fill="#009EE3"/>

  <!-- QR Finder Pattern Top-Right -->
  <rect x="195" y="45" width="60" height="60" rx="8" fill="#009EE3"/>
  <rect x="205" y="55" width="40" height="40" rx="4" fill="#FFFFFF"/>
  <rect x="215" y="65" width="20" height="20" rx="2" fill="#009EE3"/>

  <!-- QR Finder Pattern Bottom-Left -->
  <rect x="45" y="195" width="60" height="60" rx="8" fill="#009EE3"/>
  <rect x="55" y="205" width="40" height="40" rx="4" fill="#FFFFFF"/>
  <rect x="65" y="215" width="20" height="20" rx="2" fill="#009EE3"/>

  <!-- QR Data Modules Matrix -->
  <rect x="120" y="45" width="12" height="12" fill="#003B4A"/>
  <rect x="140" y="45" width="12" height="12" fill="#009EE3"/>
  <rect x="160" y="45" width="12" height="12" fill="#003B4A"/>
  <rect x="120" y="65" width="12" height="12" fill="#009EE3"/>
  <rect x="140" y="65" width="12" height="12" fill="#003B4A"/>
  <rect x="165" y="65" width="12" height="12" fill="#009EE3"/>

  <rect x="45" y="120" width="12" height="12" fill="#003B4A"/>
  <rect x="65" y="120" width="12" height="12" fill="#009EE3"/>
  <rect x="85" y="120" width="12" height="12" fill="#003B4A"/>
  <rect x="45" y="140" width="12" height="12" fill="#009EE3"/>
  <rect x="65" y="140" width="12" height="12" fill="#003B4A"/>

  <rect x="195" y="120" width="12" height="12" fill="#009EE3"/>
  <rect x="215" y="120" width="12" height="12" fill="#003B4A"/>
  <rect x="235" y="120" width="12" height="12" fill="#009EE3"/>
  <rect x="195" y="140" width="12" height="12" fill="#003B4A"/>
  <rect x="215" y="140" width="12" height="12" fill="#009EE3"/>

  <rect x="120" y="195" width="12" height="12" fill="#009EE3"/>
  <rect x="140" y="195" width="12" height="12" fill="#003B4A"/>
  <rect x="160" y="195" width="12" height="12" fill="#009EE3"/>
  <rect x="120" y="215" width="12" height="12" fill="#003B4A"/>
  <rect x="140" y="215" width="12" height="12" fill="#009EE3"/>
  <rect x="160" y="215" width="12" height="12" fill="#003B4A"/>
  
  <rect x="195" y="195" width="12" height="12" fill="#003B4A"/>
  <rect x="215" y="195" width="12" height="12" fill="#009EE3"/>
  <rect x="235" y="195" width="12" height="12" fill="#003B4A"/>
  <rect x="195" y="235" width="12" height="12" fill="#009EE3"/>
  <rect x="215" y="235" width="12" height="12" fill="#003B4A"/>
  <rect x="235" y="235" width="12" height="12" fill="#009EE3"/>

  <!-- Center Mercado Pago Logo Badge -->
  <rect x="110" y="110" width="80" height="80" rx="16" fill="#009EE3" stroke="#FFFFFF" stroke-width="4"/>
  <text x="150" y="150" fill="#FFFFFF" font-size="28" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle" dominant-baseline="central">mp</text>
  <text x="150" y="172" fill="#E0F2FE" font-size="9" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${currency}</text>
</svg>`.trim();

    const encodedSvg = btoa(unescape(encodeURIComponent(svgContent)));
    return `data:image/svg+xml;base64,${encodedSvg}`;
  }, [currency, priceArs]);

  const handleCopyBase64 = () => {
    navigator.clipboard.writeText(base64QrImage);
    setCopiedBase64(true);
    setTimeout(() => setCopiedBase64(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mpCheckoutUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = base64QrImage;
    link.download = `mercadopago-qr-${currency.toLowerCase()}-${priceArs}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulatePayment = () => {
    setSimulatedStatus("PROCESSING");
    setTimeout(() => {
      setSimulatedStatus("APPROVED");
    }, 1800);
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-5 shadow-sm space-y-4">
      {/* Component Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white shadow-sm">
            <QrCode className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-950 tracking-tight flex items-center gap-1.5">
              Generador de Código QR Base64 - Mercado Pago
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800 uppercase border border-blue-200">
                {currency} ARS Checkout Pro
              </span>
            </h4>
            <p className="text-[11px] text-zinc-600">
              Genera la imagen del código QR en formato Base64 para cobros locales en {currency} sin pasarelas externas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCheckoutModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Probar Checkout Simulado</span>
        </button>
      </div>

      {/* Main Grid: QR Preview Left, Base64 String & Controls Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Base64 QR Image Card */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-blue-100 shadow-sm relative group">
          <div className="w-44 h-44 rounded-xl overflow-hidden border border-blue-200 bg-white p-2 shadow-inner flex items-center justify-center">
            <img
              src={base64QrImage}
              alt="MercadoPago Base64 QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs font-black text-blue-950 block">
              ${priceArs.toLocaleString("es-AR")} {currency}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">
              Suscripción VIP 30 días - {influencerName}
            </span>
          </div>

          <button
            onClick={handleDownloadQr}
            className="mt-2.5 flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100 transition-all"
          >
            <Download className="h-3 w-3" />
            Descargar SVG Base64
          </button>
        </div>

        {/* Right: Data & Base64 Details */}
        <div className="md:col-span-8 space-y-3">
          {/* Base64 Data String Field */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-zinc-700 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" /> String de Imagen Base64 (Data URI):
              </span>
              <button
                onClick={handleCopyBase64}
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                {copiedBase64 ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" /> ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar String Base64
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <textarea
                readOnly
                rows={3}
                value={base64QrImage}
                className="w-full rounded-xl border border-blue-200 bg-white p-2.5 font-mono text-[10px] text-zinc-700 focus:outline-none resize-none select-all"
              />
            </div>
          </div>

          {/* Checkout URL Field */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-zinc-700">Link de Preferencia Mercado Pago Checkout:</span>
              <button
                onClick={handleCopyLink}
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" /> ¡Link Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar Enlace
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={mpCheckoutUrl}
                className="flex-1 rounded-xl border border-blue-200 bg-white px-3 py-1.5 font-mono text-[11px] text-zinc-800 focus:outline-none"
              />
              <a
                href={mpCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 transition-all"
                title="Abrir URL de Prueba Mercado Pago"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Information Notice */}
          <div className="rounded-xl bg-white p-3 border border-blue-100 text-[11px] text-zinc-600 space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              Integración Nativa con Webhook IPN (`/api/mercadopago/webhook`)
            </div>
            <p>
              El bot de Telegram renderizará este código QR Base64 directamente en el chat cuando el usuario seleccione la opción de pago en pesos argentinos ({currency}).
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Visual Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-blue-100 relative">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-[#009EE3] p-1.5 text-white font-black text-xs">
                  mp
                </div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Simulador de Checkout Mercado Pago
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSimulatedStatus("IDLE");
                }}
                className="text-zinc-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-blue-950">
                <span>Producto:</span>
                <span>Membresía VIP Telegram 30 días</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Influencer:</span>
                <span className="font-semibold">{influencerName}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Moneda / País:</span>
                <span className="font-semibold">{currency} (Argentina)</span>
              </div>
              <div className="flex justify-between font-black text-lg text-blue-900 pt-2 border-t border-blue-200">
                <span>Total a Pagar:</span>
                <span>${priceArs.toLocaleString("es-AR")} {currency}</span>
              </div>
            </div>

            {/* QR Scanner visual simulation */}
            <div className="flex flex-col items-center justify-center p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <img
                src={base64QrImage}
                alt="Scan MP QR"
                className="w-32 h-32 object-contain"
              />
              <span className="text-[10px] text-zinc-500 font-medium text-center">
                Escaneá desde la App de Mercado Pago o confirmá la transacción abajo
              </span>
            </div>

            {/* Status Feedback */}
            {simulatedStatus === "PROCESSING" && (
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 flex items-center justify-center gap-2 font-bold animate-pulse">
                <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
                Procesando Pago con Mercado Pago API...
              </div>
            )}

            {simulatedStatus === "APPROVED" && (
              <div className="rounded-xl bg-green-50 p-3 text-xs text-green-800 border border-green-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-green-900">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ¡Pago Aprobado Exitosamente! (HTTP 200 OK)
                </div>
                <p className="text-[11px] text-green-700">
                  El Webhook IPN emitió el link de un solo uso para Telegram VIP.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              {simulatedStatus !== "APPROVED" ? (
                <button
                  onClick={handleSimulatePayment}
                  disabled={simulatedStatus === "PROCESSING"}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#009EE3] py-2.5 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Simular Pago Aprobado ($ {priceArs} ARS)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setSimulatedStatus("IDLE");
                  }}
                  className="w-full rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all"
                >
                  Cerrar Simulador
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
