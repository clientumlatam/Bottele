import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  FileJson, 
  Download, 
  Check, 
  Radio, 
  Coins, 
  ChevronRight,
  User,
  Sliders,
  Sun,
  Moon
} from "lucide-react";
import { AiInfluencer, PaybotConfig } from "../types";

interface HeaderBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentInfluencer?: AiInfluencer;
  paybotConfig?: PaybotConfig;
  onExportConfig?: () => void;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  "free-ai-stack": {
    title: "Directorio de IAs 100% Gratuitas ($0 USD)",
    subtitle: "Rostros StyleGAN, Fotos Flux en HuggingFace, Kling Free Tier y Edge-TTS",
  },
  "influencer-studio": {
    title: "Influencers IA & Bloqueo Facial",
    subtitle: "Diseño de identidad consistente, bio, personalidad y prompts maestros",
  },
  "face-swap-studio": {
    title: "Fotos, Videos & Face Swap",
    subtitle: "Generación de contenido 9:16 y reemplazo facial ultra-realista",
  },
  "video-motion-studio": {
    title: "Estudio de Video y Animación Kling 3.0",
    subtitle: "Conversión Image-to-Video en 4K 60fps con micro-expresiones",
  },
  "prompt-vault": {
    title: "Bóveda de Prompts 9:16",
    subtitle: "Catálogo curado para Instagram Reels, TikTok y sets VIP de Telegram",
  },
  "telegram-guide": {
    title: "Guía de Setup de Bot Telegram",
    subtitle: "Paso a paso con BotFather, canales privados e integración Sui",
  },
  "subscriber-management": {
    title: "Gestión de Suscriptores & Motor Kick-Bot",
    subtitle: "Auditoría en tiempo real de membresías de 30 días y simulación Dry Run sin llamadas API a Telegram",
  },
  "telegram-simulator": {
    title: "Simulador de Bot Telegram en Vivo",
    subtitle: "Test interactivo de mensajes, notas de voz, fotos y flujo de cobro",
  },
  "sui-paybot-repo": {
    title: "Código Repo Bot Sui Move & Node.js",
    subtitle: "Repositorio TypeScript listo para desplegar en Railway, VPS o Render",
  },
  "funnel-blueprint": {
    title: "Embudo de Conversión & Proyección MRR",
    subtitle: "Cálculo de ingresos mensuales, retención e impacto de comisiones Web3",
  },
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  currentInfluencer,
  paybotConfig,
  onExportConfig,
  onOpenMobileSidebar,
  isDarkMode: propIsDarkMode,
  toggleDarkMode: propToggleDarkMode,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [localIsDarkMode, setLocalIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dark_mode") === "true";
      if (saved) {
        document.documentElement.classList.add("dark");
      }
      return saved;
    }
    return false;
  });

  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : localIsDarkMode;

  const toggleDarkMode = () => {
    if (propToggleDarkMode) {
      propToggleDarkMode();
    } else {
      const next = !localIsDarkMode;
      setLocalIsDarkMode(next);
      localStorage.setItem("dark_mode", String(next));
      document.documentElement.classList.toggle("dark", next);
    }
  };

  const currentInfo = TAB_TITLES[activeTab] || {
    title: "Panel de Control",
    subtitle: "Estudio de Influencers IA y Micropagos Sui",
  };

  const handleExportClick = () => {
    if (onExportConfig) {
      onExportConfig();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6">
      {/* Left: Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-black lg:hidden"
          title="Abrir Menú Lateral"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-zinc-950 tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700 border border-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sui Live
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 hidden md:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Model Indicator & Export */}
      <div className="flex items-center gap-3">
        {/* Quick Active Model Pill */}
        {currentInfluencer && (
          <button
            onClick={() => { const el = document.getElementById("influencer-studio"); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 hover:bg-zinc-100 transition-all text-left"
            title="Ir al estudio del modelo actual"
          >
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-zinc-300">
              <img
                src={currentInfluencer.avatarUrl}
                alt={currentInfluencer.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-[11px]">
              <span className="font-bold text-zinc-900 block leading-tight">{currentInfluencer.name}</span>
              <span className="text-[9px] text-zinc-400 block leading-none">{currentInfluencer.niche}</span>
            </div>
          </button>
        )}

        {/* Sui Network Status Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-1 text-xs">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <span className="text-[9px] text-zinc-400 block uppercase tracking-wider font-bold">
              SUI Mainnet
            </span>
            <span className="font-mono font-bold text-[10px] text-zinc-800">
              {paybotConfig?.tokenType || "SUI"} • {paybotConfig?.subscriberPrice || 15}/mes
            </span>
          </div>
        </div>

        {/* Theme Toggle Switch (Dark / Light High-Contrast) */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-zinc-100 transition-all shadow-2xs"
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro / alto contraste nocturno"}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-indigo-500" />
              <span className="hidden sm:inline">Modo Nocturno</span>
            </>
          )}
        </button>

        {/* Export JSON Button */}
        {onExportConfig && (
          <button
            id="btn-header-export-json"
            onClick={handleExportClick}
            className="flex items-center gap-1.5 rounded-xl border border-black bg-black px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all"
            title="Exportar Configuración Completa del Bot e Influencer (JSON)"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">¡Exportado!</span>
              </>
            ) : (
              <>
                <FileJson className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Exportar JSON</span>
                <Download className="h-3 w-3 opacity-70" />
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
