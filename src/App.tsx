import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { HeaderBar } from "./components/HeaderBar";
import { FaceToModelCreator } from "./components/FaceToModelCreator";
import { FreeNaturalVoiceStudio } from "./components/FreeNaturalVoiceStudio";
import { CustomMediaFaceSwapStudio } from "./components/CustomMediaFaceSwapStudio";
import { TelegramBotSimulator } from "./components/TelegramBotSimulator";
import { SubscriberManagement } from "./components/SubscriberManagement";
import { SuiPaybotRepo } from "./components/SuiPaybotRepo";
import { ModelWorkflowAndDatabase } from "./components/ModelWorkflowAndDatabase";
import { SecureSettings } from "./components/SecureSettings";
import { ConnectionStatusChecker } from "./components/ConnectionStatusChecker";
import { DashboardOverview } from "./components/DashboardOverview";
import { ProductRoadmap } from "./components/ProductRoadmap";
import { TechnicalDocumentation } from "./components/TechnicalDocumentation";
import { FloatingChatWidget } from "./components/FloatingChatWidget";
import { QuickStartGuideModal } from "./components/QuickStartGuideModal";
import { DEFAULT_INFLUENCERS } from "./data/influencerPresets";
import { AiInfluencer, PaybotConfig } from "./types";
import { 
  ArrowUp, 
  Database, 
  Wand2, 
  RefreshCw, 
  Bot, 
  Users, 
  Code2, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Layers,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { exportServerBootstrapJson } from "./utils/exportConfig";

const SectionHeader = ({ icon: Icon, title, subtitle, step, badge }: any) => (
  <div className="mb-8 flex flex-col items-start">
    <div className="flex items-center gap-2 mb-2">
      <span className="rounded-full bg-black px-3 py-1 text-[11px] font-black tracking-widest text-white uppercase shadow-xs">
        PASO {step}
      </span>
      {badge && (
        <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-black text-purple-800 uppercase tracking-wide">
          {badge}
        </span>
      )}
    </div>
    <div className="flex items-center gap-3.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-zinc-200 shadow-xs text-zinc-900">
        <Icon className="h-6 w-6 text-purple-600" />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("step-1-face");
  const [currentInfluencer, setCurrentInfluencer] = useState<AiInfluencer>(DEFAULT_INFLUENCERS[0]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dark_mode") === "true";
      if (saved) {
        document.documentElement.classList.add("dark");
      }
      return saved;
    }
    return false;
  });

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("dark_mode", String(next));
    document.documentElement.classList.toggle("dark", next);
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [paybotConfig, setPaybotConfig] = useState<PaybotConfig>({
    telegramBotToken: "6912345678:AAH_your_secret_botfather_token",
    suiRpcUrl: "https://fullnode.mainnet.sui.io:443",
    vipChannelId: "-1002345678901",
    adminSuiWallet: "0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b",
    subscriberPrice: 15,
    tokenType: "SUI",
    inviteLinkExpirationMinutes: 5,
    subscriptionDurationDays: 30,
    enableAutoKickCron: true,
  });

  const stepList = [
    { id: "step-1-face", step: "1", label: "Rostro & Creación", icon: Wand2 },
    { id: "step-2-voice", step: "2", label: "Voz Natural Free", icon: Radio },
    { id: "step-3-faceswap", step: "3", label: "Face Swap Videos/Fotos", icon: RefreshCw },
    { id: "step-4-telegram", step: "4", label: "Simulador Telegram", icon: Bot },
    { id: "step-5-subscribers", step: "5", label: "Suscriptores & Sui", icon: Users },
    { id: "step-6-deploy", step: "6", label: "Código & Deploy", icon: Code2 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "step-1-face",
        "step-2-voice",
        "step-3-faceswap",
        "step-4-telegram",
        "step-5-subscribers",
        "step-6-deploy",
        "model-workflow-db",
        "secure-settings",
        "technical-documentation",
        "product-roadmap"
      ];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveTab(sections[i]);
            return;
          }
        }
      }
    };

    setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStep = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExportConfig = () => {
    exportServerBootstrapJson(currentInfluencer, paybotConfig);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-zinc-900 antialiased font-sans">
      {/* Collapsible Left Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentInfluencer={currentInfluencer}
        paybotConfig={paybotConfig}
        onExportConfig={handleExportConfig}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main App Content Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <HeaderBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentInfluencer={currentInfluencer}
          paybotConfig={paybotConfig}
          onExportConfig={handleExportConfig}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Main Content Stage */}
        <main className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 space-y-16">
          
          {/* Overview Metric Cards */}
          <DashboardOverview 
            currentInfluencer={currentInfluencer} 
            paybotConfig={paybotConfig} 
            onNavigate={(id) => scrollToStep(id)} 
          />

          {/* Master Step-by-Step Pipeline Header Bar */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Flujo de Trabajo Paso a Paso (De Inicio a Fin)
              </span>
              <span className="text-[11px] font-bold text-zinc-500">
                Modelo Activa: <strong className="text-purple-700">{currentInfluencer.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {stepList.map((st) => {
                const Icon = st.icon;
                const isActive = activeTab === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => scrollToStep(st.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? "border-black bg-black text-white shadow-sm ring-2 ring-black/10"
                        : "border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:border-purple-300 hover:bg-purple-50/30"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      isActive ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-800"
                    }`}>
                      {st.step}
                    </span>
                    <span className="text-[11px] font-bold truncate leading-tight">
                      {st.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: FACE TO FULL MODEL CREATOR */}
          <section id="step-1-face" className="scroll-mt-24 pt-4">
            <SectionHeader 
              icon={Wand2} 
              title="1. Rostro Maestro & Creación de Modelo" 
              subtitle="Sube una foto de la cara y genera automáticamente identidad, biografía, prompts y voz."
              step="1" 
              badge="DESDE LA CARA CREAR TODO"
            />
            <FaceToModelCreator
              currentInfluencer={currentInfluencer}
              setCurrentInfluencer={setCurrentInfluencer}
              onNavigateNext={() => scrollToStep("step-2-voice")}
            />
          </section>

          {/* STEP 2: 100% FREE NATURAL VOICE STUDIO */}
          <section id="step-2-voice" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={Radio} 
              title="2. Estudio de Voz Natural Libre" 
              subtitle="Motor de voz 100% gratuito sin API keys de pago. Acentos latinos, modulación y descarga directa de audios."
              step="2" 
              badge="100% GRATIS • SIN LÍMITES"
            />
            <FreeNaturalVoiceStudio
              influencer={currentInfluencer}
              setCurrentInfluencer={setCurrentInfluencer}
              onNavigateToSimulator={() => scrollToStep("step-4-telegram")}
              onNavigateNext={() => scrollToStep("step-3-faceswap")}
            />
          </section>

          {/* STEP 3: CUSTOM MEDIA FACE SWAP STUDIO */}
          <section id="step-3-faceswap" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={RefreshCw} 
              title="3. Generador Face Swap de Fotos & Videos" 
              subtitle="Sube tus propios videos y fotos por cada modelo para transferir el rostro en 4K con InsightFace."
              step="3" 
              badge="SUBIDA PERSONALIZADA POR MODELO"
            />
            <CustomMediaFaceSwapStudio
              currentInfluencer={currentInfluencer}
              setCurrentInfluencer={setCurrentInfluencer}
              onNavigateToSimulator={() => scrollToStep("step-4-telegram")}
              onNavigateNext={() => scrollToStep("step-4-telegram")}
            />
          </section>

          {/* STEP 4: TELEGRAM VIP SIMULATOR */}
          <section id="step-4-telegram" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={Bot} 
              title="4. Simulador de Telegram VIP en Vivo" 
              subtitle="Prueba el chat interactivo, notas de voz generadas, plantillas de mensajes y flujo de pago SUI."
              step="4" 
              badge="SIMULADOR EN VIVO"
            />
            <TelegramBotSimulator
              influencer={currentInfluencer}
              paybotConfig={paybotConfig}
            />
          </section>
          
          {/* STEP 5: SUBSCRIBER MANAGEMENT & SUI PAYMENTS */}
          <section id="step-5-subscribers" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={Users} 
              title="5. Gestión de Suscriptores & Pagos SUI" 
              subtitle="Auditoría de membresías activas, billeteras vinculadas y control del cron de auto-expulsión (Kick-Bot)."
              step="5" 
              badge="WEB3 PAYMENTS & KICK-BOT"
            />
            <SubscriberManagement
              paybotConfig={paybotConfig}
              influencer={currentInfluencer}
            />
          </section>

          {/* STEP 6: BACKEND NODE.JS DEPLOYMENT */}
          <section id="step-6-deploy" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={Code2} 
              title="6. Backend & Despliegue del Paybot" 
              subtitle="Repositorio completo en TypeScript/Node.js listo para correr en VPS o contenedor Docker."
              step="6" 
              badge="LISTO PARA PRODUCCIÓN"
            />
            <SuiPaybotRepo
              paybotConfig={paybotConfig}
              setPaybotConfig={setPaybotConfig}
              currentInfluencer={currentInfluencer}
            />
          </section>

          {/* DATABASE & CATALOG */}
          <section id="model-workflow-db" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={Database} 
              title="Catálogo & Base de Datos de Modelos" 
              subtitle="Catálogo local y sincronización en la nube con guardado automático End-to-End."
              step="DB" 
              badge="PERSISTENCIA E2E"
            />
            <ModelWorkflowAndDatabase
              currentInfluencer={currentInfluencer}
              setCurrentInfluencer={setCurrentInfluencer}
              paybotConfig={paybotConfig}
              onNavigateTab={(tab) => scrollToStep(tab)}
            />
          </section>
          
          {/* SECURE SETTINGS & APIS */}
          <section id="secure-settings" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <SectionHeader 
              icon={ShieldCheck} 
              title="Configuración de APIs & Diagnóstico" 
              subtitle="Gestión segura de credenciales locales y prueba de conectividad de servicios."
              step="APIs" 
              badge="SEGURIDAD LOCAL"
            />
            <div className="space-y-12">
              <SecureSettings />
              <ConnectionStatusChecker />
            </div>
          </section>

          {/* TECHNICAL DOCUMENTATION SECTION */}
          <section id="technical-documentation" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200">
            <TechnicalDocumentation />
          </section>

          {/* INTERACTIVE PRODUCT ROADMAP SECTION */}
          <section id="product-roadmap" className="scroll-mt-24 pt-16 mt-8 border-t border-zinc-200 mb-20">
            <ProductRoadmap onNavigateToSection={(sectionId) => scrollToStep(sectionId)} />
          </section>
        </main>

        {/* Back to top button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-black/90 text-white shadow-xl hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 border border-zinc-700/50"
            title="Volver arriba"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Floating AI Influencer Chat Widget (Bottom Right) */}
        <FloatingChatWidget influencer={currentInfluencer} />

        {/* Quick Start Guide Modal on First Load */}
        <QuickStartGuideModal onStart={(tab) => scrollToStep(tab)} />

        {/* Footer */}
        <footer className="mt-auto border-t border-zinc-200 bg-white py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="font-black text-zinc-900">TELESUI AGENCY STUDIO</span>
              <span>•</span>
              <span>Pipeline de Creación de Modelos IA, Voz Natural Free, Face Swap 4K & Paybot SUI</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 font-medium">
              <span>Powered by @google/genai & @mysten/sui</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
