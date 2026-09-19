import React, { useState, useRef } from "react";
import { AiInfluencer, VideoMotionTemplate } from "../types";
import { VIDEO_MOTION_TEMPLATES } from "../data/videoMotionTemplates";
import {
  Film,
  Sparkles,
  Camera,
  Copy,
  Check,
  Play,
  RotateCcw,
  Layers,
  Sliders,
  Maximize2,
  Video,
  Wand2,
  Share2,
  ArrowRight,
  Music,
  Eye,
  Activity,
  Zap,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
  Volume2,
  Mic,
  MessageSquare,
  PlayCircle,
  Sparkles as SparklesIcon,
} from "lucide-react";
import {
  renderAnimatedVideoFromImage,
  VideoMotionOptions,
  renderAvatarTalkingVideoFromImage,
  AvatarLipSyncOptions,
} from "../utils/faceSwapEngine";

interface VideoMotionStudioProps {
  currentInfluencer: AiInfluencer;
}

export const VideoMotionStudio: React.FC<VideoMotionStudioProps> = ({
  currentInfluencer,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<VideoMotionTemplate>(
    VIDEO_MOTION_TEMPLATES[0]
  );
  const [activeMode, setActiveMode] = useState<"img2vid" | "vid2vid" | "nanobanana" | "avatar_lipsync">("avatar_lipsync");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [motionStrength, setMotionStrength] = useState<number>(selectedTemplate.motionStrength || 6.5);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [motionType, setMotionType] = useState<"breathe_subtle" | "camera_dolly_in" | "hair_wind_breeze" | "pan_glamour" | "night_flash_pulse">("camera_dolly_in");
  const [addFilmGrain, setAddFilmGrain] = useState<boolean>(true);
  const [addSunGlint, setAddSunGlint] = useState<boolean>(true);
  const [customMotionConcept, setCustomMotionConcept] = useState("");
  const [isGeneratingMotion, setIsGeneratingMotion] = useState(false);
  const [generatedMotionResult, setGeneratedMotionResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Avatar IA Lip-Sync Specific State
  const [avatarText, setAvatarText] = useState<string>(
    "¡Hola mi amor! Bienvenid@ a mi espacio exclusivo en Telegram. Acá vas a encontrar mis fotos 4K sin censura y mis audios de voz VIP."
  );
  const [avatarLanguage, setAvatarLanguage] = useState<string>("es-AR");
  const [avatarSpeakingRate, setAvatarSpeakingRate] = useState<number>(1.0);

  // Custom Image Upload State
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In-Browser Video Generation State
  const [isRenderingVideo, setIsRenderingVideo] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderStatusText, setRenderStatusText] = useState<string>("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [savedToDbToast, setSavedToDbToast] = useState<boolean>(false);

  const activePhotoSource = customImageSrc || currentInfluencer.avatarUrl;

  const handleRenderAvatarLipSync = async () => {
    if (!avatarText.trim()) return;
    setIsRenderingVideo(true);
    setRenderProgress(0);
    setRenderStatusText("Iniciando motor biométrico de Lip-Sync y síntesis vocal...");
    setGeneratedVideoUrl(null);

    try {
      const avatarOptions: AvatarLipSyncOptions = {
        text: avatarText,
        languageCode: avatarLanguage,
        speakingRate: avatarSpeakingRate,
        aspectRatio,
        fps: 30,
      };

      const result = await renderAvatarTalkingVideoFromImage(
        activePhotoSource,
        avatarOptions,
        (percent, frame, total) => {
          setRenderProgress(percent);
          setRenderStatusText(
            `Sincronizando labios y parpadeos biométricos (${frame}/${total} frames) - ${percent}%`
          );
        }
      );

      setGeneratedVideoUrl(result.videoUrl);
      setRenderStatusText("¡Avatar IA sintetizado con éxito con movimiento de rostro y habla natural!");

      // Sync backend log
      try {
        await fetch("/api/avatar/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: activePhotoSource,
            text: avatarText,
            language_code: avatarLanguage,
            speaking_rate: avatarSpeakingRate,
          }),
        });
      } catch (beErr) {}
    } catch (err: any) {
      console.error("Error during avatar video generation:", err);
      setRenderStatusText("Error al procesar el Avatar: " + (err.message || "Canvas error"));
    } finally {
      setIsRenderingVideo(false);
    }
  };


  const filteredTemplates =
    selectedCategory === "all"
      ? VIDEO_MOTION_TEMPLATES
      : VIDEO_MOTION_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImageSrc(url);
    }
  };

  const handleRenderInAppVideo = async () => {
    setIsRenderingVideo(true);
    setRenderProgress(0);
    setRenderStatusText("Iniciando motor de captura de video neuronal en canvas...");
    setGeneratedVideoUrl(null);

    try {
      const options: VideoMotionOptions = {
        durationSeconds: videoDuration,
        aspectRatio,
        motionType,
        intensity: motionStrength,
        addFilmGrain,
        addSunGlint,
        fps: 30,
      };

      const result = await renderAnimatedVideoFromImage(
        activePhotoSource,
        options,
        (percent, frame, total) => {
          setRenderProgress(percent);
          setRenderStatusText(
            `Renderizando cuadro a cuadro (${frame}/${total} frames) - ${percent}%`
          );
        }
      );

      setGeneratedVideoUrl(result.videoUrl);
      setRenderStatusText("¡Video sintetizado y codificado con éxito en formato MP4/WebM!");

      // Trigger backend Veo / log sync
      try {
        await fetch("/api/ai/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: selectedTemplate.description,
            characterName: currentInfluencer.name,
            characterTags: currentInfluencer.characterTags,
            aspectRatio,
          }),
        });
      } catch (beErr) {
        console.warn("Backend video log sync note:", beErr);
      }
    } catch (err: any) {
      console.error("Error during video rendering:", err);
      setRenderStatusText("Error al procesar el video: " + (err.message || "Canvas error"));
    } finally {
      setIsRenderingVideo(false);
    }
  };

  const handleSaveVideoToDatabase = async () => {
    if (!generatedVideoUrl) return;
    try {
      await fetch("/api/face-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `video-asset-${Date.now()}`,
          modelId: currentInfluencer.id,
          modelName: currentInfluencer.name,
          assetType: "video_clip",
          name: `${currentInfluencer.name} - ${selectedTemplate.title}`,
          url: activePhotoSource,
          resolution: aspectRatio === "9:16" ? "540x960" : "960x540",
          biometricPointsCount: 68,
          characterTagAnchor: currentInfluencer.characterTags,
          sourceEngine: `Neural-Motion-Engine (${selectedTemplate.motionTool})`,
          fileSizeKb: 1850,
          notes: `Video generado de ${videoDuration}s con movimiento "${motionType}" y fuerza ${motionStrength}/10.`,
        }),
      });
      setSavedToDbToast(true);
      setTimeout(() => setSavedToDbToast(false), 2500);
    } catch (err) {
      console.error("Error saving video asset to DB:", err);
    }
  };

  const compiledKlingPrompt = `${currentInfluencer.characterTags}, ${selectedTemplate.klingMotionPrompt}, natural motion: ${motionType}, organic handheld shake: 20%, hyper-realistic human motion, photorealistic skin micro-movements, 4k 60fps --ar ${aspectRatio}`;

  const compiledNanoBananaPrompt = `masterpiece, 8k uhd, photorealistic raw portrait of ${currentInfluencer.characterTags}, ${selectedTemplate.title}, natural lighting, shot on 85mm f/1.2 lens, cinematic color grading, authentic pores and skin texture, detailed eyes, raytracing reflections --ar ${aspectRatio} --v 6.1 --quality 2`;

  const handleGenerateCustomMotion = async () => {
    setIsGeneratingMotion(true);
    try {
      const res = await fetch("/api/ai/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: currentInfluencer.name,
          characterTags: currentInfluencer.characterTags,
          scenario: customMotionConcept || "Viral Dance Transition in Luxury Setting",
          lighting: "Cinematic 4K Studio & Sunset Volumetric Rays",
          cameraLens: "Hasselblad 85mm Portrait Prime",
          aspectRatio: "9:16 (Reels/TikTok/Mobile)",
        }),
      });
      const data = await res.json();
      setGeneratedMotionResult(data);
    } catch (e) {
      console.error("Failed to generate motion prompts:", e);
    } finally {
      setIsGeneratingMotion(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Generador de Video 100% In-App
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight">
                Estudio de Generación de Video & Movimiento IA
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500 max-w-3xl">
              Generá videos en movimiento (9:16 Reels/TikTok) de tu modelo IA directamente en la aplicación sin salir a herramientas externas. Compatible con <strong>Google Veo 3.1, Kling y Haiper</strong> con audio armónico y renderizado en tiempo real.
            </p>
          </div>

          {/* Active Model Indicator */}
          <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2">
            <img
              src={activePhotoSource}
              alt={currentInfluencer.name}
              className="h-9 w-9 rounded-lg object-cover border border-[#E5E7EB]"
            />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block">
                Sujeto Activo:
              </span>
              <span className="text-xs font-bold text-black font-mono">
                {currentInfluencer.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] pb-3">
        <button
          type="button"
          onClick={() => setActiveMode("avatar_lipsync")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeMode === "avatar_lipsync"
              ? "bg-purple-900 text-white shadow-sm ring-2 ring-purple-400"
              : "bg-white text-zinc-600 hover:bg-[#F9FAFB] border border-[#E5E7EB]"
          }`}
        >
          <Mic className="h-3.5 w-3.5 text-purple-300" />
          <span>🎬 Avatar IA Lip-Sync (Foto + Texto = Video Hablando)</span>
          <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">FREE API</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("img2vid")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeMode === "img2vid"
              ? "bg-black text-white shadow-sm"
              : "bg-white text-zinc-600 hover:bg-[#F9FAFB] border border-[#E5E7EB]"
          }`}
        >
          <Film className="h-3.5 w-3.5" />
          <span>1. Generador de Video In-App (Veo 3.1 / Neural Canvas)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("vid2vid")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeMode === "vid2vid"
              ? "bg-black text-white shadow-sm"
              : "bg-white text-zinc-600 hover:bg-[#F9FAFB] border border-[#E5E7EB]"
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>2. Plantillas Video-a-Video (Bailes y Transiciones)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("nanobanana")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeMode === "nanobanana"
              ? "bg-black text-white shadow-sm"
              : "bg-white text-zinc-600 hover:bg-[#F9FAFB] border border-[#E5E7EB]"
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          <span>3. Generación Vertical 9:16 HD (Nano Banana / Flux)</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Motion Control Parameters & Interactive Sliders */}
        <div className="lg:col-span-5 space-y-5">
          {/* Photo Source Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <h3 className="text-xs font-bold text-black flex items-center gap-2">
                <Camera className="h-3.5 w-3.5 text-black" />
                Foto Origen del Avatar
              </h3>
              {customImageSrc && (
                <button
                  type="button"
                  onClick={() => setCustomImageSrc(null)}
                  className="text-[10px] text-zinc-500 hover:text-black font-semibold"
                >
                  Restaurar Avatar
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <img
                src={activePhotoSource}
                alt="Source"
                className="h-16 w-12 rounded-lg object-cover border border-zinc-300 shadow-xs"
              />
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs font-bold text-zinc-800 hover:bg-white hover:border-zinc-400 transition-all"
                >
                  <Upload className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Subir otra foto de cara</span>
                </button>
                <span className="text-[10px] text-zinc-400 block font-mono">
                  Sincronización labial y movimiento de ojos 100% gratis
                </span>
              </div>
            </div>
          </div>

          {activeMode === "avatar_lipsync" ? (
            /* Avatar IA Lip-Sync Dedicated Control Panel */
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h3 className="text-xs font-bold text-purple-950 flex items-center gap-2 tracking-tight">
                  <Mic className="h-4 w-4 text-purple-600" />
                  Sintetizador de Avatar IA Hablando
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Lip-Sync 100% Gratis
                </span>
              </div>

              {/* Text Area */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                    ¿Qué querés que diga el avatar?
                  </label>
                  <span className="font-mono text-[11px] text-zinc-400 font-semibold">
                    {avatarText.length}/500 chars
                  </span>
                </div>
                <textarea
                  value={avatarText}
                  onChange={(e) => setAvatarText(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Escribí el mensaje que la modelo dirá en el video con movimiento de labios..."
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-xs"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Plantillas de Mensaje Rápido:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "🔞 Telegram VIP", text: "¡Hola mi amor! Bienvenid@ a mi espacio exclusivo en Telegram. Acá vas a encontrar mis fotos 4K sin censura y audios íntimos en privado." },
                    { label: "🍑 Fitness & Curves", text: "🔥 Hola bb, recién salgo de entrenar. Te dejé un set exclusivo de fotos y notas de voz picantes en mi canal VIP." },
                    { label: "🥂 Luxury Glamour", text: "✨ Hola a todos, los invito a ver mis historias exclusivas de viajes y charlar conmigo directamente por Telegram." },
                    { label: "🌊 Beach & Candid", text: "🌊 ¡Hola! Disfrutando del sol. Mandame un mensaje al Telegram VIP y charlamos un rato." },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarText(p.text)}
                      className="text-left text-[11px] font-medium p-2 rounded-lg border border-purple-100 bg-white hover:bg-purple-50 hover:border-purple-300 transition-all text-zinc-700"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice & Speech Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-100">
                <div>
                  <label className="text-xs font-bold text-zinc-800 block mb-1">
                    Voz & Idioma:
                  </label>
                  <select
                    value={avatarLanguage}
                    onChange={(e) => setAvatarLanguage(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="es-AR">🇦🇷 Español (Argentina)</option>
                    <option value="es-CO">🇨🇴 Español (Colombia)</option>
                    <option value="es-MX">🇲🇽 Español (México)</option>
                    <option value="es-ES">🇪🇸 Español (España)</option>
                    <option value="en-US">🇺🇸 English (US)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-800 block mb-1">
                    Velocidad: {avatarSpeakingRate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.1"
                    value={avatarSpeakingRate}
                    onChange={(e) => setAvatarSpeakingRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600 mt-2"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id="btn-render-avatar-lipsync"
                onClick={handleRenderAvatarLipSync}
                disabled={isRenderingVideo || !avatarText.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-900 py-3.5 text-xs font-bold text-white shadow-md hover:bg-purple-950 transition-all disabled:opacity-50 mt-2"
              >
                {isRenderingVideo ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-purple-300" />
                    <span>Sintetizando Avatar con Lip-Sync...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 text-emerald-400" />
                    <span>Generar Video de Avatar con Lip-Sync (100% Gratis)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Controls Box for Other Video Modes */
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-black flex items-center gap-2 tracking-tight">
                  <Sliders className="h-3.5 w-3.5 text-black" />
                  2. Parámetros de Trayectoria y Movimiento
                </h3>
                <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">
                  {selectedTemplate.motionTool}
                </span>
              </div>

              {/* Interactive Parameters */}
              <div className="space-y-4 text-xs">
                {/* Motion Type */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 block">
                    Estilo de Movimiento Cinematográfico:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "camera_dolly_in", label: "Dolly-In + Acercamiento" },
                      { id: "breathe_subtle", label: "Respiración & Sonrisa" },
                      { id: "hair_wind_breeze", label: "Viento en Cabello" },
                      { id: "pan_glamour", label: "Paneo Glamour 60fps" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMotionType(m.id as any)}
                        className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                          motionType === m.id
                            ? "border-black bg-black text-white shadow-xs"
                            : "border-[#E5E7EB] bg-[#F9FAFB] text-zinc-700 hover:bg-white"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motion Strength */}
                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-1.5">
                    <span>Intensidad de Movimiento:</span>
                    <span className="font-mono font-bold text-black">{motionStrength} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={motionStrength}
                    onChange={(e) => setMotionStrength(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                {/* Duration */}
                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-1.5">
                    <span>Duración del Video:</span>
                    <span className="font-mono font-bold text-black">{videoDuration}s</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 8].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setVideoDuration(sec)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          videoDuration === sec
                            ? "bg-black text-white border-black"
                            : "bg-[#F9FAFB] text-zinc-700 border-[#E5E7EB] hover:bg-zinc-100"
                        }`}
                      >
                        {sec} segundos
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Relación de Aspecto:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "9:16", label: "9:16 (Reels/TikTok)" },
                      { id: "1:1", label: "1:1 (Cuadrado)" },
                      { id: "16:9", label: "16:9 (Horizontal)" },
                    ].map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => setAspectRatio(ar.id as any)}
                        className={`rounded-lg py-1.5 text-[11px] font-semibold border transition-all ${
                          aspectRatio === ar.id
                            ? "bg-black text-white border-black"
                            : "bg-[#F9FAFB] text-zinc-700 border-[#E5E7EB] hover:bg-zinc-100"
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optics Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-100">
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addFilmGrain}
                      onChange={(e) => setAddFilmGrain(e.target.checked)}
                      className="accent-black rounded"
                    />
                    <span>Grano de Película</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addSunGlint}
                      onChange={(e) => setAddSunGlint(e.target.checked)}
                      className="accent-black rounded"
                    />
                    <span>Destello Solar 4K</span>
                  </label>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  id="btn-render-video-in-app"
                  onClick={handleRenderInAppVideo}
                  disabled={isRenderingVideo}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {isRenderingVideo ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                      <span>Renderizando Video In-App...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span>Generar Video In-App de {currentInfluencer.name}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}


          {/* AI Custom Motion Script Synthesizer */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-black flex items-center gap-2 tracking-tight">
              <Wand2 className="h-3.5 w-3.5 text-black" />
              Generador de Coreografía & Scripts IA
            </h3>
            <p className="text-xs text-zinc-500">
              Describí cualquier baile, transición de ropa o locación para sintetizar parámetros de cámara:
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={customMotionConcept}
                onChange={(e) => setCustomMotionConcept(e.target.value)}
                placeholder="ej: Vuelta de 180 grados con lentes de sol y sonrisa confiada en la playa..."
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
              />

              <button
                type="button"
                onClick={handleGenerateCustomMotion}
                disabled={isGeneratingMotion}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                {isGeneratingMotion ? (
                  <>
                    <Activity className="h-3.5 w-3.5 animate-spin" />
                    <span>Sintetizando Parámetros...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generar Script de Movimiento</span>
                  </>
                )}
              </button>
            </div>

            {generatedMotionResult && (
              <div className="mt-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                <span className="font-bold text-black block">Script Generado:</span>
                <p className="font-mono text-[11px] text-zinc-700">
                  {generatedMotionResult.klingMotionPrompt}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(generatedMotionResult.klingMotionPrompt, "custom-gen-motion")
                  }
                  className="font-semibold text-black hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === "custom-gen-motion" ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copiar Script
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Templates Gallery & Live Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Player Box */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Reproductor de Video Generado
                </span>
                <h4 className="text-xs font-bold text-black">
                  {selectedTemplate.title} ({aspectRatio})
                </h4>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                <Volume2 className="h-3 w-3 text-emerald-600" />
                <span>Audio 174Hz Armónico</span>
              </div>
            </div>

            {/* In-Progress Progress Bar */}
            {isRenderingVideo && (
              <div className="space-y-2 p-4 rounded-xl bg-purple-50 border border-purple-200 animate-pulse">
                <div className="flex justify-between text-xs font-bold text-purple-900">
                  <span>Procesando Frames con MediaRecorder</span>
                  <span>{renderProgress}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-150"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-purple-700 font-mono">{renderStatusText}</p>
              </div>
            )}

            {/* Video Canvas / Output Area */}
            <div className="relative aspect-[9/16] max-h-[480px] w-full mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-zinc-800 shadow-inner">
              {generatedVideoUrl ? (
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center text-zinc-400 space-y-3">
                  <img
                    src={activePhotoSource}
                    alt="Still Preview"
                    className="absolute inset-0 h-full w-full object-cover opacity-30 blur-xs"
                  />
                  <div className="relative z-10 space-y-2">
                    <Film className="h-12 w-12 mx-auto text-zinc-400 animate-pulse" />
                    <p className="text-xs font-bold text-white">
                      Listo para generar video en alta definición
                    </p>
                    <p className="text-[11px] text-zinc-300 max-w-xs mx-auto">
                      Hacé clic en &quot;Generar Video In-App de {currentInfluencer.name}&quot; para renderizar el clip en movimiento y descargarlo.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar for Generated Video */}
            {generatedVideoUrl && (
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={generatedVideoUrl}
                    download={`${currentInfluencer.name.toLowerCase().replace(/\s+/g, "_")}_video_${Date.now()}.webm`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Descargar Video (.webm/mp4)</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleSaveVideoToDatabase}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-[#F9FAFB] px-3 py-2.5 text-xs font-bold text-zinc-800 hover:bg-white hover:border-zinc-400 transition-all"
                  >
                    <Layers className="h-3.5 w-3.5 text-purple-600" />
                    <span>Guardar en DB de la Modelo</span>
                  </button>
                </div>

                {savedToDbToast && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-900 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>¡Video registrado en los activos multimedia del modelo!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Template Selection Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-black flex items-center gap-1.5 uppercase tracking-wider">
              <Film className="h-3.5 w-3.5 text-black" />
              Plantillas de Movimiento & Coreografía ({filteredTemplates.length})
            </h3>

            <div className="flex flex-wrap items-center gap-1">
              {["all", "dance", "runway", "transition", "lifestyle", "fitness"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-zinc-600 hover:bg-[#F9FAFB] border border-[#E5E7EB]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Cards Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate.id === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setMotionStrength(template.motionStrength);
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all space-y-3 ${
                    isSelected
                      ? "border-black bg-white shadow-md ring-1 ring-black"
                      : "border-[#E5E7EB] bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-100">
                    <img
                      src={template.sampleVideoThumbnail}
                      alt={template.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      <Play className="h-2.5 w-2.5 fill-white" />
                      {template.motionTool}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                      {template.musicBpmTarget} BPM
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {template.category}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-zinc-600">
                        Fuerza: {template.motionStrength}/10
                      </span>
                    </div>
                    <h4 className="font-bold text-black text-xs mt-0.5">{template.title}</h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compiled Output & Execution Box */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Comandos de Producción
                </span>
                <h4 className="text-sm font-bold text-black">
                  Código Listo para Kling 3.0 / Haiper / Nano Banana
                </h4>
              </div>
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white font-mono">
                {aspectRatio}
              </span>
            </div>

            {/* Kling 3.0 Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-black" />
                  Kling 3.0 / Haiper Video Motion Command:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(compiledKlingPrompt, "kling-compiled")}
                  className="font-semibold text-black hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === "kling-compiled" ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copiar Script
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] font-mono text-xs text-zinc-800 leading-relaxed break-words">
                {compiledKlingPrompt}
              </div>
            </div>

            {/* Nano Banana Pro / Flux Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-black" />
                  Nano Banana Pro / Flux.1 9:16 Base Frame Prompt:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(compiledNanoBananaPrompt, "nanobanana-compiled")}
                  className="font-semibold text-black hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === "nanobanana-compiled" ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copiar Prompt 9:16
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] font-mono text-xs text-zinc-800 leading-relaxed break-words">
                {compiledNanoBananaPrompt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
