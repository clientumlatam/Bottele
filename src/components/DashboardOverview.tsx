import React from 'react';
import { AiInfluencer, PaybotConfig } from '../types';
import { 
  Users, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Wallet, 
  Bot, 
  Database, 
  Wand2, 
  RefreshCw, 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Play, 
  Globe, 
  Cpu, 
  Layers,
  ChevronRight,
  Radio
} from 'lucide-react';

interface DashboardOverviewProps {
  currentInfluencer: AiInfluencer;
  paybotConfig: PaybotConfig;
  onNavigate: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentInfluencer,
  paybotConfig,
  onNavigate
}) => {
  const activeSubscribers = 127;
  const expiringSoonCount = 3;
  const price = paybotConfig.subscriberPrice || 15;
  const monthlyRevenue = activeSubscribers * price;

  const pipelineSteps = [
    { id: "wizard", step: "★", title: "Clonador Mágico", icon: Sparkles, badge: "Batch IA" },
    { id: "model-workflow-db", step: "1", title: "Base de Datos", icon: Database, badge: "Modelos" },
    { id: "influencer-studio", step: "2", title: "Identidad & Voz", icon: Wand2, badge: "Estudio" },
    { id: "face-swap-studio", step: "3", title: "Face Swap 4K", icon: RefreshCw, badge: "9:16 Media" },
    { id: "telegram-simulator", step: "4", title: "Simulador Telegram", icon: Bot, badge: "VIP Chat" },
    { id: "subscriber-management", step: "5", title: "Pagos & Kick-Bot", icon: Users, badge: "SUI/USDC" },
    { id: "sui-paybot-repo", step: "6", title: "Backend Node", icon: Code2, badge: "Deploy" },
    { id: "secure-settings", step: "7", title: "Claves API", icon: ShieldCheck, badge: "Seguridad" },
  ];

  return (
    <div className="space-y-6">
      {/* SUI Subscription Expiration Notification Service Alert */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50/50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm animate-pulse">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Servicio de Alerta Web3 SUI
              </h3>
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                {expiringSoonCount} suscripciones por expirar
              </span>
            </div>
            <p className="text-xs text-amber-900/80 mt-0.5">
              Hay {expiringSoonCount} membresías SUI que vencen en menos de 24 horas. El cron de auto-expulsión de Telegram enviará recordatorios de renovación.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('subscriber-management')}
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white px-4 py-2 text-xs font-bold shadow-sm transition"
        >
          <span>Gestionar Suscriptores</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Top Banner Status Bar */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SUI MAINNET ONLINE
              </span>
              <span className="rounded-md bg-black px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                Panel de Mando Principal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              Plataforma TeleSui • Monetización & Influencers IA
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Gestión centralizada de avatar virtual, generación de contenido 4K, bot de cobros en Telegram y auditoría Web3.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('wizard')}
              className="flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Clonador Mágico</span>
            </button>
            <button
              onClick={() => onNavigate('telegram-simulator')}
              className="flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-all shadow-sm"
            >
              <Bot className="h-4 w-4" />
              <span>Probar Bot Telegram</span>
            </button>
          </div>
        </div>

        {/* System Health Indicators Bar */}
        <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 text-zinc-600 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-100">
            <Globe className="h-4 w-4 text-cyan-600 shrink-0" />
            <div className="truncate">
              <span className="block text-[10px] font-bold text-zinc-400 uppercase">Nodo RPC SUI</span>
              <span className="font-bold text-zinc-800 text-[11px] truncate">sui.mainnet.io</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-600 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-100">
            <Radio className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="block text-[10px] font-bold text-zinc-400 uppercase">Webhook Telegram</span>
              <span className="font-bold text-emerald-700 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Activo (0ms)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-600 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-100">
            <Cpu className="h-4 w-4 text-purple-600 shrink-0" />
            <div className="truncate">
              <span className="block text-[10px] font-bold text-zinc-400 uppercase">Motor de IA</span>
              <span className="font-bold text-zinc-800 text-[11px]">Gemini / Fal.ai 4K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-600 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-100">
            <Database className="h-4 w-4 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="block text-[10px] font-bold text-zinc-400 uppercase">Base de Datos</span>
              <span className="font-bold text-zinc-800 text-[11px]">Persistencia E2E</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Model Card */}
        <button 
          onClick={() => onNavigate('influencer-studio')}
          className="relative overflow-hidden flex flex-col text-left p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-zinc-200 shrink-0 relative bg-zinc-100">
              <img src={currentInfluencer.avatarUrl} alt={currentInfluencer.name} className="h-full w-full object-cover" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Modelo Seleccionada</p>
              <h3 className="font-extrabold text-zinc-900 text-sm leading-tight truncate">{currentInfluencer.name}</h3>
              <p className="text-[11px] text-purple-600 font-bold truncate">{currentInfluencer.handle}</p>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 line-clamp-1 italic mb-3 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
            "{currentInfluencer.vibe}"
          </p>
          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-100 w-full text-xs font-bold text-zinc-600 group-hover:text-black transition-colors">
            <span className="flex items-center gap-1.5"><Wand2 className="h-3.5 w-3.5 text-purple-600" /> Editar Estudio</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Subscribers Card */}
        <button 
          onClick={() => onNavigate('subscriber-management')}
          className="relative overflow-hidden flex flex-col text-left p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Suscriptores VIP</p>
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-xl">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl tracking-tight font-black text-black">{activeSubscribers}</h3>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-lg border border-emerald-100">
              <Activity className="h-3 w-3 mr-1"/> +18% este mes
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mb-3">Acceso verificado a canal VIP Telegram</p>
          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-100 w-full text-xs font-bold text-zinc-600 group-hover:text-black transition-colors">
            <span>Auditar Kick-Bot</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Revenue Card */}
        <button 
          onClick={() => onNavigate('subscriber-management')}
          className="relative overflow-hidden flex flex-col text-left p-5 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Proyección MRR</p>
            <div className="p-1.5 bg-zinc-800 text-emerald-400 rounded-xl">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl tracking-tight font-black text-white">{monthlyRevenue.toLocaleString()}</h3>
            <span className="text-xs font-extrabold text-emerald-400">{paybotConfig.tokenType} / mes</span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">Suscripción: {price} {paybotConfig.tokenType}/mes</p>
          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-800 w-full text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
            <span className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-emerald-400" /> Billetera SUI</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Automation Bot Card */}
        <button 
          onClick={() => onNavigate('telegram-simulator')}
          className="relative overflow-hidden flex flex-col text-left p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bot de Telegram</p>
            <div className="p-1.5 bg-cyan-100 text-cyan-700 rounded-xl">
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl tracking-tight font-black text-zinc-900">100%</h3>
            <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded-lg border border-cyan-100">
              Automatizado
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mb-3">Links con expiración de 5 minutos</p>
          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-100 w-full text-xs font-bold text-zinc-600 group-hover:text-black transition-colors">
            <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-cyan-600" /> Probar Simulador</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Interactive Workflow Pipeline Navigator */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
          <div>
            <h3 className="font-black text-base text-zinc-900 tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" />
              Flujo de Trabajo End-to-End (Pasos del 1 al 7)
            </h3>
            <p className="text-xs text-zinc-500">
              Haz clic en cualquier paso para desplazarte directamente a su módulo de configuración.
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 shrink-0 self-start sm:self-auto">
            7 Módulos Configurados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className="group flex flex-col justify-between p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-left h-28"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="rounded font-mono px-1.5 py-0.5 text-[9px] font-black bg-white group-hover:bg-zinc-800 text-black group-hover:text-white border border-zinc-200 group-hover:border-zinc-700">
                    Paso {step.step}
                  </span>
                  <Icon className="h-4 w-4 text-zinc-500 group-hover:text-purple-300 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight group-hover:text-white text-zinc-900 line-clamp-2">
                    {step.title}
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-300 mt-1 block">
                    {step.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Modules Section (Fases de Trabajo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phase 1: Content Creation & IA */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900">Estudio Creativo & Generación IA</h3>
                  <p className="text-[11px] text-zinc-500">Creación de modelo, clones de voz y medios 9:16</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
                Fase 1
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onNavigate('wizard')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Clonador Mágico Express</h4>
                    <p className="text-[10px] text-zinc-500">Crea perfil, voz y galería fotográfica en 1 clic</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('model-workflow-db')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-purple-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Base de Datos de Modelos</h4>
                    <p className="text-[10px] text-zinc-500">Catálogo guardado localmente con persistencia E2E</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('influencer-studio')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Wand2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Identidad, Voz & Calendario</h4>
                    <p className="text-[10px] text-zinc-500">Prompts, clonación ElevenLabs y drag & drop semanal</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('face-swap-studio')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Generador Face Swap 4K</h4>
                    <p className="text-[10px] text-zinc-500">Sustitución facial ultrarrealista en fotos y videos</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Phase 2: Web3 Monetization & Telegram Bot */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900">Monetización & Operación Telegram</h3>
                  <p className="text-[11px] text-zinc-500">Cobros en SUI/USDC, Kick-Bot y backend Node.js</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-lg">
                Fase 2
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onNavigate('telegram-simulator')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Bot className="h-4 w-4 text-cyan-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Simulador de Bot Telegram VIP</h4>
                    <p className="text-[10px] text-zinc-500">Prueba interactiva del flujo de pago y entregas de link</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('subscriber-management')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-purple-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Gestión & Auditoría de Suscriptores</h4>
                    <p className="text-[10px] text-zinc-500">Control de billeteras vincualdas y cron de expulsión</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('sui-paybot-repo')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Code2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Backend & Repositorio TypeScript</h4>
                    <p className="text-[10px] text-zinc-500">Servidor Node listo para desplegar en Cloud Run/Render</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('secure-settings')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Configuración & Llaves de API</h4>
                    <p className="text-[10px] text-zinc-500">Credenciales guardadas en el navegador de forma segura</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
