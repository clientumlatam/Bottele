import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Radio, Download, RefreshCw, Check } from "lucide-react";
import { AiInfluencer } from "../types";

interface AudioWaveformPreviewerProps {
  influencer: AiInfluencer;
}

export const AudioWaveformPreviewer: React.FC<AudioWaveformPreviewerProps> = ({ influencer }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(6.5);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const sampleText = `¡Hola amor! Soy ${influencer.name}. Escuchá este avance de voz exclusivo generado antes de activar el bot de Telegram.`;
  const voiceName = influencer.voiceProfile?.name || "Elena • Susurro Sensual (Porteño)";

  // Generate audio via GoTTS/TTS proxy or browser speech
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

    setLoading(true);
    try {
      const res = await fetch("/api/ai/gotts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sampleText, lang: "es" }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.onended = () => {
            setIsPlaying(false);
            setCurrentTime(0);
          };
          audioRef.current.ontimeupdate = () => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              if (audioRef.current.duration) {
                setDuration(audioRef.current.duration);
              }
            }
          };
          await audioRef.current.play();
          setLoading(false);
          setIsPlaying(true);
          return;
        }
      }
    } catch (err) {
      console.error("Waveform preview audio fetch error:", err);
    }

    // Fallback Web Speech synthesis with animated timer
    setLoading(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.lang = "es-AR";
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      let t = 0;
      const interval = setInterval(() => {
        t += 0.1;
        setCurrentTime(t);
        if (t >= duration) {
          clearInterval(interval);
        }
      }, 100);
    }
  };

  // Render animated waveform visualizer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let step = 0;
    const render = () => {
      step += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barsCount = 48;
      const barWidth = canvas.width / barsCount - 2;
      
      for (let i = 0; i < barsCount; i++) {
        const x = i * (barWidth + 2);
        // compute wave height
        let heightMultiplier = Math.sin(i * 0.3 + (isPlaying ? step * 4 : 0)) * 0.5 + 0.5;
        if (!isPlaying) {
          heightMultiplier = 0.2 + Math.sin(i * 0.4) * 0.15;
        } else {
          // add some random frequency modulation
          heightMultiplier = Math.min(1, Math.max(0.15, heightMultiplier * (0.8 + Math.random() * 0.4)));
        }

        const barHeight = Math.max(4, heightMultiplier * (canvas.height - 4));
        const y = (canvas.height - barHeight) / 2;

        // color based on progress
        const progressRatio = i / barsCount;
        const currentRatio = currentTime / duration;

        if (progressRatio <= currentRatio && isPlaying) {
          ctx.fillStyle = "#10b981"; // emerald for played bars
        } else {
          ctx.fillStyle = "#d1d5db"; // gray for unplayed bars
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `${influencer.name.toLowerCase().replace(/\s+/g, "_")}_voice_sample.mp3`;
      a.click();
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              Visualizador de Onda de Voz (Waveform Preview)
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                HD Audio
              </span>
            </h4>
            <p className="text-[11px] text-zinc-500">
              {voiceName} • {influencer.nationality}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={!audioUrl}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-700 hover:text-black bg-zinc-100 px-2.5 py-1.5 rounded-lg transition disabled:opacity-40"
            title="Descargar audio MP3"
          >
            <Download className="h-3 w-3" />
            <span>Descargar</span>
          </button>
        </div>
      </div>

      {/* Canvas Waveform */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-900 p-4 flex flex-col items-center justify-center space-y-3 shadow-inner">
        <div className="w-full h-16 flex items-center justify-center relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={60}
            className="w-full h-full max-h-16 object-contain"
          />
        </div>

        {/* Playback Controls Bar */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-zinc-800 text-zinc-300">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition shadow-md disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>

            <div className="text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                {Math.floor(currentTime)}:{Math.floor((currentTime % 1) * 10).toString().padEnd(1, "0")}
              </span>
              <span className="text-zinc-500"> / {Math.floor(duration)}:00</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="hidden sm:inline">Calidad: </span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
              320kbps MP3
            </span>
          </div>
        </div>
      </div>

      {/* Sample text snippet previewed */}
      <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-xs text-zinc-700 italic">
        "{sampleText}"
      </div>
    </div>
  );
};
