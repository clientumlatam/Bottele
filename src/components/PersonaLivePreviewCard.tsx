import React, { useState } from "react";
import { AiInfluencer } from "../types";
import { 
  User, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  Copy, 
  Check, 
  MessageSquare, 
  Lock, 
  CreditCard, 
  DollarSign, 
  FileCode, 
  Terminal, 
  Eye,
  Camera,
  Layers,
  Heart
} from "lucide-react";

interface PersonaLivePreviewCardProps {
  influencer: AiInfluencer;
  activeTab?: "card" | "system_prompt" | "tags";
  onTabChange?: (tab: "card" | "system_prompt" | "tags") => void;
}

export const PersonaLivePreviewCard: React.FC<PersonaLivePreviewCardProps> = ({
  influencer,
  activeTab: externalTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<"card" | "system_prompt" | "tags">("card");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeTab = externalTab || internalTab;
  const setTab = onTabChange || setInternalTab;

  const isAdult = Boolean(influencer.isAdultContent);

  // Generate dynamic system personality prompt based on live model data
  const generateSystemPromptTemplate = () => {
    return `# ========================================================
# SYSTEM INSTRUCTION: ${influencer.name.toUpperCase()} PERSONA
# Mode: ${isAdult ? "🔞 18+ ADULT / NSFW ROLEPLAY VIP" : "✨ SFW LIFESTYLE & GLAMOUR VIP"}
# ========================================================

You are ${influencer.name} (${influencer.handle}), a ${influencer.age}-year-old model from ${influencer.nationality}.
Your aesthetic vibe is: "${influencer.vibe}".
Visual Face Lock: "${influencer.characterTags}".

## 👤 PERSONALITY & SPEECH STYLE:
- Tone: ${isAdult ? "Intimate, seductive, playfully unfiltered, affectionate, teasing, and confident." : "Charming, aspirational, sophisticated, warm, and engaging."}
- Bio Hook: "${influencer.bio}"
- Language: Speaks primarily in Spanish with occasional English slang and emotive emojis (💋, ✨, 🔥, 🖤).
- Core Objective: Build high emotional connection, reward VIP subscribers, and encourage monthly renews on Telegram.

${isAdult ? `## 🔞 18+ ADULT / NSFW GUIDELINES:
- This persona is configured for UNCENSORED 18+ Telegram VIP channels.
- Emphasize private boudoir sets, candid lingerie previews, late-night audio whispers, and sensual teasing.
- Maintain a captivating, alluring persona with personal audio notes and exclusive behind-the-scenes teasers.
- Always include explicit confirmation that VIP content is 100% private and unfiltered.` : `## ✨ SFW / FASHION CONTENT GUIDELINES:
- Keep conversations stylish, aspirational, and high-fashion oriented.
- Focus on travel lifestyle, luxury aesthetics, fitness routines, and creator insights.`}

## 💳 MONETIZATION DETAILS:
- SUI VIP Price: ${influencer.recommendedPricing?.sui || 15} SUI / month
- USDC Price: $${influencer.recommendedPricing?.usdc || 25} USDC / month
- Mercado Pago (ARS): $${(influencer.recommendedPricing?.ars || 18500).toLocaleString("es-AR")} ARS / month
`;
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      {/* Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black tracking-tight flex items-center gap-1.5">
              Live Real-Time Persona Card Preview
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-zinc-500">
              Vista previa instantánea sincronizada con tus cambios en vivo.
            </p>
          </div>
        </div>

        <div className="flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200 text-xs">
          <button
            onClick={() => setTab("card")}
            className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
              activeTab === "card"
                ? "bg-white text-black shadow-2xs"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Tarjeta Visual
          </button>
          <button
            onClick={() => setTab("system_prompt")}
            className={`px-3 py-1 rounded-lg font-bold transition-all text-xs flex items-center gap-1 ${
              activeTab === "system_prompt"
                ? "bg-white text-black shadow-2xs"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <Terminal className="h-3 w-3" />
            System Prompt
          </button>
          <button
            onClick={() => setTab("tags")}
            className={`px-3 py-1 rounded-lg font-bold transition-all text-xs flex items-center gap-1 ${
              activeTab === "tags"
                ? "bg-white text-black shadow-2xs"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <Lock className="h-3 w-3" />
            Tags
          </button>
        </div>
      </div>

      {/* Adult Content Warning Disclaimer Banner */}
      {isAdult && (
        <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-3.5 space-y-1 animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black text-rose-800">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>⚠️ AVISO DE CONTENIDO ADULTO (18+ NSFW ACTIVO)</span>
            <span className="rounded-full bg-rose-600 px-2 py-0.2 text-[9px] font-bold text-white uppercase ml-auto">
              18+ ONLY
            </span>
          </div>
          <p className="text-[11px] text-rose-900 leading-snug">
            {influencer.contentWarningDisclaimer ||
              "Este personaje está configurado para generación de contenido erótico/boudoir, notas de voz íntimas y monetización en canales privados VIP de Telegram para mayores de 18 años."}
          </p>
        </div>
      )}

      {/* TAB 1: VISUAL PERSONA CARD */}
      {activeTab === "card" && (
        <div className="space-y-4">
          {/* Card Hero */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-4 shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={influencer.avatarUrl}
                  alt={influencer.name}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                {isAdult ? (
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm ring-2 ring-white text-[10px] font-black">
                    18+
                  </span>
                ) : (
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-white text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <h3 className="text-base font-extrabold text-black tracking-tight truncate">
                    {influencer.name || "Nombre del Personaje"}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase border ${
                      isAdult
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {isAdult ? "🔞 NSFW VIP" : "✨ SFW Glamour"}
                  </span>
                </div>

                <p className="text-xs font-semibold text-zinc-600">
                  {influencer.handle || "@handle"} • {influencer.age || 23} años • {influencer.nationality || "Internacional"}
                </p>

                <p className="text-xs text-zinc-500 italic line-clamp-2">
                  "{influencer.vibe || "Sin vibe configurada..."}"
                </p>
              </div>
            </div>

            {/* Bio Hook Section */}
            <div className="mt-3.5 rounded-xl bg-white p-3 text-xs border border-zinc-200 text-zinc-700 shadow-2xs">
              <span className="font-bold text-black text-[11px] block mb-0.5 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-zinc-800" /> Bio & Hook de Conversión:
              </span>
              <p className="text-zinc-600 leading-relaxed font-medium">
                {influencer.bio || "Agregá una descripción o gancho persuasivo para los suscriptores..."}
              </p>
            </div>

            {/* Pricing Chips */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-2xs">
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">SUI Mainnet</span>
                <span className="text-sm font-black text-black block mt-0.5">
                  {influencer.recommendedPricing?.sui || 15} SUI
                </span>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-2xs">
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">USDC</span>
                <span className="text-sm font-black text-black block mt-0.5">
                  ${influencer.recommendedPricing?.usdc || 25}
                </span>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-2 shadow-2xs">
                <span className="text-[9px] font-bold text-blue-700 uppercase block flex items-center justify-center gap-0.5">
                  <CreditCard className="h-2.5 w-2.5" /> Mercado Pago
                </span>
                <span className="text-sm font-black text-blue-950 block mt-0.5">
                  ${(influencer.recommendedPricing?.ars || 18500).toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          {influencer.contentPillars && influencer.contentPillars.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 space-y-2">
              <span className="text-xs font-bold text-zinc-700 block flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-zinc-800" /> Pilares de Contenido Semanal ({influencer.contentPillars.length}):
              </span>
              <div className="space-y-1.5 text-xs">
                {influencer.contentPillars.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-zinc-800 border border-zinc-200"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-black text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-medium leading-tight">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SYSTEM PERSONALITY PROMPT */}
      {activeTab === "system_prompt" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-black" /> Prompt de Personalidad Inyectado:
            </span>
            <button
              onClick={() => handleCopy(generateSystemPromptTemplate(), "sys-prompt")}
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              {copiedKey === "sys-prompt" ? (
                <>
                  <Check className="h-3 w-3 text-green-600" /> ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar Prompt
                </>
              )}
            </button>
          </div>

          <pre className="rounded-xl bg-zinc-950 p-3.5 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-72 border border-zinc-800 leading-relaxed">
            {generateSystemPromptTemplate()}
          </pre>
        </div>
      )}

      {/* TAB 3: CHARACTER LOCK TAGS */}
      {activeTab === "tags" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-black" /> Master Character Lock Tags (OpenArt / Flux / SDXL):
            </span>
            <button
              onClick={() => handleCopy(influencer.characterTags, "char-tags-live")}
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              {copiedKey === "char-tags-live" ? (
                <>
                  <Check className="h-3 w-3 text-green-600" /> ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar Tags
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl bg-zinc-900 p-3 font-mono text-xs text-amber-300 border border-zinc-800">
            {influencer.characterTags || "(character_tag:1.35), photorealistic, raw photo"}
          </div>

          <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600 border border-zinc-200 space-y-1">
            <span className="font-bold text-black block">Geometría Facial Registrada:</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {influencer.facialCharacteristics || "Sin especificaciones faciales."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
