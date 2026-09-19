import React, { useState, useEffect } from "react";
import { Volume2, Play, Square, Mic, Copy, Check, Terminal, Sparkles, Zap, ExternalLink } from "lucide-react";

interface VoiceSynthesisPreviewProps {
  influencerName: string;
  bio: string;
  vibe: string;
  nationality: string;
}

export const VoiceSynthesisPreview: React.FC<VoiceSynthesisPreviewProps> = ({
  influencerName,
  bio,
  vibe,
  nationality,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pitch, setPitch] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.0);
  const [hasSupport, setHasSupport] = useState<boolean>(true);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [mode, setMode] = useState<"browser" | "edgetts">("browser");

  // Sample voice notes
  const sampleLines = [
    `¡Hola mi amor! Soy ${influencerName}. Bienvenido a mi club VIP exclusivo en Telegram. Subo fotos 4K y videos verticales todos los días.`,
    `Hola amor, te dejé un regalito especial en el canal VIP. Escaneá el QR de SUI y desbloquealo ahora mismo.`,
    `¡Atención! Acabo de publicar un nuevo set exclusivo de fotos con Face Swap HD. ¡Accedé ahora abonando con SUI o Mercado Pago ARS!`,
  ];

  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [spokenText, setSpokenText] = useState<string>(sampleLines[0]);

  // Sync spoken text when sample or influencer changes
  useEffect(() => {
    setSpokenText(
      sampleLines[selectedSampleIndex] ||
        `¡Hola! Soy ${influencerName}, creadora VIP. Escuchá la vista previa de mi voz sintética.`
    );
  }, [selectedSampleIndex, influencerName]);

  // Load browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setHasSupport(false);
      return;
    }

    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (avail && avail.length > 0) {
        setVoices(avail);
        // Find best default voice (Prefer Spanish or Female voices)
        const defaultVoice =
          avail.find((v) => v.lang.startsWith("es") || v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("google")) ||
          avail[0];
        if (defaultVoice) {
          setSelectedVoiceName(defaultVoice.name);
        }
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlaySpeech = () => {
    if (!hasSupport || typeof window === "undefined") return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.pitch = pitch;
    utterance.rate = rate;

    if (selectedVoiceName) {
      const voiceObj = voices.find((v) => v.name === selectedVoiceName);
      if (voiceObj) {
        utterance.voice = voiceObj;
      }
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const edgeTtsPythonCode = `# 100% GRATIS ($0) - Generar Audio para Telegram con Edge-TTS
# pip install edge-tts
import asyncio
import edge_tts

TEXT = "${spokenText.replace(/"/g, '\\"')}"
VOICE = "es-AR-ElenaNeural"  # Opciones: es-AR-ElenaNeural, es-MX-DaliaNeural, es-ES-ElviraNeural
OUTPUT_FILE = "welcome_voice_note.ogg"

async def generate_voice():
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+5%", pitch="+2Hz")
    await communicate.save(OUTPUT_FILE)
    print("✅ Nota de voz generada con éxito: " + OUTPUT_FILE)

if __name__ == "__main__":
    asyncio.run(generate_voice())
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(edgeTtsPythonCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-black p-2 text-white">
            <Mic className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black tracking-tight flex items-center gap-1.5">
              Voz Sintética IA (100% Gratis • $0 Costo)
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                Edge-TTS & Web Speech
              </span>
            </h4>
            <p className="text-[11px] text-zinc-500">
              Escuchá cómo suena la voz de <strong>{influencerName}</strong> sin pagar suscripciones a ElevenLabs.
            </p>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-1">
            <span className="h-2 w-1 bg-emerald-500 rounded-full animate-pulse" />
            <span className="h-3.5 w-1 bg-emerald-500 rounded-full animate-pulse delay-75" />
            <span className="h-2 w-1 bg-emerald-500 rounded-full animate-pulse delay-150" />
            <span className="text-[10px] font-bold text-emerald-600 ml-1">Reproduciendo...</span>
          </div>
        )}
      </div>

      {/* Tabs: Browser Live Test vs Edge-TTS Script */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => setMode("browser")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === "browser" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          🔊 Probar en Navegador
        </button>
        <button
          onClick={() => setMode("edgetts")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
            mode === "edgetts" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span>Edge-TTS Code (Gratis)</span>
        </button>
      </div>

      {mode === "browser" ? (
        <div className="space-y-3 text-xs">
          {/* Preset Voice Notes Selectors */}
          <div>
            <label className="font-semibold text-zinc-700 mb-1.5 block">
              Guion de Nota de Voz VIP:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleLines.map((line, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSampleIndex(idx);
                    setSpokenText(line);
                  }}
                  className={`p-2 rounded-xl text-left text-[11px] leading-snug border transition-all ${
                    selectedSampleIndex === idx
                      ? "border-black bg-zinc-50 font-semibold text-black shadow-xs"
                      : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider font-bold block text-zinc-400 mb-0.5">
                    Guion {idx + 1}
                  </span>
                  <span className="line-clamp-2">{line}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Text Area */}
          <div>
            <textarea
              rows={2}
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder="Escribí aquí cualquier mensaje para probar la voz..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-black focus:outline-none font-sans resize-none"
            />
          </div>

          {/* Controls Bar: Voice selector, pitch, rate, play button */}
          <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Voice dropdown */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Voz del Sistema ({voices.length} disponibles)
              </label>
              <select
                value={selectedVoiceName}
                onChange={(e) => setSelectedVoiceName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-900 focus:border-black focus:outline-none"
              >
                {voices.length === 0 && <option>Cargando voces...</option>}
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Pitch & Rate Sliders */}
            <div className="md:col-span-4 flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                  <span>Tono (Pitch)</span>
                  <span>{pitch.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-black h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                  <span>Velocidad (Rate)</span>
                  <span>{rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-black h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Play & Stop Actions */}
            <div className="md:col-span-3 flex items-center gap-2 justify-end">
              {isPlaying ? (
                <button
                  id="btn-stop-tts"
                  onClick={handleStopSpeech}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Detener</span>
                </button>
              ) : (
                <button
                  id="btn-play-tts"
                  onClick={handlePlaySpeech}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-black py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />
                  <span>Escuchar Voz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              Script Python de Edge-TTS (Ilimitado y Gratis):
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] font-bold text-black hover:underline"
            >
              {copiedScript ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedScript ? "¡Código Copiado!" : "Copiar Script"}</span>
            </button>
          </div>

          <pre className="p-3 bg-zinc-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800">
            {edgeTtsPythonCode}
          </pre>

          <p className="text-[11px] text-zinc-500">
            💡 Las voces neuronales de Microsoft Edge-TTS permiten crear notas de voz ilimitadas para Telegram en formato <code>.ogg</code> sin límites de caracteres ni pagos.
          </p>
        </div>
      )}
    </div>
  );
};
