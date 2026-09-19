import React, { useState, useEffect, useRef } from "react";
import {
  Database,
  Layers,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Edit3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  Camera,
  Bot,
  Zap,
  Tag,
  DollarSign,
  TrendingUp,
  FileJson,
  Sliders,
  CheckSquare,
  Square,
  HelpCircle,
  Flame,
  ChevronRight,
  BookOpen,
  Cloud,
  CloudCheck,
  CloudUpload,
  CloudDownload,
  CloudOff,
  HardDrive,
  Maximize2,
  FileImage,
  FolderDown,
  FileArchive,
  Type,
  ArrowDownToLine,
  Grip
} from "lucide-react";
import JSZip from "jszip";
import {
  AiInfluencer,
  ModelDatabaseRecord,
  WorkflowStage,
  PaybotConfig,
  FaceAssetRecord,
  CloudSyncSnapshot
} from "../types";
import { DEFAULT_INFLUENCERS } from "../data/influencerPresets";
import { VOICE_PERSONALITY_PRESETS } from "../data/voicePresets";

interface ModelWorkflowAndDatabaseProps {
  currentInfluencer: AiInfluencer;
  setCurrentInfluencer: (influencer: AiInfluencer) => void;
  paybotConfig: PaybotConfig;
  onNavigateTab: (tab: string) => void;
}

const LOCAL_STORAGE_KEYS = {
  SNAPSHOT: "TELESUI_CLOUD_SYNC_SNAPSHOT_V1",
  AUTO_SYNC: "TELESUI_AUTO_SYNC_ENABLED",
  FACE_ASSETS: "TELESUI_FACE_ASSETS_CACHE_V1",
  WORKFLOW: "TELESUI_WORKFLOW_PROGRESS_V1",
};

const DEFAULT_FACE_ASSETS: FaceAssetRecord[] = [
  {
    id: "face-asset-sweet-blondie-1",
    modelId: "sweet-blondie",
    modelName: "Sweet Blondie (Rubia Hot)",
    assetType: "synthetic_seed",
    name: "Master Synthetic Face Seed 1024px",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    resolution: "1024x1024",
    biometricPointsCount: 68,
    characterTagAnchor: "(sweet_blondie_hot_arg:1.35)",
    sourceEngine: "StyleGAN3",
    fileSizeKb: 420,
    createdAt: "2026-08-20T12:00:00.000Z",
    notes: "Rostro frontal neutro con iluminación difusa, optimizado para InsightFace swap."
  },
  {
    id: "face-asset-sweet-blondie-2",
    modelId: "sweet-blondie",
    modelName: "Sweet Blondie (Rubia Hot)",
    assetType: "avatar_master",
    name: "VIP Night Flash Candid 9:16",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    resolution: "1080x1920",
    biometricPointsCount: 68,
    characterTagAnchor: "(sweet_blondie_hot_arg:1.35)",
    sourceEngine: "Flux.1",
    fileSizeKb: 680,
    createdAt: "2026-08-22T14:30:00.000Z",
    notes: "Render vertical 9:16 para Reels e historias VIP de Telegram."
  },
  {
    id: "face-asset-valeria-1",
    modelId: "valeria-vance",
    modelName: "Valeria Vance",
    assetType: "synthetic_seed",
    name: "Valeria Vance - High Precision Seed",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    resolution: "1024x1024",
    biometricPointsCount: 68,
    characterTagAnchor: "(valeria_vance_v2:1.35)",
    sourceEngine: "ThisPersonDoesNotExist",
    fileSizeKb: 380,
    createdAt: "2026-08-22T10:30:00.000Z",
    notes: "Matriz facial simétrica con textura de piel con micro-poros reales."
  },
  {
    id: "face-asset-mia-1",
    modelId: "mia-khalil",
    modelName: "Mia Khalil",
    assetType: "synthetic_seed",
    name: "Mia Khalil - Fitness Studio Face Seed",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    resolution: "1024x1024",
    biometricPointsCount: 68,
    characterTagAnchor: "(mia_khalil_fit:1.35)",
    sourceEngine: "StyleGAN3",
    fileSizeKb: 395,
    createdAt: "2026-08-25T09:00:00.000Z",
    notes: "Rostro atlético iluminado con luz natural de estudio."
  }
];

const DEFAULT_WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "stage-1-face-seed",
    phaseNumber: 1,
    title: "Fase 1: Semilla Facial & Identidad Base",
    subtitle: "Rostro sintético 100% inexistente sin riesgos de derechos de autor",
    badge: "InsightFace & StyleGAN",
    description:
      "Definición biométrica y descarga de un rostro base de alta fidelidad desde thispersonnotexist.org o generación sintética 1024x1024.",
    iconName: "UserCheck",
    targetTab: "face-swap-studio",
    deliverables: [
      "Archivo de rostro frontal neutro (1024x1024 px)",
      "Matriz de 68 puntos biométricos alineada",
      "Definición de edad, etnicidad, color de ojos y rasgos óseos",
    ],
    checklist: [
      { id: "c1", text: "Elegir nicho de mercado (Glamour, Fitness, Boudoir o Lifestyle)", completed: true, required: true },
      { id: "c2", text: "Obtener foto frontal 1024px en thispersonnotexist.org o generador sintético", completed: true, required: true, quickActionLabel: "Ir a Source Face Upload", targetTab: "face-swap-studio" },
      { id: "c3", text: "Verificar simetría facial y nitidez de micro-poros de la piel", completed: true, required: true },
    ],
    proTips: [
      "Evita rostros con accesorios como anteojos gruesos o manos tapando la cara para no confundir al modelo de intercambio facial.",
      "Las fotos con luz natural o softbox producen los vectores más limpios para consistencia.",
    ],
  },
  {
    id: "stage-2-character-lock",
    phaseNumber: 2,
    title: "Fase 2: Character Lock & Síntesis 9:16",
    subtitle: "Generación de fotos y videos consistentes con peso de bloqueo",
    badge: "Flux.1 & Kling I2V",
    description:
      "Construcción del Master Prompt con peso de identidad `(nombre:1.35)` y renderizado de fotos 9:16 para Reels y canal VIP.",
    iconName: "Camera",
    targetTab: "influencer-studio",
    deliverables: [
      "Master Character Tag fijado en la base de datos",
      "10-20 fotos fotorrealistas verticales 9:16 (Locaciones: Yate, Balcón, Boudoir, Selfie nocturna)",
      "3-5 micro-videos animados con Kling AI / Luma Dream Machine",
    ],
    checklist: [
      { id: "c4", text: "Definir tag ancla (ej: (sweet_blondie_hot_arg:1.35))", completed: true, required: true, quickActionLabel: "Generar Fotos 9:16", targetTab: "influencer-studio" },
      { id: "c5", text: "Generar sesión de 10 imágenes en locaciones de alta conversión", completed: false, required: true, quickActionLabel: "Abrir Text-to-Image", targetTab: "influencer-studio" },
      { id: "c6", text: "Producir animaciones de video con movimiento de cabeza y miradas sutiles", completed: false, required: false, quickActionLabel: "Video Motion Studio", targetTab: "video-motion-studio" },
    ],
    proTips: [
      "Usa siempre el modificador `--ar 9:16` para que los activos calcen perfecto en Instagram Stories y Telegram sin bandas negras.",
      "Agrega prompts negativos fijos: `deformed eyes, extra fingers, cartoon, 3d render`.",
    ],
  },
  {
    id: "stage-3-voice-roleplay",
    phaseNumber: 3,
    title: "Fase 3: Voz IA y Personalidad Rioplatense / Latina",
    subtitle: "Audios personalizados y motor conversacional para Telegram",
    badge: "ElevenLabs & Edge-TTS",
    description:
      "Configuración de voz femenina envolvente, notas de voz de bienvenida y prompt de rol con modismos argentinos/latinos.",
    iconName: "Zap",
    targetTab: "influencer-studio",
    deliverables: [
      "Perfil de voz asignado (ElevenLabs Voice ID o Edge-TTS Free)",
      "Audio de bienvenida '¡Hola bombón! ✨'",
      "Prompt del sistema para respuestas dinámicas en el bot",
    ],
    checklist: [
      { id: "c7", text: "Seleccionar tono de voz (Sultry Whisper, Velvet ASMR o Playful)", completed: true, required: true },
      { id: "c8", text: "Generar y probar audio de bienvenida para nuevos miembros", completed: false, required: true, quickActionLabel: "Probar Voz en Estudio", targetTab: "influencer-studio" },
      { id: "c9", text: "Testear respuestas en el Simulador de Bot Telegram", completed: false, required: true, quickActionLabel: "Abrir Simulador", targetTab: "telegram-simulator" },
    ],
    proTips: [
      "Los suscriptores valoran un audio diario de 15 segundos más que 10 fotos estáticas; multiplica la tasa de retención un 300%.",
    ],
  },
  {
    id: "stage-4-monetization-sui",
    phaseNumber: 4,
    title: "Fase 4: Pasarela Cripto SUI & MercadoPago",
    subtitle: "Micropagos sin comisiones y cobro de suscripciones VIP",
    badge: "Sui Mainnet & ARS",
    description:
      "Vincular la wallet de administrador SUI, precios de suscripción en SUI/USDC/ARS y canal privado de Telegram con hash de invitación efímero.",
    iconName: "DollarSign",
    targetTab: "funnel-blueprint",
    deliverables: [
      "Dirección de wallet SUI de cobro configurada",
      "Precio definido (ej: 15 SUI o $18.500 ARS por mes)",
      "Enlace de invitación con expiración automática de 5 minutos",
    ],
    checklist: [
      { id: "c10", text: "Crear wallet en Slingshot / Sui Wallet / Phantom", completed: true, required: true },
      { id: "c11", text: "Configurar precios de tiers en SUI y USDC", completed: true, required: true, quickActionLabel: "Calculadora de Ingresos", targetTab: "funnel-blueprint" },
      { id: "c12", text: "Generar QR / Alias de MercadoPago para usuarios de Argentina/LATAM", completed: false, required: false },
    ],
    proTips: [
      "Las transacciones en la red SUI demoran solo 400ms y cuestan menos de $0.001 USD de gas, ideales para micropagos anónimos.",
    ],
  },
  {
    id: "stage-5-deploy-telegram",
    phaseNumber: 5,
    title: "Fase 5: Despliegue del Bot & Captación de Tráfico",
    subtitle: "BotFather, Kick-Bot automático y embudo de Instagram Reels",
    badge: "Render / Railway Deploy",
    description:
      "Despliegue del backend de Telegram en Node.js, cron de expulsión automática para membresías vencidas y tráfico orgánico.",
    iconName: "Bot",
    targetTab: "subscriber-management",
    deliverables: [
      "Bot registrado en @BotFather con token activo",
      "Cron job de expulsión automática (Auto-Kick) habilitado",
      "Enlace público en biografía de Instagram / TikTok",
    ],
    checklist: [
      { id: "c13", text: "Crear bot en Telegram con @BotFather y obtener HTTP API Token", completed: false, required: true, quickActionLabel: "Guía BotFather", targetTab: "telegram-guide" },
      { id: "c14", text: "Hacer prueba de Dry Run en el gestor de suscriptores", completed: false, required: true, quickActionLabel: "Auditoría Dry Run", targetTab: "subscriber-management" },
      { id: "c15", text: "Descargar código de servidor 'server-bootstrap.json' y desplegar", completed: false, required: true, quickActionLabel: "Ver Código & Deploy", targetTab: "sui-paybot-repo" },
    ],
    proTips: [
      "Publica 2 Reels diarios en Instagram con audios virales mostrando micro-momentos para redirigir tráfico al enlace de Telegram.",
    ],
  },
];

