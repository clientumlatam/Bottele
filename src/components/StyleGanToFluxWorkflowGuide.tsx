import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  ExternalLink, 
  User, 
  Camera, 
  Film, 
  Mic, 
  ShieldCheck, 
  Layers, 
  Zap, 
  RefreshCw, 
  Download, 
  Sliders, 
  Info,
  CheckCircle2,
  Lock,
  Eye,
  Maximize2,
  X,
  Play,
  Share2
} from "lucide-react";
import { AiInfluencer } from "../types";

interface StyleGanToFluxWorkflowGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentInfluencer?: AiInfluencer;
  onApplySeedFace?: (avatarUrl: string, characteristics: string, characterTags: string) => void;
}

// Curated high-res synthetic faces (StyleGAN / Diffusion seeds)
const SYNTHETIC_SEED_FACES = [
  {
    id: "seed-valeria",
    name: "Valeria (Latina / Buenos Aires Chic)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    nationality: "Argentina",
    age: 23,
    style: "Warm olive skin, almond hazel eyes, subtle jawline definition, natural honey-brown wavy hair",
    tags: "(masterpiece, best quality, ultra-detailed 8k), valeria_latina face, warm olive undertone, hazel brown eyes, soft defined jawline, honey brown voluminous waves, photorealistic skin texture with natural pores",
    motionPrompt: "A beautiful young woman smiling gently at the camera, wind blowing hair strands softly, subtle breathing, eye contact, golden hour cafe terrace, cinematic 4k 60fps"
  },
  {
    id: "seed-elena",
    name: "Elena (Mediterranean / Glamour & VIP)",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    nationality: "España / Colombia",
    age: 22,
    style: "Deep emerald eyes, dark sleek brunette hair, sculpted cheekbones, light porcelain olive skin",
    tags: "(masterpiece, photorealistic 8k RAW photo), elena_model face, emerald green eyes, sharp defined cheekbones, glossy brunette hair, realistic micro-pores, soft catchlight in eyes",
    motionPrompt: "Cinematic portrait, subtle slow smile, camera panning slightly around her face, elegant silk dress reflection, ambient luxury indoor lighting, hyperrealistic micro-expressions"
  },
  {
    id: "seed-maya",
    name: "Maya (Nordic / Minimalist Aesthetic)",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    nationality: "Suecia / Miami",
    age: 24,
    style: "Icy blue eyes, ash blonde textured bob, sun-kissed freckles on nose bridge, athletic elegance",
    tags: "(ultra-detailed 8k, Hasselblad 85mm portrait), maya_scandi face, intense ice blue eyes, faint light freckles on nose, ash blonde strands, natural radiant skin texture, soft bokeh",
    motionPrompt: "Slow motion head turn towards camera, soft breeze touching blonde hair, sun flare behind, sparkling blue eyes, candid documentary realism, 4k 60fps"
  },
  {
    id: "seed-chloe",
    name: "Chloe (Tokyo / Cyber Fitness & Neon)",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
    nationality: "Japón / Los Angeles",
    age: 23,
    style: "Dark almond eyes, glass skin glow, jet black straight bob with curtain bangs, minimalist streetwear",
    tags: "(photorealistic 8k, 35mm film photography), chloe_tokyo face, luminous glass skin, dark espresso almond eyes, sleek dark bob hair, subtle lip gloss sheen, soft ambient lighting",
    motionPrompt: "Walking forward in urban city with soft depth of field, looking into the lens, natural eye blink, modern clean aesthetic, cinematic color grading"
  }
];

