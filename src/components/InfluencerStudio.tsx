import React, { useState } from "react";
import { AiInfluencer, PaybotConfig } from "../types";
import { DEFAULT_INFLUENCERS } from "../data/influencerPresets";
import { exportServerBootstrapJson } from "../utils/exportConfig";
import { VoiceSynthesisPreview } from "./VoiceSynthesisPreview";
import { VoiceProfileSection } from "./VoiceProfileSection";
import { EroticModelBuilderModal } from "./EroticModelBuilderModal";
import { FaceSeedUploaderModal } from "./FaceSeedUploaderModal";
import { PersonaLivePreviewCard } from "./PersonaLivePreviewCard";
import { PersonaEditorPane } from "./PersonaEditorPane";
import { StyleGanToFluxWorkflowGuide } from "./StyleGanToFluxWorkflowGuide";
import { InfluencerImageGenerator } from "./InfluencerImageGenerator";
import { InfluencerMediaGallery } from "./InfluencerMediaGallery";
import { InfluencerContentCalendar } from "./InfluencerContentCalendar";
import { ElevenLabsVoicePreviewPlayer } from "./ElevenLabsVoicePreviewPlayer";
import { AudioWaveformPreviewer } from "./AudioWaveformPreviewer";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  User, 
  Lock, 
  Camera, 
  Film, 
  Send, 
  RefreshCw, 
  FileJson, 
  Download, 
  CreditCard, 
  Flame, 
  Columns, 
  Layout, 
  ShieldAlert,
  BookOpen,
  Mic,
  Volume2,
  Image as ImageIcon,
  Database,
  FolderOpen,
  CalendarDays
} from "lucide-react";


interface InfluencerStudioProps {
  currentInfluencer: AiInfluencer;
  setCurrentInfluencer: (influencer: AiInfluencer) => void;
  onNavigateToSimulator: () => void;
  paybotConfig?: PaybotConfig;
}

