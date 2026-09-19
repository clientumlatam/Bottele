import React, { useState } from "react";
import { Sparkles, Bot, Code2, Layers, DollarSign, Image as ImageIcon, ShieldCheck, Zap, Film, RefreshCw, Download, FileJson, Check } from "lucide-react";


interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSimulator?: () => void;
  onExportConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onExportConfig }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportClick = () => {
    if (onExportConfig) {
      onExportConfig();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const tabs = [
    { id: "influencer-studio", label: "Influencers IA & Bloqueo Facial", icon: Sparkles, badge: "Estudio" },
    { id: "face-swap-studio", label: "Fotos, Videos & Face Swap", icon: RefreshCw, badge: "Face Swap" },
    { id: "video-motion-studio", label: "Estudio de Video y Animación", icon: Film, badge: "Kling 3.0" },
    { id: "prompt-vault", label: "Bóveda de Prompts 9:16", icon: ImageIcon, badge: "Bóveda" },
    { id: "telegram-guide", label: "Guía de Bot de Pago Sui", icon: ShieldCheck, badge: "Paso a Paso" },
    { id: "telegram-simulator", label: "Simulador de Bot", icon: Bot, badge: "En Vivo" },
    { id: "sui-paybot-repo", label: "Código Repo Bot Sui", icon: Code2, badge: "Código" },
    { id: "funnel-blueprint", label: "Embudo & Facturación MRR", icon: Layers },
  ];


  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold text-xs tracking-wider">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-black">
                AGENCIA <span className="font-light text-zinc-500">TELESUI</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 border border-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                SUI 2026
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Arquitectura de Influencers IA y Micropagos en Telegram con Sui
            </p>
          </div>
        </div>

        {/* Sui Network Status Badge & Export JSON Button */}
        <div className="flex items-center gap-2.5">
          {onExportConfig && (
            <button
              id="btn-navbar-export-json"
              onClick={handleExportClick}
              title="Exportar Configuración Completa del Bot e Influencer (JSON)"
              className="flex items-center gap-1.5 rounded-xl border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  <span className="hidden sm:inline">¡Config JSON Exportada!</span>
                </>
              ) : (
                <>
                  <FileJson className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="hidden sm:inline">Exportar Config JSON</span>
                  <Download className="h-3 w-3 opacity-70" />
                </>
              )}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1.5 text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">SUI Mainnet</span>
              <span className="font-mono font-bold text-[11px] text-zinc-800">0x4a2...9f1e</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 border-t border-[#F3F4F6] py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:bg-[#F9FAFB] hover:text-black"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-zinc-800 text-zinc-200"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
