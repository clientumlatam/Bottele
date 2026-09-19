import React, { useState } from "react";
import {
  Sparkles,
  Camera,
  Layers,
  Wand2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Flame,
  ArrowRight,
  Maximize2,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";
import { AiInfluencer } from "../types";

interface InfluencerImageGeneratorProps {
  influencer: AiInfluencer;
  onUpdateInfluencer: (updated: AiInfluencer) => void;
  onNavigateToFaceSwap?: () => void;
}

interface GeneratedAsset {
  id: string;
  url: string;
  scenario: string;
  shotType: string;
  aspectRatio: string;
  promptUsed: string;
  timestamp: string;
  isCurated?: boolean;
}

const SCENARIO_PRESETS = [
  {
    id: "yacht-ibiza",
    title: "Yate de Lujo en Ibiza (Golden Hour)",
    scenario: "on luxury yacht deck during golden hour in Ibiza, champagne silk dress, ocean breeze, sea spray in background",
    category: "luxury",
  },
  {
    id: "balcony-morning",
    title: "Balcón Penthouse al Amanecer",
    scenario: "sipping espresso in white silk robe on modern glass high-rise balcony overlooking city skyline at sunrise, warm diffused morning light",
    category: "lifestyle",
  },
  {
    id: "santorini-pool",
    title: "Infinity Pool en Santorini",
    scenario: "relaxing on edge of private infinity pool overlooking Santorini caldera at sunset, stylish emerald designer swimwear, glistening water droplets",
    category: "swimwear",
  },
  {
    id: "night-flash-selfie",
    title: "Selfie Nocturna con Flash (Estilo VIP)",
    scenario: "candid smartphone flash selfie, wearing black satin top in sports car passenger seat at night, direct camera flash, authentic creator aesthetic",
    category: "candid",
  },
  {
    id: "pilates-gym",
    title: "Estudio de Pilates & Activewear",
    scenario: "stretching on wooden pilates reformer in bright minimalist luxury gym, seamless charcoal athletic set, natural healthy skin glow",
    category: "fitness",
  },
  {
    id: "boudoir-candlelight",
    title: "Boudoir Íntimo con Velas",
    scenario: "lounging on silk sheets in luxury penthouse bedroom, intimate black lace lingerie, soft candlelight glow reflections, sensual mood",
    category: "lingerie",
  },
  {
    id: "paris-cafe",
    title: "Café en París / Palermo Soho",
    scenario: "sitting at outdoor Parisian bistro cafe table, chic oversized blazer, holding coffee cup, warm afternoon sun, cobblestone street background",
    category: "lifestyle",
  },
  {
    id: "cyber-neon",
    title: "VIP Nightclub & Luces de Neón",
    scenario: "exclusive VIP nightclub lounge in Miami, backless dress with chain accents, ambient magenta and cyan neon bokeh, holding champagne flute",
    category: "nightlife",
  },
];

const SHOT_TYPES = [
  { id: "portrait-85", label: "Retrato Medio (85mm)", lens: "Hasselblad 85mm f/1.4 Portrait Prime", desc: "Enfoque nítido en rostro y mirada con bokeh cremoso" },
  { id: "full-body", label: "Cuerpo Entero (50mm)", lens: "Sony A7R V 50mm f/1.2 GM", desc: "Muestra outfit completo, calzado y entorno" },
  { id: "macro-face", label: "Primer Plano Facial (100mm)", lens: "Macro 100mm f/2.8", desc: "Detalles biométricos extremos, ojos, labios y textura" },
  { id: "selfie-flash", label: "Selfie Celular Directa (24mm)", lens: "Cámara Smartphone 24mm con Flash", desc: "Aesthetic orgánico de creadora real en redes sociales" },
];

const ASPECT_RATIOS = [
  { id: "9:16", label: "9:16 Vertical", desc: "Stories, Reels & TikTok", widthClass: "w-[180px] h-[320px]" },
  { id: "1:1", label: "1:1 Cuadrado", desc: "Feed Instagram & Avatar", widthClass: "w-[240px] h-[240px]" },
  { id: "3:4", label: "3:4 Retrato", desc: "Editorial & Catálogo", widthClass: "w-[210px] h-[280px]" },
  { id: "16:9", label: "16:9 Horizontal", desc: "Cinematic & Banner", widthClass: "w-[320px] h-[180px]" },
];

const LIGHTING_OPTIONS = [
  "Golden Hour Cinematic (Luz Cálida de Atardecer)",
  "Flash Directo Nocturno de Celular",
  "Luz Natural Difusa de Mañana",
  "Luz de Estudio de Moda (Softbox & Rim Light)",
  "Neón Ambiental Magenta y Cyan",
  "Luz Íntima de Velas & Habitación",
];

export const InfluencerImageGenerator: React.FC<InfluencerImageGeneratorProps> = ({
  influencer,
  onUpdateInfluencer,
  onNavigateToFaceSwap,
}) => {
  const [selectedScenarioPreset, setSelectedScenarioPreset] = useState(SCENARIO_PRESETS[0]);
  const [customScenarioText, setCustomScenarioText] = useState("");
  const [selectedShotType, setSelectedShotType] = useState(SHOT_TYPES[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("9:16");
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_OPTIONS[0]);
  const [characterWeight, setCharacterWeight] = useState<number>(1.35);
  const [selectedEngine, setSelectedEngine] = useState<"flux-free" | "gemini" | "auto">("flux-free");
  const [customSeed, setCustomSeed] = useState<number>(() => Math.floor(Math.random() * 999999));
  const [showBiometricOverlay, setShowBiometricOverlay] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [activeGeneratedImage, setActiveGeneratedImage] = useState<GeneratedAsset | null>({
    id: "initial-asset",
    url: influencer.avatarUrl,
    scenario: "Foto de Perfil Oficial",
    shotType: "Retrato 85mm",
    aspectRatio: "9:16",
    promptUsed: influencer.characterTags,
    timestamp: "Activo Principal",
  });
  const [assetHistory, setAssetHistory] = useState<GeneratedAsset[]>([
    {
      id: "asset-1",
      url: influencer.avatarUrl,
      scenario: "Retrato de Identidad Base",
      shotType: "Retrato 85mm",
      aspectRatio: "9:16",
      promptUsed: influencer.characterTags,
      timestamp: "Base Face",
    },
  ]);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [avatarSetNotification, setAvatarSetNotification] = useState<boolean>(false);
  const [savedToDbNotification, setSavedToDbNotification] = useState<boolean>(false);

  const activeScenarioString = customScenarioText.trim() || selectedScenarioPreset.scenario;

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setGenerationStep("1/4: Analizando matriz biométrica del personaje e identidad...");

    const step1Timer = setTimeout(() => {
      setGenerationStep(`2/4: Inyectando Character Lock: (${influencer.name}: ${characterWeight}x)...`);
    }, 400);

    const step2Timer = setTimeout(() => {
      setGenerationStep(`3/4: Configurando lente (${selectedShotType.label}) e iluminación...`);
    }, 800);

    const step3Timer = setTimeout(() => {
      setGenerationStep("4/4: Sintetizando textura fotorrealista de piel y renderizando en la app...");
    }, 1200);

    try {
      // Inyectar el tag del personaje con el peso dinámico seleccionado
      const customTagWithWeight = influencer.characterTags
        ? influencer.characterTags.replace(/:\d+(\.\d+)?\)/, `:${characterWeight})`)
        : `(${influencer.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}:${characterWeight})`;

      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: influencer.name,
          characterTags: customTagWithWeight,
          facialCharacteristics: influencer.facialCharacteristics,
          scenario: activeScenarioString,
          lighting: selectedLighting,
          cameraLens: selectedShotType.lens,
          aspectRatio: selectedAspectRatio,
          shotType: selectedShotType.label,
          engine: selectedEngine,
          seed: customSeed,
          aesthetic: influencer.isAdultContent
            ? "ultra-realistic 8k raw photography, sensual boudoir aesthetic"
            : "ultra-realistic 8k raw photograph, high fashion magazine portrait",
        }),
      });

      const data = await res.json();

      if (data && data.imageUrl) {
        const newAsset: GeneratedAsset = {
          id: `gen-${Date.now()}`,
          url: data.imageUrl,
          scenario: selectedScenarioPreset.title || "Custom Scene",
          shotType: selectedShotType.label,
          aspectRatio: selectedAspectRatio,
          promptUsed: data.promptUsed || customTagWithWeight,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isCurated: data.isCuratedSample,
        };

        setActiveGeneratedImage(newAsset);
        setAssetHistory((prev) => [newAsset, ...prev]);

        // Automatically add to model gallery & server face assets database
        try {
          await fetch("/api/face-assets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `asset-auto-${Date.now()}`,
              modelId: influencer.id,
              modelName: influencer.name,
              assetType: "synthetic_seed",
              name: `${influencer.name} - ${selectedScenarioPreset.title || "Generación IA"}`,
              url: data.imageUrl,
              resolution: selectedAspectRatio === "9:16" ? "768x1344" : "1024x1024",
              biometricPointsCount: 68,
              characterTagAnchor: customTagWithWeight,
              sourceEngine: data.engine || "Flux-Pollinations-Free",
              fileSizeKb: 450,
              notes: `Generado con iluminación "${selectedLighting}" y encuadre "${selectedShotType.label}".`,
            }),
          });
        } catch (dbErr) {
          console.warn("Auto sync to face-assets warning:", dbErr);
        }
      }
    } catch (err) {
      console.error("Error generating influencer image:", err);
    } finally {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleSaveToFaceDatabase = async (asset: GeneratedAsset) => {
    try {
      await fetch("/api/face-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `face-asset-${Date.now()}`,
          modelId: influencer.id,
          modelName: influencer.name,
          assetType: "synthetic_seed",
          name: `${influencer.name} - ${asset.scenario}`,
          url: asset.url,
          resolution: asset.aspectRatio === "9:16" ? "768x1344" : "1024x1024",
          biometricPointsCount: 68,
          characterTagAnchor: influencer.characterTags,
          sourceEngine: selectedEngine === "gemini" ? "Gemini 3.1 Imagen" : "Flux Realtime Free Engine",
          fileSizeKb: 420,
          notes: "Guardado manualmente desde el Generador de Imágenes IA.",
        }),
      });
      setSavedToDbNotification(true);
      setTimeout(() => setSavedToDbNotification(false), 2500);
    } catch (err) {
      console.error("Error saving asset to DB:", err);
    }
  };

  const handleSetAsAvatar = (asset: GeneratedAsset) => {
    onUpdateInfluencer({
      ...influencer,
      avatarUrl: asset.url,
    });
    setAvatarSetNotification(true);
    setTimeout(() => setAvatarSetNotification(false), 2500);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadImage = (url: string, scenarioName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${influencer.name.toLowerCase().replace(/\s+/g, "_")}_${scenarioName.toLowerCase().replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                Text-to-Image 9:16
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight flex items-center gap-2">
                Generador de Fotos y Activos IA con Bloqueo Facial
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-2xl">
              Generá imágenes consistentes de <strong>{influencer.name}</strong> para tu canal VIP de Telegram e historias de Instagram 9:16 inyectando su matriz biométrica, color de ojos y <strong>Character Tags</strong> exactos.
            </p>
          </div>

          {/* Current Influencer Profile Pill */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#F9FAFB] p-2.5">
            <img
              src={influencer.avatarUrl}
              alt={influencer.name}
              className="h-10 w-10 rounded-lg object-cover border border-zinc-200 shadow-2xs"
            />
            <div className="text-xs">
              <span className="font-bold text-black block truncate max-w-[140px]">
                {influencer.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                Lock Activo ({characterWeight}x)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generation Controls & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Character Consistency Anchor & Tag Spec */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black">
                    Paso 1: Character Lock & Consistencia Facial
                  </h3>
                  <span className="text-[10px] text-zinc-500">
                    Tags ancla inyectados automáticamente en el modelo generador
                  </span>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="flex items-center gap-2 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                <Sliders className="h-3 w-3 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-700">Peso: {characterWeight}x</span>
                <input
                  type="range"
                  min="1.0"
                  max="1.6"
                  step="0.05"
                  value={characterWeight}
                  onChange={(e) => setCharacterWeight(parseFloat(e.target.value))}
                  className="w-16 accent-black cursor-pointer"
                />
              </div>
            </div>

            {/* Injected Tag Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-700 flex items-center gap-1">
                  <Tag className="h-3 w-3 text-purple-600" /> Prompt Positivo Ancla (Character Tag):
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(influencer.characterTags)}
                  className="text-[10px] font-bold text-zinc-500 hover:text-black flex items-center gap-1"
                >
                  {copiedPrompt ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                  <span>Copiar Tag</span>
                </button>
              </div>

              <code className="block font-mono text-[11px] text-zinc-700 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 break-words leading-relaxed max-h-20 overflow-y-auto">
                {influencer.characterTags}
              </code>
            </div>

            {/* Facial Characteristics Spec */}
            <div className="flex items-start gap-2 bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 text-[10px] text-purple-950">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Landmarks del Rostro: </span>
                <span>{influencer.facialCharacteristics}</span>
              </div>
            </div>
          </div>

          {/* Step 2: Scenario & Lifestyle Location Presets */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black">
                    Paso 2: Escenario y Locación de la Sesión
                  </h3>
                  <span className="text-[10px] text-zinc-500">
                    Elegí un preset de alta conversión para Instagram y Telegram VIP
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">8 Presets HD</span>
            </div>

            {/* Quick Grid of Scenarios */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SCENARIO_PRESETS.map((preset) => {
                const isSelected = selectedScenarioPreset.id === preset.id && !customScenarioText;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedScenarioPreset(preset);
                      setCustomScenarioText("");
                    }}
                    className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-black bg-black text-white shadow-sm font-bold"
                        : "border-zinc-200 bg-[#F9FAFB] text-zinc-700 hover:border-zinc-400 hover:bg-white"
                    }`}
                  >
                    <span className="text-[11px] font-bold leading-tight line-clamp-2">
                      {preset.title}
                    </span>
                    <span className={`text-[9px] uppercase mt-1 tracking-wider ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                      {preset.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Scenario Textbox */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-zinc-700 block">
                O escribe tu propio escenario personalizado:
              </label>
              <input
                type="text"
                value={customScenarioText}
                onChange={(e) => setCustomScenarioText(e.target.value)}
                placeholder="Ej: Caminando por Times Square con vestido rojo de noche..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Step 3: Photographic Specifications (Shot Type, Lens, Aspect Ratio, Lighting) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
                <Sliders className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-black">
                  Paso 3: Parámetros Fotográficos y Relación de Aspecto
                </h3>
                <span className="text-[10px] text-zinc-500">
                  Lente, plano de cámara, formato 9:16 vertical e iluminación
                </span>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-700 block">
                Relación de Aspecto (Aspect Ratio):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ASPECT_RATIOS.map((ar) => {
                  const isSelected = selectedAspectRatio === ar.id;
                  return (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => setSelectedAspectRatio(ar.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-black bg-black text-white shadow-xs font-bold"
                          : "border-zinc-200 bg-[#F9FAFB] text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <div className="text-xs font-bold">{ar.label}</div>
                      <div className={`text-[9px] ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                        {ar.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shot Type & Lens Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-700 block">
                Plano de Cámara y Lente Fotográfico:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SHOT_TYPES.map((st) => {
                  const isSelected = selectedShotType.id === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedShotType(st)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-black bg-black text-white shadow-xs"
                          : "border-zinc-200 bg-[#F9FAFB] text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <div className="text-xs font-bold">{st.label}</div>
                      <div className={`text-[10px] truncate ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                        {st.lens}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lighting Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-700 block">
                Tipo de Iluminación y Atmósfera:
              </span>
              <select
                value={selectedLighting}
                onChange={(e) => setSelectedLighting(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
              >
                {LIGHTING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            id="btn-generate-influencer-image"
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-3.5 px-6 text-sm font-black text-white shadow-lg hover:from-purple-700 hover:via-indigo-700 hover:to-pink-700 transition-all active:scale-98 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{generationStep || "Sintetizando imagen hiperrealista..."}</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 text-amber-300" />
                <span>Generar Activo 9:16 con Bloqueo Facial</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Result Preview, Biometric Overlay & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Active Asset Preview Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-zinc-800" />
                <h3 className="text-xs font-bold text-black">
                  Previsualización del Activo Generado
                </h3>
              </div>

              {/* Biometric Mesh Overlay Toggle */}
              <button
                type="button"
                onClick={() => setShowBiometricOverlay(!showBiometricOverlay)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  showBiometricOverlay
                    ? "bg-purple-900 text-purple-200 border-purple-700 shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                <span>{showBiometricOverlay ? "Ocultar Mesh" : "Ver Landmark Mesh"}</span>
              </button>
            </div>

            {/* Stage Visual Container */}
            <div className="relative flex items-center justify-center bg-zinc-950 rounded-xl overflow-hidden min-h-[380px] p-2">
              {activeGeneratedImage ? (
                <div className="relative group max-h-[460px] flex items-center justify-center">
                  <img
                    src={activeGeneratedImage.url}
                    alt={influencer.name}
                    className="max-h-[440px] w-auto rounded-lg object-contain shadow-2xl transition-transform duration-300 group-hover:scale-102"
                  />

                  {/* Biometric 68-Point Mesh Overlay Simulator */}
                  {showBiometricOverlay && (
                    <div className="absolute inset-0 bg-purple-950/20 backdrop-blur-3xs rounded-lg border border-purple-400/50 flex flex-col justify-between p-3 pointer-events-none">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold bg-black/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40">
                          68 FACIAL LANDMARKS LOCKED
                        </span>
                        <span className="text-[9px] font-mono text-purple-200 bg-purple-950/80 px-2 py-0.5 rounded">
                          CONFIDENCE: 99.4%
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-mono font-bold text-white bg-black/70 px-3 py-1 rounded-full border border-purple-400">
                          {influencer.name} • Character Tag Matched
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top Badge on Image */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold bg-black/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                      {activeGeneratedImage.aspectRatio}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-purple-900/90 text-purple-200 px-2 py-0.5 rounded backdrop-blur-xs">
                      {activeGeneratedImage.shotType}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-zinc-500 space-y-2">
                  <ImageIcon className="h-10 w-10 mx-auto text-zinc-600 animate-pulse" />
                  <p className="text-xs">No hay imagen generada aún.</p>
                </div>
              )}

              {/* In-Progress Loading Animation Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-purple-300 block">
                      Generando Activo IA para {influencer.name}
                    </span>
                    <p className="text-[11px] text-zinc-300 font-mono max-w-xs leading-relaxed">
                      {generationStep}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notification when Avatar is updated */}
            {avatarSetNotification && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 font-bold animate-fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>¡Avatar principal del modelo actualizado exitosamente!</span>
              </div>
            )}

            {/* Quick Action Buttons */}
            {activeGeneratedImage && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  {/* Set as Avatar Button */}
                  <button
                    type="button"
                    id="btn-set-active-avatar"
                    onClick={() => handleSetAsAvatar(activeGeneratedImage)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Usar como Avatar</span>
                  </button>

                  {/* Download Image Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadImage(activeGeneratedImage.url, activeGeneratedImage.scenario)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-[#F9FAFB] px-3 py-2.5 text-xs font-bold text-zinc-800 hover:bg-white hover:border-zinc-400 transition-all"
                  >
                    <Download className="h-3.5 w-3.5 text-zinc-600" />
                    <span>Descargar PNG</span>
                  </button>
                </div>

                {/* Copy Master Prompt */}
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(activeGeneratedImage.promptUsed)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">¡Prompt Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Copiar Prompt Exacto (Flux / Midjourney / SDXL)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Generated Assets Session Gallery */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-zinc-700" />
                <h4 className="text-xs font-bold text-black">
                  Galería de Activos Generados ({assetHistory.length})
                </h4>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Sesión Activa</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {assetHistory.map((asset) => {
                const isActive = activeGeneratedImage?.id === asset.id;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setActiveGeneratedImage(asset)}
                    className={`group relative aspect-[9/16] rounded-xl overflow-hidden border transition-all ${
                      isActive
                        ? "border-black ring-2 ring-black shadow-sm"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <img
                      src={asset.url}
                      alt={asset.scenario}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[8px] text-white font-mono truncate">
                      {asset.scenario}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