export const ModelWorkflowAndDatabase: React.FC<ModelWorkflowAndDatabaseProps> = ({
  currentInfluencer,
  setCurrentInfluencer,
  paybotConfig,
  onNavigateTab,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<"database" | "workflow" | "cloud-sync" | "new-model">("database");
  const [models, setModels] = useState<ModelDatabaseRecord[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNicheFilter, setSelectedNicheFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cloud Sync & Local Storage Cache State
  const [faceAssets, setFaceAssets] = useState<FaceAssetRecord[]>(DEFAULT_FACE_ASSETS);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isSyncingNow, setIsSyncingNow] = useState<boolean>(false);
  const [cacheSizeBytes, setCacheSizeBytes] = useState<number>(0);
  const [selectedFaceAssetFilter, setSelectedFaceAssetFilter] = useState<string>("all");
  const [previewingFaceAsset, setPreviewingFaceAsset] = useState<FaceAssetRecord | null>(null);
  const [isAddFaceAssetModalOpen, setIsAddFaceAssetModalOpen] = useState<boolean>(false);
  const [newFaceAssetForm, setNewFaceAssetForm] = useState<Partial<FaceAssetRecord>>({
    name: "",
    assetType: "synthetic_seed",
    sourceEngine: "StyleGAN3",
    resolution: "1024x1024",
    biometricPointsCount: 68,
    url: "",
    notes: "",
  });

  // Workflow Checklist State
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKFLOW);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load saved workflow:", e);
    }
    return DEFAULT_WORKFLOW_STAGES;
  });

  // New Model Form State
  const [newModelForm, setNewModelForm] = useState<Partial<ModelDatabaseRecord>>({
    name: "",
    handle: "",
    age: 22,
    nationality: "Argentina (Buenos Aires)",
    vibe: "Rubia Glam & Sensual, Fotos con Flash",
    bio: "Modelo Digital & Creadora VIP ✨ | Contenido 4K y audios exclusivos por Telegram 💋",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    facialCharacteristics: "Ojos almendrados color miel, pómulos altos, labios carnosos con gloss, cabello castaño con balayage claro, piel bronceada con textura natural.",
    characterTags: "(custom_model_v1:1.35), 22yo model, honey almond eyes, high cheekbones, plump glossy lips, natural skin pores, 8k raw photograph",
    isAdultContent: true,
    nicheCategory: "adult_erotic",
    monetizationModel: "hybrid_sui_fiat",
    recommendedPricing: {
      sui: 15,
      usdc: 25,
      ars: 18500,
      tierName: "VIP Diamond Access",
    },
    contentPillars: [
      "Selfies nocturnas con flash en auto (Reels 9:16)",
      "Sesiones 4K exclusivas en lencería (Canal VIP)",
      "Audios íntimos en español argentino (Bot Telegram)",
    ],
  });
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState<boolean>(false);
  const [aiPersonaConcept, setAiPersonaConcept] = useState<string>("");
  const [isSavingModel, setIsSavingModel] = useState<boolean>(false);
  const [isBatchRenaming, setIsBatchRenaming] = useState<boolean>(false);
  const [namingConvention, setNamingConvention] = useState<string>("[MODEL]_[DATE]_[INDEX]");
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // File import refs
  const fileImportInputRef = useRef<HTMLInputElement>(null);
  const cloudSyncBackupInputRef = useRef<HTMLInputElement>(null);
  const faceAssetFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute cache size
  const updateCacheSizeStats = () => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (key.startsWith("TELESUI_")) {
          const item = localStorage.getItem(key);
          if (item) total += item.length * 2; // Approximate UTF-16 bytes
        }
      }
      setCacheSizeBytes(total);
    } catch (e) {
      console.warn("Could not calculate cache size:", e);
    }
  };

  // Load models & face assets from backend or localStorage cache
  const fetchAllData = async () => {
    setIsLoadingModels(true);
    let loadedModels: ModelDatabaseRecord[] = [];
    let loadedAssets: FaceAssetRecord[] = [];

    // 1. Try to read local cache first
    try {
      const cachedSnapshotStr = localStorage.getItem(LOCAL_STORAGE_KEYS.SNAPSHOT);
      if (cachedSnapshotStr) {
        const cachedSnapshot: CloudSyncSnapshot = JSON.parse(cachedSnapshotStr);
        if (cachedSnapshot.modelsDatabase && Array.isArray(cachedSnapshot.modelsDatabase)) {
          loadedModels = cachedSnapshot.modelsDatabase;
        }
        if (cachedSnapshot.faceAssets && Array.isArray(cachedSnapshot.faceAssets)) {
          loadedAssets = cachedSnapshot.faceAssets;
        }
        if (cachedSnapshot.timestamp) {
          setLastSyncedAt(cachedSnapshot.timestamp);
        }
      }

      const autoSyncPref = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTO_SYNC);
      if (autoSyncPref !== null) {
        setIsAutoSyncEnabled(autoSyncPref === "true");
      }
    } catch (err) {
      console.warn("Local storage cache read error:", err);
    }

    // 2. Fetch from backend API /api/models and /api/face-assets
    try {
      const [modelsRes, assetsRes] = await Promise.all([
        fetch("/api/models").catch(() => null),
        fetch("/api/face-assets").catch(() => null),
      ]);

      if (modelsRes && modelsRes.ok) {
        const data = await modelsRes.json();
        if (data.success && Array.isArray(data.models) && data.models.length > 0) {
          loadedModels = data.models;
        }
      }

      if (assetsRes && assetsRes.ok) {
        const data = await assetsRes.json();
        if (data.success && Array.isArray(data.faceAssets) && data.faceAssets.length > 0) {
          loadedAssets = data.faceAssets;
        }
      }
    } catch (err) {
      console.warn("Backend API sync fallback to local cache:", err);
    }

    // Fallbacks
    if (loadedModels.length === 0) {
      loadedModels = DEFAULT_INFLUENCERS as ModelDatabaseRecord[];
    }
    if (loadedAssets.length === 0) {
      loadedAssets = DEFAULT_FACE_ASSETS;
    }

    setModels(loadedModels);
    setFaceAssets(loadedAssets);
    setIsLoadingModels(false);
    updateCacheSizeStats();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Save full Cloud-Sync Snapshot to browser LocalStorage and Backend API
  const performCloudSync = async (
    customModels?: ModelDatabaseRecord[],
    customAssets?: FaceAssetRecord[],
    customInfluencer?: AiInfluencer,
    silent: boolean = false
  ) => {
    setIsSyncingNow(true);
    const targetModels = customModels || models;
    const targetAssets = customAssets || faceAssets;
    const targetInfluencer = customInfluencer || currentInfluencer;
    const nowIso = new Date().toISOString();

    const allChecklistItems = workflowStages.flatMap((s) => s.checklist);
    const completedTasksCount = allChecklistItems.filter((i) => i.completed).length;

    const snapshot: CloudSyncSnapshot = {
      version: "1.0.0",
      timestamp: nowIso,
      environment: "TeleSui VIP Cloud-Sync Engine",
      currentInfluencer: targetInfluencer,
      modelsDatabase: targetModels,
      faceAssets: targetAssets,
      workflowStages,
      syncStats: {
        totalModels: targetModels.length,
        totalFaceAssets: targetAssets.length,
        completedChecklistTasks: completedTasksCount,
        cacheSizeBytes: JSON.stringify(targetModels).length + JSON.stringify(targetAssets).length,
        lastSyncedAt: nowIso,
      },
      metadata: {
        app: "TeleSui VIP Platform",
        exportType: "cloud_sync_full_backup",
        generatedBy: "ModelWorkflowAndDatabase Cloud Sync Module",
      },
    };

    // 1. Write to LocalStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SNAPSHOT, JSON.stringify(snapshot));
      localStorage.setItem(LOCAL_STORAGE_KEYS.FACE_ASSETS, JSON.stringify(targetAssets));
      localStorage.setItem(LOCAL_STORAGE_KEYS.WORKFLOW, JSON.stringify(workflowStages));
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTO_SYNC, String(isAutoSyncEnabled));
      setLastSyncedAt(nowIso);
      updateCacheSizeStats();
    } catch (lsErr) {
      console.warn("Could not save snapshot to localStorage (quota or disabled):", lsErr);
    }

    // 2. Write to Backend Cloud Sync Endpoint in background
    try {
      await fetch("/api/cloud-sync/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot }),
      });
    } catch (apiErr) {
      console.warn("Background API cloud-sync failed (local cache preserved):", apiErr);
    } finally {
      setIsSyncingNow(false);
      if (!silent) {
        showToast("☁️ ¡Estado del modelo, activos faciales y DB sincronizados en caché y nube!");
      }
    }
  };

  // Auto-sync effect when currentInfluencer or models change (debounced)
  useEffect(() => {
    if (!isAutoSyncEnabled || isLoadingModels) return;
    const timer = setTimeout(() => {
      performCloudSync(models, faceAssets, currentInfluencer, true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentInfluencer, models, faceAssets, workflowStages, isAutoSyncEnabled]);

  // Download JSON Backup Function
  const handleDownloadCloudSyncJson = () => {
    const allChecklistItems = workflowStages.flatMap((s) => s.checklist);
    const completedTasksCount = allChecklistItems.filter((i) => i.completed).length;

    const exportSnapshot: CloudSyncSnapshot = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: "TeleSui VIP Cloud-Sync Engine",
      currentInfluencer,
      modelsDatabase: models,
      faceAssets,
      workflowStages,
      syncStats: {
        totalModels: models.length,
        totalFaceAssets: faceAssets.length,
        completedChecklistTasks: completedTasksCount,
        cacheSizeBytes: cacheSizeBytes || (JSON.stringify(models).length + JSON.stringify(faceAssets).length),
        lastSyncedAt: new Date().toISOString(),
      },
      metadata: {
        app: "TeleSui VIP Platform",
        exportType: "cloud_sync_full_backup",
        generatedBy: "TeleSui Cloud-Sync Engine (Download JSON Backup)",
      },
    };

    const jsonString = JSON.stringify(exportSnapshot, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const timestampStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `telesui_cloud_sync_backup_${currentInfluencer.id || "models"}_${timestampStr}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("💾 ¡Copia de seguridad 'Download JSON Backup' descargada con éxito!");
  };

  // Restore Cloud Sync Snapshot from JSON file
  const handleRestoreCloudSyncJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);

        let restoredModels = models;
        let restoredAssets = faceAssets;
        let restoredInfluencer = currentInfluencer;
        let restoredStages = workflowStages;

        // Check if it's a full CloudSyncSnapshot or an array of models
        if (parsed.modelsDatabase && Array.isArray(parsed.modelsDatabase)) {
          restoredModels = parsed.modelsDatabase;
        } else if (Array.isArray(parsed)) {
          restoredModels = parsed;
        }

        if (parsed.faceAssets && Array.isArray(parsed.faceAssets)) {
          restoredAssets = parsed.faceAssets;
        }

        if (parsed.currentInfluencer && parsed.currentInfluencer.name) {
          restoredInfluencer = parsed.currentInfluencer;
          setCurrentInfluencer(parsed.currentInfluencer);
        }

        if (parsed.workflowStages && Array.isArray(parsed.workflowStages)) {
          restoredStages = parsed.workflowStages;
          setWorkflowStages(parsed.workflowStages);
        }

        setModels(restoredModels);
        setFaceAssets(restoredAssets);

        // Sync to localStorage and backend
        await performCloudSync(restoredModels, restoredAssets, restoredInfluencer, true);

        showToast(`📥 ¡Copia de seguridad restaurada con éxito! (${restoredModels.length} modelos, ${restoredAssets.length} activos faciales)`);
      } catch (err) {
        console.error("Invalid Cloud-Sync JSON file:", err);
        showToast("❌ El archivo JSON no tiene una estructura de copia de seguridad válida.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (cloudSyncBackupInputRef.current) cloudSyncBackupInputRef.current.value = "";
  };

  // Clear local storage cache
  const handleClearLocalStorageCache = () => {
    if (!window.confirm("¿Deseas restablecer la memoria caché local de modelos y activos faciales a los valores de fábrica?")) {
      return;
    }
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SNAPSHOT);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.FACE_ASSETS);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.WORKFLOW);
      setModels(DEFAULT_INFLUENCERS as ModelDatabaseRecord[]);
      setFaceAssets(DEFAULT_FACE_ASSETS);
      setWorkflowStages(DEFAULT_WORKFLOW_STAGES);
      updateCacheSizeStats();
      showToast("🧹 Caché local restablecido a los valores iniciales.");
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }
  };

  // Add / Upload new Face Asset
  const handleSaveFaceAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaceAssetForm.name?.trim() || !newFaceAssetForm.url?.trim()) {
      showToast("❌ Por favor ingresa el nombre y la imagen / URL del activo facial.");
      return;
    }

    const assignedModel = models.find((m) => m.id === newFaceAssetForm.modelId) || currentInfluencer;

    const newAsset: FaceAssetRecord = {
      id: `face-asset-${Date.now().toString().slice(-6)}`,
      modelId: assignedModel.id,
      modelName: assignedModel.name,
      assetType: (newFaceAssetForm.assetType as any) || "synthetic_seed",
      name: newFaceAssetForm.name,
      url: newFaceAssetForm.url,
      resolution: newFaceAssetForm.resolution || "1024x1024",
      biometricPointsCount: Number(newFaceAssetForm.biometricPointsCount) || 68,
      characterTagAnchor: newFaceAssetForm.characterTagAnchor || assignedModel.characterTags,
      sourceEngine: (newFaceAssetForm.sourceEngine as any) || "StyleGAN3",
      fileSizeKb: newFaceAssetForm.fileSizeKb || 450,
      createdAt: new Date().toISOString(),
      notes: newFaceAssetForm.notes || "Activo facial registrado en caché local de identidad.",
    };

    const updated = [newAsset, ...faceAssets];
    setFaceAssets(updated);
    setIsAddFaceAssetModalOpen(false);
    setNewFaceAssetForm({
      name: "",
      assetType: "synthetic_seed",
      sourceEngine: "StyleGAN3",
      resolution: "1024x1024",
      biometricPointsCount: 68,
      url: "",
      notes: "",
    });

    performCloudSync(models, updated, currentInfluencer, true);
    showToast(`✨ ¡Activo facial '${newAsset.name}' guardado y sincronizado en caché!`);
  };

  // Handle local image file upload for Face Asset
  const handleFaceAssetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("❌ Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).");
      return;
    }

    const sizeInKb = Math.round(file.size / 1024);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewFaceAssetForm((prev) => ({
        ...prev,
        url: dataUrl,
        fileSizeKb: sizeInKb,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
      }));
      showToast(`📸 Imagen '${file.name}' cargada (${sizeInKb} KB).`);
    };
    reader.readAsDataURL(file);
  };

  // Delete a Face Asset
  const handleDeleteFaceAsset = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar el activo facial '${name}' de la caché local?`)) return;
    const filtered = faceAssets.filter((a) => a.id !== id);
    setFaceAssets(filtered);
    performCloudSync(models, filtered, currentInfluencer, true);
    showToast(`🗑️ Activo facial '${name}' eliminado.`);
  };

  // Set Face Asset as Active Model's Avatar
  const handleSetAssetAsAvatar = (asset: FaceAssetRecord) => {
    const updatedInfluencer = {
      ...currentInfluencer,
      avatarUrl: asset.url,
      characterTags: asset.characterTagAnchor || currentInfluencer.characterTags,
    };
    setCurrentInfluencer(updatedInfluencer);

    // Update in models array
    const updatedModels = models.map((m) => (m.id === currentInfluencer.id ? { ...m, avatarUrl: asset.url } : m));
    setModels(updatedModels);
    performCloudSync(updatedModels, faceAssets, updatedInfluencer, true);
    showToast(`⭐ ¡'${asset.name}' asignado como avatar principal de ${currentInfluencer.name}!`);
  };

  // Select a model as active app-wide
  const handleSelectActiveModel = (model: ModelDatabaseRecord) => {
    setCurrentInfluencer(model);
    performCloudSync(models, faceAssets, model, true);
    showToast(`⭐ ¡Modelo '${model.name}' fijado como perfil activo en toda la app!`);
  };

  // Save new model to Database
  const handleSaveNewModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelForm.name?.trim()) {
      showToast("❌ Por favor ingresa el nombre de la modelo.");
      return;
    }

    setIsSavingModel(true);
    try {
      const slug = newModelForm.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const modelPayload: ModelDatabaseRecord = {
        id: `model-${slug}-${Date.now().toString().slice(-4)}`,
        name: newModelForm.name,
        handle: newModelForm.handle || `@${slug}.ai`,
        age: Number(newModelForm.age) || 22,
        nationality: newModelForm.nationality || "Argentina",
        vibe: newModelForm.vibe || "Lifestyle & Glamour",
        bio: newModelForm.bio || "Creadora Digital VIP",
        avatarUrl: newModelForm.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        facialCharacteristics: newModelForm.facialCharacteristics || "Rasgos faciales definidos, ojos expresivos y piel con micro-poros naturales.",
        characterTags: newModelForm.characterTags || `(${slug}:1.35), 22yo photorealistic model, natural skin pores, 8k uhd`,
        isAdultContent: newModelForm.isAdultContent ?? true,
        status: "vip_ready",
        nicheCategory: newModelForm.nicheCategory || "adult_erotic",
        monetizationModel: newModelForm.monetizationModel || "hybrid_sui_fiat",
        recommendedPricing: newModelForm.recommendedPricing || {
          sui: 15,
          usdc: 25,
          ars: 18500,
          tierName: "VIP Access",
        },
        contentPillars: newModelForm.contentPillars || ["Fotos 9:16", "Sesiones VIP", "Audios de rol"],
        promptPresets: [
          {
            scene: "Selfie con Flash Nocturno",
            prompt: `candid flash portrait of (${slug}:1.35), 22yo model, direct camera flash, 8k raw portrait --ar 9:16`,
            klingMotion: "Subtle smile into camera, blinking naturally",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalAssetsGenerated: 1,
        isCustomCreated: true,
      };

      const updatedModels = [modelPayload, ...models.filter((m) => m.id !== modelPayload.id)];
      setModels(updatedModels);
      setCurrentInfluencer(modelPayload);

      // Create a default face asset for the new model
      const autoAsset: FaceAssetRecord = {
        id: `face-asset-${slug}-${Date.now().toString().slice(-4)}`,
        modelId: modelPayload.id,
        modelName: modelPayload.name,
        assetType: "avatar_master",
        name: `${modelPayload.name} - Initial Seed`,
        url: modelPayload.avatarUrl,
        resolution: "1024x1024",
        biometricPointsCount: 68,
        characterTagAnchor: modelPayload.characterTags,
        sourceEngine: "StyleGAN3",
        fileSizeKb: 400,
        createdAt: new Date().toISOString(),
        notes: "Activo de rostro maestro autogenerado al registrar el modelo.",
      };
      const updatedAssets = [autoAsset, ...faceAssets];
      setFaceAssets(updatedAssets);

      await performCloudSync(updatedModels, updatedAssets, modelPayload, true);
      showToast(`🎉 ¡Modelo '${modelPayload.name}' guardada y sincronizada en caché!`);
      setActiveMainTab("database");
    } catch (err) {
      console.error("Error saving model:", err);
      showToast("❌ Error al guardar el modelo.");
    } finally {
      setIsSavingModel(false);
    }
  };

  // AI-Assisted persona generator
  const handleAutoFillWithAi = async () => {
    setIsGeneratingWithAi(true);
    try {
      const res = await fetch("/api/ai/generate-influencer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: newModelForm.nicheCategory || "adult_erotic",
          concept: aiPersonaConcept,
          style: newModelForm.vibe || "Glamour Argentino / Boudoir",
          language: "es-AR",
          targetAudience: "Telegram VIP Subscriptions & Sui Micropayments",
        }),
      });

      const aiData = await res.json();
      if (aiData) {
        setNewModelForm((prev) => ({
          ...prev,
          name: aiData.name || prev.name,
          handle: aiData.handle || prev.handle,
          age: aiData.age || prev.age,
          nationality: aiData.nationality || prev.nationality,
          vibe: aiData.vibe || prev.vibe,
          bio: aiData.bio || prev.bio,
          facialCharacteristics: aiData.facialCharacteristics || prev.facialCharacteristics,
          characterTags: aiData.characterTags || prev.characterTags,
          recommendedPricing: aiData.recommendedPricing || prev.recommendedPricing,
          contentPillars: aiData.contentPillars || prev.contentPillars,
        }));
        showToast("✨ ¡Perfil de modelo autocompletado con IA con éxito!");
      }
    } catch (err) {
      console.error("Error autofilling with AI:", err);
      showToast("⚠️ No se pudo autocompletar con IA, completa los campos manualmente.");
    } finally {
      setIsGeneratingWithAi(false);
    }
  };

  // Delete model from DB
  const handleDeleteModel = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar '${name}' de la base de datos?`)) return;

    try {
      const updatedModels = models.filter((m) => m.id !== id);
      setModels(updatedModels);
      await performCloudSync(updatedModels, faceAssets, currentInfluencer, true);
      showToast(`🗑️ Modelo '${name}' eliminada de la base de datos.`);
    } catch (err) {
      console.error("Error deleting model:", err);
      showToast("❌ Error al eliminar modelo.");
    }
  };

  const handleDuplicateModel = async (model: ModelDatabaseRecord) => {
    try {
      const copy: ModelDatabaseRecord = {
        ...model,
        id: `model-${Date.now()}`,
        name: `${model.name} (Copia)`,
        handle: `${model.handle}_copy`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedModels = [copy, ...models];
      setModels(updatedModels);
      await performCloudSync(updatedModels, faceAssets, currentInfluencer, true);
      showToast(`📋 ¡Modelo '${copy.name}' duplicada con éxito!`);
    } catch (err) {
      console.error("Error duplicating model:", err);
    }
  };

  // ZIP Export Logic
  const handleExportAllAssetsZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();
      const modelFolder = zip.folder(`${currentInfluencer.name.replace(/\s+/g, '_')}_assets`);
      
      // 1. Add current state JSON
      const snapshot = {
        influencer: currentInfluencer,
        timestamp: new Date().toISOString()
      };
      modelFolder?.file("metadata.json", JSON.stringify(snapshot, null, 2));

      // 2. Add Face Assets
      const modelAssets = faceAssets.filter(a => a.modelId === currentInfluencer.id);
      const assetsFolder = modelFolder?.folder("face_assets");
      
      for (const asset of modelAssets) {
        if (asset.url.startsWith("data:")) {
          const base64Data = asset.url.split(',')[1];
          assetsFolder?.file(`${asset.name.replace(/\s+/g, '_')}.png`, base64Data, { base64: true });
        }
      }

      // 3. Add Gallery Media
      if (currentInfluencer.galleryMedia) {
        const galleryFolder = modelFolder?.folder("gallery");
        for (const item of currentInfluencer.galleryMedia) {
          if (item.url.startsWith("data:")) {
            const base64Data = item.url.split(',')[1];
            galleryFolder?.file(`${item.title.replace(/\s+/g, '_')}.${item.type === 'video' ? 'mp4' : 'png'}`, base64Data, { base64: true });
          }
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentInfluencer.name.replace(/\s+/g, '_')}_Bundle_Assets.zip`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("📦 ¡Assets empaquetados en ZIP con éxito!");
    } catch (err) {
      console.error("ZIP Export error:", err);
      showToast("❌ Error al generar el paquete ZIP.");
    } finally {
      setIsExportingZip(false);
    }
  };

  // Batch Rename Logic
  const handleBatchRenameAssets = () => {
    if (!currentInfluencer.galleryMedia || currentInfluencer.galleryMedia.length === 0) {
      showToast("⚠️ No hay medios en la galería para renombrar.");
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const updatedGallery = currentInfluencer.galleryMedia.map((item, index) => {
      let newTitle = namingConvention
        .replace("[MODEL]", currentInfluencer.name)
        .replace("[DATE]", dateStr)
        .replace("[INDEX]", (index + 1).toString().padStart(3, '0'))
        .replace("[CAT]", item.category || "General");
      
      return { ...item, title: newTitle };
    });

    setCurrentInfluencer({ ...currentInfluencer, galleryMedia: updatedGallery });
    showToast(`📝 ${updatedGallery.length} archivos renombrados con la convención '${namingConvention}'.`);
  };

  // Drag and Drop Logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.currentInfluencer || parsed.influencer) {
            const restored = parsed.currentInfluencer || parsed.influencer;
            setCurrentInfluencer(restored);
            showToast(`🚀 Perfil de '${restored.name}' restaurado vía Drag & Drop.`);
          }
        } catch (err) {
          showToast("❌ Error: El archivo JSON no es un perfil válido.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Toggle checklist item
  const handleToggleChecklistItem = (stageId: string, checkId: string) => {
    const updated = workflowStages.map((st) => {
      if (st.id !== stageId) return st;
      return {
        ...st,
        checklist: st.checklist.map((item) => {
          if (item.id !== checkId) return item;
          return { ...item, completed: !item.completed };
        }),
      };
    });
    setWorkflowStages(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.WORKFLOW, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save workflow progress:", e);
    }
  };

  const handleCopyTag = (tag: string, id: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered models
  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.characterTags && m.characterTags.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesNiche =
      selectedNicheFilter === "all" ||
      (m.nicheCategory && m.nicheCategory === selectedNicheFilter) ||
      (selectedNicheFilter === "adult_erotic" && m.isAdultContent);

    const matchesStatus =
      selectedStatusFilter === "all" || (m.status && m.status === selectedStatusFilter);

    return matchesSearch && matchesNiche && matchesStatus;
  });

  // Filtered Face Assets
  const filteredFaceAssets = faceAssets.filter((asset) => {
    if (selectedFaceAssetFilter === "all") return true;
    if (selectedFaceAssetFilter === "current_model") return asset.modelId === currentInfluencer.id;
    return asset.assetType === selectedFaceAssetFilter;
  });

  // Calculate workflow total progress
  const allChecklistItems = workflowStages.flatMap((s) => s.checklist);
  const completedChecklistItems = allChecklistItems.filter((i) => i.completed);
  const progressPercent = Math.round((completedChecklistItems.length / allChecklistItems.length) * 100) || 0;

  return (
    <div 
      className={`space-y-6 transition-all duration-300 ${isDraggingFile ? 'scale-[0.99] opacity-70' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay Info */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-600/20 backdrop-blur-md pointer-events-none border-4 border-dashed border-purple-500 m-4 rounded-3xl animate-pulse">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center space-y-4">
            <div className="h-20 w-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-black">Suelta el JSON para restaurar</h2>
            <p className="text-zinc-500 font-medium">Restaurarás el perfil de la modelo y sus configuraciones instantáneamente.</p>
          </div>
        </div>
      )}
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-zinc-950 text-white px-5 py-3.5 shadow-2xl border border-zinc-800 text-xs font-bold animate-bounce">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Inputs for Import / Restore */}
      <input
        ref={fileImportInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleRestoreCloudSyncJson}
        className="hidden"
      />
      <input
        ref={cloudSyncBackupInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleRestoreCloudSyncJson}
        className="hidden"
      />
      <input
        ref={faceAssetFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFaceAssetImageUpload}
        className="hidden"
      />

      {/* Top Header Card with Cloud-Sync Controls */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-xs">
                <Database className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-black tracking-tight">
                Base de Datos & Cloud-Sync de Modelos IA
              </h2>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900 border border-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                CLOUD-SYNC ACTIVO
              </span>
              <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-900 border border-purple-200">
                localStorage Cache: {(cacheSizeBytes / 1024).toFixed(1)} KB
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-3xl">
              Sincroniza el estado del influencer activo, vectores de identidad y activos faciales en la caché local del navegador con respaldo y descarga instantánea en formato JSON.
            </p>
          </div>

          {/* Quick Action Buttons (including Download JSON Backup) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Download JSON Backup Button */}
            <button
              type="button"
              id="btn-export-assets-zip"
              onClick={handleExportAllAssetsZip}
              disabled={isExportingZip}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xs"
            >
              {isExportingZip ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileArchive className="h-3.5 w-3.5" />
              )}
              <span>Export All Assets (ZIP)</span>
            </button>

            <button
              type="button"
              id="btn-cloud-sync-download-json-header"
              onClick={handleDownloadCloudSyncJson}
              title="Descargar copia de seguridad completa en formato JSON (Modelos, Activos Faciales y Estado)"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-[#F9FAFB] px-3.5 py-2 text-xs font-bold text-zinc-800 hover:bg-white hover:border-zinc-400 transition-all shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download JSON</span>
            </button>

            {/* Sync Now Button */}
            <button
              type="button"
              id="btn-cloud-sync-now-header"
              onClick={() => performCloudSync()}
              disabled={isSyncingNow}
              title="Sincronizar cambios a la caché local y backend ahora"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-800 hover:border-black transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-purple-600 ${isSyncingNow ? "animate-spin" : ""}`} />
              <span>{isSyncingNow ? "Sincronizando..." : "Sync Now"}</span>
            </button>

            {/* Restore from JSON Button */}
            <button
              type="button"
              onClick={() => cloudSyncBackupInputRef.current?.click()}
              title="Restaurar copia de seguridad desde archivo JSON"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-[#F9FAFB] px-3 py-2 text-xs font-bold text-zinc-800 hover:bg-white hover:border-zinc-400 transition-all"
            >
              <Upload className="h-3.5 w-3.5 text-zinc-600" />
              <span>Restaurar Backup</span>
            </button>

            <button
              type="button"
              id="btn-open-new-model-tab"
              onClick={() => setActiveMainTab("new-model")}
              className="flex items-center gap-1.5 rounded-xl bg-black px-3.5 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-400" />
              <span>Nuevo Modelo</span>
            </button>
          </div>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center gap-2 border-t border-zinc-100 mt-5 pt-4 overflow-x-auto">
          <button
            type="button"
            id="tab-models-database"
            onClick={() => setActiveMainTab("database")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeMainTab === "database"
                ? "bg-black text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>1. Catálogo & Base de Datos ({models.length})</span>
          </button>

          <button
            type="button"
            id="tab-models-workflow"
            onClick={() => setActiveMainTab("workflow")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeMainTab === "workflow"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-950 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-600" />
            <span>2. Workflow Integral E2E (5 Fases)</span>
            <span className="rounded bg-purple-200 text-purple-900 text-[10px] font-mono font-black px-1.5 py-0.2">
              {progressPercent}%
            </span>
          </button>

          {/* TAB 3: CLOUD-SYNC & FACE ASSETS */}
          <button
            type="button"
            id="tab-models-cloud-sync"
            onClick={() => setActiveMainTab("cloud-sync")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeMainTab === "cloud-sync"
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <Cloud className="h-3.5 w-3.5 text-emerald-600" />
            <span>3. Cloud-Sync & Face Assets Cache ({faceAssets.length})</span>
            <span className="rounded bg-emerald-200 text-emerald-900 text-[10px] font-mono font-black px-1.5 py-0.2">
              Sync OK
            </span>
          </button>

          <button
            type="button"
            id="tab-create-model-wizard"
            onClick={() => setActiveMainTab("new-model")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeMainTab === "new-model"
                ? "bg-black text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>4. Creador Rápido en DB</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MODEL DATABASE & REGISTRY */}
      {activeMainTab === "database" && (
        <div className="space-y-5">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Modelos Registrados en DB
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-black">{models.length}</span>
                <span className="text-[11px] font-bold text-emerald-600">Sincronizados</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Modelo Activo en App
              </span>
              <div className="flex items-center gap-2 mt-1 truncate">
                <img
                  src={currentInfluencer.avatarUrl}
                  alt={currentInfluencer.name}
                  className="h-6 w-6 rounded-full object-cover border border-zinc-300"
                />
                <span className="text-xs font-black text-black truncate">{currentInfluencer.name}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Face Assets en Caché
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-black">{faceAssets.length}</span>
                <span className="text-[10px] font-mono text-zinc-500">archivos</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Cloud Sync Status
              </span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-700 font-mono">LocalStorage Cached</span>
              </div>
            </div>
          </div>

          {/* Search, Filter & Controls Bar */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, país o tag..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-xl border border-zinc-200 text-xs">
                <span className="text-[10px] font-bold text-zinc-400 px-1.5">Nicho:</span>
                {["all", "adult_erotic", "luxury", "fitness"].map((niche) => (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => setSelectedNicheFilter(niche)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      selectedNicheFilter === niche
                        ? "bg-black text-white shadow-xs"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    {niche === "all" ? "Todos" : niche === "adult_erotic" ? "Adult 18+" : niche}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadCloudSyncJson}
                className="text-[11px] font-bold text-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1"
              >
                <Download className="h-3 w-3 text-emerald-600" />
                <span>Backup JSON</span>
              </button>
            </div>
          </div>

          {/* Grid of Models in Database */}
          {isLoadingModels ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500 space-y-2">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-black" />
              <p className="text-xs font-bold">Cargando base de datos de modelos y caché local...</p>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500 space-y-3">
              <Database className="h-8 w-8 mx-auto text-zinc-400" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-black">No se encontraron modelos</h4>
                <p className="text-xs">Intenta cambiar los filtros o crea un nuevo perfil de modelo.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMainTab("new-model")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Registrar Nuevo Modelo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredModels.map((model) => {
                const isActive = currentInfluencer.id === model.id;
                const modelFaceAssetsCount = faceAssets.filter((a) => a.modelId === model.id).length;

                return (
                  <div
                    key={model.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                      isActive
                        ? "border-black ring-2 ring-black shadow-md"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {/* Top Row: Avatar + Badges + Identity */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative group">
                          <img
                            src={model.avatarUrl}
                            alt={model.name}
                            className="h-16 w-16 rounded-xl object-cover border-2 border-zinc-200 shadow-xs"
                          />
                          {model.isAdultContent && (
                            <span className="absolute -top-1.5 -right-1.5 rounded bg-rose-600 text-white text-[8px] font-black px-1 py-0.2 shadow-xs">
                              18+ VIP
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-black truncate">{model.name}</h3>
                            {isActive && (
                              <span className="rounded-md bg-black text-white text-[9px] font-bold px-1.5 py-0.2">
                                ACTIVA
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500 block truncate">
                            {model.handle} • {model.nationality}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-semibold bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200 block truncate">
                            {model.vibe}
                          </span>
                        </div>
                      </div>

                      {/* Character Tag Box */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-zinc-600 flex items-center gap-1">
                            <Tag className="h-3 w-3 text-purple-600" /> Character Tag Lock:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyTag(model.characterTags, model.id)}
                            className="text-zinc-500 hover:text-black font-bold flex items-center gap-0.5"
                          >
                            {copiedId === model.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>{copiedId === model.id ? "Copiado" : "Copiar"}</span>
                          </button>
                        </div>
                        <code className="block text-[10px] font-mono text-zinc-700 bg-[#F9FAFB] p-2 rounded-xl border border-zinc-200 line-clamp-2 break-all">
                          {model.characterTags}
                        </code>
                      </div>

                      {/* Face Assets & Pricing Specs */}
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                        <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                          <span className="text-[9px] font-bold text-zinc-400 block uppercase">
                            Face Assets
                          </span>
                          <span className="font-black text-purple-700">
                            {modelFaceAssetsCount} items
                          </span>
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                          <span className="text-[9px] font-bold text-zinc-400 block uppercase">
                            Precio SUI
                          </span>
                          <span className="font-black text-black">
                            {model.recommendedPricing?.sui || 15} SUI
                          </span>
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-2 border border-zinc-200">
                          <span className="text-[9px] font-bold text-zinc-400 block uppercase">
                            Precio ARS
                          </span>
                          <span className="font-black text-black">
                            ${model.recommendedPricing?.ars?.toLocaleString() || "18.500"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      {/* Primary Activate Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectActiveModel(model)}
                        className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                          isActive
                            ? "bg-zinc-900 text-white cursor-default"
                            : "bg-black text-white hover:bg-zinc-800 shadow-xs"
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>{isActive ? "Modelo Activo en Uso" : "Seleccionar como Modelo Activo"}</span>
                      </button>

                      {/* Quick Navigation Shortcuts */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentInfluencer(model);
                            onNavigateTab("influencer-studio");
                          }}
                          className="flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 text-[11px] font-semibold text-zinc-800 hover:bg-white hover:border-zinc-400"
                        >
                          <Camera className="h-3 w-3 text-purple-600" />
                          <span>Generar Fotos</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentInfluencer(model);
                            onNavigateTab("face-swap-studio");
                          }}
                          className="flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 text-[11px] font-semibold text-zinc-800 hover:bg-white hover:border-zinc-400"
                        >
                          <RefreshCw className="h-3 w-3 text-blue-600" />
                          <span>Face Swap</span>
                        </button>
                      </div>

                      {/* Secondary Management Row */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateModel(model)}
                          className="hover:text-black font-semibold flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" /> Duplicar
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadCloudSyncJson}
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                          title="Descargar JSON Backup completo"
                        >
                          <Download className="h-3 w-3" /> JSON Backup
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteModel(model.id, model.name)}
                          className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: END-TO-END WORKFLOW (5 PHASES) */}
      {activeMainTab === "workflow" && (
        <div className="space-y-6">
          {/* Progress Overview Banner */}
          <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-900 via-purple-950 to-zinc-900 text-white p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                  Pipeline de Producción E2E
                </span>
                <h3 className="text-lg font-bold text-white">
                  De Cero a Modelo IA Monetizando en Telegram
                </h3>
                <p className="text-xs text-zinc-300 max-w-xl">
                  Sigue las 5 fases ordenadas para construir un avatar consistente, entrenar su voz, desplegar el bot de Telegram y recibir micropagos en SUI.
                </p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="bg-black/60 p-4 rounded-xl border border-purple-800/40 text-center min-w-[140px]">
                <span className="text-3xl font-black text-emerald-400 font-mono">{progressPercent}%</span>
                <span className="text-[10px] font-bold text-zinc-300 block">Progreso Global</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mt-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* The 5 Interactive Stages */}
          <div className="space-y-4">
            {workflowStages.map((stage) => {
              const stageCompleted = stage.checklist.every((c) => c.completed);
              return (
                <div
                  key={stage.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                    stageCompleted ? "border-emerald-300 bg-emerald-50/20" : "border-zinc-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-black">
                          {stage.phaseNumber}
                        </span>
                        <h4 className="text-base font-bold text-black">{stage.title}</h4>
                        <span className="rounded bg-purple-100 text-purple-900 text-[10px] font-black px-2 py-0.5">
                          {stage.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">{stage.description}</p>
                    </div>

                    {/* Quick Direct Navigation Tab */}
                    {stage.targetTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab(stage.targetTab!)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition-all shrink-0 shadow-2xs"
                      >
                        <span>Abrir Herramienta</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
                    {/* Checklist Section (7 cols) */}
                    <div className="lg:col-span-7 space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                        Checklist de Tareas:
                      </span>
                      <div className="space-y-2">
                        {stage.checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleToggleChecklistItem(stage.id, item.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              item.completed
                                ? "border-emerald-300 bg-emerald-50/50 text-emerald-950"
                                : "border-zinc-200 bg-[#F9FAFB] text-zinc-800 hover:border-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {item.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Square className="h-4 w-4 text-zinc-400 shrink-0" />
                              )}
                              <span className={`text-xs ${item.completed ? "line-through text-zinc-500" : "font-semibold"}`}>
                                {item.text}
                              </span>
                            </div>

                            {item.quickActionLabel && item.targetTab && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateTab(item.targetTab!);
                                }}
                                className="text-[10px] font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded transition-all shrink-0 ml-2"
                              >
                                {item.quickActionLabel}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables & Pro Tips (5 cols) */}
                    <div className="lg:col-span-5 space-y-3 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      <div>
                        <span className="font-bold text-zinc-800 block mb-1">Entregables Clave:</span>
                        <ul className="space-y-1 text-zinc-600 text-[11px]">
                          {stage.deliverables.map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-zinc-200 pt-2">
                        <span className="font-bold text-purple-900 flex items-center gap-1 text-[11px] mb-0.5">
                          <Sparkles className="h-3 w-3 text-purple-600" /> Pro-Tip de Monetización:
                        </span>
                        <p className="text-[10px] text-zinc-600 leading-relaxed">
                          {stage.proTips[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CLOUD-SYNC & FACE ASSETS CACHE (FEATURED) */}
      {activeMainTab === "cloud-sync" && (
        <div className="space-y-6">
          {/* Cloud Sync Status & Control Panel */}
          <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-950 via-zinc-950 to-teal-950 text-white p-6 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <Cloud className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    Cloud-Sync Engine & LocalStorage Cache
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Sincronización de Identidad & Bóveda de Activos Faciales
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Guarda de forma persistente la matriz biométrica del influencer, semillas StyleGAN3, imágenes 9:16 y el catálogo de modelos en el <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-300 font-mono">localStorage</code> del navegador. Descarga copias de seguridad portables en formato JSON en cualquier momento.
                </p>
              </div>

              {/* Status Stats Block */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-black/50 p-3 rounded-xl border border-emerald-800/40 text-center">
                  <span className="text-xs font-bold text-zinc-400 block">Modelos en Cache</span>
                  <span className="text-xl font-black text-white font-mono">{models.length}</span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-emerald-800/40 text-center">
                  <span className="text-xs font-bold text-zinc-400 block">Face Assets</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{faceAssets.length}</span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-emerald-800/40 text-center col-span-2 sm:col-span-1">
                  <span className="text-xs font-bold text-zinc-400 block">Tamaño de Cache</span>
                  <span className="text-xl font-black text-teal-300 font-mono">
                    {(cacheSizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            </div>

            {/* Sync Controls & Auto-Sync Toggle */}
            <div className="mt-6 pt-5 border-t border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Auto-Sync Toggle */}
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-300 select-none">
                  <input
                    type="checkbox"
                    checked={isAutoSyncEnabled}
                    onChange={(e) => {
                      setIsAutoSyncEnabled(e.target.checked);
                      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTO_SYNC, String(e.target.checked));
                      showToast(e.target.checked ? "⚡ Auto-Sync activado." : "⏸️ Auto-Sync en pausa.");
                    }}
                    className="h-4 w-4 rounded accent-emerald-500"
                  />
                  <span>Auto-Sync en tiempo real al editar modelos</span>
                </label>

                {lastSyncedAt && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                    Último sync: {new Date(lastSyncedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-cloud-sync-download-json"
                  onClick={handleDownloadCloudSyncJson}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-zinc-950 hover:bg-emerald-400 transition-all shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>Download JSON Backup</span>
                </button>

                <button
                  type="button"
                  id="btn-cloud-sync-now"
                  onClick={() => performCloudSync()}
                  disabled={isSyncingNow}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-zinc-700 transition-all border border-zinc-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncingNow ? "animate-spin" : ""}`} />
                  <span>{isSyncingNow ? "Sincronizando..." : "Sincronizar Ahora"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => cloudSyncBackupInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Restaurar JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearLocalStorageCache}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-2 rounded-xl hover:bg-rose-950/30 transition-all"
                >
                  Limpiar Cache
                </button>
              </div>
            </div>
          </div>

          {/* Active Model Snapshot Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-black">
                  Estado Sincronizado del Influencer Activo
                </h4>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">ID: {currentInfluencer.id}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentInfluencer.avatarUrl}
                  alt={currentInfluencer.name}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-zinc-200 shadow-xs shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-black">{currentInfluencer.name}</h5>
                    <span className="text-[10px] font-mono text-zinc-500">{currentInfluencer.handle}</span>
                  </div>
                  <p className="text-xs text-zinc-600">{currentInfluencer.vibe}</p>
                  <p className="text-[11px] font-mono text-purple-700 truncate max-w-md">
                    {currentInfluencer.characterTags}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigateTab("influencer-studio")}
                  className="flex items-center gap-1 rounded-xl bg-black px-3.5 py-2 text-xs font-bold text-white hover:bg-zinc-800"
                >
                  <Camera className="h-3.5 w-3.5 text-purple-400" />
                  <span>Ir al Estudio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Batch Rename Tools (Gallery) */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-purple-600" />
                Utilidad de Renombrado en Lote (Galería)
              </h4>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={namingConvention}
                  onChange={(e) => setNamingConvention(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-[10px] font-mono bg-white focus:outline-none focus:border-purple-500"
                  placeholder="Convención..."
                />
                <button 
                  onClick={handleBatchRenameAssets}
                  className="rounded-lg bg-black text-white px-3 py-1.5 text-[10px] font-bold hover:bg-zinc-800"
                >
                  Aplicar
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["[MODEL]_[DATE]_[INDEX]", "[MODEL]_VIP_[CAT]_[INDEX]", "[DATE]_[MODEL]"].map(p => (
                <button 
                  key={p} 
                  onClick={() => setNamingConvention(p)}
                  className={`px-2 py-1 rounded-md text-[9px] font-mono transition ${namingConvention === p ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-white text-zinc-500 border border-zinc-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Face Assets Vault & Cache Manager */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div>
                <h4 className="text-base font-bold text-black flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-purple-600" />
                  Bóveda de Activos Faciales & Semillas Sintéticas ({filteredFaceAssets.length})
                </h4>
                <p className="text-xs text-zinc-500">
                  Colección de rostros frontales neutros (StyleGAN3 / ThisPersonDoesNotExist), máscaras faciales y renders 9:16 guardados en memoria caché.
                </p>
              </div>

              {/* Add New Face Asset Button */}
              <button
                type="button"
                id="btn-add-face-asset"
                onClick={() => {
                  setNewFaceAssetForm({
                    name: `${currentInfluencer.name} - Face Seed`,
                    modelId: currentInfluencer.id,
                    assetType: "synthetic_seed",
                    sourceEngine: "StyleGAN3",
                    resolution: "1024x1024",
                    biometricPointsCount: 68,
                    url: "",
                    notes: "Semilla frontal 1024px con matriz de 68 puntos.",
                  });
                  setIsAddFaceAssetModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Registrar Face Asset</span>
              </button>
            </div>

            {/* Filter Pills for Face Assets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Filtrar por:</span>
              {[
                { id: "all", label: "Todos los Assets" },
                { id: "current_model", label: `Solo ${currentInfluencer.name}` },
                { id: "synthetic_seed", label: "Semillas Sintéticas" },
                { id: "avatar_master", label: "Avatares & Renders 9:16" },
                { id: "custom_upload", label: "Subidas Personalizadas" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFaceAssetFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFaceAssetFilter === f.id
                      ? "bg-black text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Grid of Face Assets */}
            {filteredFaceAssets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 space-y-2">
                <FileImage className="h-8 w-8 mx-auto text-zinc-400" />
                <p className="text-xs font-bold">No hay activos faciales en esta categoría.</p>
                <button
                  type="button"
                  onClick={() => setIsAddFaceAssetModalOpen(true)}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  Subir o registrar el primer activo facial
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredFaceAssets.map((asset) => {
                  const isCurrentAvatar = currentInfluencer.avatarUrl === asset.url;
                  return (
                    <div
                      key={asset.id}
                      className={`rounded-xl border bg-white p-3.5 shadow-2xs transition-all flex flex-col justify-between space-y-3 ${
                        isCurrentAvatar ? "border-emerald-400 ring-2 ring-emerald-300" : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative rounded-lg overflow-hidden bg-zinc-100 aspect-square group">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className="rounded bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 backdrop-blur-xs">
                            {asset.resolution || "1024x1024"}
                          </span>
                          <span className="rounded bg-purple-900/80 text-purple-200 text-[9px] font-bold px-1.5 py-0.5 backdrop-blur-xs">
                            {asset.sourceEngine}
                          </span>
                        </div>

                        {isCurrentAvatar && (
                          <span className="absolute bottom-2 right-2 rounded bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 shadow-xs">
                            AVATAR ACTIVO
                          </span>
                        )}
                      </div>

                      {/* Info Details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-black truncate" title={asset.name}>
                            {asset.name}
                          </h5>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {asset.biometricPointsCount || 68} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate">
                          Modelo: <span className="font-semibold text-zinc-700">{asset.modelName}</span>
                        </p>
                        {asset.notes && (
                          <p className="text-[10px] text-zinc-600 line-clamp-1 italic">
                            {asset.notes}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs">
                        <button
                          type="button"
                          onClick={() => handleSetAssetAsAvatar(asset)}
                          className={`w-full py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
                            isCurrentAvatar
                              ? "bg-emerald-100 text-emerald-900 cursor-default"
                              : "bg-black text-white hover:bg-zinc-800"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          <span>{isCurrentAvatar ? "Avatar en Uso" : "Fijar como Avatar"}</span>
                        </button>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                          <a
                            href={asset.url}
                            download={`${asset.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-black font-semibold flex items-center gap-0.5"
                          >
                            <Download className="h-3 w-3" /> Descargar
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteFaceAsset(asset.id, asset.name)}
                            className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-0.5"
                          >
                            <Trash2 className="h-3 w-3" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NEW MODEL CREATOR WIZARD */}
      {activeMainTab === "new-model" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Registrar Nuevo Perfil de Modelo en Base de Datos & Cloud-Sync
              </h3>
              <p className="text-xs text-zinc-500">
                Guarda una identidad única con su master prompt ancla, precios y configuración para Telegram.
              </p>
            </div>

                        {/* AI Persona Architect */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 mb-4">
              <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> AI Persona Architect
              </h4>
              <p className="text-xs text-purple-800 mb-3">
                Ingresá un concepto de 2-3 palabras (Ej: "Gótica Rosarina", "Rubia Palermo", "Fitness Córdoba") y Gemini creará automáticamente toda la personalidad, historia y estética.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPersonaConcept}
                  onChange={(e) => setAiPersonaConcept(e.target.value)}
                  placeholder='Ej: "Gótica Rosarina"'
                  className="flex-1 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs text-purple-900 focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  id="btn-autofill-persona-ai"
                  onClick={handleAutoFillWithAi}
                  disabled={isGeneratingWithAi || !aiPersonaConcept.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-black text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-xs disabled:opacity-50"
                >
                  {isGeneratingWithAi ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Generar Perfil</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveNewModel} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">Nombre Artístico del Modelo *</label>
                <input
                  type="text"
                  required
                  value={newModelForm.name || ""}
                  onChange={(e) => setNewModelForm({ ...newModelForm, name: e.target.value })}
                  placeholder="Ej: Sofia Lorenzi, Elena Fox, Sweet Blondie"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Handle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">Handle / Usuario de Redes</label>
                <input
                  type="text"
                  value={newModelForm.handle || ""}
                  onChange={(e) => setNewModelForm({ ...newModelForm, handle: e.target.value })}
                  placeholder="Ej: @sofia.lorenzi_vip"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Age & Nationality */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Edad</label>
                  <input
                    type="number"
                    min={18}
                    max={35}
                    value={newModelForm.age || 22}
                    onChange={(e) => setNewModelForm({ ...newModelForm, age: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Nacionalidad / Ciudad</label>
                  <input
                    type="text"
                    value={newModelForm.nationality || ""}
                    onChange={(e) => setNewModelForm({ ...newModelForm, nationality: e.target.value })}
                    placeholder="Argentina / Miami"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Niche Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">Categoría de Nicho</label>
                <select
                  value={newModelForm.nicheCategory || "adult_erotic"}
                  onChange={(e) => setNewModelForm({ ...newModelForm, nicheCategory: e.target.value as any })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                >
                  <option value="adult_erotic">Adult / Erotic Boudoir 18+</option>
                  <option value="glamour">Glamour & Fashion</option>
                  <option value="fitness">Fitness & Activewear</option>
                  <option value="lifestyle">Lifestyle & Travel</option>
                  <option value="luxury">Luxury & Yachts</option>
                </select>
              </div>

              {/* Avatar URL */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-zinc-800">URL del Avatar / Foto Base</label>
                <input
                  type="text"
                  value={newModelForm.avatarUrl || ""}
                  onChange={(e) => setNewModelForm({ ...newModelForm, avatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... o data:image/png;base64,..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Character Tags */}
              <div className="space-y-1 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-800">
                    Master Character Tags (Bloqueo de Consistencia para Text-to-Image) *
                  </label>
                  <span className="text-[10px] text-purple-700 font-bold font-mono">(nombre:1.35)</span>
                </div>
                <textarea
                  rows={2}
                  value={newModelForm.characterTags || ""}
                  onChange={(e) => setNewModelForm({ ...newModelForm, characterTags: e.target.value })}
                  placeholder="(nombre_modelo:1.35), 22yo model, honey almond eyes, natural skin pores, 8k uhd"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none font-mono leading-relaxed"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-zinc-800">Biografía para Redes & Telegram</label>
                <textarea
                  rows={2}
                  value={newModelForm.bio || ""}
                  onChange={(e) => setNewModelForm({ ...newModelForm, bio: e.target.value })}
                  placeholder="Modelo Digital & Creadora VIP ✨ | Contenido exclusivo y audios íntimos en Telegram 💋"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Pricing in SUI / USDC / ARS */}
              <div className="grid grid-cols-3 gap-2 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Precio SUI (Mes)</label>
                  <input
                    type="number"
                    value={newModelForm.recommendedPricing?.sui || 15}
                    onChange={(e) =>
                      setNewModelForm({
                        ...newModelForm,
                        recommendedPricing: {
                          ...(newModelForm.recommendedPricing || { usdc: 25, tierName: "VIP" }),
                          sui: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Precio USDC</label>
                  <input
                    type="number"
                    value={newModelForm.recommendedPricing?.usdc || 25}
                    onChange={(e) =>
                      setNewModelForm({
                        ...newModelForm,
                        recommendedPricing: {
                          ...(newModelForm.recommendedPricing || { sui: 15, tierName: "VIP" }),
                          usdc: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Precio ARS (MercadoPago)</label>
                  <input
                    type="number"
                    value={newModelForm.recommendedPricing?.ars || 18500}
                    onChange={(e) =>
                      setNewModelForm({
                        ...newModelForm,
                        recommendedPricing: {
                          ...(newModelForm.recommendedPricing || { sui: 15, usdc: 25, tierName: "VIP" }),
                          ars: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setActiveMainTab("database")}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-white"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-submit-save-model-db"
                disabled={isSavingModel}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-xs disabled:opacity-50"
              >
                {isSavingModel ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Guardando y Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Guardar y Sincronizar en DB</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / UPLOAD FACE ASSET */}
      {isAddFaceAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h4 className="text-base font-bold text-black flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-purple-600" />
                Registrar Nuevo Activo Facial en Caché
              </h4>
              <button
                type="button"
                onClick={() => setIsAddFaceAssetModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-black hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaceAsset} className="space-y-4 text-xs">
              {/* Asset Name */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-800">Nombre del Activo Facial *</label>
                <input
                  type="text"
                  required
                  value={newFaceAssetForm.name || ""}
                  onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, name: e.target.value })}
                  placeholder="Ej: Sofia Lorenzi - Synthetic Face Seed 1024px"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Model Assignment & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-800">Asignar a Modelo</label>
                  <select
                    value={newFaceAssetForm.modelId || currentInfluencer.id}
                    onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, modelId: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-800">Tipo de Activo</label>
                  <select
                    value={newFaceAssetForm.assetType || "synthetic_seed"}
                    onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, assetType: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                  >
                    <option value="synthetic_seed">Semilla Sintética (1024px)</option>
                    <option value="avatar_master">Avatar Maestro / Render 9:16</option>
                    <option value="custom_upload">Subida Personalizada</option>
                    <option value="facial_mask">Máscara Facial (InsightFace 68pts)</option>
                  </select>
                </div>
              </div>

              {/* Image Input (Upload file or URL) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-800">Imagen del Rostro *</label>
                  <button
                    type="button"
                    onClick={() => faceAssetFileInputRef.current?.click()}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <Upload className="h-3 w-3" /> Subir desde mi equipo
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={newFaceAssetForm.url || ""}
                  onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, url: e.target.value })}
                  placeholder="Pega la URL de la imagen o presiona 'Subir desde mi equipo'"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none font-mono text-[11px]"
                />

                {newFaceAssetForm.url && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <img
                      src={newFaceAssetForm.url}
                      alt="Preview"
                      className="h-12 w-12 rounded-lg object-cover border border-zinc-300"
                    />
                    <span className="text-[11px] text-zinc-600 font-semibold">
                      Vista previa de imagen cargada correctamente
                    </span>
                  </div>
                )}
              </div>

              {/* Engine & Resolution */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-800">Motor de Origen</label>
                  <select
                    value={newFaceAssetForm.sourceEngine || "StyleGAN3"}
                    onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, sourceEngine: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900"
                  >
                    <option value="StyleGAN3">StyleGAN3</option>
                    <option value="ThisPersonDoesNotExist">ThisPersonDoesNotExist</option>
                    <option value="InsightFace">InsightFace</option>
                    <option value="Flux.1">Flux.1</option>
                    <option value="Custom Upload">Custom Upload</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-800">Resolución</label>
                  <select
                    value={newFaceAssetForm.resolution || "1024x1024"}
                    onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, resolution: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900"
                  >
                    <option value="1024x1024">1024x1024 (Rostro Frontal 1:1)</option>
                    <option value="1080x1920">1080x1920 (Reels / Telegram 9:16)</option>
                    <option value="512x512">512x512 (Thumbnail)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-800">Notas Biométricas</label>
                <input
                  type="text"
                  value={newFaceAssetForm.notes || ""}
                  onChange={(e) => setNewFaceAssetForm({ ...newFaceAssetForm, notes: e.target.value })}
                  placeholder="Ej: Rostro frontal neutro con iluminación softbox para face-swap."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddFaceAssetModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-black px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Guardar en Caché</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
