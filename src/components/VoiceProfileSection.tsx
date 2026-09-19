import React, { useState, useEffect } from "react";
import { AiInfluencer, VoiceProfile } from "../types";
import { AlertTriangle } from "lucide-react";
import { VOICE_PERSONALITY_PRESETS } from "../data/voicePresets";
import { VoiceCloneRecorderTester } from "./VoiceCloneRecorderTester";
import { GoTTSVoiceStudio } from "./GoTTSVoiceStudio";
import { 
  Volume2, 
  Play, 
  Square, 
  Mic, 
  Copy, 
  Check, 
  Sparkles, 
  Sliders, 
  Wand2, 
  Terminal, 
  Zap, 
  Music, 
  Flame, 
  RefreshCw, 
  Radio, 
  Settings2, 
  MessageSquare,
  ShieldAlert,
  Download,
  ExternalLink
} from "lucide-react";

interface VoiceProfileSectionProps {
  influencer: AiInfluencer;
  onUpdateInfluencer: (updated: AiInfluencer) => void;
}

export const VoiceProfileSection: React.FC<VoiceProfileSectionProps> = ({
  influencer,
  onUpdateInfluencer,
}) => {
  // Current active voice profile or fallback to first preset
  const currentVoice: VoiceProfile = influencer.voiceProfile || VOICE_PERSONALITY_PRESETS[0];

  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentVoice.id);
  const [activeTab, setActiveTab] = useState<"presets" | "recorder" | "customizer" | "scripts" | "code" | "live" | "gotts">("gotts");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [customVoicePrompt, setCustomVoicePrompt] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Audio Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingText, setPlayingText] = useState<string>("");
  const [customScriptText, setCustomScriptText] = useState<string>(
    currentVoice.samplePhrases?.[0]?.text ||
      `Hola amor... Qué lindo tenerte en mi canal VIP. Te dejé un regalito especial en el mensaje fijado 💋`
  );
  const [selectedScriptIdx, setSelectedScriptIdx] = useState<number>(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>(() => localStorage.getItem("API_KEY_ELEVENLABS") || "");
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);

  const handleSaveElevenKey = (newKey: string) => {
    setElevenLabsApiKey(newKey);
    localStorage.setItem("API_KEY_ELEVENLABS", newKey);
    setKeySaveSuccess(true);
    setTimeout(() => setKeySaveSuccess(false), 2500);
  };

  // Stop any speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, [audioElement]);

  // Sync customScriptText when preset changes
  const handleSelectPreset = (preset: VoiceProfile) => {
    setSelectedPresetId(preset.id);
    const firstPhrase = preset.samplePhrases[0]?.text || "";
    setCustomScriptText(firstPhrase);
    setSelectedScriptIdx(0);
    onUpdateInfluencer({
      ...influencer,
      voiceProfile: preset,
    });
  };

  // Update specific slider in active voiceProfile
  const handleUpdateParameter = (key: keyof VoiceProfile, value: any) => {
    const updated: VoiceProfile = {
      ...currentVoice,
      [key]: value,
    };
    onUpdateInfluencer({
      ...influencer,
      voiceProfile: updated,
    });
  };

  // Play audio preview via Web Speech API or ElevenLabs proxy
  const handlePlayVoice = async (textToSpeak: string) => {
    setApiError(null);
    if (isPlaying && playingText === textToSpeak) {
      handleStopVoice();
      return;
    }

    handleStopVoice(); // Stop any existing playing audio

    if (currentVoice.provider === "ElevenLabs" && currentVoice.elevenLabsVoiceId) {
      setIsPlaying(true);
      setPlayingText(textToSpeak);
      try {
        const response = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-elevenlabs-key": localStorage.getItem("API_KEY_ELEVENLABS") || ""
          },
          body: JSON.stringify({
            text: textToSpeak,
            voiceId: currentVoice.elevenLabsVoiceId
          })
        });

        if (!response.ok) {
          let errorMsg = "Fallo en la API de ElevenLabs";
          try {
            const errData = await response.json();
            errorMsg = errData.error || errorMsg;
          } catch(e) {}
          throw new Error(errorMsg);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const newAudio = new Audio(url);
        setAudioElement(newAudio);
        
        newAudio.onended = () => {
          setIsPlaying(false);
          setPlayingText("");
        };
        newAudio.onerror = () => {
          setIsPlaying(false);
          setPlayingText("");
        };
        
        await newAudio.play();
      } catch (err: any) {
        console.log("ElevenLabs TTS local fallback active:", err);
        setApiError(err.message || "Error al conectar con ElevenLabs. Verifica tu API Key o Voice ID.");
        playFallbackLocalVoice(textToSpeak);
      }
    } else {
      playFallbackLocalVoice(textToSpeak);
    }
  };

  const playFallbackLocalVoice = (textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = currentVoice.speed || 1.0;
    utterance.pitch = currentVoice.pitch || 1.0;

    // Pick best available browser voice
    const voices = window.speechSynthesis.getVoices();
    const isSpanish = currentVoice.language.toLowerCase().includes("español") || currentVoice.accent.toLowerCase().includes("argentin") || currentVoice.accent.toLowerCase().includes("español");
    
    let matchedVoice = voices.find(
      (v) =>
        (isSpanish ? v.lang.startsWith("es") : true) &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("paulina") ||
          v.name.toLowerCase().includes("monica") ||
          v.name.toLowerCase().includes("lucia"))
    ) || voices.find((v) => isSpanish ? v.lang.startsWith("es") : true) || voices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setPlayingText(textToSpeak);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setPlayingText("");
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setPlayingText("");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
      setAudioElement(null);
    }
    setIsPlaying(false);
    setPlayingText("");
  };

  // Copy code helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // AI Voice Personality Generator using character data & niche
  const handleGenerateAiVoice = async () => {
    setIsAiGenerating(true);
    try {
      // Simulate/Trigger AI Voice profile synthesis based on model data
      const isAdult = Boolean(influencer.isAdultContent);
      const isArgentine = influencer.nationality.toLowerCase().includes("argentin");
      const isSpanish = influencer.nationality.toLowerCase().includes("span") || influencer.nationality.toLowerCase().includes("españ");

      const generatedProfile: VoiceProfile = {
        id: `custom-voice-${Date.now()}`,
        name: `${influencer.name} • ${customVoicePrompt || (isAdult ? "Sensual Whisper & Velvet Intimacy" : "Charming Glamour & Vocal Sparkle")}`,
        provider: "ElevenLabs",
        accent: isArgentine ? "Argentino Rioplatense" : isSpanish ? "Español Madrid" : "Latinoamericano Neutro",
        language: "Español & English Spanglish",
        gender: "female",
        tone: isAdult ? "sultry_whisper" : "playful_energetic",
        description: `Personalidad vocal diseñada especialmente para ${influencer.name}. ${customVoicePrompt || influencer.vibe}. Modulación natural para audios de Telegram.`,
        elevenLabsVoiceId: isAdult ? "21m00Tcm4TlvDq8ikWAM" : "AZnzlk1XvdvUeBnXmlld",
        edgeTtsVoice: isArgentine ? "es-AR-ElenaNeural" : isSpanish ? "es-ES-ElviraNeural" : "es-MX-DaliaNeural",
        stability: isAdult ? 0.39 : 0.50,
        similarityBoost: 0.86,
        styleExaggeration: isAdult ? 0.28 : 0.16,
        speed: isAdult ? 0.94 : 1.02,
        pitch: isAdult ? 1.02 : 1.04,
        tags: [isAdult ? "18+ VIP" : "Lifestyle", "Sensual", "Telegram Bot", "Ultra HD"],
        personalityBioPrompt: `Habla con tono ${isAdult ? "íntimo, susurrado y pícaro" : "cálido, magnético y alegre"}. Refleja la personalidad de ${influencer.name}.`,
        samplePhrases: [
          {
            title: "Bienvenida Personalizada al Canal VIP",
            category: "welcome",
            text: `Hola mi vida... Soy ${influencer.name}. Qué lindo que estés acá en mi canal exclusivo. Ponete cómodo y mirá todo lo que preparé para vos hoy 💋`,
          },
          {
            title: "Teaser Nocturno 18+ Exclusivo",
            category: "intimate_whisper",
            text: `Shhh... Me estoy por ir a dormir pero te grabé este audio para avisarte que acabo de publicar un set 4K que no te podés perder 🔥`,
          },
          {
            title: "Aviso de Pago SUI / Mercado Pago",
            category: "mercadopago_sui",
            text: `Bebé, acordate de renovar tu membresía VIP con tu wallet de SUI o Mercado Pago ARS para seguir disfrutando de mis fotos y videos privados ✨`,
          },
        ],
      };

      onUpdateInfluencer({
        ...influencer,
        voiceProfile: generatedProfile,
      });
      setSelectedPresetId(generatedProfile.id);
      setCustomScriptText(generatedProfile.samplePhrases[0].text);
    } catch (err) {
      console.error("Failed to generate voice profile:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Python ElevenLabs code snippet
  const elevenLabsSnippet = `# ========================================================
# ELEVENLABS TTS INTEGRATION FOR ${influencer.name.toUpperCase()}
# Voice: ${currentVoice.name}
# ========================================================
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings, save

client = ElevenLabs(api_key="YOUR_ELEVENLABS_API_KEY")

audio = client.generate(
    text="${customScriptText.replace(/"/g, '\\"')}",
    voice="${currentVoice.elevenLabsVoiceId}",
    model="eleven_multilingual_v2",
    voice_settings=VoiceSettings(
        stability=${currentVoice.stability.toFixed(2)},
        similarity_boost=${currentVoice.similarityBoost.toFixed(2)},
        style=${currentVoice.styleExaggeration.toFixed(2)},
        use_speaker_boost=True
    )
)

# Guardar nota de voz en formato OGG/MP3 para Telegram
save(audio, "telegram_voice_note.ogg")
print("✅ Nota de voz generada con éxito para Telegram!")
`;

  // Free Edge-TTS snippet
  const edgeTtsSnippet = `# ========================================================
# 100% GRATIS ($0 COSTO) - EDGE-TTS NEURAL VOICE
# Modelo: ${currentVoice.edgeTtsVoice}
# ========================================================
# pip install edge-tts
import asyncio
import edge_tts

TEXT = "${customScriptText.replace(/"/g, '\\"')}"
VOICE = "${currentVoice.edgeTtsVoice}"
OUTPUT_FILE = "bot_audio_${influencer.id}.ogg"

async def main():
    communicate = edge_tts.Communicate(
        text=TEXT,
        voice=VOICE,
        rate="${currentVoice.speed >= 1.0 ? `+${Math.round((currentVoice.speed - 1.0) * 100)}%` : `-${Math.round((1.0 - currentVoice.speed) * 100)}%`}",
        pitch="${currentVoice.pitch >= 1.0 ? `+${Math.round((currentVoice.pitch - 1.0) * 10)}Hz` : `-${Math.round((1.0 - currentVoice.pitch) * 10)}Hz`}"
    )
    await communicate.save(OUTPUT_FILE)
    print("✅ Audio OGG generado sin costo para enviar con telebot / python-telegram-bot")

if __name__ == "__main__":
    asyncio.run(main())
`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm shrink-0">
            <Mic className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Voice Profile
              </span>
              <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                ElevenLabs & Edge-TTS
              </span>
            </div>
            <h3 className="text-base font-extrabold text-black tracking-tight mt-1">
              Perfil de Voz y Personalidad Sonora ({influencer.name})
            </h3>
            <p className="text-xs text-zinc-500">
              Configurá la voz, timbre, susurro y parámetros de síntesis de audio para que tu bot envíe notas de voz hiperrealistas en Telegram.
            </p>
          </div>
        </div>

        {/* Audio Wave Visualizer Animation & Status */}
        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200 shrink-0">
          <div className="flex items-center gap-1">
            <span className={`h-2.5 w-1 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"}`} />
            <span className={`h-4 w-1 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse delay-75" : "bg-zinc-300"}`} />
            <span className={`h-6 w-1 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse delay-150" : "bg-zinc-300"}`} />
            <span className={`h-3.5 w-1 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse delay-100" : "bg-zinc-300"}`} />
            <span className={`h-2 w-1 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"}`} />
          </div>
          <div className="text-left pl-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Estado Vocal
            </span>
            <span className="text-xs font-bold text-zinc-800">
              {isPlaying ? "Hablando en Vivo..." : "Listo para Sintetizar"}
            </span>
          </div>
        </div>
      </div>

      {/* Current Active Voice Card Summary */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/70 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-emerald-950 uppercase tracking-tight">
                Voz Activa: {currentVoice.name}
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed max-w-2xl">
              {currentVoice.description}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/80 text-emerald-900 rounded-md border border-emerald-200">
                Acento: {currentVoice.accent}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/80 text-emerald-900 rounded-md border border-emerald-200">
                Stability: {(currentVoice.stability * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/80 text-emerald-900 rounded-md border border-emerald-200">
                Similarity: {(currentVoice.similarityBoost * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/80 text-emerald-900 rounded-md border border-emerald-200">
                Style: {(currentVoice.styleExaggeration * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPlaying ? (
              <button
                onClick={handleStopVoice}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Detener Audio</span>
              </button>
            ) : (
              <button
                onClick={() => handlePlayVoice(customScriptText)}
                className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />
                <span>Escuchar Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => setActiveTab("gotts")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "gotts"
              ? "bg-zinc-900 text-emerald-400 shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>GoTTS (100% Gratis)</span>
        </button>

        <button
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "presets"
              ? "bg-black text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span>Presets de Personalidad ({VOICE_PERSONALITY_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("recorder")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "recorder"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          <span>Grabadora & Clon AI</span>
        </button>

        <button
          onClick={() => setActiveTab("customizer")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "customizer"
              ? "bg-black text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Calibración ElevenLabs</span>
        </button>

        <button
          onClick={() => setActiveTab("scripts")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "scripts"
              ? "bg-black text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Guiones de Telegram ({currentVoice.samplePhrases?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "code"
              ? "bg-black text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Código & API Python</span>
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "live"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          <span>ElevenLabs Live Listener</span>
        </button>
      </div>

      {/* TAB GOTTS (100% Free / GoTTS Integration) */}
      {activeTab === "gotts" && (
        <GoTTSVoiceStudio influencer={influencer} />
      )}

      {/* TAB 0: RECORDER & CLONE TESTER */}
      {activeTab === "recorder" && (
        <VoiceCloneRecorderTester
          currentVoice={currentVoice}
          onUpdateVoice={(updated) => onUpdateInfluencer({ ...influencer, voiceProfile: updated })}
        />
      )}

      {/* TAB 1: PRESETS SELECTOR */}
      {activeTab === "presets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {VOICE_PERSONALITY_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id || currentVoice.id === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-black bg-zinc-50 ring-1 ring-black shadow-xs"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-zinc-950 block leading-tight">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold block">
                          {preset.accent} • {preset.language}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white shrink-0">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-600 leading-snug">
                      {preset.description}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {preset.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold text-zinc-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Play sample & Select preset */}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-zinc-100">
                    <button
                      onClick={() => handlePlayVoice(preset.samplePhrases[0]?.text || "Hola amor...")}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-zinc-100 py-1.5 px-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-200 transition-all"
                    >
                      <Play className="h-3 w-3 fill-current text-emerald-600" />
                      <span>Probar Audio</span>
                    </button>

                    <button
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-2.5 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-black text-white"
                          : "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                      }`}
                    >
                      {isSelected ? "Seleccionada" : "Usar Voz"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Voice Personality Generator Box */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-black" />
                <h4 className="text-xs font-bold text-black tracking-tight">
                  Generar Personalidad Vocal Personalizada con IA
                </h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                Gemini 3.7 & ElevenLabs Tuner
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={customVoicePrompt}
                onChange={(e) => setCustomVoicePrompt(e.target.value)}
                placeholder={`ej. Voz dulce, susurrada, acento colombiano con risas sutiles para ${influencer.name}...`}
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
              />
              <button
                onClick={handleGenerateAiVoice}
                disabled={isAiGenerating}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Calibrando Timbre...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Generar Perfil de Voz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ELEVENLABS FINE-TUNING SLIDERS */}
      {activeTab === "customizer" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Stability */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-black block">Stability (Estabilidad Emocional)</span>
                  <p className="text-[10px] text-zinc-500">
                    Menor estabilidad = Más inflexión, susurros y aire; Mayor = Voz formal y constante.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {currentVoice.stability.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.01"
                value={currentVoice.stability}
                onChange={(e) => handleUpdateParameter("stability", parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                <span>0.20 (Sensual / Susurro)</span>
                <span>0.50 (Natural)</span>
                <span>0.90 (Noticiero)</span>
              </div>
            </div>

            {/* Similarity Boost */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-black block">Clarity & Similarity Boost</span>
                  <p className="text-[10px] text-zinc-500">
                    Fidelidad al timbre original del modelo y reducción de artefactos de audio.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {currentVoice.similarityBoost.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.30"
                max="1.00"
                step="0.01"
                value={currentVoice.similarityBoost}
                onChange={(e) => handleUpdateParameter("similarityBoost", parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                <span>0.50 (Baja Fidelidad)</span>
                <span>0.85 (Recomendado)</span>
                <span>1.00 (Máxima Fidelidad)</span>
              </div>
            </div>

            {/* Style Exaggeration */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-black block">Style Exaggeration (Dramatismo & Actuación)</span>
                  <p className="text-[10px] text-zinc-500">
                    Amplifica el estilo del susurro o la emoción. (Recomendado 0.15 - 0.30 en ElevenLabs v2).
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {currentVoice.styleExaggeration.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.00"
                max="0.60"
                step="0.01"
                value={currentVoice.styleExaggeration}
                onChange={(e) => handleUpdateParameter("styleExaggeration", parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                <span>0.00 (Neutro)</span>
                <span>0.25 (Óptimo)</span>
                <span>0.50 (Muy Exagerado)</span>
              </div>
            </div>

            {/* Speed & Pitch */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-black block">Velocidad de Habla (Speed Rate)</span>
                  <p className="text-[10px] text-zinc-500">
                    Control de cadencia para audios relajados (0.9x) o enérgicos (1.1x).
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {currentVoice.speed.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.30"
                step="0.02"
                value={currentVoice.speed}
                onChange={(e) => handleUpdateParameter("speed", parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                <span>0.80x (Lento / ASMR)</span>
                <span>1.00x (Normal)</span>
                <span>1.20x (Rápido)</span>
              </div>
            </div>
          </div>

          {/* Model Voice IDs Configuration */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3 text-xs">
            <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5 text-zinc-800" />
              Identificadores de Modelos Vocales en Producción:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  ElevenLabs Voice ID:
                </label>
                <input
                  type="text"
                  value={currentVoice.elevenLabsVoiceId}
                  onChange={(e) => handleUpdateParameter("elevenLabsVoiceId", e.target.value)}
                  className="w-full font-mono text-xs rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Edge-TTS Voice ID (100% Free):
                </label>
                <input
                  type="text"
                  value={currentVoice.edgeTtsVoice}
                  onChange={(e) => handleUpdateParameter("edgeTtsVoice", e.target.value)}
                  className="w-full font-mono text-xs rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEGRAM VOICE NOTE SCRIPTS */}
      {activeTab === "scripts" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {currentVoice.samplePhrases?.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedScriptIdx(idx);
                  setCustomScriptText(phrase.text);
                }}
                className={`p-3 rounded-xl text-left border transition-all text-xs ${
                  selectedScriptIdx === idx
                    ? "border-black bg-zinc-50 shadow-xs font-bold text-black"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Guion {idx + 1} • {phrase.category}
                </span>
                <span className="line-clamp-2">{phrase.title}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-zinc-800" />
                Texto del Guion a Sintetizar:
              </label>
              <button
                onClick={() => handleCopy(customScriptText, "script-copy")}
                className="text-[11px] font-bold text-black hover:underline flex items-center gap-1"
              >
                {copiedCode === "script-copy" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode === "script-copy" ? "¡Copiado!" : "Copiar Texto"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={customScriptText}
              onChange={(e) => setCustomScriptText(e.target.value)}
              placeholder="Escribí aquí cualquier nota de voz para enviar a tus suscriptores de Telegram..."
              className="w-full text-xs font-medium rounded-xl border border-zinc-200 bg-white p-3 text-zinc-900 focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            {isPlaying ? (
              <button
                onClick={handleStopVoice}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Detener Reproducción</span>
              </button>
            ) : (
              <button
                onClick={() => handlePlayVoice(customScriptText)}
                className="flex items-center gap-1.5 rounded-xl bg-black py-2.5 px-5 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />
                <span>Reproducir Nota de Voz</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PYTHON & TELEGRAM BOT INTEGRATION CODE */}
      {activeTab === "code" && (
        <div className="space-y-4 text-xs">
          {/* ElevenLabs Python Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-black" />
                1. Código Python ElevenLabs (Calidad Estudio Multilingual v2):
              </span>
              <button
                onClick={() => handleCopy(elevenLabsSnippet, "code-eleven")}
                className="text-[11px] font-bold text-black hover:underline flex items-center gap-1"
              >
                {copiedCode === "code-eleven" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode === "code-eleven" ? "¡Código Copiado!" : "Copiar Snippet"}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-zinc-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800 leading-relaxed">
              {elevenLabsSnippet}
            </pre>
          </div>

          {/* Edge-TTS Free Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                2. Código Edge-TTS (100% Gratis • $0 Costo • Sin API Key):
              </span>
              <button
                onClick={() => handleCopy(edgeTtsSnippet, "code-edgetts")}
                className="text-[11px] font-bold text-black hover:underline flex items-center gap-1"
              >
                {copiedCode === "code-edgetts" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode === "code-edgetts" ? "¡Código Copiado!" : "Copiar Snippet"}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-zinc-950 text-cyan-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800 leading-relaxed">
              {edgeTtsSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: ELEVENLABS LIVE LISTENER */}
      {activeTab === "live" && (
        <div className="space-y-4">
          {/* Quick API Key Banner */}
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold text-purple-950">ElevenLabs API Key: </span>
                <span className="text-purple-700 font-mono">
                  {elevenLabsApiKey ? `${elevenLabsApiKey.substring(0, 7)}...${elevenLabsApiKey.slice(-4)}` : "No configurada (usará respaldo de voz local)"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="sk_..."
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-purple-300 bg-white font-mono w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={() => handleSaveElevenKey(elevenLabsApiKey)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shrink-0 transition-colors"
              >
                {keySaveSuccess ? "¡Guardada!" : "Guardar Key"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <Mic className="h-4 w-4" /> ElevenLabs Live Listener
            </h4>
            <p className="text-xs text-emerald-800 mb-4 leading-relaxed">
              Probá la voz en tiempo real con la API de ElevenLabs conectada al Voice ID actual (<strong>{currentVoice.elevenLabsVoiceId || "Ninguno"}</strong>). Escribí el mensaje y escuchá cómo sonaría la personalidad vocal en el bot.
            </p>
            
            {apiError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-start gap-2 shadow-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="font-bold text-red-700 mb-0.5">Diagnóstico de ElevenLabs API</p>
                  <p>{apiError}</p>
                  <p className="font-normal mt-1 opacity-80">Reproduciendo voz local (sintetizada por el navegador) como respaldo temporal.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <textarea
                rows={4}
                value={customScriptText}
                onChange={(e) => setCustomScriptText(e.target.value)}
                placeholder="Escribí un mensaje con jerga argentina para probar la voz..."
                className="w-full text-xs font-medium rounded-xl border border-emerald-200 bg-white p-3 text-emerald-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300'}`} />
                  {isPlaying ? 'Transmitiendo streaming de audio...' : 'Listo para probar'}
                </div>
                
                {isPlaying ? (
                  <button
                    onClick={handleStopVoice}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                    <span>Detener Transmisión</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlayVoice(customScriptText)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                    disabled={!currentVoice.elevenLabsVoiceId}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Generar y Escuchar Voz</span>
                  </button>
                )}
              </div>
            </div>
            {!currentVoice.elevenLabsVoiceId && (
              <p className="text-xs text-red-600 mt-3 font-semibold">
                ⚠️ Este perfil no tiene un Voice ID de ElevenLabs asignado. Usará la voz de respaldo del navegador.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
