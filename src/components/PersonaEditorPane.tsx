import React from "react";
import { AiInfluencer } from "../types";
import { VOICE_PERSONALITY_PRESETS } from "../data/voicePresets";
import { 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  User, 
  Lock, 
  DollarSign, 
  CreditCard, 
  Sliders, 
  Layers, 
  Info,
  Image as ImageIcon,
  Tag,
  Mic,
  Volume2,
  Upload
} from "lucide-react";

interface PersonaEditorPaneProps {
  influencer: AiInfluencer;
  onChange: (updated: AiInfluencer) => void;
}

export const PersonaEditorPane: React.FC<PersonaEditorPaneProps> = ({
  influencer,
  onChange,
}) => {
  const isAdult = Boolean(influencer.isAdultContent);

  const handleToggleAdult = (enabled: boolean) => {
    let updatedBio = influencer.bio;
    let updatedVibe = influencer.vibe;

    if (enabled && !influencer.bio.includes("18+") && !influencer.bio.includes("🔞")) {
      updatedBio = `🔞 18+ VIP Uncensored | ${influencer.bio} | Contenido íntimo y audios VIP exclusivos 💋`;
    }

    onChange({
      ...influencer,
      isAdultContent: enabled,
      bio: updatedBio,
      contentWarningDisclaimer: enabled
        ? (influencer.contentWarningDisclaimer || "⚠️ AVISO: Canal 18+ con contenido boudoir íntimo, fotos de lencería sin censura y audios personalizados.")
        : undefined,
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black tracking-tight">
              Editor de Personalidad y Ajustes en Tiempo Real
            </h4>
            <p className="text-[10px] text-zinc-500">
              Modificá cualquier campo; la vista previa se actualiza instantáneamente.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
          Live Sync Active
        </span>
      </div>

      {/* ADULT CONTENT (18+ NSFW) TOGGLE SETTING */}
      <div className={`rounded-2xl border p-4 transition-all ${
        isAdult 
          ? "border-rose-300 bg-gradient-to-r from-rose-50/80 via-pink-50/50 to-rose-50/80 shadow-2xs" 
          : "border-zinc-200 bg-zinc-50/60"
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className={`rounded-xl p-2 text-white shadow-2xs shrink-0 ${
              isAdult ? "bg-gradient-to-r from-rose-600 to-pink-600" : "bg-zinc-400"
            }`}>
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-zinc-900 tracking-tight">
                  Adult Content (18+ NSFW Mode)
                </span>
                <span className={`rounded-full px-2 py-0.2 text-[9px] font-black uppercase border ${
                  isAdult ? "bg-rose-100 text-rose-700 border-rose-300" : "bg-zinc-200 text-zinc-600 border-zinc-300"
                }`}>
                  {isAdult ? "18+ ENABLED" : "SFW ONLY"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                Activa generación de contenido erótico/boudoir, notas de voz íntimas, prompts NSFW sin censura y el disclaimer de advertencia.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            id="toggle-adult-content"
            type="button"
            role="switch"
            aria-checked={isAdult}
            onClick={() => handleToggleAdult(!isAdult)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAdult ? "bg-rose-600" : "bg-zinc-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isAdult ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Content Warning Disclaimer Customizer (Visible when Adult Content is ON) */}
        {isAdult && (
          <div className="mt-3.5 pt-3 border-t border-rose-200/80 space-y-1.5 animate-fade-in">
            <label className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
              Aviso de Contenido / Disclaimer de Advertencia (18+):
            </label>
            <input
              type="text"
              value={influencer.contentWarningDisclaimer || ""}
              onChange={(e) =>
                onChange({ ...influencer, contentWarningDisclaimer: e.target.value })
              }
              placeholder="⚠️ Canal VIP 18+ exclusivo con contenido boudoir íntimo..."
              className="w-full text-xs font-semibold rounded-xl border border-rose-200 bg-white px-3 py-2 text-rose-950 focus:border-rose-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* CORE IDENTITY INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Name */}
        <div>
          <label className="font-bold text-zinc-700 block mb-1">Nombre de la Modelo / Influencer:</label>
          <input
            type="text"
            value={influencer.name}
            onChange={(e) => onChange({ ...influencer, name: e.target.value })}
            className="w-full font-bold rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
          />
        </div>

        {/* Handle */}
        <div>
          <label className="font-bold text-zinc-700 block mb-1">Handle Social / Telegram:</label>
          <input
            type="text"
            value={influencer.handle}
            onChange={(e) => onChange({ ...influencer, handle: e.target.value })}
            className="w-full font-mono rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
          />
        </div>

        {/* Age & Nationality */}
        <div>
          <label className="font-bold text-zinc-700 block mb-1">Edad & Nacionalidad:</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={influencer.age}
              onChange={(e) => onChange({ ...influencer, age: Number(e.target.value) || 23 })}
              className="col-span-1 font-bold rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 text-center"
            />
            <input
              type="text"
              value={influencer.nationality}
              onChange={(e) => onChange({ ...influencer, nationality: e.target.value })}
              className="col-span-2 font-medium rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900"
            />
          </div>
        </div>

        {/* Avatar URL & File Upload */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-zinc-700">Foto Principal / Avatar:</label>
            <label className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded cursor-pointer hover:bg-purple-100 border border-purple-200 flex items-center gap-1 transition-all">
              <Upload className="h-3 w-3" /> Subir archivo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) {
                      onChange({ ...influencer, avatarUrl: ev.target.result as string });
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
          <input
            type="url"
            value={influencer.avatarUrl}
            onChange={(e) => onChange({ ...influencer, avatarUrl: e.target.value })}
            placeholder="https://... o sube una foto con el botón de arriba"
            className="w-full font-mono text-[11px] rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
          />
        </div>
      </div>

      {/* Vibe / Aesthetic */}
      <div className="space-y-1 text-xs">
        <label className="font-bold text-zinc-700 block">Estilo & Vibe Estético:</label>
        <input
          type="text"
          value={influencer.vibe}
          onChange={(e) => onChange({ ...influencer, vibe: e.target.value })}
          placeholder="ej. Boudoir de Seda, Lencería de Encaje, Candids Nocturnos..."
          className="w-full font-medium rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
        />
      </div>

      {/* Bio / Description Hook */}
      <div className="space-y-1 text-xs">
        <label className="font-bold text-zinc-700 block">
          Descripción / Gancho de Bio (Bio & Sales Hook):
        </label>
        <textarea
          rows={3}
          value={influencer.bio}
          onChange={(e) => onChange({ ...influencer, bio: e.target.value })}
          placeholder="Escribí el texto persuasivo que verán los usuarios en Instagram / Telegram..."
          className="w-full font-medium rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
        />
      </div>

      {/* Character Lock Tags */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <label className="font-bold text-zinc-700 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-black" />
            Master Character Lock Tags (OpenArt / Flux / Midjourney):
          </label>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200">
            Prompt Anchor
          </span>
        </div>
        <textarea
          rows={3}
          value={influencer.characterTags}
          onChange={(e) => onChange({ ...influencer, characterTags: e.target.value })}
          className="w-full font-mono text-xs rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 focus:border-black focus:outline-none"
        />
      </div>

      {/* Facial Characteristics */}
      <div className="space-y-1 text-xs">
        <label className="font-bold text-zinc-700 block">
          Detalles de Geometría Facial y Rasgos Físicos:
        </label>
        <textarea
          rows={2}
          value={influencer.facialCharacteristics}
          onChange={(e) => onChange({ ...influencer, facialCharacteristics: e.target.value })}
          className="w-full font-medium text-xs rounded-xl border border-zinc-200 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
        />
      </div>

      {/* Pricing Tiers */}
      <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 space-y-2 text-xs">
        <span className="font-bold text-zinc-800 flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          Precios de Suscripción Recomendados:
        </span>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-zinc-500 font-medium block mb-1">SUI Mainnet:</span>
            <input
              type="number"
              value={influencer.recommendedPricing.sui}
              onChange={(e) =>
                onChange({
                  ...influencer,
                  recommendedPricing: {
                    ...influencer.recommendedPricing,
                    sui: Number(e.target.value) || 15,
                  },
                })
              }
              className="w-full font-bold rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-medium block mb-1">USDC:</span>
            <input
              type="number"
              value={influencer.recommendedPricing.usdc}
              onChange={(e) =>
                onChange({
                  ...influencer,
                  recommendedPricing: {
                    ...influencer.recommendedPricing,
                    usdc: Number(e.target.value) || 25,
                  },
                })
              }
              className="w-full font-bold rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-medium block mb-1">Mercado Pago ARS:</span>
            <input
              type="number"
              value={influencer.recommendedPricing.ars || 18500}
              onChange={(e) =>
                onChange({
                  ...influencer,
                  recommendedPricing: {
                    ...influencer.recommendedPricing,
                    ars: Number(e.target.value) || 18500,
                  },
                })
              }
              className="w-full font-bold rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* Voice Profile Selector */}
      <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-zinc-800 flex items-center gap-1.5">
            <Mic className="h-3.5 w-3.5 text-emerald-600" />
            Perfil de Voz (ElevenLabs & Edge-TTS):
          </span>
          <span className="text-[10px] font-mono text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
            {influencer.voiceProfile?.name ? influencer.voiceProfile.name.split("•")[0].trim() : "Elena"}
          </span>
        </div>

        <select
          value={influencer.voiceProfile?.id || VOICE_PERSONALITY_PRESETS[0].id}
          onChange={(e) => {
            const selected = VOICE_PERSONALITY_PRESETS.find((p) => p.id === e.target.value);
            if (selected) {
              onChange({
                ...influencer,
                voiceProfile: selected,
              });
            }
          }}
          className="w-full font-medium rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
        >
          {VOICE_PERSONALITY_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.accent})
            </option>
          ))}
        </select>

        <p className="text-[11px] text-zinc-500 leading-snug">
          {influencer.voiceProfile?.description || VOICE_PERSONALITY_PRESETS[0].description}
        </p>
      </div>
    </div>
  );
};
