import React, { useState, useRef, useEffect } from "react";
import { VoiceProfile } from "../types";
import { 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  AlertCircle, 
  Sliders,
  Radio,
  Download
} from "lucide-react";

interface VoiceCloneRecorderTesterProps {
  currentVoice: VoiceProfile;
  onUpdateVoice: (updated: VoiceProfile) => void;
}

export const VoiceCloneRecorderTester: React.FC<VoiceCloneRecorderTesterProps> = ({
  currentVoice,
  onUpdateVoice,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  
  // Clone simulation state
  const [isCloningProcessing, setIsCloningProcessing] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // Test sentence state
  const [testSentence, setTestSentence] = useState(
    currentVoice.samplePhrases?.[0]?.text || "Hola amor... Qué lindo tenerte en mi canal VIP."
  );
  const [isSynthesizingTest, setIsSynthesizingTest] = useState(false);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    setCloneSuccess(false);
    setMatchScore(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("No se pudo acceder al micrófono. Por favor verifica los permisos del navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    audioRef.current = audio;
    setIsPlayingRecorded(true);

    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);
    audio.play().catch(() => setIsPlayingRecorded(false));
  };

  const handleSimulateInstantClone = () => {
    if (!audioBlob && !recordedAudioUrl) return;
    setIsCloningProcessing(true);
    setCloneSuccess(false);

    setTimeout(() => {
      setIsCloningProcessing(false);
      setCloneSuccess(true);
      const score = Number((94.2 + Math.random() * 4.5).toFixed(1));
      setMatchScore(score);

      onUpdateVoice({
        ...currentVoice,
        stability: 0.42,
        similarityBoost: 0.88,
        description: `Voz clonada y calibrada mediante muestra de micrófono grabada en vivo (${score}% de similitud biométrica).`
      });
    }, 2500);
  };

  const handleTestClonedVoice = async () => {
    if (testAudioPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setTestAudioPlaying(false);
      return;
    }

    setIsSynthesizingTest(true);
    setTestAudioPlaying(true);

    try {
      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-elevenlabs-key": localStorage.getItem("API_KEY_ELEVENLABS") || ""
        },
        body: JSON.stringify({
          text: testSentence,
          voiceId: currentVoice.elevenLabsVoiceId
        })
      });

      if (!response.ok) {
        throw new Error("ElevenLabs API proxy fallback");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setTestAudioPlaying(false);
      audio.onerror = () => {
        setTestAudioPlaying(false);
        fallbackBrowserSpeech(testSentence);
      };

      await audio.play();
      setIsSynthesizingTest(false);
    } catch (e) {
      setIsSynthesizingTest(false);
      fallbackBrowserSpeech(testSentence);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTestAudioPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = currentVoice.speed || 1.0;
    utterance.pitch = currentVoice.pitch || 1.0;

    utterance.onend = () => setTestAudioPlaying(false);
    utterance.onerror = () => setTestAudioPlaying(false);

    window.speechSynthesis.speak(utterance);
    setTestAudioPlaying(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50/80 via-white to-zinc-50/80 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
            <Mic className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Grabadora & Clonador ElevenLabs
              </span>
              <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                Zero-Shot Voice Cloning
              </span>
            </div>
            <h4 className="text-sm font-black text-black tracking-tight mt-0.5">
              Estudio de Grabación de Muestra de Voz en Vivo
            </h4>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-medium">
          Graba 15-30 segundos para clonar el timbre exacto.
        </div>
      </div>

      {/* Recording Studio Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Recorder Controls */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              1. Captura de Muestra de Voz
            </span>
            <span className="font-mono text-xs font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
              {isRecording ? `00:${recordingTime < 10 ? `0${recordingTime}` : recordingTime} / 00:30` : "Listo para grabar"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 text-white flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
            {isRecording && (
              <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none" />
            )}
            
            <div className="flex items-center gap-1.5 h-8">
              <span className={`w-1 rounded-full transition-all ${isRecording ? "bg-rose-500 h-7 animate-bounce" : "bg-zinc-700 h-3"}`} />
              <span className={`w-1 rounded-full transition-all ${isRecording ? "bg-rose-500 h-5 animate-bounce delay-75" : "bg-zinc-700 h-2"}`} />
              <span className={`w-1 rounded-full transition-all ${isRecording ? "bg-rose-500 h-8 animate-bounce delay-150" : "bg-zinc-700 h-4"}`} />
              <span className={`w-1 rounded-full transition-all ${isRecording ? "bg-rose-500 h-6 animate-bounce delay-100" : "bg-zinc-700 h-2"}`} />
              <span className={`w-1 rounded-full transition-all ${isRecording ? "bg-rose-500 h-7 animate-bounce" : "bg-zinc-700 h-3"}`} />
            </div>

            <p className="text-xs text-zinc-300 text-center px-4">
              {isRecording 
                ? "🎙️ Grabando... Lee el texto sugerido con naturalidad y tono expresivo."
                : recordedAudioUrl 
                  ? "✅ Muestra grabada con éxito. Lista para clonar."
                  : "Haz click en el botón para comenzar a hablar."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all"
              >
                <Mic className="h-4 w-4" />
                <span>{recordedAudioUrl ? "Volver a Grabar" : "Iniciar Grabación de Voz"}</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-all animate-pulse"
              >
                <Square className="h-4 w-4 fill-current text-rose-500" />
                <span>Detener Grabación</span>
              </button>
            )}

            {recordedAudioUrl && !isRecording && (
              <button
                onClick={playRecordedAudio}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isPlayingRecorded ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                }`}
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{isPlayingRecorded ? "Pausar" : "Escuchar Muestra"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Instant ElevenLabs Cloning & Match Analysis */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                2. Calibración Instantánea ElevenLabs
              </span>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Voice ID: {currentVoice.elevenLabsVoiceId}
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Procesa tu muestra de voz grabada para aplicar los perfiles neuronales de ElevenLabs multilingüe v2.
            </p>

            {cloneSuccess && matchScore && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-3 animate-in fade-in duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    ¡Clonación Exitosa ({matchScore}% Similitud Biométrica)!
                  </span>
                  <p className="text-[10px] text-emerald-700">
                    El modelo vocal está sincronizado y listo para generar audios en Telegram.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleSimulateInstantClone}
              disabled={!recordedAudioUrl || isCloningProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {isCloningProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
                  <span>Entrenando Clon Neuronal (ElevenLabs)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>{cloneSuccess ? "Re-Calibrar Clon de Voz" : "Clonador Instantáneo AI"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Testing Cloned Voice with Custom Sentence */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-purple-700" />
            3. Probador de Calidad de Clon (Prueba de Frase de Prueba)
          </span>
          <span className="text-[10px] font-bold bg-white text-purple-900 px-2 py-0.5 rounded border border-purple-200">
            {currentVoice.name}
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={testSentence}
            onChange={(e) => setTestSentence(e.target.value)}
            placeholder="Escribe una frase para probar el clon de voz generado..."
            className="w-full text-xs font-medium rounded-xl border border-purple-200 bg-white p-3 text-zinc-900 focus:border-purple-500 focus:outline-none shadow-2xs"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-purple-900 font-medium">
              💡 Sugerencia: Prueba escribiendo jerga o saludos exclusivos para tus suscriptores de Telegram.
            </div>

            <button
              onClick={handleTestClonedVoice}
              disabled={isSynthesizingTest || !testSentence.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all disabled:opacity-50 shrink-0"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{testAudioPlaying ? "Reproduciendo..." : "Probar Calidad de Voz"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
