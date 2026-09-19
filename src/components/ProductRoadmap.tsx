import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Bot,
  RefreshCw,
  Code2,
  Layers,
  ChevronRight,
  Filter,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Flame,
  Globe,
  Database,
  Search,
  Check,
  AlertCircle
} from "lucide-react";

export interface RoadmapMilestone {
  id: string;
  title: string;
  version: "v1.5" | "v2.0" | "v2.5" | "v3.0";
  status: "completed" | "in_progress" | "planned";
  category: "core" | "ai_models" | "sui_paybot" | "ecosystem";
  quarter: string;
  impact: "Critico" | "Alto" | "Medio";
  description: string;
  deliverables: string[];
  techStack: string[];
  targetSectionId?: string;
  progress: number; // 0 to 100
}

const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  // Completed - v1.5
  {
    id: "m-1",
    title: "Creación de Modelo IA desde Foto Rostro Maestro",
    version: "v1.5",
    status: "completed",
    category: "ai_models",
    quarter: "Q3 2026",
    impact: "Critico",
    description: "Extracción de vectores faciales, generación automática de biografía, personalidad, prompts de difusión y voz por defecto.",
    deliverables: [
      "Extractor de características faciales 2D/3D con InsightFace",
      "Auto-generación de biografía y perfil con Gemini AI",
      "Respaldo y restauración en lote vía JSON / ZIP",
      "Sustitución de avatar maestro en tiempo real"
    ],
    techStack: ["InsightFace", "Gemini AI", "TypeScript", "JSZip"],
    targetSectionId: "step-1-face",
    progress: 100
  },
  {
    id: "m-2",
    title: "Motor de Voz Natural 100% Gratuito (Zero-Cost TTS)",
    version: "v1.5",
    status: "completed",
    category: "core",
    quarter: "Q3 2026",
    impact: "Alto",
    description: "Síntesis vocal sin costo de API keys. Soporte para múltiples acentos latinos, modulación de tono/velocidad y descargas MP3/WAV.",
    deliverables: [
      "Generación de voz nativa del navegador y Google Cloud Speech API free tier",
      "Ajuste de tonalidades: Seductora, Profesional, Divertida y Formal",
      "Biblioteca de guiones para saludos VIP y promociones",
      "Reproducción de onda de audio interactiva"
    ],
    techStack: ["Web Speech API", "Web Audio", "Gemini Prompts"],
    targetSectionId: "step-2-voice",
    progress: 100
  },
  {
    id: "m-3",
    title: "Estudio Face Swap 4K en Fotos & Videos 9:16",
    version: "v1.5",
    status: "completed",
    category: "ai_models",
    quarter: "Q3 2026",
    impact: "Critico",
    description: "Intercambio facial sobre fotos y videos en formato vertical. Restauración CodeFormer y alineador de tono de piel.",
    deliverables: [
      "Inferencia de rostros sobre canvas HTML5 y buffers de video",
      "Control deslizante del peso de restauración CodeFormer (0.50 - 1.00)",
      "Auto-generación de descripciones y hashtags para TikTok/Reels/X",
      "Galería interactiva Masonry con botón de copia de rutas y descargas"
    ],
    techStack: ["InsightFace", "CodeFormer", "HTML5 Canvas", "Recharts"],
    targetSectionId: "step-3-faceswap",
    progress: 100
  },
  {
    id: "m-4",
    title: "Simulador Interactivo de Bot de Telegram VIP",
    version: "v1.5",
    status: "completed",
    category: "sui_paybot",
    quarter: "Q3 2026",
    impact: "Alto",
    description: "Ambiente de prueba en vivo para verificar el flujo de comandos (/start, /pay), teclados inline y recepción de notas de voz.",
    deliverables: [
      "Simulador de interfaz gráfica de Telegram en tiempo real",
      "Generación de enlaces de invitación temporales de uso único",
      "Envío de audios de la modelo dentro de la ventana de chat",
      "Verificación simulada de transacciones SUI Mainnet/Testnet"
    ],
    techStack: ["Telegram Bot API", "Sui Web3 SDK", "React State"],
    targetSectionId: "step-4-telegram",
    progress: 100
  },
  {
    id: "m-5",
    title: "Gestión de Suscriptores & Pagos Web3 en Sui Network",
    version: "v1.5",
    status: "completed",
    category: "sui_paybot",
    quarter: "Q3 2026",
    impact: "Critico",
    description: "Control de suscriptores VIP, auditoría de pagos en SUI, gráfico de LTV por usuario y servicio de Auto-Kick para vencidos.",
    deliverables: [
      "Integración de billeteras Sui (Mysten RPC)",
      "Gráfico de LTV por usuario categorizado por origen de tráfico",
      "Conversor dinámico SUI/USD y Moneda Local (ARS)",
      "Asistente de delegación en Liquid Staking Sui (Volo / Haedal)"
    ],
    techStack: ["@mysten/sui", "Recharts", "CoinGecko API"],
    targetSectionId: "step-5-subscribers",
    progress: 100
  },

  // In Progress - v2.0
  {
    id: "m-6",
    title: "Publicador Automático Multi-Canal (Auto-Poster Agent)",
    version: "v2.0",
    status: "in_progress",
    category: "core",
    quarter: "Q4 2026",
    impact: "Alto",
    description: "Programador e integrador de contenido automatizado para canales de Telegram, Twitter/X y plataformas de suscripción.",
    deliverables: [
      "Integración directa con Telegram Channel API para envíos programados",
      "Publicación automática de teasers en Twitter/X con marca de agua",
      "Cola de trabajos asíncrona respaldada en SQLite/Redis",
      "Panel de métricas de rendimiento por publicación"
    ],
    techStack: ["Node.js Cron", "Twitter API v2", "Telegram Bot API"],
    progress: 65
  },
  {
    id: "m-7",
    title: "Optimización GPU Cloud & Fallbacks Cascaca (Fal.ai / Replicate)",
    version: "v2.0",
    status: "in_progress",
    category: "ai_models",
    quarter: "Q4 2026",
    impact: "Critico",
    description: "Cascada de aceleración en la nube para procesar Face Swaps en videos 4K de alta duración en menos de 5 segundos.",
    deliverables: [
      "Cliente API Fal.ai para renderizado FLUX.1 + InsightFace",
      "Sistema de conmutación por error (Fallback) a Replicate / Server local",
      "Cacheado inteligente de embeddings faciales por modelo",
      "Loteado masivo (Batching) de fotogramas de video"
    ],
    techStack: ["Fal.ai API", "Replicate API", "WebSockets"],
    progress: 40
  },
  {
    id: "m-8",
    title: "Sincronización Labial 3D en Video (Wav2Lip / SadTalker)",
    version: "v2.0",
    status: "in_progress",
    category: "ai_models",
    quarter: "Q4 2026",
    impact: "Alto",
    description: "Alineación de labios y gesticulación facial automática según la pista de audio clonada o voz natural sintetizada.",
    deliverables: [
      "Integración de Wav2Lip para animación de boca en videos existentes",
      "Generación de expresiones faciales naturales basadas en la emoción del audio",
      "Sincronización de audio y video en contenedor MP4 H.264"
    ],
    techStack: ["Wav2Lip", "FFmpeg", "Canvas AudioContext"],
    progress: 30
  },

  // Planned - v2.5 & v3.0
  {
    id: "m-9",
    title: "Chatters IA Autónomos con Memoria Long-Term (RAG Vectorial)",
    version: "v2.5",
    status: "planned",
    category: "sui_paybot",
    quarter: "Q1 2027",
    impact: "Critico",
    description: "Agente conversacional en Telegram capaz de recordar detalles personales de cada suscriptor y responder autónomamente.",
    deliverables: [
      "Base de datos vectorial en Firestore / Pinecone para historial de chat",
      "Motor RAG con Gemini 3.0 Flash para respuestas ultra-rápidas",
      "Detección de intenciones de venta y ofertas de upsell personalizadas",
      "Modo supervisión humana con intervención en tiempo real"
    ],
    techStack: ["Gemini 3.0 Flash", "Firestore Vector Search", "LangChain"],
    progress: 0
  },
  {
    id: "m-10",
    title: "Smart Contracts de Suscripción Recurrente en Sui Move",
    version: "v2.5",
    status: "planned",
    category: "sui_paybot",
    quarter: "Q1 2027",
    impact: "Critico",
    description: "Implementación de Smart Contracts nativos en el lenguaje Move para cobros recurrentes automáticos y distribución de regalías.",
    deliverables: [
      "Módulo Sui Move `subscription_vault.move` para cobros periódicos",
      "Descuento automático mensual mediante allowance autorizado",
      "Enrutado de comisión de agencia a billeteras múltiples en 1 transacción",
      "Auditoría de seguridad y contrato verificado en Sui Explorer"
    ],
    techStack: ["Sui Move", "Mysten Sui CLI", "Kiosk Protocol"],
    progress: 0
  },
  {
    id: "m-11",
    title: "Marketplace de Modelos IA Tokenizadas & Assets NFT",
    version: "v3.0",
    status: "planned",
    category: "ecosystem",
    quarter: "Q2 2027",
    impact: "Medio",
    description: "Ecosistema descentralizado donde agencias pueden comercializar o licenciar modelos de IA y paquetes de contenido VIP.",
    deliverables: [
      "Tokenización de identidad visual de modelos en formato NFT Sui Kiosk",
      "Sistema de licencias de uso temporal para agencias asociadas",
      "Pagos de regalías automáticos a creadores originales en tokens SUI"
    ],
    techStack: ["Sui Kiosk", "GraphQL", "Web3 Storage"],
    progress: 0
  }
];

