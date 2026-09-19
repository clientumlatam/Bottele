import React, { useState } from "react";
import {
  Sparkles, Bot, Code2, Layers, DollarSign, Image as ImageIcon,
  ShieldCheck, Zap, Film, RefreshCw, Download, FileJson, Check,
  ChevronLeft, ChevronRight, Menu, X, User, ExternalLink, Activity,
  Sliders, TrendingUp, CircleDollarSign, Radio, BookOpen, UserCheck,
  Database, Wand2, Users, Map
} from "lucide-react";

import { AiInfluencer, PaybotConfig } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentInfluencer?: AiInfluencer;
  paybotConfig?: PaybotConfig;
  onExportConfig?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentInfluencer,
  paybotConfig,
  onExportConfig,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportClick = () => {
    if (onExportConfig) {
      onExportConfig();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const menuSections = [
    {
      title: "Flujo Paso a Paso",
      items: [
        {
          id: "step-1-face",
          label: "1. Rostro & Creación IA",
          description: "Crea todo desde una cara",
          icon: Wand2,
          badge: "PASO 1",
          badgeColor: "bg-purple-100 text-purple-800",
        },
        {
          id: "step-2-voice",
          label: "2. Voz Natural Free",
          description: "100% libre sin API keys",
          icon: Radio,
          badge: "PASO 2",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "step-3-faceswap",
          label: "3. Face Swap Videos & Fotos",
          description: "Sube tus videos y fotos",
          icon: RefreshCw,
          badge: "PASO 3",
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          id: "step-4-telegram",
          label: "4. Simulador Telegram",
          description: "Bot VIP interactivo en vivo",
          icon: Bot,
          badge: "PASO 4",
          badgeColor: "bg-cyan-100 text-cyan-800",
        },
        {
          id: "step-5-subscribers",
          label: "5. Suscriptores & Pagos Sui",
          description: "Membresías y Auto-Kick",
          icon: Users,
          badge: "PASO 5",
          badgeColor: "bg-purple-100 text-purple-800",
        },
        {
          id: "step-6-deploy",
          label: "6. Código & Despliegue",
          description: "Paybot Node.js listo",
          icon: Code2,
          badge: "PASO 6",
          badgeColor: "bg-zinc-100 text-zinc-800",
        },
      ],
    },
    {
      title: "Herramientas & Catálogo",
      items: [
        {
          id: "model-workflow-db",
          label: "Base de Datos de Modelos",
          description: "Catálogo persistente E2E",
          icon: Database,
          badge: "CATÁLOGO",
          badgeColor: "bg-zinc-100 text-zinc-700",
        },
        {
          id: "secure-settings",
          label: "Configuración APIs",
          description: "Diagnóstico y llaves seguras",
          icon: ShieldCheck,
          badge: "AJUSTES",
          badgeColor: "bg-red-100 text-red-700",
        },
        {
          id: "technical-documentation",
          label: "Doc Técnica 6 Pasos",
          description: "Manual de usuario & APIs",
          icon: BookOpen,
          badge: "DOCS",
          badgeColor: "bg-blue-100 text-blue-800",
        },
        {
          id: "product-roadmap",
          label: "Roadmap de Producto",
          description: "Hitos e interactividad",
          icon: Map,
          badge: "ROADMAP",
          badgeColor: "bg-purple-100 text-purple-800",
        }
      ],
    },
  ];

  const handleItemClick = (tabId: string) => {
    const el = document.getElementById(tabId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out lg:static ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "w-72 lg:w-72"}`}
      >
        {/* Top Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white font-black text-xs shadow-sm">
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-black truncate">
                    TELESUI <span className="font-medium text-zinc-400">STUDIO</span>
                  </span>
                  <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SUI 2026
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 truncate">
                  AI Influencers & Sui Paywall
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close or Desktop Collapse Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-black lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-black transition-all"
              title={isCollapsed ? "Expandir Menú Lateral" : "Colapsar Menú Lateral"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Current Active Model Card (if not collapsed) */}
        {!isCollapsed && currentInfluencer && (
          <div className="p-3 mx-3 mt-3 rounded-xl border border-zinc-200 bg-zinc-50/80">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-200">
                <img
                  src={currentInfluencer.avatarUrl}
                  alt={currentInfluencer.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {currentInfluencer.name}
                  </h4>
                  <span className="text-[9px] bg-zinc-200 text-zinc-700 font-bold px-1.5 py-0.5 rounded">
                    {currentInfluencer.age}a
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate">
                  {currentInfluencer.niche}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleItemClick("influencer-studio")}
              className="w-full mt-2.5 py-1 px-2 rounded-lg bg-white border border-zinc-200 text-[10px] font-bold text-zinc-700 hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center gap-1"
            >
              <Sliders className="h-3 w-3" />
              <span>Ajustar Rostro & Voz</span>
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  {section.title}
                </div>
              ) : (
                <div className="h-px bg-zinc-200 my-2" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? "bg-black text-white shadow-sm font-bold"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-black font-medium"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-white" : "text-zinc-500"
                      }`}
                    />

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                isActive
                                  ? "bg-zinc-800 text-zinc-200"
                                  : item.badgeColor
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] truncate ${
                            isActive ? "text-zinc-400" : "text-zinc-400"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions / SUI Status / Export JSON */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-3 space-y-2">
          {!isCollapsed ? (
            <>
              {/* Sui Wallet & Node Status */}
              <div className="rounded-xl border border-zinc-200 bg-white p-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Radio className="h-3 w-3 text-emerald-500" />
                    SUI Mainnet Node
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {paybotConfig?.subscriberPrice || 15} {paybotConfig?.tokenType || "SUI"}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-zinc-700 truncate bg-zinc-50 p-1 rounded border border-zinc-100">
                  {paybotConfig?.adminSuiWallet || "0x7a8b...7a6b"}
                </div>
              </div>

              {/* Export Button */}
              {onExportConfig && (
                <button
                  id="btn-sidebar-export-json"
                  onClick={handleExportClick}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>¡JSON Exportado!</span>
                    </>
                  ) : (
                    <>
                      <FileJson className="h-3.5 w-3.5 text-amber-400" />
                      <span>Exportar Config Bot</span>
                      <Download className="h-3 w-3 opacity-70" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleExportClick}
                title="Exportar Config JSON"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white hover:bg-zinc-800 transition-all shadow-sm"
              >
                <Download className="h-4 w-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
