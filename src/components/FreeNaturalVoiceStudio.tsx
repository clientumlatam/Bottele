import React, { useState, useRef, useEffect } from "react";
import { 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Sparkles, 
  Zap, 
  Send, 
  Check, 
  Copy, 
  MessageSquare, 
  Radio, 
  Sliders, 
  ArrowRight, 
  CheckCircle2,
  RefreshCw,
  Flame,
  UserCheck,
  ShieldCheck,
  Heart
} from "lucide-react";
import { AiInfluencer } from "../types";

interface FreeNaturalVoiceStudioProps {
  influencer: AiInfluencer;
  onUpdateInfluencer?: (updated: AiInfluencer) => void;
  onNavigateToSimulator?: () => void;
  onNavigateNext?: () => void;
}

const NATURAL_ACCENTS = [
  { id: "es-AR", label: "Argentina (Porteña)", flag: "🇦🇷", desc: "Tono cálido, seductor y amigable", langCode: "es" },
  { id: "es-CO", label: "Colombia (Paisa)", flag: "🇨🇴", desc: "Tono dulce, cariñoso y melodioso", langCode: "es" },
  { id: "es-ES", label: "España (Castellana)", flag: "🇪🇸", desc: "Tono elegante, claro y sofisticado", langCode: "es" },
  { id: "es-MX", label: "México (Norteña/CDMX)", flag: "🇲🇽", desc: "Tono fresco, juvenil y alegre", langCode: "es" },
  { id: "es-US", label: "Español Neutro", flag: "🌎", desc: "Tono internacional para audiencias globales", langCode: "es" },
];