interface ProductRoadmapProps {
  onNavigateToSection?: (sectionId: string) => void;
}

export const ProductRoadmap: React.FC<ProductRoadmapProps> = ({ onNavigateToSection }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>("m-3");

  const completedCount = ROADMAP_MILESTONES.filter((m) => m.status === "completed").length;
  const inProgressCount = ROADMAP_MILESTONES.filter((m) => m.status === "in_progress").length;
  const plannedCount = ROADMAP_MILESTONES.filter((m) => m.status === "planned").length;
  const totalCount = ROADMAP_MILESTONES.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  const filteredMilestones = ROADMAP_MILESTONES.filter((m) => {
    if (selectedStatus !== "all" && m.status !== selectedStatus) return false;
    if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.deliverables.some((d) => d.toLowerCase().includes(q)) ||
        m.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: RoadmapMilestone["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Completado
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 animate-pulse">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            En Desarrollo
          </span>
        );
      case "planned":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
            <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
            Planificado
          </span>
        );
    }
  };

  const getCategoryLabel = (category: RoadmapMilestone["category"]) => {
    switch (category) {
      case "core":
        return "Infraestructura Base";
      case "ai_models":
        return "Modelos IA & Face Swap";
      case "sui_paybot":
        return "PayBot SUI & Web3";
      case "ecosystem":
        return "Ecosistema & NFT";
    }
  };

  const getImpactBadge = (impact: RoadmapMilestone["impact"]) => {
    switch (impact) {
      case "Critico":
        return <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">Impacto Crítico</span>;
      case "Alto":
        return <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">Impacto Alto</span>;
      case "Medio":
        return <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">Impacto Medio</span>;
    }
  };

  return (
    <div id="product-roadmap" className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-purple-600 text-white px-3 py-1 text-[11px] font-black tracking-widest uppercase">
              ROADMAP DE PRODUCTO
            </span>
            <span className="rounded-full bg-zinc-100 text-zinc-700 px-3 py-1 text-[11px] font-bold">
              Versión Actual v1.5
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Línea de Tiempo Interactiva & Hitos de Desarrollo
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-2xl">
            Visualiza las capacidades implementadas y la hoja de ruta estratégica para la escalabilidad del PayBot SUI y la optimización de contenido IA.
          </p>
        </div>

        {/* Global Progress Widget */}
        <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 shrink-0">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white font-black text-sm shadow-sm">
            {completionRate}%
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Progreso Global del Roadmap</div>
            <div className="text-sm font-black text-zinc-900 mt-0.5">
              {completedCount} de {totalCount} Hitos Completados
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
              <span className="text-emerald-700 font-bold">{completedCount} listos</span> •{" "}
              <span className="text-amber-700 font-bold">{inProgressCount} en curso</span> •{" "}
              <span className="text-zinc-600">{plannedCount} futuros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 mr-1">
            <Filter className="h-4 w-4 text-purple-600" />
            <span>Filtros:</span>
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-2xs">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                selectedStatus === "all" ? "bg-black text-white" : "text-zinc-600 hover:text-black"
              }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                selectedStatus === "completed" ? "bg-emerald-600 text-white" : "text-zinc-600 hover:text-emerald-700"
              }`}
            >
              Completados ({completedCount})
            </button>
            <button
              onClick={() => setSelectedStatus("in_progress")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                selectedStatus === "in_progress" ? "bg-amber-600 text-white" : "text-zinc-600 hover:text-amber-700"
              }`}
            >
              En Desarrollo ({inProgressCount})
            </button>
            <button
              onClick={() => setSelectedStatus("planned")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                selectedStatus === "planned" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-black"
              }`}
            >
              Planificados ({plannedCount})
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-2xs"
          >
            <option value="all">Todas las Categorías</option>
            <option value="core">Infraestructura Base</option>
            <option value="ai_models">Modelos IA & Face Swap</option>
            <option value="sui_paybot">PayBot SUI & Web3</option>
            <option value="ecosystem">Ecosistema & NFT</option>
          </select>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar hito o tecnología..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Interactive Timeline Grid */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-6 before:md:left-8 before:w-0.5 before:bg-zinc-200">
        {filteredMilestones.length === 0 ? (
          <div className="py-12 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-500 text-sm">
            No se encontraron hitos de desarrollo que coincidan con la búsqueda.
          </div>
        ) : (
          filteredMilestones.map((item) => {
            const isExpanded = expandedMilestoneId === item.id;
            return (
              <div
                key={item.id}
                className="relative pl-12 md:pl-16 group transition duration-200"
              >
                {/* Timeline Node Dot */}
                <div
                  className={`absolute left-3.5 md:left-5 top-4 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-125 ${
                    item.status === "completed"
                      ? "bg-emerald-500 ring-2 ring-emerald-200"
                      : item.status === "in_progress"
                      ? "bg-amber-500 ring-2 ring-amber-200 animate-pulse"
                      : "bg-zinc-300 ring-2 ring-zinc-100"
                  }`}
                />

                {/* Milestone Card */}
                <div
                  className={`rounded-2xl border transition-all duration-200 ${
                    isExpanded
                      ? "border-purple-300 bg-purple-50/20 shadow-md ring-1 ring-purple-200"
                      : "border-zinc-200 bg-white hover:border-zinc-300 shadow-2xs"
                  }`}
                >
                  {/* Card Main Bar */}
                  <div
                    onClick={() => setExpandedMilestoneId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(item.status)}
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-black font-mono text-zinc-700">
                          {item.version}
                        </span>
                        <span className="text-xs font-bold text-zinc-500">
                          {item.quarter}
                        </span>
                        <span className="text-xs font-semibold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
                          {getCategoryLabel(item.category)}
                        </span>
                        {getImpactBadge(item.impact)}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Right side metrics and expand toggle */}
                    <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 border-zinc-100 pt-3 md:pt-0">
                      {/* Progress Bar indicator */}
                      <div className="w-28 space-y-1 text-right hidden sm:block">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Avance</span>
                          <span className="font-mono text-purple-700">{item.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.status === "completed"
                                ? "bg-emerald-500"
                                : item.status === "in_progress"
                                ? "bg-amber-500"
                                : "bg-zinc-300"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>

                      {item.targetSectionId && item.status === "completed" && onNavigateToSection && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToSection(item.targetSectionId!);
                          }}
                          className="rounded-xl bg-purple-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-purple-700 transition flex items-center gap-1 shadow-2xs"
                        >
                          <span>Probar en App</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 group-hover:bg-purple-100 group-hover:text-purple-800 transition">
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="border-t border-zinc-200/80 bg-white p-5 rounded-b-2xl space-y-4">
                      {/* Deliverables checklist */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-600" />
                          Entregables & Especificaciones Técnicas:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {item.deliverables.map((deliv, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                                item.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700"
                              }`}>
                                {idx + 1}
                              </span>
                              <span>{deliv}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-500">Stack Tecnológico:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.techStack.map((tech, idx) => (
                              <span key={idx} className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {item.targetSectionId && onNavigateToSection && (
                          <button
                            onClick={() => onNavigateToSection(item.targetSectionId!)}
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                          >
                            <span>Ir al Paso correspondiente en la App</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-zinc-900 to-black p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <Flame className="h-4 w-4 text-purple-400" />
            <span>Escalabilidad SUI PayBot & Optimización de Modelos IA</span>
          </div>
          <p className="text-sm font-medium text-zinc-300 max-w-xl">
            ¿Requieres integración de nodos RPC personalizados en Sui o endpoints dedicados en Fal.ai? Revisa la documentación técnica detallada de la suite.
          </p>
        </div>

        <button
          onClick={() => {
            const docEl = document.getElementById("technical-documentation");
            if (docEl) docEl.scrollIntoView({ behavior: "smooth" });
          }}
          className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white transition shrink-0 shadow-md flex items-center gap-2"
        >
          <Code2 className="h-4 w-4" />
          <span>Ver Doc Técnica de 6 Pasos</span>
        </button>
      </div>
    </div>
  );
};
