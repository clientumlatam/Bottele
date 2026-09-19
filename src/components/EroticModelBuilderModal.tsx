import React, { useState } from "react";
import { AiInfluencer } from "../types";
import { Sparkles, Flame, Heart, Lock, ShieldAlert, Check, X, Wand2, Copy, DollarSign, Camera, Music, MessageSquare } from "lucide-react";

interface EroticModelBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveModel: (newModel: AiInfluencer) => void;
}

export const EroticModelBuilderModal: React.FC<EroticModelBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveModel,
}) => {
  if (!isOpen) return null;

  const [archetype, setArchetype] = useState<"boudoir" | "latina_hot" | "cyber_erotica" | "luxury_yacht">("boudoir");
  const [modelName, setModelName] = useState("Sienna Silk (Sensual 18+)");
  const [handle, setHandle] = useState("@siennasilk.vip");
  const [age, setAge] = useState(23);
  const [nationality, setNationality] = useState("Argentina / Miami");
  const [vibe, setVibe] = useState("Boudoir Fino 4K, Lencería de Seda, Candids Nocturnos & Audios Íntimos");
  const [suiPrice, setSuiPrice] = useState(18);
  const [usdcPrice, setUsdcPrice] = useState(30);
  const [arsPrice, setArsPrice] = useState(22500);

  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80");

  const ARCHETYPES_PRESETS = {
    boudoir: {
      title: "🔥 Sensual Boudoir & Encaje Fino (18+ VIP)",
      vibe: "Lencería de encaje sheer, iluminación cálida de hotel penthouse, poros reales, audios íntimos en español.",
      tags: "(sienna_silk_boudoir:1.4), 23yo model, sheer lace lingerie, honey hazel eyes, silk bed sheets, warm candlelight, authentic skin micro-texture, 85mm portrait",
      pillars: [
        "Galerías 4K Boudoir sin censura en Canal VIP Telegram",
        "Notas de voz personalizadas y juegos de rol diario",
        "Selfies candids con flash nocturno y lencería fina",
      ],
      prompts: [
        {
          scene: "Sesión Intimista en Penthouse con Lencería de Encaje",
          prompt: "raw photo of (sienna_silk_boudoir:1.4), wearing delicate black sheer lace corset, sitting on satin bed sheets in luxury penthouse, soft candle illumination, Hasselblad 85mm f/1.4 --ar 9:16 --style raw",
          klingMotion: "Model softly adjusting hair on satin pillow, looking intimately into camera with a subtle smirk, gentle breathing motion",
        },
        {
          scene: "Selfie de Espejo Nocturna con Flash Directo",
          prompt: "candid smartphone flash mirror selfie of (sienna_silk_boudoir:1.4), messy wet hair, wearing crimson silk robe unbuttoned, hotel bathroom background, direct camera flash --ar 9:16",
          klingMotion: "Adjusting smartphone angle in mirror, biting bottom lip gently and winking at camera",
        },
      ],
    },
    latina_hot: {
      title: "💃 Latina Glamour Spiced (Alta Conversión)",
      vibe: "Rubia/Morena despampanante, bikinis metálicos, boliches de lujo, chat de voz cariñoso porteño/caribeño.",
      tags: "(latina_hot_spiced:1.4), 22yo latin glamour model, sun-kissed skin, plump lips, bronze metallic bikini, luxury yacht, natural skin texture",
      pillars: [
        "Reels y TikToks provocativos con transiciones virales",
        "Sets fotográficos 4K de verano y playa privada",
        "Atención personalizada con bot de voz de IA",
      ],
      prompts: [
        {
          scene: "Atardecer en Yate Privado en Ibiza",
          prompt: "masterpiece portrait of (latina_hot_spiced:1.4), metallic bronze swimsuit, golden hour sun reflections on sun-kissed skin, sea background, 85mm f/1.2 --ar 9:16",
          klingMotion: "Warm ocean wind moving hair, model lowering sunglasses and smiling seductively towards viewer",
        },
      ],
    },
    cyber_erotica: {
      title: "🔮 Cyber Erotica & Neon Midnight",
      vibe: "Estética cyberpunk sensual, neón magenta y cian, vestidos de cuero con transparencias, ambiente VIP nocturno.",
      tags: "(cyber_erotica_v1:1.35), 23yo futuristic glamour model, obsidian hair, glossy lips, black leather top, neon magenta ambient lighting, high contrast",
      pillars: [
        "Galerías nocturnas cyberpunk exclusivas",
        "Contenido conceptual erótico de alta resolución",
        "Juegos de rol futuristas en el bot de Telegram",
      ],
      prompts: [
        {
          scene: "VIP Lounge Cyberpunk con Luces Neón",
          prompt: "nightlife portrait of (cyber_erotica_v1:1.35), wearing black leather sheer dress, seated in velvet booth of VIP club, magenta neon reflections, Canon 85mm f/1.2 --ar 9:16",
          klingMotion: "Club lights pulsing softly, model raising glass towards camera with mysterious smile",
        },
      ],
    },
    luxury_yacht: {
      title: "🍾 Luxury Sunset & Intimate Lounge",
      vibe: "Glamour mediterráneo, jacuzzis de hotel, bata de seda al amanecer, paseos en superyate.",
      tags: "(luxury_yacht_glam:1.35), 24yo European glamour model, champagne slip dress, golden hour light, luxury penthouse balcony, Leica 50mm",
      pillars: [
        "Diarios de viaje exclusivos y sesiones fotográficas privadas",
        "Mensajes de voz de buenos días para suscriptores VIP",
        "Acceso directo a canal privado con material exclusivo",
      ],
      prompts: [
        {
          scene: "Balcón de Lujo con Vista al Mar al Atardecer",
          prompt: "romantic shot of (luxury_yacht_glam:1.35), silk champagne slip dress, holding glass of rosé on glass balcony at sunset, soft warm glow --ar 9:16",
          klingMotion: "Sea breeze blowing silk dress, model looking back smiling warmly into camera",
        },
      ],
    },
  };

  const handleApplyArchetype = (type: "boudoir" | "latina_hot" | "cyber_erotica" | "luxury_yacht") => {
    setArchetype(type);
    const data = ARCHETYPES_PRESETS[type];
    setVibe(data.vibe);
  };

  const handleBuildAndSave = () => {
    const preset = ARCHETYPES_PRESETS[archetype];
    const createdModel: AiInfluencer = {
      id: `erotic-model-${Date.now()}`,
      name: modelName,
      handle,
      age: Number(age) || 23,
      nationality,
      vibe,
      bio: `🔥 Creadora Exclusiva 18+ | ${vibe} ✨ | Sumate al VIP sin censura en el canal de Telegram 🔞💋`,
      avatarUrl,
      facialCharacteristics: "Ojos almendrados expresivos, labios carnosos con brillo gloss, piel suave con microtextura natural y mirada cautivadora.",
      characterTags: preset.tags,
      recommendedPricing: {
        sui: Number(suiPrice),
        usdc: Number(usdcPrice),
        ars: Number(arsPrice),
        tierName: "VIP 18+ Sin Censura",
      },
      contentPillars: preset.pillars,
      promptPresets: preset.prompts,
    };

    onSaveModel(createdModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-pink-200 bg-white p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-pink-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 p-2.5 text-white shadow-md">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">
                  Creador de Modelo Erótica / 18+ VIP (`Erotic Model Builder`)
                </h3>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700 border border-rose-200">
                  18+ VIP ONLY
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Diseñá y configurá un modelo de IA de alta conversión especializado en canales de Telegram VIP, OnlyFans y modelos de lencería/boudoir.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-black transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Archetype Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-pink-600" />
            Elegí el Arquetipo / Estilo Erótico
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {(Object.keys(ARCHETYPES_PRESETS) as Array<keyof typeof ARCHETYPES_PRESETS>).map((key) => {
              const item = ARCHETYPES_PRESETS[key];
              const isSelected = archetype === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyArchetype(key)}
                  className={`text-left rounded-2xl p-3 border transition-all ${
                    isSelected
                      ? "border-pink-500 bg-pink-50/60 shadow-xs ring-1 ring-pink-400"
                      : "border-zinc-200 bg-white hover:border-pink-300 hover:bg-pink-50/20"
                  }`}
                >
                  <div className="font-bold text-zinc-900 text-xs flex items-center justify-between">
                    <span>{item.title}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-pink-600" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                    {item.vibe}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Nombre de la Modelo:</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full font-bold rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Handle Telegram / IG:</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full font-mono rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Edad & Nacionalidad:</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="col-span-1 font-bold rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900"
              />
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="col-span-2 font-medium rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Avatar Image URL:</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full font-mono text-[11px] rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900"
            />
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200 space-y-2 text-xs">
          <span className="font-bold text-zinc-800 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-green-600" />
            Precios Recomendados Membresía VIP 18+:
          </span>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-zinc-500 font-medium">SUI Mainnet:</span>
              <input
                type="number"
                value={suiPrice}
                onChange={(e) => setSuiPrice(Number(e.target.value))}
                className="w-full font-bold rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-medium">USDC Stables:</span>
              <input
                type="number"
                value={usdcPrice}
                onChange={(e) => setUsdcPrice(Number(e.target.value))}
                className="w-full font-bold rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-medium">Mercado Pago ARS:</span>
              <input
                type="number"
                value={arsPrice}
                onChange={(e) => setArsPrice(Number(e.target.value))}
                className="w-full font-bold rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleBuildAndSave}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-pink-700 hover:to-rose-700 transition-all"
          >
            <Flame className="h-4 w-4" />
            <span>Aplicar Modelo Erótico a la App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