export const FreeNaturalVoiceStudio: React.FC<FreeNaturalVoiceStudioProps> = ({
  influencer,
  onUpdateInfluencer,
  onNavigateToSimulator,
  onNavigateNext,
}) => {
  const [selectedAccent, setSelectedAccent] = useState<string>("es-AR");
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.05);
  const [selectedTone, setSelectedTone] = useState<string>("playful");
  const [customText, setCustomText] = useState<string>(
    `¡Hola mi amor! Soy ${influencer?.name || "tu modelo VIP"}. Qué lindo que estés acá en mi canal exclusivo. Te mando este audio para darte la bienvenida y recordarte que en el mensaje fijado tenés todo el contenido sin censura. ¡Escribime al privado cuando quieras!`
  );

  const PERSONA_TONES = [
    { id: "professional", label: "Profesional", icon: ShieldCheck, desc: "Elegante y respetuoso" },
    { id: "playful", label: "Divertida", icon: Sparkles, desc: "Alegre y con emojis" },
    { id: "seductive", label: "Seductora", icon: Flame, desc: "Íntima y provocativa" },
    { id: "formal", label: "Formal", icon: UserCheck, desc: "Seria y directa" },
  ];

  // Quick phrase templates
  const quickPhrases = [
    {
      title: "👋 Bienvenida VIP",
      text: `¡Hola amor! Gracias por unirte a mi canal VIP. Acá vas a ver fotos y videos exclusivos que no subo a ninguna otra red. ¡Disfrutá del contenido! 💋`
    },
    {
      title: "🔥 Oferta Flash SUI",
      text: `¡Atención bombón! Durante las próximas 24 horas podés renovar tu suscripción VIP con un 50% de descuento abonando en SUI. ¡Aprovechalo antes de que termine!`
    },
    {
      title: "💋 Nota Íntima",
      text: `Hola corazón, recién termino de grabar una sesión de fotos increíble y quería que fueras el primero en verla. Entrá al chat fijado que ya está disponible.`
    },
    {
      title: "⚠️ Recordatorio de Pago",
      text: `Hola cariño, tu suscripción está por expirar en las próximas horas. Renová ahora para no perder tu acceso al grupo privado y seguir chateando conmigo.`
    }
  ];
  
  const [engineMode, setEngineMode] = useState<"gotts" | "browser">("gotts");
  const [isHumanizing, setIsHumanizing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [sentToBotToast, setSentToBotToast] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleHumanizeScript = async () => {
    if (!customText.trim() || isHumanizing) return;
    setIsHumanizing(true);
    try {
      const res = await fetch("/api/ai/humanize-voice-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: customText,
          tone: selectedTone,
          accent: selectedAccent,
          modelName: influencer?.name || "Modelo VIP",
        }),
      });
      const data = await res.json();
      if (data.success && data.humanizedText) {
        setCustomText(data.humanizedText);
      }
    } catch (e) {
      console.warn("Humanizing script error:", e);
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleGenerateAndPlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    if (engineMode === "browser") {
      playWithBrowserTts();
      return;
    }

    try {
      const res = await fetch("/api/ai/gotts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: customText, 
          accent: selectedAccent,
          lang: selectedAccent 
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.playbackRate = speed;
          audioRef.current.onended = () => setIsPlaying(false);
          audioRef.current.onerror = () => {
            playWithBrowserTts();
          };
          await audioRef.current.play();
          setIsLoading(false);
          setIsPlaying(true);
          return;
        }
      }
    } catch (e) {
      console.warn("GoTTS fetch error, using High-Quality Browser Speech Engine:", e);
    }

    playWithBrowserTts();
  };

  const playWithBrowserTts = () => {
    setIsLoading(false);
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(customText);
      utterance.lang = selectedAccent;
      utterance.rate = speed;
      utterance.pitch = pitch;

      // Find female or natural neural voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLang = selectedAccent.split('-')[0];
      const matchingVoice = voices.find(v => 
        (v.lang.toLowerCase().includes(selectedAccent.toLowerCase()) || v.lang.toLowerCase().startsWith(targetLang)) && 
        (v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("Online") || v.name.includes("Female") || v.name.includes("Sabina") || v.name.includes("Helena") || v.name.includes("Paulina") || v.name.includes("Elena") || v.name.includes("Salma") || v.name.includes("Google"))
      ) || voices.find(v => v.lang.toLowerCase().startsWith(targetLang));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendToBot = () => {
    setSentToBotToast(true);
    setTimeout(() => setSentToBotToast(false), 2500);
    if (onNavigateToSimulator) {
      onNavigateToSimulator();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(customText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `${influencer.name.toLowerCase().replace(/\s+/g, "_")}_audio_nota.mp3`;
      a.click();
    } else {
      handleGenerateAndPlay();
    }
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />

      {/* Main Studio Card */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header with 100% Free Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={influencer.avatarUrl} 
                alt={influencer.name} 
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] shadow-sm">
                <Volume2 className="h-3 w-3" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                  Voz Natural Libre • {influencer.name}
                </h3>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-800 uppercase tracking-wider shadow-2xs">
                  100% Gratis • Sin Límites
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Motor de síntesis neural en español de alta fidelidad. Sin suscripciones ni claves de pago.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">Motor de Audio Activo</span>
          </div>
        </div>

        {/* Accent Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
            <Radio className="h-4 w-4 text-purple-600" />
            1. Selecciona el Acento Natural de la Modelo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {NATURAL_ACCENTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccent(acc.id)}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  selectedAccent === acc.id
                    ? "border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500"
                    : "border-zinc-200 bg-zinc-50/70 hover:border-zinc-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{acc.flag}</span>
                  <span className="text-xs font-bold text-zinc-900">{acc.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-tight">
                  {acc.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Persona Tone Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            2. Define el Tono de la Persona (IA System Prompt)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PERSONA_TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  selectedTone === tone.id
                    ? "border-pink-500 bg-pink-50/50 ring-1 ring-pink-500 shadow-xs"
                    : "border-zinc-200 bg-zinc-50/70 hover:border-zinc-300 hover:bg-white"
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedTone === tone.id ? "bg-pink-500 text-white" : "bg-zinc-200 text-zinc-500"}`}>
                  <tone.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-zinc-900 block">{tone.label}</span>
                  <span className="text-[9px] text-zinc-500">{tone.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Phrase Presets */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            3. Guiones Rápidos de Telegram VIP
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => setCustomText(phrase.text)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-700 hover:border-purple-500 hover:bg-purple-50/30 hover:text-purple-900 transition text-left flex items-center gap-1.5 truncate shadow-2xs"
              >
                <span>{phrase.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Prompt & Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              3. Mensaje a Sintetizar para la Nota de Voz
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleHumanizeScript}
                disabled={isHumanizing || !customText.trim()}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl px-3 py-1 transition shadow-2xs"
                title="Añade pausas, modismos locales e inflexión humana al texto gratis con Gemini"
              >
                {isHumanizing ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                )}
                <span>{isHumanizing ? "Humanizando..." : "✨ Humanizar con IA (Gratis)"}</span>
              </button>

              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-black transition"
              >
                {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedText ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 text-xs sm:text-sm font-medium text-zinc-800 focus:bg-white focus:border-black focus:outline-none transition leading-relaxed shadow-inner"
            placeholder="Escribe lo que dirá la modelo en su nota de voz..."
          />
        </div>

        {/* Engine Selection & Audio Customization */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            4. Motor de Síntesis Vocal Libre (100% Gratis)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setEngineMode("gotts")}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                engineMode === "gotts"
                  ? "border-purple-600 bg-purple-50/60 ring-1 ring-purple-500 shadow-xs"
                  : "border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 hover:bg-white"
              }`}
            >
              <div className={`p-2 rounded-xl mt-0.5 ${engineMode === "gotts" ? "bg-purple-600 text-white" : "bg-zinc-200 text-zinc-600"}`}>
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-black text-zinc-900 block">Motor Neural Cloud (Google Free)</span>
                <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">
                  Multi-fragmento sin límite de caracteres. Soporta acentos nativos (es-AR, es-MX, es-ES, es-CO).
                </span>
                <span className="inline-block mt-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  100% Gratis • Descargable MP3
                </span>
              </div>
            </button>

            <button
              onClick={() => setEngineMode("browser")}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                engineMode === "browser"
                  ? "border-purple-600 bg-purple-50/60 ring-1 ring-purple-500 shadow-xs"
                  : "border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 hover:bg-white"
              }`}
            >
              <div className={`p-2 rounded-xl mt-0.5 ${engineMode === "browser" ? "bg-purple-600 text-white" : "bg-zinc-200 text-zinc-600"}`}>
                <Radio className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-black text-zinc-900 block">Motor Sistema Browser HD</span>
                <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">
                  Usa las voces Neurales de tu sistema (Microsoft Online Natural / Google Speech).
                </span>
                <span className="inline-block mt-1 text-[9px] font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                  Latencia Cero • Ultra Realista
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Sliders: Velocity & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-zinc-50 p-4 border border-zinc-200/80">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-purple-600" />
                Velocidad de Lectura
              </span>
              <span className="font-mono text-purple-700">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.3"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
              <span>Lenta (0.75x)</span>
              <span>Normal (1.0x)</span>
              <span>Rápida (1.3x)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-purple-600" />
                Tono / Modulación Femenina
              </span>
              <span className="font-mono text-purple-700">{pitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
              <span>Grave / ASMR</span>
              <span>Natural</span>
              <span>Agudo / Juvenil</span>
            </div>
          </div>
        </div>

        {/* Waveform Player & Action Buttons */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className={`h-4 w-4 ${isPlaying ? 'text-pink-400 animate-pulse' : 'text-zinc-500'}`} />
              <span className="text-xs font-bold tracking-wide">
                {isPlaying ? "Reproduciendo Nota de Voz..." : "Previsualización de Onda de Audio"}
              </span>
            </div>
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-purple-300">
              MP3 44.1kHz • High Quality
            </span>
          </div>

          {/* Canvas Waveform */}
          <div className="w-full h-16 bg-zinc-900 rounded-xl flex items-center justify-center p-2">
            <canvas ref={canvasRef} width={600} height={60} className="w-full h-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateAndPlay}
                disabled={isLoading || !customText.trim()}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition shadow-md ${
                  isPlaying 
                    ? "bg-rose-600 text-white hover:bg-rose-700" 
                    : "bg-white text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Sintetizando...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pausar Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Generar & Escuchar Gratis</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadAudio}
                className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2.5 text-xs font-bold transition"
                title="Descargar archivo de audio MP3"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Descargar MP3</span>
              </button>
            </div>

            <button
              onClick={handleSendToBot}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 text-xs font-bold transition shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Usar en Simulador Telegram</span>
            </button>
          </div>
        </div>

        {/* Step Progression CTA */}
        {onNavigateNext && (
          <div className="flex justify-end pt-2">
            <button
              onClick={onNavigateNext}
              className="flex items-center gap-2 rounded-2xl bg-black text-white px-6 py-3 text-xs font-black hover:bg-zinc-800 transition shadow-md"
            >
              <span>Continuar al Paso 3: Face Swap de Fotos & Videos</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
