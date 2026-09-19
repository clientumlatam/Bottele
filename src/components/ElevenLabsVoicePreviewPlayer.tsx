import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, Sparkles, Check, Send, Radio, Terminal } from "lucide-react";
import { AiInfluencer } from "../types";

interface ElevenLabsVoicePreviewPlayerProps {
  influencer: AiInfluencer;
  onPushToBot?: () => void;
}

export const ElevenLabsVoicePreviewPlayer: React.FC<ElevenLabsVoicePreviewPlayerProps> = ({
  influencer,
  onPushToBot,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPushed, setIsPushed] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sampleText = `¡Hola amor! Soy ${influencer.name}. Bienvenid@ a mi canal VIP de Telegram. Escuchá este clip de voz exclusivo generado 100% gratis con GoTTS.`;

  const handleTogglePlay = async () => {
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

    setIsPlaying(true);
    setPlaybackProgress(0);

    // Try GoTTS / Free TTS proxy first (Zero API Key required, 100% free)
    try {
      const res = await fetch("/api/ai/gotts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sampleText,
          lang: "es",
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.onended = () => setIsPlaying(false);
          audioRef.current.ontimeupdate = () => {
            if (audioRef.current && audioRef.current.duration) {
              setPlaybackProgress(
                (audioRef.current.currentTime / audioRef.current.duration) * 100
              );
            }
          };
          await audioRef.current.play();
          return;
        }
      }
    } catch (e) {
      // Fallback to Web Speech API
    }

    // Web Speech Fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      let currentProg = 0;
      const interval = setInterval(() => {
        currentProg += 5;
        if (currentProg > 100) clearInterval(interval);
        setPlaybackProgress(currentProg);
      }, 150);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePushToBotAction = () => {
    setIsPushed(true);
    if (onPushToBot) {
      onPushToBot();
    }
    setTimeout(() => setIsPushed(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/20 to-emerald-50/50 p-4 shadow-xs space-y-3">
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-zinc-900 p-2 text-white shadow-xs">
            <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-950 tracking-tight flex items-center gap-1.5">
              GoTTS Voice Clip (100% Gratis)
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                Zero API Key
              </span>
            </h4>
            <p className="text-[11px] text-zinc-500 truncate max-w-[220px]">
              {influencer.name} • GoTTS & Edge-TTS Engine
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all shadow-sm ${
            isPlaying
              ? "bg-zinc-950 text-white animate-pulse ring-4 ring-emerald-200"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
          title={isPlaying ? "Pausar audio" : "Reproducir audio de voz GoTTS"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
      </div>

      {/* Waveform / Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>{isPlaying ? "Reproduciendo audio GoTTS..." : "Listo para previsualizar"}</span>
          <span>0:04 / 0:08</span>
        </div>
        <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden relative">
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-150"
            style={{ width: `${playbackProgress}%` }}
          />
        </div>
      </div>

      {/* Action: Push to Bot */}
      <div className="pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={handlePushToBotAction}
          className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold shadow-xs transition-all ${
            isPushed
              ? "bg-emerald-600 text-white"
              : "bg-black text-white hover:bg-zinc-800"
          }`}
        >
          {isPushed ? (
            <>
              <Check className="h-3.5 w-3.5 text-white" />
              <span>¡Voz GoTTS sincronizada con Telegram Bot!</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 text-emerald-400" />
              <span>Push GoTTS a Telegram Bot</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

