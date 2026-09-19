import React, { useState, useRef } from "react";
import { Terminal, Play, Square, Volume2, Sparkles, Check, Copy, Download, Radio, ShieldCheck, Zap } from "lucide-react";
import { AiInfluencer } from "../types";

interface GoTTSVoiceStudioProps {
  influencer?: AiInfluencer;
}

export const GoTTSVoiceStudio: React.FC<GoTTSVoiceStudioProps> = ({ influencer }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(
    influencer
      ? `¡Hola amor! Soy ${influencer.name}. Escuchá este audio generado 100% gratis con GoTTS y Edge-TTS sin pagar suscripciones.`
      : "¡Hola! Bienvenidos al estudio de voz con GoTTS, la herramienta de texto a voz libre y ultrarrápida."
  );
  const [selectedLang, setSelectedLang] = useState<string>("es");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const goInstallCommand = "go install github.com/aandrew-me/gotts@latest";
  const goUsageExample = `gotts --text "${customText.slice(0, 80)}" --output voice_note.mp3`;

  const handlePlayGoTTS = async () => {
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

    setLoading(true);
    try {
      const res = await fetch("/api/ai/gotts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText, lang: selectedLang }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.onended = () => setIsPlaying(false);
          await audioRef.current.play();
          setLoading(false);
          setIsPlaying(true);
          return;
        }
      }
    } catch (err) {
      console.error("GoTTS server fetch error:", err);
    }

    // Fallback to browser Web Speech API
    setLoading(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(customText);
      utterance.lang = selectedLang === 'es' ? 'es-AR' : 'en-US';
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (text: string, type: 'cmd' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'cmd') {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-emerald-400 shadow-md">
            <Terminal className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-black tracking-tight">GoTTS Studio (Go Text-to-Speech)</h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                100% Gratis • Sin API Key
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Integración oficial basada en <code className="text-zinc-800 font-semibold">github.com/aandrew-me/gotts</code> para síntesis de voz ilimitada.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Motor GoTTS Activo</span>
        </div>
      </div>

      {/* Installation & CLI Guide */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-900 p-4 text-zinc-100 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Terminal className="h-3.5 w-3.5" /> Instalación CLI (Go 1.18+)
          </span>
          <button
            onClick={() => handleCopy(goInstallCommand, 'cmd')}
            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-800 px-2.5 py-1 rounded-lg transition"
          >
            {copiedCmd ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedCmd ? "Copiado" : "Copiar comando"}
          </button>
        </div>
        <div className="text-emerald-300 overflow-x-auto py-1">
          $ {goInstallCommand}
        </div>

        <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80 flex items-center justify-between">
          <span>Ejecución rápida con GoTTS:</span>
          <button
            onClick={() => handleCopy(goUsageExample, 'code')}
            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-800 px-2.5 py-1 rounded-lg transition"
          >
            {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedCode ? "Copiado" : "Copiar uso"}
          </button>
        </div>
        <div className="text-zinc-200 bg-black/50 p-2.5 rounded-lg border border-zinc-800 overflow-x-auto text-[11px]">
          {goUsageExample}
        </div>
      </div>

      {/* Interactive Voice Generator */}
      <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-5">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-emerald-600" /> Probador en Vivo (GoTTS Web Proxy)
        </h4>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-700 mb-1 block">Texto a sintetizar para {influencer?.name || "la modelo"}:</label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none shadow-xs resize-none"
              placeholder="Escribí lo que querés que diga en su nota de voz..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Idioma:</span>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="es">Español (Latino / Argentina)</option>
                <option value="en">English (US)</option>
                <option value="pt">Português (Brasil)</option>
              </select>
            </div>

            <button
              onClick={handlePlayGoTTS}
              disabled={loading || !customText.trim()}
              className="flex items-center gap-2 rounded-xl bg-black hover:bg-zinc-800 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Generando GoTTS...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Square className="h-4 w-4 text-emerald-400 fill-current" />
                  <span>Detener Reproducción</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 text-emerald-400 fill-current" />
                  <span>Reproducir con GoTTS ($0)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="rounded-xl border border-zinc-100 bg-white p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Sin Tarjeta de Crédito
          </div>
          <p className="text-[11px] text-zinc-500">GoTTS no requiere suscripciones ni límites de cuota mensuales como ElevenLabs.</p>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-white p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <Zap className="h-4 w-4 text-emerald-600" /> Ultrarrápido en Go
          </div>
          <p className="text-[11px] text-zinc-500">Escrito en Go para máxima velocidad de conversión de texto a audio MP3.</p>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-white p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black">
            <Radio className="h-4 w-4 text-emerald-600" /> Listo para Telegram
          </div>
          <p className="text-[11px] text-zinc-500">Exportá audios en formato nativo OGG/MP3 para enviar a tus suscriptores VIP.</p>
        </div>
      </div>
    </div>
  );
};