export const InfluencerStudio: React.FC<InfluencerStudioProps> = ({
  currentInfluencer,
  setCurrentInfluencer,
  onNavigateToSimulator,
  paybotConfig,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [dbSaveSuccess, setDbSaveSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveToDatabase = async () => {
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentInfluencer),
      });
      const data = await res.json();
      if (data.success) {
        setDbSaveSuccess(true);
        setTimeout(() => setDbSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save to database:", err);
    }
  };

  const [isEroticModalOpen, setIsEroticModalOpen] = useState(false);
  const [isFaceSeedModalOpen, setIsFaceSeedModalOpen] = useState(false);
  const [isWorkflowGuideOpen, setIsWorkflowGuideOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "split">("split");
  const [studioTab, setStudioTab] = useState<"persona" | "voice" | "prompts" | "image-generator" | "gallery" | "calendar">("persona");

  const handleExportJson = () => {
    const defaultConfig: PaybotConfig = paybotConfig || {
      telegramBotToken: "6912345678:AAH_your_secret_botfather_token",
      suiRpcUrl: "https://fullnode.mainnet.sui.io:443",
      vipChannelId: "-1002345678901",
      adminSuiWallet: "0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b",
      subscriberPrice: currentInfluencer.pricing?.suiPrice || 15,
      tokenType: "SUI",
      inviteLinkExpirationMinutes: 5,
      subscriptionDurationDays: 30,
      enableAutoKickCron: true,
    };
    exportServerBootstrapJson(currentInfluencer, defaultConfig);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };
  const [customNiche, setCustomNiche] = useState("Luxury Mediterranean Glamour");
  const [customStyle, setCustomStyle] = useState("Sensual Haute Couture, 9:16 vertical");
  const [selectedScenario, setSelectedScenario] = useState("Luxury Yacht in Ibiza");
  const [customPromptResult, setCustomPromptResult] = useState<any>(null);
  const [isPromptGenerating, setIsPromptGenerating] = useState(false);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateAiInfluencer = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-influencer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: customNiche,
          style: customStyle,
          language: "Spanish & English",
        }),
      });
      const data = await res.json();
      if (data && data.name) {
        const newInfluencer: AiInfluencer = {
          id: `ai-${Date.now()}`,
          name: data.name,
          handle: data.handle || `@${data.name.toLowerCase().replace(/\s+/g, "")}_ai`,
          age: data.age || 23,
          nationality: data.nationality || "International",
          vibe: data.vibe || customNiche,
          bio: data.bio || "Digital Model & VIP Creator ✨",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
          facialCharacteristics: data.facialCharacteristics || "",
          characterTags: data.characterTags || `(${data.name.toLowerCase().replace(/\s+/g, "_")}:1.35), realistic skin, photorealistic`,
          recommendedPricing: data.recommendedPricing || { sui: 15, usdc: 25, tierName: "VIP Club" },
          contentPillars: data.contentPillars || ["Reels Lifestyle", "VIP 4K Sets", "Voice Notes"],
          promptPresets: data.promptPresets || [],
        };
        setCurrentInfluencer(newInfluencer);
      }
    } catch (err) {
      console.error("Failed to generate AI influencer:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCustomScene = async () => {
    setIsPromptGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: currentInfluencer.name,
          characterTags: currentInfluencer.characterTags,
          scenario: selectedScenario,
          lighting: "Golden Hour Cinematic",
          cameraLens: "Hasselblad 85mm f/1.4",
          aspectRatio: "9:16 (Reels/TikTok/Mobile)",
        }),
      });
      const data = await res.json();
      setCustomPromptResult(data);
    } catch (err) {
      console.error("Error generating scene prompt:", err);
    } finally {
      setIsPromptGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Overview */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Paso 1: Personaje y Lore
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight">
                Arquitectura de Influencers IA y Bloqueo Facial
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-2xl">
              Mantené una consistencia visual total utilizando <strong>Character Tags</strong> (OpenArt / Flux / SDXL) y diseñá la personalidad, precios y calendario de contenidos verticales 9:16 para tu canal VIP de Telegram.
            </p>
          </div>

          {/* Quick Model Selector & Export JSON Button */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Modelos:</span>
            {DEFAULT_INFLUENCERS.map((inf) => (
              <button
                key={inf.id}
                id={`preset-model-${inf.id}`}
                onClick={() => {
                  setCurrentInfluencer(inf);
                  setCustomPromptResult(null);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  currentInfluencer.name === inf.name
                    ? "bg-black text-white shadow-sm"
                    : "bg-[#F9FAFB] text-zinc-600 hover:bg-zinc-100 border border-[#E5E7EB]"
                }`}
              >
                {inf.name}
              </button>
            ))}

            <button
              id="btn-open-face-seed-uploader"
              onClick={() => setIsFaceSeedModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-all border border-purple-400"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Subir Cara StyleGAN / Crear Todo</span>
            </button>

            <button
              id="btn-open-workflow-guide"
              onClick={() => setIsWorkflowGuideOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-black transition-all border border-zinc-700"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>Guía StyleGAN ➡️ Flux / Kling</span>
            </button>

            <button
              id="btn-open-erotic-builder"
              onClick={() => setIsEroticModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-pink-700 hover:to-rose-700 transition-all border border-pink-400"
            >
              <Flame className="h-3.5 w-3.5 text-yellow-300" />
              <span>Builder Modelo Erótico / 18+ VIP</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

            <button
              id="btn-influencer-save-db"
              onClick={handleSaveToDatabase}
              title="Guardar este modelo en la base de datos persistente"
              className="flex items-center gap-1.5 rounded-lg bg-purple-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-black transition-all border border-purple-700"
            >
              {dbSaveSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>¡Guardado en DB!</span>
                </>
              ) : (
                <>
                  <Database className="h-3.5 w-3.5 text-purple-300" />
                  <span>Guardar en DB</span>
                </>
              )}
            </button>

            <button
              id="btn-influencer-export-json"
              onClick={handleExportJson}
              title="Exportar configuración completa del modelo y bot en formato JSON"
              className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all border border-zinc-700"
            >
              {exportSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  <span>¡JSON Exportado!</span>
                </>
              ) : (
                <>
                  <FileJson className="h-3.5 w-3.5 text-yellow-400" />
                  <span>Exportar Config JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Erotic / 18+ VIP AI Model Builder Modal */}
      <EroticModelBuilderModal
        isOpen={isEroticModalOpen}
        onClose={() => setIsEroticModalOpen(false)}
        onSaveModel={(newModel) => {
          setCurrentInfluencer(newModel);
          setCustomPromptResult(null);
        }}
      />

      {/* Face Seed Uploader & Full Identity Builder Modal */}
      <FaceSeedUploaderModal
        isOpen={isFaceSeedModalOpen}
        onClose={() => setIsFaceSeedModalOpen(false)}
        currentInfluencer={currentInfluencer}
        onApplyIdentity={(newIdentity) => {
          setCurrentInfluencer({
            ...currentInfluencer,
            ...newIdentity,
          });
          setCustomPromptResult(null);
        }}
      />

      {/* StyleGAN to Flux/Kling Step-by-Step Workflow Guide Modal */}
      <StyleGanToFluxWorkflowGuide
        isOpen={isWorkflowGuideOpen}
        onClose={() => setIsWorkflowGuideOpen(false)}
        currentInfluencer={currentInfluencer}
        onApplySeedFace={(avatarUrl, characteristics, characterTags) => {
          setCurrentInfluencer({
            ...currentInfluencer,
            avatarUrl,
            facialCharacteristics: characteristics,
            characterTags,
          });
        }}
      />

      {/* Studio Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="tab-studio-persona"
            onClick={() => setStudioTab("persona")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              studioTab === "persona"
                ? "bg-black text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>1. Identidad Visual & Lore</span>
          </button>

          <button
            id="tab-studio-voice"
            onClick={() => setStudioTab("voice")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              studioTab === "voice"
                ? "bg-black text-white shadow-xs"
                : "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-emerald-600" />
            <span>2. Perfil de Voz (ElevenLabs & Edge-TTS)</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            id="tab-studio-prompts"
            onClick={() => setStudioTab("prompts")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              studioTab === "prompts"
                ? "bg-black text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>3. Prompts 9:16 & Kling Motion</span>
          </button>

          <button
            id="tab-studio-image-generator"
            onClick={() => setStudioTab("image-generator")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              studioTab === "image-generator"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-950 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>4. Generador de Fotos IA (Text-to-Image)</span>
            <span className="rounded bg-purple-200 text-purple-900 text-[9px] font-black px-1.5 py-0.2">AI MODEL</span>
          </button>

          <button
            id="tab-studio-gallery"
            onClick={() => setStudioTab("gallery")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              studioTab === "gallery"
                ? "bg-black text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>5. Galería Multimedia</span>
          </button>

          <button
            id="tab-studio-calendar"
            onClick={() => setStudioTab("calendar")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              studioTab === "calendar"
                ? "bg-black text-white shadow-xs"
                : "bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5 text-purple-600" />
            <span>6. Calendario & Drag-Drop</span>
          </button>
        </div>

        {/* View Mode Switcher (Visible on Persona tab) */}
        {studioTab === "persona" && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500">Vista:</span>
            <div className="flex items-center rounded-lg bg-zinc-100 p-1 border border-zinc-200 text-xs">
              <button
                id="btn-split-view-mode"
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all text-xs ${
                  viewMode === "split"
                    ? "bg-white text-black shadow-2xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <Columns className="h-3 w-3" />
                <span>Split</span>
              </button>

              <button
                id="btn-standard-view-mode"
                onClick={() => setViewMode("standard")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all text-xs ${
                  viewMode === "standard"
                    ? "bg-white text-black shadow-2xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <Layout className="h-3 w-3" />
                <span>Estándar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RENDER TAB 2: VOICE PROFILE STUDIO */}
      {studioTab === "voice" && (
        <div className="space-y-6">
          <AudioWaveformPreviewer influencer={currentInfluencer} />
          <VoiceProfileSection
            influencer={currentInfluencer}
            onUpdateInfluencer={(updated) => setCurrentInfluencer(updated)}
          />

          {/* Quick Test in Simulator CTA */}
          <button
            id="btn-voice-test-simulator"
            onClick={onNavigateToSimulator}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 px-4 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all"
          >
            <Send className="h-3.5 w-3.5" /> Probar Mensajes de Voz en el Simulador de Telegram
          </button>
        </div>
      )}

      {/* RENDER TAB 1 & 3: CONDITIONAL ON studioTab */}
      {studioTab === "persona" && (
        <>
          {/* View Mode Switcher & Quick Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900">Modo de Visualización:</span>
              <div className="flex items-center rounded-lg bg-zinc-100 p-1 border border-zinc-200 text-xs">
                <button
                  id="btn-split-view-mode"
                  onClick={() => setViewMode("split")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all text-xs ${
                    viewMode === "split"
                      ? "bg-black text-white shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>Split-View (Editor + Live Preview)</span>
                </button>

                <button
                  id="btn-standard-view-mode"
                  onClick={() => setViewMode("standard")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all text-xs ${
                    viewMode === "standard"
                      ? "bg-black text-white shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  <Layout className="h-3.5 w-3.5" />
                  <span>Vista Estándar (Generadores 9:16)</span>
                </button>
              </div>
            </div>

            {/* Live Adult Content Status Badge & Quick Toggle */}
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                currentInfluencer.isAdultContent
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
                {currentInfluencer.isAdultContent ? (
                  <>
                    <Flame className="h-3.5 w-3.5 text-rose-600" />
                    <span>Modo 18+ Adult Activo</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Modo SFW Activo</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Conditional Rendering based on View Mode */}
          {viewMode === "split" ? (
            /* SPLIT-VIEW MODE: Real-time Live Persona Editor & Instant Persona Card Preview */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live Editable Fields */}
              <div className="lg:col-span-6 space-y-6">
                <PersonaEditorPane
                  influencer={currentInfluencer}
                  onChange={(updated) => setCurrentInfluencer(updated)}
                />
              </div>

              {/* Right Column: Instant Live Preview Card & Voice Synthesis */}
              <div className="lg:col-span-6 space-y-6">
                <PersonaLivePreviewCard
                  influencer={currentInfluencer}
                />

                {/* Quick Voice Profile Banner */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-950">
                        Voz Seleccionada: {currentInfluencer.voiceProfile?.name || "Elena • Susurro Sensual"}
                      </span>
                    </div>
                    <button
                      onClick={() => setStudioTab("voice")}
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Configurar Timbre & Sliders →
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-snug">
                    {currentInfluencer.voiceProfile?.description || "Voz suave, aterciopelada y cercana al micrófono para notas de voz VIP de Telegram."}
                  </p>
                </div>

                {/* Browser TTS Voice preview synchronized */}
                <VoiceSynthesisPreview
                  influencerName={currentInfluencer.name}
                  bio={currentInfluencer.bio}
                  vibe={currentInfluencer.vibe}
                  nationality={currentInfluencer.nationality}
                />

                {/* ElevenLabs Voice Clip Preview Player */}
                <ElevenLabsVoicePreviewPlayer influencer={currentInfluencer} />

                {/* Dedicated Audio Waveform Previewer */}
                <AudioWaveformPreviewer influencer={currentInfluencer} />

                {/* Quick Test in Simulator CTA */}
                <button
                  id="btn-split-test-simulator"
                  onClick={onNavigateToSimulator}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 px-4 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all"
                >
                  <Send className="h-3.5 w-3.5" /> Probar Respuestas & Paywall en el Simulador de Telegram
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD VIEW MODE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Model Card & Live Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                  {/* Header Avatar & Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={currentInfluencer.avatarUrl}
                        alt={currentInfluencer.name}
                        referrerPolicy="no-referrer"
                        className="h-20 w-20 rounded-xl object-cover border border-[#E5E7EB] shadow-sm"
                      />
                      {currentInfluencer.isAdultContent && (
                        <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-black shadow-xs ring-2 ring-white">
                          18+
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-black truncate">
                          {currentInfluencer.name}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          currentInfluencer.isAdultContent
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : "bg-zinc-100 text-zinc-800 border-zinc-200"
                        }`}>
                          {currentInfluencer.isAdultContent ? "🔞 18+ VIP" : "Live Model"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 font-medium">
                        {currentInfluencer.handle} • {currentInfluencer.age} yo • {currentInfluencer.nationality}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                        {currentInfluencer.vibe}
                      </p>
                    </div>
                  </div>

                  {/* Adult Content Warning Disclaimer (if active) */}
                  {currentInfluencer.isAdultContent && (
                    <div className="mt-3.5 rounded-xl border border-rose-200 bg-rose-50/70 p-2.5 text-[11px] text-rose-900 font-medium flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{currentInfluencer.contentWarningDisclaimer || "Canal 18+ VIP con fotos boudoir y notas de voz exclusivas."}</span>
                    </div>
                  )}

                  {/* Bio CTA */}
                  <div className="mt-4 rounded-xl bg-[#F9FAFB] p-3 text-xs text-zinc-600 border border-[#E5E7EB]">
                    <div className="font-semibold text-black mb-1 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-black" /> Instagram / TikTok Bio Hook:
                    </div>
                    <p className="italic">{currentInfluencer.bio}</p>
                  </div>

                  {/* Pricing & SUI / Mercado Pago Recommendation */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-2.5">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                        SUI VIP
                      </span>
                      <div className="mt-0.5 text-base font-black text-black">
                        {currentInfluencer.recommendedPricing.sui} SUI
                        <span className="text-[10px] font-normal text-zinc-400 block">/mes</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-2.5">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                        USDC (Sui)
                      </span>
                      <div className="mt-0.5 text-base font-black text-black">
                        ${currentInfluencer.recommendedPricing.usdc}
                        <span className="text-[10px] font-normal text-zinc-400 block">/mes</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-2.5">
                      <span className="text-[9px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                        <CreditCard className="h-2.5 w-2.5 text-blue-600" /> Mercado Pago
                      </span>
                      <div className="mt-0.5 text-base font-black text-blue-950">
                        ${(currentInfluencer.recommendedPricing.ars || 18500).toLocaleString("es-AR")}
                        <span className="text-[10px] font-normal text-blue-700 block">ARS / mes</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Pillars */}
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-semibold text-zinc-500">
                      Weekly Content Pillars:
                    </span>
                    <div className="space-y-1.5">
                      {currentInfluencer.contentPillars.map((pillar, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg bg-[#F9FAFB] px-2.5 py-1.5 text-xs text-zinc-700 border border-[#E5E7EB]"
                        >
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-black text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <span>{pillar}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulator CTA */}
                  <button
                    id="btn-test-in-simulator"
                    onClick={onNavigateToSimulator}
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-black py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" /> Test Roleplay & SUI Paywall in Simulator
                  </button>
                </div>

                {/* Voice Profile Section in standard view */}
                <VoiceProfileSection
                  influencer={currentInfluencer}
                  onUpdateInfluencer={(updated) => setCurrentInfluencer(updated)}
                />

                {/* ElevenLabs Voice Clip Preview Player */}
                <ElevenLabsVoicePreviewPlayer influencer={currentInfluencer} />
              </div>

              {/* Right Column: Character Tags & Prompts */}
              <div className="lg:col-span-7 space-y-6">
                {/* Character Lock Tags */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-black" />
                      <h4 className="text-xs font-bold text-black tracking-tight">
                        Character Lock Tags (OpenArt / Flux / Midjourney v6.1)
                      </h4>
                    </div>
                    <button
                      id="btn-copy-character-tags"
                      onClick={() => handleCopy(currentInfluencer.characterTags, "charTags")}
                      className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
                    >
                      {copiedField === "charTags" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Tags
                        </>
                      )}
                    </button>
                  </div>

                  <p className="font-mono text-xs text-zinc-800 bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB] leading-relaxed">
                    {currentInfluencer.characterTags}
                  </p>

                  <div className="text-[11px] text-zinc-500 flex items-start gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <Sparkles className="h-3.5 w-3.5 text-black shrink-0 mt-0.5" />
                    <span>
                      <strong>Facial Consistency Lock:</strong>{" "}
                      {currentInfluencer.facialCharacteristics}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* RENDER TAB 3: PROMPTS 9:16 & KLING MOTION STUDIO */}
      {studioTab === "prompts" && (
        <div className="space-y-6">
          {/* Character Tag Locker Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-black" />
                <h3 className="text-base font-bold text-black">
                  Master Character Lock Tags (OpenArt / Flux / SDXL)
                </h3>
              </div>
              <span className="text-xs text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200 font-medium">
                Face Lock Active
              </span>
            </div>

              <p className="text-xs text-zinc-500">
                Paste this tag string into OpenArt, Midjourney Character Weight (<code>--cw 100</code>), or Stable Diffusion LoRA prompts to guarantee identical facial geometry across every photo and video.
              </p>

              {/* Editable Character Tags */}
              <div className="relative">
                <textarea
                  rows={3}
                  value={currentInfluencer.characterTags}
                  onChange={(e) =>
                    setCurrentInfluencer({ ...currentInfluencer, characterTags: e.target.value })
                  }
                  className="w-full font-mono text-xs rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-zinc-800 focus:border-black focus:outline-none"
                />
                <button
                  id="btn-copy-character-tags"
                  onClick={() => handleCopy(currentInfluencer.characterTags, "char-tags")}
                  className="absolute top-2 right-2 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 border border-[#E5E7EB] hover:bg-zinc-50 flex items-center gap-1 shadow-sm"
                >
                  {copiedField === "char-tags" ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Tag
                    </>
                  )}
                </button>
              </div>

              {/* Facial Characteristics Spec */}
              <div className="rounded-xl bg-[#F9FAFB] p-3 text-xs text-zinc-700 border border-[#E5E7EB]">
                <span className="font-semibold text-black block mb-0.5">
                  Facial Landmark Consistency Spec:
                </span>
                <p className="text-zinc-500">{currentInfluencer.facialCharacteristics}</p>
              </div>
            </div>

            {/* Master 9:16 Scene & Kling 3.0 Motion Generator */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-black" />
                  <h3 className="text-base font-bold text-black">
                    9:16 Vertical Photoshoot & Motion Prompt Builder
                  </h3>
                </div>
                <span className="text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full border border-zinc-200 font-medium">
                  Instagram Reels / TikTok Ready
                </span>
              </div>

              {/* Scene Selector Quick Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Luxury Yacht in Ibiza",
                  "Santorini Infinity Pool Sunset",
                  "Parisian Balcony Cafe",
                  "Miami VIP Nightclub",
                  "High-End Pilates Gym",
                  "Cozy Silk Penthouse Morning",
                ].map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setSelectedScenario(sc)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedScenario === sc
                        ? "bg-black text-white"
                        : "bg-[#F9FAFB] text-zinc-600 hover:bg-zinc-100 border border-[#E5E7EB]"
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  placeholder="Or type custom scene description..."
                  className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
                <button
                  id="btn-generate-scene-prompts"
                  onClick={handleGenerateCustomScene}
                  disabled={isPromptGenerating}
                  className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {isPromptGenerating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Crafting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" /> Craft Master Prompt
                    </>
                  )}
                </button>
              </div>

              {/* Generated Prompts or Default Presets */}
              {customPromptResult ? (
                <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-black flex items-center gap-1">
                        <Camera className="h-3.5 w-3.5 text-black" /> Photorealistic Image Prompt (9:16):
                      </span>
                      <button
                        onClick={() => handleCopy(customPromptResult.positivePrompt, "custom-pos")}
                        className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1"
                      >
                        {copiedField === "custom-pos" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />} Copy
                      </button>
                    </div>
                    <p className="font-mono text-xs text-zinc-800 bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                      {customPromptResult.positivePrompt}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-black flex items-center gap-1">
                        <Film className="h-3.5 w-3.5 text-black" /> Kling 3.0 / Motion Prompt:
                      </span>
                      <button
                        onClick={() => handleCopy(customPromptResult.klingMotionPrompt, "custom-kling")}
                        className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1"
                      >
                        {copiedField === "custom-kling" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />} Copy
                      </button>
                    </div>
                    <p className="font-mono text-xs text-zinc-800 bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                      {customPromptResult.klingMotionPrompt}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-black block mb-1">
                      Telegram VIP Teaser & Instagram Funnel Post:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                        <span className="font-semibold text-black block mb-0.5">Telegram VIP Tease:</span>
                        <p className="text-zinc-600 italic">{customPromptResult.telegramTeaseCaption}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                        <span className="font-semibold text-black block mb-0.5">Instagram Caption:</span>
                        <p className="text-zinc-600 italic">{customPromptResult.instagramCaption}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentInfluencer.promptPresets.map((preset, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5 text-black" /> {preset.scene}
                        </span>
                        <button
                          onClick={() => handleCopy(preset.prompt, `preset-${idx}`)}
                          className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1"
                        >
                          {copiedField === `preset-${idx}` ? (
                            <>
                              <Check className="h-3 w-3 text-green-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy Prompt
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-xs text-zinc-700 bg-white p-2 rounded-lg border border-[#E5E7EB]">
                        {preset.prompt}
                      </p>
                      <div className="flex items-start gap-1.5 text-[11px] text-zinc-500 bg-white p-2 rounded-lg border border-[#E5E7EB]">
                        <Film className="h-3.5 w-3.5 text-black shrink-0 mt-0.5" />
                        <span><strong>Kling Motion:</strong> {preset.klingMotion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
      )}

      {/* 4. AI Image Generator Tab */}
      {studioTab === "image-generator" && (
        <InfluencerImageGenerator
          influencer={currentInfluencer}
          onUpdateInfluencer={setCurrentInfluencer}
          onNavigateToFaceSwap={onNavigateToSimulator}
        />
      )}

      {/* 5. Media Gallery Tab */}
      {studioTab === "gallery" && (
        <InfluencerMediaGallery
          influencer={currentInfluencer}
          onUpdateInfluencer={setCurrentInfluencer}
        />
      )}

      {/* 6. Content Calendar & Drag-Drop Tab */}
      {studioTab === "calendar" && (
        <InfluencerContentCalendar
          influencer={currentInfluencer}
          onUpdateInfluencer={setCurrentInfluencer}
        />
      )}
    </div>
  );
};