export const StyleGanToFluxWorkflowGuide: React.FC<StyleGanToFluxWorkflowGuideProps> = ({
  isOpen = true,
  onClose,
  currentInfluencer,
  onApplySeedFace,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedSeed, setSelectedSeed] = useState(SYNTHETIC_SEED_FACES[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUseSeedFace = (seed: typeof SYNTHETIC_SEED_FACES[0]) => {
    setSelectedSeed(seed);
    if (onApplySeedFace) {
      onApplySeedFace(seed.avatarUrl, seed.style, seed.tags);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3000);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Seed Face (StyleGAN / ThisPersonDoesNotExist)",
      desc: "Generación de rostro sintético virgen, sin copyright y no existente en el mundo real.",
      icon: User,
      badge: "Base ID",
    },
    {
      number: 2,
      title: "Bloqueo Facial (InsightFace / Flux LoRA / --cref)",
      desc: "Extracción de landmarks biométricos y entrenamiento de pesos consistentes.",
      icon: Lock,
      badge: "Consistencia",
    },
    {
      number: 3,
      title: "Expansión 9:16 Vertical (Flux Fill & Inpainting)",
      desc: "Transformar el primer plano 1:1 en fotos de cuerpo entero para Instagram Reels y TikTok.",
      icon: Camera,
      badge: "9:16 Outpaint",
    },
    {
      number: 4,
      title: "Generación de Movimiento (Kling 3.0 / Motion Brush)",
      desc: "Animación fotorrealista de microexpresiones, respiración y contacto visual en 4K.",
      icon: Film,
      badge: "Video I2V",
    },
    {
      number: 5,
      title: "Clonación de Voz & Notas de Audio (TTS / ElevenLabs)",
      desc: "Creación de la voz de la modelo para enviar notas de voz reales y personalizadas al bot.",
      icon: Mic,
      badge: "Voz Realista",
    },
    {
      number: 6,
      title: "Monetización & Entrega en Telegram VIP (Sui Web3)",
      desc: "Integración automática de contenido desbloqueable con contrato inteligente en Sui.",
      icon: Zap,
      badge: "Pagos Sui",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black font-bold text-xs shadow-sm">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Workflow Maestro: de StyleGAN (ThisPersonDoesNotExist) a Flux & Kling 3.0
                </h2>
                <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-800">
                  Guía Oficial 2026
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Pipeline paso a paso para crear influencers IA con 100% de consistencia facial, video 9:16 y voz sintética.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Applied Notification Banner */}
        {appliedNotification && (
          <div className="bg-emerald-500 text-black px-6 py-2 text-xs font-bold flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>¡Rostro de {selectedSeed.name} aplicado con éxito a tu Modelo en el Estudio!</span>
            </div>
            <span className="text-[10px] uppercase font-black bg-black text-white px-2 py-0.5 rounded">
              Sincronizado
            </span>
          </div>
        )}

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-6 border-b border-zinc-200 bg-zinc-50 overflow-x-auto">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.number;
            return (
              <button
                key={s.number}
                onClick={() => setActiveStep(s.number)}
                className={`flex flex-col items-center justify-center p-3 text-center border-r border-zinc-200 transition-all ${
                  isCurrent
                    ? "bg-white border-b-2 border-b-black text-black font-bold shadow-2xs"
                    : "text-zinc-500 hover:bg-zinc-100/70 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCurrent ? "bg-black text-white" : "bg-zinc-200 text-zinc-700"
                  }`}>
                    {s.number}
                  </span>
                  <Icon className={`h-4 w-4 ${isCurrent ? "text-black" : "text-zinc-400"}`} />
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-1">{s.title.split("(")[0]}</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">{s.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body based on Active Step */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: STYLEGAN / THIS PERSON DOES NOT EXIST */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-black" />
                    Paso 1: Obtención del Rostro Base (Seed Facial) en StyleGAN
                  </h3>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://thispersondoesnotexist.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-800 border border-zinc-300"
                    >
                      <span>thispersondoesnotexist.com</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://thispersonnotexist.org"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-800 border border-zinc-300"
                    >
                      <span>thispersonnotexist.org</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Las redes <strong>StyleGAN2/3</strong> generan imágenes de 1024x1024 de caras humanas artificiales con simetría fotorrealista y texturas epidérmicas indistinguibles de una persona real. Al usar un rostro de <em>ThisPersonDoesNotExist</em>, obtienes un personaje con <strong>cero riesgo de reclamos de imagen</strong>, <strong>identidad única</strong> y lista para convertirse en una marca digital millonaria.
                </p>

                {/* Key rules for selecting a good seed face */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="font-bold text-zinc-900 block mb-1">1. Iluminación Neutra</span>
                    <p className="text-zinc-500 text-[11px]">Evita sombras duras o gafas de sol. Busca luz frontal difusa (ring light o luz natural suave).</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="font-bold text-zinc-900 block mb-1">2. Mirada Directa a Cámara</span>
                    <p className="text-zinc-500 text-[11px]">La mirada alineada facilita la extracción precisa de landmarks por parte de InsightFace y ControlNet.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="font-bold text-zinc-900 block mb-1">3. Rasgos Distintivos</span>
                    <p className="text-zinc-500 text-[11px]">Un color de ojos marcado, lunares suaves o forma de mandíbula facilitan la consistencia en los prompts.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Synthetic Seed Face Picker */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-zinc-700" />
                    Catálogo de Rostros Sintéticos Curados (Listos para Usar):
                  </span>
                  <span className="text-[11px] text-zinc-500">Haz clic para seleccionar o aplicar</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SYNTHETIC_SEED_FACES.map((seed) => {
                    const isSelected = selectedSeed.id === seed.id;
                    return (
                      <div
                        key={seed.id}
                        onClick={() => setSelectedSeed(seed)}
                        className={`group relative rounded-2xl border p-3.5 cursor-pointer transition-all ${
                          isSelected
                            ? "border-black bg-zinc-50 ring-2 ring-black shadow-md"
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs"
                        }`}
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 mb-2.5">
                          <img
                            src={seed.avatarUrl}
                            alt={seed.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 left-2 rounded-md bg-black/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                            {seed.age} años • {seed.nationality}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-zinc-950 truncate mb-1">{seed.name}</h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                          {seed.style}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseSeedFace(seed);
                          }}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            isSelected
                              ? "bg-black text-white hover:bg-zinc-800"
                              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          <span>Aplicar a mi Modelo</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CHARACTER LOCKING & PROMPTS */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-black" />
                  Paso 2: Bloqueo Facial en Flux.1, Midjourney (--cref) y OpenArt
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Para que tu modelo mantenga la <strong>misma identidad visual</strong> en sesiones de playa, gimnasio, balcón o dormitorio, utilizamos 3 técnicas de la industria:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-zinc-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-950">A. Fooocus (FaceID Free)</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">100% Gratis ($0)</span>
                    </div>
                    <p className="text-zinc-500 text-[11px]">
                      Usa Fooocus con Image Prompt + FaceID. Carga el rostro StyleGAN como referencia y genera fotos infinitas sin costo.
                    </p>
                    <code className="block bg-zinc-100 p-1.5 rounded text-[10px] font-mono text-zinc-800">
                      Modo: Image Prompt (Weight: 0.85, Stop At: 0.9)
                    </code>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-zinc-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-950">B. HuggingFace Flux Spaces</span>
                      <span className="text-[9px] bg-cyan-100 text-cyan-900 font-bold px-1.5 py-0.5 rounded">100% Nube Gratis</span>
                    </div>
                    <p className="text-zinc-500 text-[11px]">
                      Genera en Flux.1 Schnell en Hugging Face Spaces sin suscripciones ni tarjeta de crédito con ratio 9:16.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-zinc-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-950">C. SeaArt / Tensor.Art</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">150 Créditos/Día</span>
                    </div>
                    <p className="text-zinc-500 text-[11px]">
                      Usa la cuota diaria gratuita renovable de por vida para aplicar Face Swap e Inpainting sin instalar nada local.
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Character Consistency Prompt for Selected Model */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-black" />
                    Etiqueta Maestra de Consistencia Facial para {selectedSeed.name}:
                  </span>
                  <button
                    onClick={() => handleCopy(selectedSeed.tags, "master-tags")}
                    className="flex items-center gap-1 text-xs font-bold text-black hover:underline"
                  >
                    {copiedCode === "master-tags" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar Tags</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-200 border border-zinc-800 leading-relaxed">
                  {selectedSeed.tags}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 9:16 OUTPAINT & PHOTOSHOOTS */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-black" />
                  Paso 3: Expansión 9:16 Vertical para Instagram Reels & TikTok
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Las fotos de StyleGAN son cuadradas (1:1). Para monetizar en redes sociales y crear contenido viral, debes <strong>expandir (outpaint)</strong> el encuadre a formato vertical 9:16 (1080x1920) y situar a la modelo en escenarios aspiracionales.
                </p>

                {/* Prompt Blueprint Template */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-950">
                        Fórmula de Prompt para Outpainting en Flux.1 Fill / Stable Diffusion:
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `9:16 full-body vertical shot of ${selectedSeed.tags}, standing on a luxury yacht balcony in Ibiza sunset, wearing silk sundress, candid phone photography, ultra-realistic skin texture, 8k resolution, cinematic golden hour lighting, Hasselblad 50mm f/1.8 --ar 9:16`,
                            "outpaint-prompt"
                          )
                        }
                        className="text-xs font-bold text-black flex items-center gap-1 hover:underline"
                      >
                        {copiedCode === "outpaint-prompt" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />} Copiar Prompt
                      </button>
                    </div>

                    <p className="font-mono text-xs text-zinc-800 bg-zinc-50 p-3 rounded-lg border border-zinc-200 leading-relaxed">
                      9:16 full-body vertical shot of {selectedSeed.tags}, standing on a luxury yacht balcony in Ibiza sunset, wearing silk sundress, candid phone photography, ultra-realistic skin texture, 8k resolution, cinematic golden hour lighting, Hasselblad 50mm f/1.8 --ar 9:16
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: KLING 3.0 MOTION */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Film className="h-4 w-4 text-black" />
                    Paso 4: Animación y Video Fotorrealista con Kling 3.0 / Luma
                  </h3>
                  <a
                    href="https://klingai.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-800 border border-zinc-300"
                  >
                    <span>klingai.com</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Convierte las fotos generadas en videos de 5 a 10 segundos utilizando el modo <strong>Image-to-Video (I2V)</strong> en Kling 3.0 o Luma Dream Machine. Configura la cámara en modo <em>Orbit</em> o <em>Push In</em> para lograr realismo máximo en TikTok y Reels.
                </p>

                {/* Motion prompt block */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950">
                      Prompt de Movimiento Óptimo para Kling 3.0:
                    </span>
                    <button
                      onClick={() => handleCopy(selectedSeed.motionPrompt, "kling-prompt")}
                      className="text-xs font-bold text-black flex items-center gap-1 hover:underline"
                    >
                      {copiedCode === "kling-prompt" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />} Copiar Motion
                    </button>
                  </div>
                  <p className="font-mono text-xs text-zinc-800 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    {selectedSeed.motionPrompt}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: VOICE SYNTHESIS */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Mic className="h-4 w-4 text-black" />
                  Paso 5: Notas de Voz Sintéticas y Síntesis Conversacional
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Los suscriptores pagan hasta <strong>4 veces más</strong> cuando la modelo les envía notas de voz auténticas en Telegram. Configura el tono de voz de acuerdo con su nacionalidad ({selectedSeed.nationality}).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
                    <span className="font-bold text-zinc-950 block flex items-center justify-between">
                      <span>Herramientas de Voz 100% Gratuitas ($0):</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">100% Free</span>
                    </span>
                    <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                      <li><strong>Edge-TTS (Recomendado):</strong> Voces neuronales de Microsoft sin costo ni límites vía Python/Node.js.</li>
                      <li><strong>Kokoro-82M / Piper TTS:</strong> Modelos de síntesis Open Source de ultra alta fidelidad emocional.</li>
                      <li><strong>Web Speech API:</strong> Reproducción instantánea nativa desde el navegador.</li>
                      <li><strong>Eleven Multilingual (Opcional):</strong> Para clonación avanzada si se dispone de plan.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
                    <span className="font-bold text-zinc-950 block">Guión de Bienvenida para Telegram VIP:</span>
                    <p className="italic text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-[11px]">
                      "Hola mi amor... qué lindo tenerte acá en mi canal privado. Te preparé unas fotitos y videos exclusivos que no puedo subir a Instagram. Decime qué querés ver primero..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: TELEGRAM SUI MONETIZATION */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-600" />
                  Paso 6: Embudo de Monetización y Cobro Automático con Sui Web3
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Una vez que el contenido de la modelo ({selectedSeed.name}) está listo, el bot de Telegram automatiza la venta de suscripciones mensuales y desbloqueo de fotos/videos por propina.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-zinc-200">
                    <span className="font-bold text-zinc-950 block mb-1">1. Enlace de Pago Instantáneo</span>
                    <p className="text-zinc-500 text-[11px]">El bot genera una transacción Sui Move con monto exacto en SUI o USDC.</p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-zinc-200">
                    <span className="font-bold text-zinc-950 block mb-1">2. Verificación On-Chain</span>
                    <p className="text-zinc-500 text-[11px]">En menos de 400 milisegundos, Sui confirma la transacción y genera el link de un solo uso.</p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-zinc-200">
                    <span className="font-bold text-zinc-950 block mb-1">3. Auto-Expulsión Cron</span>
                    <p className="text-zinc-500 text-[11px]">A los 30 días, si el usuario no renueva, el bot lo expulsa automáticamente del canal VIP.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Paso {activeStep} de {steps.length}</span>
            <span>•</span>
            <span className="font-semibold text-zinc-800">{steps[activeStep - 1].title}</span>
          </div>

          <div className="flex items-center gap-3">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-100 transition-all"
              >
                Paso Anterior
              </button>
            )}

            {activeStep < steps.length ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 transition-all shadow-sm"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleUseSeedFace(selectedSeed);
                  if (onClose) onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 transition-all shadow-sm"
              >
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Aplicar Rostro & Cerrar Guía</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
