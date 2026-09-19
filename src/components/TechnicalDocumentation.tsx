import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  Copy,
  Check,
  Sparkles,
  Key,
  Wand2,
  Radio,
  RefreshCw,
  Bot,
  Users,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Layers,
  Cpu,
  Zap,
  CheckCircle2
} from "lucide-react";

export const TechnicalDocumentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"steps" | "apis" | "scalability">("steps");
  const [activeStepDoc, setActiveStepDoc] = useState<number>(1);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 2500);
  };

  const stepsDocData = [
    {
      step: 1,
      title: "1. Rostro Maestro & Creación de Modelo",
      icon: Wand2,
      badge: "FaceToModelCreator",
      description: "Convierte cualquier fotografía de rostro en la identidad completa de una modelo virtual.",
      instructions: [
        "Selecciona una modelo preexistente o haz clic en 'Sustituir Rostro Maestro'.",
        "Sube una imagen clara y bien iluminada de frente en formato PNG/JPG (resolución recomendada 1024x1024).",
        "Haz clic en 'Analizar y Generar Identidad' para que Gemini AI extraiga los vectores faciales, nombre, biografía, tono vocal y prompts de difusión.",
        "Descarga el respaldo en JSON o ZIP si deseas migrar el perfil a otra instancia del servidor."
      ],
      codeSnippet: `// Ejemplo de inicialización de Modelo IA vía Gemini SDK
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    { text: "Crea una biografía y prompt de difusión para una modelo virtual basándote en este análisis..." }
  ]
});`
    },
    {
      step: 2,
      title: "2. Estudio de Voz Natural Libre (Zero-Cost TTS)",
      icon: Radio,
      badge: "FreeNaturalVoiceStudio",
      description: "Genera audios y notas de voz en español e inglés totalmente gratis sin requerir API keys de pago.",
      instructions: [
        "Escribe o genera un guión utilizando los botones de sugerencias ('Saludo VIP', 'Promo Suscripción').",
        "Selecciona el acento de la modelo (Español Latino, México, España, EE.UU.) y modula el tono (Seductora, Profesional, Divertida, Formal).",
        "Ajusta los deslizadores de velocidad y tono para afinar la cadencia vocal.",
        "Presiona 'Generar & Escuchar' para sintetizar la pista de audio y descargar el archivo MP3/WAV o enviarlo directamente al bot de Telegram."
      ],
      codeSnippet: `// Ejemplo de uso de la Web Speech API nativa sin costo
const utterance = new SpeechSynthesisUtterance("Hola mi amor, gracias por suscribirte a mi canal VIP");
utterance.lang = "es-MX";
utterance.pitch = 1.1; // Tono ligeramente más agudo/femenino
utterance.rate = 0.95;  // Velocidad pausada y natural
window.speechSynthesis.speak(utterance);`
    },
    {
      step: 3,
      title: "3. Face Swap de Fotos & Videos 4K",
      icon: RefreshCw,
      badge: "CustomMediaFaceSwapStudio",
      description: "Reemplaza rostros en fotos y videos 9:16 (TikTok/Reels) conservando iluminación y movimiento con InsightFace.",
      instructions: [
        "Sube un video o fotografía base en formato 9:16 que desees transformar.",
        "Ajusta el peso de restauración facial CodeFormer (entre 0.50 y 1.00) y la alineación de tono de piel para evitar diferencias de coloración.",
        "Haz clic en 'Ejecutar Face Swap 4K'. El motor alineará la malla facial 3D y restaurará la textura de la piel.",
        "Genera copies sociales automáticos optimizados para Instagram, TikTok o Twitter/X e inspecciona el resultado en la Galería Masonry."
      ],
      codeSnippet: `// Ejecución de Canvas Face Swap 4K local con restauración
import { performCanvasFaceSwap } from "./utils/faceSwapEngine";

const result = await performCanvasFaceSwap(influencerAvatarUrl, targetMediaUrl, {
  codeFormerWeight: 0.85,
  skinToneAlignment: 90,
  enhanceResolution: true
});
console.log("Media procesada:", result.dataUrl);`
    },
    {
      step: 4,
      title: "4. Simulador de Bot de Telegram VIP",
      icon: Bot,
      badge: "TelegramBotSimulator",
      description: "Prueba la experiencia completa del usuario final dentro de Telegram con notas de voz, teclados inline y flujo de pago SUI.",
      instructions: [
        "Interactúa con el chat enviado los comandos predefinidos como /start, /pay o enviando mensajes directos.",
        "Selecciona el paquete de suscripción en SUI y presiona 'Pagar Membresía'.",
        "Verifica cómo el bot procesa el hash de la transacción en la red Sui Network y entrega el enlace único y temporal al canal VIP privado.",
        "Escucha los audios autogenerados en respuesta a los mensajes del usuario."
      ],
      codeSnippet: `// Estructura de comandos de Telegram Bot API
bot.onText(/\\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, \`¡Hola! Soy \${influencer.name}. Suscríbete a mi VIP por \${price} SUI.\`, {
    reply_markup: {
      inline_keyboard: [[
        { text: "💎 Pagar Membresía en SUI", callback_data: "pay_sui" }
      ]]
    }
  });
});`
    },
    {
      step: 5,
      title: "5. Gestión de Suscriptores & Pagos SUI",
      icon: Users,
      badge: "SubscriberManagement",
      description: "Panel de control financiero y auditoría de miembros activos, tasa de retención (LTV) y servicio de Kick-Bot.",
      instructions: [
        "Visualiza la lista de suscriptores con estado Activo, Por Vencer (<48h) o Vencido.",
        "Monitorea el valor acumulado por suscriptor (LTV) en SUI y su equivalente en dólares americanos USD / ARS.",
        "Activa el Cron de Auto-Kick para revocar accesos automáticamente de los miembros con membresía expirada.",
        "Utiliza la calculadora de Liquid Staking para proyectar retornos pasivos delegando los fondos recaudados en Sui Staking Pools."
      ],
      codeSnippet: `// Verificación de saldo y expiración en Sui Network
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
const balance = await client.getBalance({ owner: walletAddress, coinType: "0x2::sui::SUI" });
console.log("Saldo verificado en SUI:", Number(balance.totalBalance) / 1e9);`
    },
    {
      step: 6,
      title: "6. Código & Despliegue Backend Paybot",
      icon: Code2,
      badge: "SuiPaybotRepo",
      description: "Exportación completa del repositorio listo para producción en Node.js, TypeScript y Docker.",
      instructions: [
        "Configura las variables de entorno (`TELEGRAM_BOT_TOKEN`, `ADMIN_SUI_WALLET`, `SUBSCRIBER_PRICE`).",
        "Copia el código TypeScript de `server.ts` o clona el repositorio empaquetado.",
        "Ejecuta `npm install` y posteriormente `npm run dev` (o `docker compose up -d`).",
        "Prueba el envío de webhooks a través del evaluador de endpoints integrado en la suite."
      ],
      codeSnippet: `# Comandos de despliegue rápido en servidor VPS (Docker / systemd)
git clone https://github.com/telesui/sui-vip-paybot.git
cd sui-vip-paybot
cp .env.example .env
npm install
npm run build && npm start`
    }
  ];

  return (
    <div id="technical-documentation" className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Document Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-black text-white px-3 py-1 text-[11px] font-black tracking-widest uppercase">
              DOCUMENTACIÓN TÉCNICA
            </span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[11px] font-bold">
              GUÍA COMPLETA PARA EL USUARIO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Guía de Configuración & Manual de 6 Pasos
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-2xl">
            Aprende a operar el flujo completo de creación de contenido IA, generación de voz, Face Swap 4K y monetización con el PayBot en Sui Network.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 shrink-0">
          <button
            onClick={() => setActiveTab("steps")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "steps" ? "bg-white text-black shadow-2xs" : "text-zinc-600 hover:text-black"
            }`}
          >
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span>Guía de los 6 Pasos</span>
          </button>
          <button
            onClick={() => setActiveTab("apis")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "apis" ? "bg-white text-black shadow-2xs" : "text-zinc-600 hover:text-black"
            }`}
          >
            <Key className="h-4 w-4 text-amber-600" />
            <span>Guías de APIs (Gemini, ElevenLabs, Fal)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 6-STEP WORKFLOW GUIDE */}
      {activeTab === "steps" && (
        <div className="space-y-6">
          {/* Step Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stepsDocData.map((item) => {
              const Icon = item.icon;
              const isSelected = activeStepDoc === item.step;
              return (
                <button
                  key={item.step}
                  onClick={() => setActiveStepDoc(item.step)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-black bg-black text-white shadow-sm ring-2 ring-black/10"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-black ${
                      isSelected ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-800"
                    }`}>
                      {item.step}
                    </span>
                    <Icon className={`h-4 w-4 ${isSelected ? "text-purple-300" : "text-zinc-400"}`} />
                  </div>
                  <div className="text-xs font-bold truncate">{item.badge}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Content Detail Card */}
          {(() => {
            const currentDoc = stepsDocData.find((s) => s.step === activeStepDoc)!;
            const Icon = currentDoc.icon;
            return (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-zinc-900 tracking-tight">{currentDoc.title}</h3>
                      <p className="text-xs text-zinc-500">{currentDoc.description}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-mono font-bold text-purple-800">
                    Componente: {currentDoc.badge}
                  </span>
                </div>

                {/* Instructions List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Pasos de Operación Recomendados:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentDoc.instructions.map((inst, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-zinc-200 text-xs text-zinc-700 shadow-2xs">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white text-[10px] font-black">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Snippet Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5 text-purple-600" />
                      Código de Referencia / Ejemplo de Integración:
                    </span>
                    <button
                      onClick={() => copyToClipboard(currentDoc.codeSnippet, `step-${currentDoc.step}`)}
                      className="flex items-center gap-1 text-[11px] font-mono text-purple-700 hover:text-purple-900 bg-white border border-zinc-200 px-2 py-1 rounded-lg shadow-2xs"
                    >
                      {copiedCodeIndex === `step-${currentDoc.step}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-100 border border-zinc-800 leading-relaxed">
                    <code>{currentDoc.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: API SETUP GUIDES (Gemini, ElevenLabs, Fal.ai) */}
      {activeTab === "apis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GEMINI API CARD */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-black text-xs">
                      AI
                    </span>
                    <h3 className="text-base font-black text-zinc-900">Google Gemini API</h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Requerida
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  Generación de biografías de influencers, personalidad conversacional, copies para redes sociales y chat autogestionado en el simulador.
                </p>

                <div className="space-y-2 text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <div className="font-bold text-zinc-900 mb-1">Pasos de Configuración:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Obtén tu API Key gratuita en <strong className="text-purple-700">Google AI Studio</strong>.</li>
                    <li>Agrega la clave en el archivo `.env`: <code className="bg-zinc-200 px-1 rounded text-[11px]">GEMINI_API_KEY=tu_key</code></li>
                    <li>Utiliza el SDK oficial <code className="bg-zinc-200 px-1 rounded text-[11px]">@google/genai</code> en backend server-side.</li>
                  </ol>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Obtener Gemini Key en AI Studio</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* ELEVENLABS API CARD */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-black text-xs">
                      TTS
                    </span>
                    <h3 className="text-base font-black text-zinc-900">ElevenLabs API</h3>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                    Opcional / Premium
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  Clonación vocal ultra-realista con modulación de emociones, pausas respiratorias naturales y streaming de audio de alta fidelidad.
                </p>

                <div className="space-y-2 text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <div className="font-bold text-zinc-900 mb-1">Pasos de Configuración:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Regístrate en ElevenLabs y genera tu API Key.</li>
                    <li>Configura en `.env`: <code className="bg-zinc-200 px-1 rounded text-[11px]">ELEVENLABS_API_KEY=xi_key</code></li>
                    <li>Copia el Voice ID de tu voz clonada al perfil de la modelo en la app.</li>
                  </ol>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <a
                  href="https://elevenlabs.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl bg-black hover:bg-zinc-800 text-white py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Dashboard de ElevenLabs</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* FAL.AI API CARD */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 font-black text-xs">
                      GPU
                    </span>
                    <h3 className="text-base font-black text-zinc-900">Fal.ai Cloud API</h3>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                    Aceleración GPU
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  Procesamiento en la nube de Face Swap 4K en lote para videos largos, FLUX.1 y aceleración por GPU sin requerir hardware local.
                </p>

                <div className="space-y-2 text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <div className="font-bold text-zinc-900 mb-1">Pasos de Configuración:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Crea una cuenta en Fal.ai y genera tu token.</li>
                    <li>Configura en `.env`: <code className="bg-zinc-200 px-1 rounded text-[11px]">FAL_KEY=fal_secret</code></li>
                    <li>Invoca los endpoints de InsightFace / CodeFormer vía HTTP REST.</li>
                  </ol>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <a
                  href="https://fal.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl bg-zinc-900 hover:bg-black text-white py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Obtener Fal.ai API Key</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Quick Integration Example Box */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-purple-400" />
                Archivo de Configuración Global `.env.example`
              </h4>
              <button
                onClick={() => copyToClipboard(`TELEGRAM_BOT_TOKEN=6912345678:AAH_your_secret_botfather_token
ADMIN_SUI_WALLET=0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b
SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
GEMINI_API_KEY=AIzaSy_your_gemini_key_here
ELEVENLABS_API_KEY=xi_your_elevenlabs_key_here
FAL_KEY=fal_your_fal_ai_key_here
SUBSCRIBER_PRICE_SUI=15`, "env-example")}
                className="flex items-center gap-1 text-xs font-mono text-purple-300 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800"
              >
                {copiedCodeIndex === "env-example" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copiar .env</span>
              </button>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-4 font-mono text-xs text-purple-200 border border-zinc-800 leading-relaxed">
<code>{`# Environment Variables for TeleSui Agency Studio
TELEGRAM_BOT_TOKEN=6912345678:AAH_your_secret_botfather_token
ADMIN_SUI_WALLET=0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b
SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
GEMINI_API_KEY=AIzaSy_your_gemini_key_here
ELEVENLABS_API_KEY=xi_your_elevenlabs_key_here
FAL_KEY=fal_your_fal_ai_key_here
SUBSCRIBER_PRICE_SUI=15`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
