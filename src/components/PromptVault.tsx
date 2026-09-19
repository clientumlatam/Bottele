import React, { useState } from "react";
import { MASTER_PROMPT_PRESETS } from "../data/influencerPresets";
import { Copy, Check, Filter, Camera, Film, Layers, Sparkles, ExternalLink, Zap } from "lucide-react";

interface PromptVaultProps {
  characterTagOverride?: string;
}

export const PromptVault: React.FC<PromptVaultProps> = ({ characterTagOverride }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Todos los Prompts" },
    { id: "lingerie", label: "🔞 Lencería & VIP Erótico" },
    { id: "swimwear", label: "Bikinis y Playa" },
    { id: "lifestyle", label: "Penthouse y Casual" },
    { id: "fitness", label: "Gimnasio y Deportivo" },
    { id: "nightlife", label: "Fiesta y Noche" },
  ];

  const filtered = selectedCategory === "all"
    ? MASTER_PROMPT_PRESETS
    : MASTER_PROMPT_PRESETS.filter((p) => p.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    // Replace (character_tag:1.35) with actual character tag if provided
    const finalPrompt = characterTagOverride
      ? text.replace(/\(character_tag:1\.35\)/g, characterTagOverride)
      : text;

    navigator.clipboard.writeText(finalPrompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Bóveda de Prompts 9:16
            </span>
            <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
              100% Free Ready ($0)
            </span>
            <h2 className="text-lg font-bold text-black tracking-tight">
              Librería de Prompts Verticales 9:16 y Movimiento Kling
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Prompts probados y optimizados para <strong>HuggingFace Flux.1 Schnell, Fooocus (Free FaceID)</strong> y animaciones de video en <strong>Kling AI (Free Tier)</strong>.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-zinc-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-black text-white shadow-sm"
                  : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-800 border border-zinc-200">
                  {item.category.toUpperCase()} • 9:16 VERTICAL
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">{item.cameraLens}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-black">
                {item.title}
              </h3>
            </div>

            {/* Positive Prompt Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700 flex items-center gap-1">
                  <Camera className="h-3.5 w-3.5 text-black" /> Positive Prompt:
                </span>
                <button
                  onClick={() => handleCopy(item.positivePrompt, `${item.id}-pos`)}
                  className="font-medium text-black hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedId === `${item.id}-pos` ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copiar Prompt
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                {characterTagOverride
                  ? item.positivePrompt.replace(/\(character_tag:1\.35\)/g, characterTagOverride)
                  : item.positivePrompt}
              </p>
            </div>

            {/* Kling 3.0 Motion Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700 flex items-center gap-1">
                  <Film className="h-3.5 w-3.5 text-black" /> Kling Motion (Free):
                </span>
                <button
                  onClick={() => handleCopy(item.klingMotion, `${item.id}-kling`)}
                  className="font-medium text-black hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedId === `${item.id}-kling` ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copiar Movimiento
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-zinc-700 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                {item.klingMotion}
              </p>
            </div>

            {/* Captions Preview */}
            <div className="rounded-lg bg-zinc-50 p-2.5 text-xs space-y-1.5 border border-zinc-200">
              <div>
                <span className="font-semibold text-black">📸 Instagram Hook: </span>
                <span className="text-zinc-600 italic">{item.captionInstagram}</span>
              </div>
              <div>
                <span className="font-semibold text-black">💬 VIP Telegram Tease: </span>
                <span className="text-zinc-600 italic">{item.captionTelegram}</span>
              </div>
            </div>

            {/* Direct Free AI Launchers */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-[11px]">
              <span className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Lanzar en IA Free:</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 font-bold text-zinc-700 hover:bg-black hover:text-white transition-all"
                  title="Abrir Flux Schnell en Hugging Face (100% Gratis)"
                >
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>Flux (Free)</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>

                <a
                  href="https://klingai.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 font-bold text-zinc-700 hover:bg-black hover:text-white transition-all"
                  title="Abrir Kling AI (66 créditos diarios gratis)"
                >
                  <Film className="h-3 w-3 text-purple-500" />
                  <span>Kling Free</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
