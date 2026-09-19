import React, { useState } from "react";
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Coins, 
  DollarSign, 
  Zap, 
  Camera, 
  Film, 
  Mic, 
  User, 
  Layers, 
  Download, 
  Terminal, 
  CheckCircle2,
  Info,
  HeartHandshake,
  Cpu,
  MonitorPlay,
  Share2
} from "lucide-react";

export const FreeAiStackGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "faces" | "images" | "video" | "audio" | "local">("all");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const freeTools = [
    {
      category: "faces",
      name: "This Person Does Not Exist",
      type: "Rostro Base Sintético",
      cost: "100% Gratis ($0) • Sin Registro",
      url: "https://thispersondoesnotexist.com",
      desc: "Genera rostros humanos 100% artificiales e irreales con StyleGAN2. Cero problemas de copyright o suplantación de identidad.",
      badge: "Gratis Ilimitado",
      badgeColor: "bg-emerald-100 text-emerald-800",
      howToUse: "Recarga la página (F5) hasta encontrar tu modelo ideal y guarda la imagen como avatar semilla.",
    },
    {
      category: "faces",
      name: "This Person Not Exist (.org)",
      type: "Filtros de Género y Edad",
      cost: "100% Gratis ($0)",
      url: "https://thispersonnotexist.org",
      desc: "Permite filtrar rostros sintéticos por edad (ej. 20-25 años), etnia (latina, europea, asiática) y expresión.",
      badge: "Gratis Ilimitado",
      badgeColor: "bg-emerald-100 text-emerald-800",
      howToUse: "Filtra por 'Mujer, 22 años, Latina' para obtener semillas coherentes con Sweet Blondie o Valeria.",
    },
    {
      category: "images",
      name: "Hugging Face Spaces (Flux.1 Schnell & Dev)",
      type: "Generador de Imágenes 8K",
      cost: "100% Gratis ($0) en la Nube",
      url: "https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell",
      desc: "El modelo más avanzado del mundo para fotorrealismo, textura de piel y manos perfectas sin pagar Midjourney.",
      badge: "Flux Open Source",
      badgeColor: "bg-cyan-100 text-cyan-900",
      howToUse: "Pega tus Character Tags con ratio 9:16 (896x1152) y genera fotos en menos de 4 segundos.",
    },
    {
      category: "images",
      name: "Fooocus (Stable Diffusion + FaceID)",
      type: "Consistencia Facial & Outpainting",
      cost: "100% Open Source • Local / Colab",
      url: "https://github.com/lllyasviel/Fooocus",
      desc: "Software gratuito con interfaz similar a Midjourney. Incluye función 'Image Prompt + FaceID' para mantener siempre la misma cara.",
      badge: "FaceID Gratis",
      badgeColor: "bg-purple-100 text-purple-800",
      howToUse: "Instalable con 1 clic en Windows/Mac o ejecutable gratis en Google Colab con GPU T4.",
    },
    {
      category: "images",
      name: "SeaArt AI & Tensor.Art",
      type: "Generador Web con Créditos Diarios",
      cost: "Plan Gratuito Diario (150+ créditos/día)",
      url: "https://seaart.ai",
      desc: "Plataforma web para generar con Flux, LoRAs de Instagram y hacer Face Swap directamente en la nube sin instalar nada.",
      badge: "Créditos Diarios Gratis",
      badgeColor: "bg-amber-100 text-amber-800",
      howToUse: "Inicia sesión con Google para recibir ~150 créditos gratis diarios que renuevan cada 24hs.",
    },
    {
      category: "video",
      name: "Kling AI (Image-to-Video)",
      type: "Animación 4K en Video",
      cost: "66 Créditos Gratis Diarios (~6 videos/día)",
      url: "https://klingai.com",
      desc: "El mejor motor del mundo para transformar fotos en videos con movimiento natural de cabello, respiración y labios.",
      badge: "Plan Gratis Diario",
      badgeColor: "bg-emerald-100 text-emerald-800",
      howToUse: "Sube la foto 9:16 generada, agrega prompt de movimiento leve y genera videos de 5 segundos gratis.",
    },
    {
      category: "video",
      name: "Luma Dream Machine",
      type: "Movimiento Cinemático 3D",
      cost: "30 Generaciones Gratis al Mes",
      url: "https://lumalabs.ai/dream-machine",
      desc: "Animación de alta fidelidad física con movimientos de cámara en 3D (orbit, pan, zoom in).",
      badge: "Free Tier",
      badgeColor: "bg-blue-100 text-blue-800",
      howToUse: "Utiliza el modo 'Camera Motion: Orbit Left' para videos llamativos en TikTok y Reels.",
    },
    {
      category: "video",
      name: "CogVideoX & Wan 2.1 (Open Source)",
      type: "Generador de Video Local / Hugging Face",
      cost: "100% Open Source y Gratis",
      url: "https://huggingface.co/spaces/THUDM/CogVideoX-5B-Space",
      desc: "Modelo de generación de video de código abierto ejecutable gratuitamente en Hugging Face Spaces o localmente.",
      badge: "100% Open Source",
      badgeColor: "bg-zinc-100 text-zinc-800",
      howToUse: "Ejecútalo gratis en Hugging Face Spaces o en local con Pinokio.",
    },
    {
      category: "audio",
      name: "Edge-TTS (Microsoft Neural Voice)",
      type: "Voz Realista sin Límites",
      cost: "100% Gratis e Ilimitado ($0)",
      url: "https://github.com/rany2/edge-tts",
      desc: "Utiliza las voces neuronales ultra-realistas en español y más de 40 idiomas sin pagar suscripciones a ElevenLabs.",
      badge: "Sin Límites ($0)",
      badgeColor: "bg-emerald-100 text-emerald-800",
      howToUse: "Disponible en Python/Node.js o mediante bots de Discord/Telegram gratuitos.",
    },
    {
      category: "audio",
      name: "Kokoro-82M & Piper TTS",
      type: "Síntesis de Audio Open Source",
      cost: "100% Open Source de Calidad Estudio",
      url: "https://huggingface.co/hexgrad/Kokoro-82M",
      desc: "Modelo de síntesis de voz de solo 82M parámetros, de peso liviano y calidad idéntica a humanos reales.",
      badge: "Open Source Audio",
      badgeColor: "bg-purple-100 text-purple-800",
      howToUse: "Pruébalo gratis en Hugging Face Spaces o intégalo al backend del bot de Telegram.",
    },
    {
      category: "local",
      name: "Pinokio (1-Click AI Browser)",
      type: "Instalador Local Todo en Uno",
      cost: "100% Gratis y Open Source",
      url: "https://pinokio.computer",
      desc: "Instala con 1 solo clic Fooocus, ComfyUI, FaceFusion, Whisper, Flux y RoOP en tu PC sin tocar comandos de terminal.",
      badge: "1-Click Installer",
      badgeColor: "bg-cyan-100 text-cyan-900",
      howToUse: "Descarga Pinokio, haz clic en 'Install Fooocus' o 'Install FaceFusion' y listo.",
    },
  ];

  const filteredTools = activeCategory === "all" 
    ? freeTools 
    : freeTools.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Hero Banner: 100% Free AI Architecture */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>ARQUITECTURA 100% GRATUITA ($0 COSTO)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Directorio de Inteligencias Artificiales 100% Gratuitas y Open Source
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed">
            No necesitas pagar suscripciones mensuales a Midjourney ($30/mes), ElevenLabs ($22/mes) ni Runway ($28/mes). Todo el ecosistema de <strong>Telesui</strong> está diseñado para operar con herramientas <strong>100% gratuitas, open source y con cuotas diarias renovables de por vida</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <span className="text-xs text-zinc-400 block">Rostros Sintéticos</span>
              <span className="text-sm font-bold text-emerald-400">$0 (Ilimitado)</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <span className="text-xs text-zinc-400 block">Fotos 8K (Flux)</span>
              <span className="text-sm font-bold text-emerald-400">$0 (Hugging Face)</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <span className="text-xs text-zinc-400 block">Video I2V (Kling)</span>
              <span className="text-sm font-bold text-emerald-400">$0 (Créditos Diarios)</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <span className="text-xs text-zinc-400 block">Voz Sintética</span>
              <span className="text-sm font-bold text-emerald-400">$0 (Edge-TTS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: "all", label: "Todas las IAs Gratuitas", count: freeTools.length },
          { id: "faces", label: "Rostros Sintéticos", count: freeTools.filter(t => t.category === "faces").length },
          { id: "images", label: "Generadores de Fotos 8K", count: freeTools.filter(t => t.category === "images").length },
          { id: "video", label: "Video y Animación I2V", count: freeTools.filter(t => t.category === "video").length },
          { id: "audio", label: "Voz & Audio TTS", count: freeTools.filter(t => t.category === "audio").length },
          { id: "local", label: "Instalación Local (1-Clic)", count: freeTools.filter(t => t.category === "local").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeCategory === tab.id
                ? "bg-black text-white shadow-sm"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCategory === tab.id ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-600"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    {tool.type}
                  </span>
                  <h3 className="text-base font-bold text-zinc-950 leading-snug">
                    {tool.name}
                  </h3>
                </div>
                <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{tool.cost}</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {tool.desc}
              </p>

              {/* How to use tip */}
              <div className="rounded-xl bg-zinc-50 p-2.5 border border-zinc-100 text-[11px] text-zinc-700">
                <strong className="text-zinc-900 block mb-0.5">Cómo usarlo al 100% gratis:</strong>
                <p className="text-zinc-500">{tool.howToUse}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
              >
                <span>Abrir Herramienta Gratuita</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={() => handleCopy(tool.url, `tool-url-${idx}`)}
                className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 transition-all"
                title="Copiar Enlace"
              >
                {copiedCode === `tool-url-${idx}` ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Zero Cost Production Pipeline Summary Card */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-4">
        <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-black" />
          Pipeline de Producción Completo ($0 USD de Costo Operativo)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1">
            <span className="font-black text-black">1. Rostro Base</span>
            <p className="text-zinc-600">ThisPersonDoesNotExist (StyleGAN2)</p>
            <span className="text-[10px] text-emerald-600 font-bold block">Costo: $0.00</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1">
            <span className="font-black text-black">2. Fotos 9:16 & FaceLock</span>
            <p className="text-zinc-600">Fooocus / Flux Schnell en HuggingFace</p>
            <span className="text-[10px] text-emerald-600 font-bold block">Costo: $0.00</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1">
            <span className="font-black text-black">3. Animación Reels/TikTok</span>
            <p className="text-zinc-600">Kling 3.0 (Créditos Diarios) / CogVideo</p>
            <span className="text-[10px] text-emerald-600 font-bold block">Costo: $0.00</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1">
            <span className="font-black text-black">4. Voz & Mensajes Telegram</span>
            <p className="text-zinc-600">Edge-TTS / Web Speech API en navegador</p>
            <span className="text-[10px] text-emerald-600 font-bold block">Costo: $0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
