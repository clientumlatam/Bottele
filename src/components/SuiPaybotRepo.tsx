import React, { useState } from "react";
import { AiInfluencer, PaybotConfig, RepoFile } from "../types";
import { generateRepoFiles } from "../data/repoCodeTemplates";
import { exportServerBootstrapJson } from "../utils/exportConfig";
import { WalletBalanceChecker } from "./WalletBalanceChecker";
import { MercadoPagoQrGenerator } from "./MercadoPagoQrGenerator";
import { WebhookTester } from "./WebhookTester";
import { BotHealth } from "./BotHealth";
import { DeploymentReadinessChecklist } from "./DeploymentReadinessChecklist";
import { Code2, Copy, Check, Download, FileCode, Folder, Terminal, Settings, CheckCircle2, Shield, Zap, ExternalLink, FileJson, CreditCard, Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SuiPaybotRepoProps {
  paybotConfig: PaybotConfig;
  setPaybotConfig: React.Dispatch<React.SetStateAction<PaybotConfig>>;
  currentInfluencer?: AiInfluencer;
}

export const SuiPaybotRepo: React.FC<SuiPaybotRepoProps> = ({
  paybotConfig,
  setPaybotConfig,
  currentInfluencer,
}) => {
  const [selectedFileName, setSelectedFileName] = useState("src/index.js");
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportJsonSuccess, setExportJsonSuccess] = useState(false);
  const [validationReport, setValidationReport] = useState<{type: "error" | "warning" | "success", msg: string}[] | null>(null);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);

  const files = generateRepoFiles(paybotConfig);
  const currentFile = files.find((f) => f.name === selectedFileName) || files[0];


  const runValidation = () => {
    const report: {type: "error" | "warning" | "success", msg: string}[] = [];

    // 1. Paybot Config checks
    const telegramKey = localStorage.getItem("API_KEY_TELEGRAM") || paybotConfig.telegramBotToken;
    if (!telegramKey || telegramKey === "6912345678:AAH_your_secret_botfather_token" || telegramKey === "6912345678:AAH_...") {
      report.push({ type: "error", msg: "Falta Token de Telegram (Configurado con valor por defecto o vacío)" });
    } else {
      report.push({ type: "success", msg: "Token de Telegram configurado" });
    }

    if (!paybotConfig.vipChannelId || !paybotConfig.vipChannelId.startsWith("-100")) {
      report.push({ type: "error", msg: "ID del Canal VIP inválido (Debe empezar con -100)" });
    } else {
      report.push({ type: "success", msg: "ID de Canal VIP correcto" });
    }

    if (!paybotConfig.adminSuiWallet || !paybotConfig.adminSuiWallet.startsWith("0x") || paybotConfig.adminSuiWallet.length < 10) {
      report.push({ type: "error", msg: "Dirección de Billetera SUI de administrador inválida" });
    } else {
      report.push({ type: "success", msg: "Billetera SUI configurada correctamente" });
    }

    // 2. Models DB Checks
    if (!currentInfluencer) {
      report.push({ type: "error", msg: "No hay un influencer base seleccionado en la base de datos" });
    } else {
      if (!currentInfluencer.name || !currentInfluencer.bio) {
        report.push({ type: "error", msg: "El Influencer seleccionado está incompleto (Falta Nombre o Bio)" });
      } else {
        report.push({ type: "success", msg: "Perfil de Influencer seleccionado listo" });
      }

      // 3. Optional integration checks based on Influencer setup
      if (currentInfluencer.voiceProfile?.elevenLabsVoiceId) {
        const elKey = localStorage.getItem("API_KEY_ELEVENLABS");
        if (!elKey || !elKey.startsWith("sk_")) {
          report.push({ type: "info", msg: "Modo 100% Gratuito: Usando motor GoTTS / Browser Neural en lugar de ElevenLabs." });
        } else {
          report.push({ type: "success", msg: "ElevenLabs API Key lista para generación de audio" });
        }
      }
    }

    // 4. API Keys from localStorage checks
    const falAiKey = localStorage.getItem("API_KEY_FALAI");
    if (!falAiKey) {
      report.push({ type: "info", msg: "Modo 100% Gratuito: Generación de imágenes usando Pollinations FLUX / Fallbacks Locales." });
    }

    const replicateKey = localStorage.getItem("API_KEY_REPLICATE");
    if (!replicateKey) {
      report.push({ type: "info", msg: "Modo 100% Gratuito: Face-Swap ejecutándose en navegador vía Neural Canvas (sin costo)." });
    }

    setValidationReport(report);
    setIsValidatorOpen(true);
  };

  const handleCopyCurrentFile = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleExportJson = () => {
    if (currentInfluencer) {
      exportServerBootstrapJson(currentInfluencer, paybotConfig);
      setExportJsonSuccess(true);
      setTimeout(() => setExportJsonSuccess(false), 2500);
    }
  };

  const handleDownloadAllFiles = () => {
    // Combine files into a single structured text payload for easy copy or download
    const bundleText = files
      .map(
        (f) =>
          `// ========================================================\n// FILE: ${f.name}\n// ========================================================\n\n${f.content}\n\n`
      )
      .join("\n");

    const blob = new Blob([bundleText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sui-telegram-paybot-bundle.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Repositorio GitHub
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight">
                Código Fuente y Motor de Despliegue de sui-telegram-paybot
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500 max-w-2xl">
              Código completo para producción en Node.js usando <code>@mysten/sui</code> y <code>telegraf</code>. Genera enlaces de invitación dinámicos de un solo uso al verificar pagos en la blockchain en menos de 1 segundo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentInfluencer && (
              <>
                <button
                  onClick={runValidation}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition-all border border-purple-800"
              >
                <Activity className="h-4 w-4" /> Validar Configuración
              </button>
              <button
                id="btn-export-bootstrap-json"
                onClick={handleExportJson}
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all border border-zinc-700"
              >
                {exportJsonSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-green-400" /> ¡JSON Exportado!
                  </>
                ) : (
                  <>
                    <FileJson className="h-4 w-4 text-yellow-400" /> Exportar Config Server (JSON)
                  </>
                )}
              </button>
              </>
            )}

            <button
              id="btn-download-bundle"
              onClick={handleDownloadAllFiles}
              className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 transition-all"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-4 w-4 text-green-600" /> ¡Descargado!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-zinc-700" /> Descargar Código (.txt)
                </>
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Configuration Validator Modal */}
      {isValidatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-50 px-6 py-4 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-black flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Reporte de Validación de Configuración
              </h3>
              <button onClick={() => setIsValidatorOpen(false)} className="text-zinc-400 hover:text-black">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {validationReport?.map((item, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl border ${
                  item.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                  item.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  {item.type === 'error' && <XCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />}
                  {item.type === 'warning' && <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />}
                  {item.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />}
                  <div className="text-xs font-semibold leading-relaxed">
                    {item.msg}
                  </div>
                </div>
              ))}
              
              {validationReport && !validationReport.some(r => r.type === 'error') && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">¡Configuración en estado óptimo!</p>
                    <p className="text-xs opacity-90">No se detectaron dependencias críticas faltantes. El entorno está listo para ejecución y despliegue.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex justify-end">
              <button 
                onClick={() => setIsValidatorOpen(false)}
                className="rounded-xl bg-black px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800"
              >
                Cerrar Reporte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bot Health & Telemetry Dashboard */}
      <BotHealth paybotConfig={paybotConfig} />

      {/* Sui Wallet Balance Checker & Real-time RPC Status */}
      <WalletBalanceChecker
        adminSuiWallet={paybotConfig.adminSuiWallet}
        suiRpcUrl={paybotConfig.suiRpcUrl}
        tokenType={paybotConfig.tokenType}
        subscriberPrice={paybotConfig.subscriberPrice}
        arsSubscriberPrice={paybotConfig.arsSubscriberPrice || 18500}
      />

      {/* Mercado Pago QR Code Generator Helper */}
      <MercadoPagoQrGenerator
        priceArs={paybotConfig.arsSubscriberPrice || 18500}
        currency={paybotConfig.mercadoPagoCurrency || "ARS"}
        accessToken={paybotConfig.mercadoPagoAccessToken || "APP_USR-789123456789-082816-ae9834..."}
        publicKey={paybotConfig.mercadoPagoPublicKey || "APP_USR-f34a81b9-2c6e-41d5-8910-91a2..."}
        collectorId={paybotConfig.mercadoPagoCollectorId || "129845673"}
        influencerName={currentInfluencer?.name || "Elena Rostova"}
      />

      {/* Telegram Webhook Tester Helper */}
      <WebhookTester />

      {/* Deployment Readiness Checklist & Script Generator */}
      <DeploymentReadinessChecklist
        paybotConfig={paybotConfig}
        influencer={currentInfluencer}
      />

      {/* Main Content Grid: Config on Left, Code Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Configurator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-black" />
                <h3 className="text-xs font-bold text-black tracking-tight">
                  Parámetros del Bot (.env)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Web3 + Mercado Pago
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              Modificá estos campos para actualizar el código generado en tiempo real:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700">
                  Telegram Bot Token:
                </label>
                <input
                  type="text"
                  value={paybotConfig.telegramBotToken}
                  onChange={(e) =>
                    setPaybotConfig({ ...paybotConfig, telegramBotToken: e.target.value })
                  }
                  placeholder="6912345678:AAH_..."
                  className="mt-1 w-full font-mono rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700">
                  Telegram VIP Channel ID:
                </label>
                <input
                  type="text"
                  value={paybotConfig.vipChannelId}
                  onChange={(e) =>
                    setPaybotConfig({ ...paybotConfig, vipChannelId: e.target.value })
                  }
                  placeholder="-1002345678901"
                  className="mt-1 w-full font-mono rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700">
                  Admin Destination SUI Wallet:
                </label>
                <input
                  type="text"
                  value={paybotConfig.adminSuiWallet}
                  onChange={(e) =>
                    setPaybotConfig({ ...paybotConfig, adminSuiWallet: e.target.value })
                  }
                  placeholder="0x7a8b... (Slush / @wallet)"
                  className="mt-1 w-full font-mono rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-700">
                    SUI Price:
                  </label>
                  <input
                    type="number"
                    value={paybotConfig.subscriberPrice}
                    onChange={(e) =>
                      setPaybotConfig({
                        ...paybotConfig,
                        subscriberPrice: Number(e.target.value) || 15,
                      })
                    }
                    className="mt-1 w-full font-mono rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700">
                    Payment Token:
                  </label>
                  <select
                    value={paybotConfig.tokenType}
                    onChange={(e) =>
                      setPaybotConfig({
                        ...paybotConfig,
                        tokenType: e.target.value as "SUI" | "USDC",
                      })
                    }
                    className="mt-1 w-full font-medium rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                  >
                    <option value="SUI">SUI (Native)</option>
                    <option value="USDC">USDC (on Sui)</option>
                  </select>
                </div>
              </div>

              {/* Mercado Pago Integration Config Section */}
              <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    Mercado Pago Integration
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paybotConfig.enableMercadoPago !== false}
                      onChange={(e) =>
                        setPaybotConfig({
                          ...paybotConfig,
                          enableMercadoPago: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {paybotConfig.enableMercadoPago !== false && (
                  <div className="space-y-2.5 pl-1.5 border-l-2 border-blue-200">
                    <div>
                      <label className="font-semibold text-zinc-700 text-[11px]">
                        Mercado Pago Access Token:
                      </label>
                      <input
                        type="text"
                        value={paybotConfig.mercadoPagoAccessToken || "APP_USR-789123456789-082816-ae9834..."}
                        onChange={(e) =>
                          setPaybotConfig({
                            ...paybotConfig,
                            mercadoPagoAccessToken: e.target.value,
                          })
                        }
                        placeholder="APP_USR-..."
                        className="mt-0.5 w-full font-mono text-[10px] rounded-lg border border-blue-200 bg-blue-50/30 px-2.5 py-1.5 text-zinc-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-700 text-[11px]">
                        Mercado Pago Public Key:
                      </label>
                      <input
                        type="text"
                        value={paybotConfig.mercadoPagoPublicKey || "APP_USR-f34a81b9-2c6e-41d5-8910-91a2..."}
                        onChange={(e) =>
                          setPaybotConfig({
                            ...paybotConfig,
                            mercadoPagoPublicKey: e.target.value,
                          })
                        }
                        placeholder="APP_USR-..."
                        className="mt-0.5 w-full font-mono text-[10px] rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-zinc-700 text-[11px]">
                          Moneda Local:
                        </label>
                        <select
                          value={paybotConfig.mercadoPagoCurrency || "ARS"}
                          onChange={(e) =>
                            setPaybotConfig({
                              ...paybotConfig,
                              mercadoPagoCurrency: e.target.value,
                            })
                          }
                          className="mt-0.5 w-full font-semibold text-xs rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-zinc-900 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="ARS">ARS (Pesos Arg)</option>
                          <option value="BRL">BRL (Reais)</option>
                          <option value="MXN">MXN (Pesos Mex)</option>
                          <option value="CLP">CLP (Pesos Chi)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 text-[11px]">
                          Precio Suscripción:
                        </label>
                        <input
                          type="number"
                          value={paybotConfig.arsSubscriberPrice || 18500}
                          onChange={(e) =>
                            setPaybotConfig({
                              ...paybotConfig,
                              arsSubscriberPrice: Number(e.target.value) || 18500,
                            })
                          }
                          placeholder="18500"
                          className="mt-0.5 w-full font-mono text-xs rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="font-semibold text-zinc-700">
                  Sui RPC Endpoint:
                </label>
                <input
                  type="text"
                  value={paybotConfig.suiRpcUrl}
                  onChange={(e) =>
                    setPaybotConfig({ ...paybotConfig, suiRpcUrl: e.target.value })
                  }
                  className="mt-1 w-full font-mono text-[11px] rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Setup Checklist */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-black flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              4-Step Deployment Checklist
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black text-[10px] font-bold text-white">
                  1
                </span>
                <div>
                  <span className="font-semibold text-black">
                    Create Bot in @BotFather
                  </span>
                  <p className="text-[11px] text-zinc-500">Send /newbot in Telegram and copy token.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black text-[10px] font-bold text-white">
                  2
                </span>
                <div>
                  <span className="font-semibold text-black">
                    Add Bot as Admin in Channel
                  </span>
                  <p className="text-[11px] text-zinc-500">Grant "Invite Users via Link" permission.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black text-[10px] font-bold text-white">
                  3
                </span>
                <div>
                  <span className="font-semibold text-black">
                    Set SUI Wallet Address
                  </span>
                  <p className="text-[11px] text-zinc-500">Slush Wallet or native Telegram @wallet.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black text-[10px] font-bold text-white">
                  4
                </span>
                <div>
                  <span className="font-semibold text-black">
                    Run `npm start` on Server
                  </span>
                  <p className="text-[11px] text-zinc-500">Deploy on Railway, Render or VPS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: File Explorer & Syntax Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {/* File Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white p-1.5 border border-[#E5E7EB]">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileName(file.name)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                  selectedFileName === file.name
                    ? "bg-black text-white font-bold shadow-sm"
                    : "text-zinc-600 hover:text-black hover:bg-[#F9FAFB]"
                }`}
              >
                <FileCode className={`h-3.5 w-3.5 ${selectedFileName === file.name ? "text-white" : "text-zinc-400"}`} />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Box */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-zinc-950 text-zinc-100 shadow-md overflow-hidden">
            {/* Code Header */}
            <div className="flex items-center justify-between bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-zinc-300">{currentFile.name}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-[11px]">{currentFile.description}</span>
              </div>

              <button
                id="btn-copy-file-code"
                onClick={handleCopyCurrentFile}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all border border-zinc-700"
              >
                {copiedFile ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy File
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="max-h-[520px] overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-200 scrollbar-thin scrollbar-thumb-zinc-700">
              <pre className="whitespace-pre">{currentFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
