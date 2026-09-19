export interface VoiceProfile {
  id: string;
  name: string;
  provider: "ElevenLabs" | "Edge-TTS" | "Kokoro-82M" | "WebSpeech";
  accent: string;
  language: string;
  gender: "female" | "male" | "non-binary";
  tone: "sultry_whisper" | "playful_energetic" | "posh_elegant" | "velvet_asmr" | "sweet_candid" | "bilingual_glam";
  description: string;
  elevenLabsVoiceId: string;
  edgeTtsVoice: string;
  stability: number; // 0.0 - 1.0 (e.g., 0.45)
  similarityBoost: number; // 0.0 - 1.0 (e.g., 0.85)
  styleExaggeration: number; // 0.0 - 1.0 (e.g., 0.20)
  speed: number; // 0.7 - 1.3
  pitch: number; // 0.8 - 1.2
  samplePhrases: {
    title: string;
    category: "welcome" | "vip_teaser" | "intimate_whisper" | "renewal_reminder" | "mercadopago_sui";
    text: string;
  }[];
  tags: string[];
  personalityBioPrompt?: string;
}

export interface ModelMediaItem {
  id: string;
  type: "photo" | "video";
  title: string;
  url: string;
  thumbnailUrl?: string;
  category: "lingerie" | "swimwear" | "lifestyle" | "fitness" | "nightlife";
  aspectRatio: "9:16" | "4:3" | "1:1";
  duration?: string;
  promptUsed?: string;
}

export interface FaceSwapTemplate {
  id: string;
  title: string;
  type: "photo" | "video";
  category: "dance" | "lingerie" | "lifestyle" | "fitness" | "runway";
  originalUrl: string;
  originalThumbnail: string;
  swappedUrlByModel: Record<string, string>; // influencerId -> swapped media url
  description: string;
}

export interface AiInfluencer {
  id: string;
  name: string;
  handle: string;
  age: number;
  nationality: string;
  vibe: string;
  bio: string;
  avatarUrl: string;
  facialCharacteristics: string;
  characterTags: string;
  isAdultContent?: boolean;
  contentWarningDisclaimer?: string;
  personalityPromptTemplate?: string;
  voiceProfile?: VoiceProfile;
  recommendedPricing: {
    sui: number;
    usdc: number;
    ars?: number;
    tierName: string;
  };
  contentPillars: string[];
  promptPresets: {
    scene: string;
    prompt: string;
    klingMotion: string;
  }[];
  galleryMedia?: ModelMediaItem[];
}

export interface PromptPreset {
  id: string;
  title: string;
  category: "luxury" | "lifestyle" | "swimwear" | "fitness" | "candid" | "nightlife" | "lingerie";
  aspectRatio: string;
  positivePrompt: string;
  negativePrompt: string;
  klingMotion: string;
  cameraLens: string;
  lighting: string;
  captionInstagram: string;
  captionTelegram: string;
}

export interface PaybotConfig {
  telegramBotToken: string;
  suiRpcUrl: string;
  vipChannelId: string;
  adminSuiWallet: string;
  subscriberPrice: number;
  tokenType: "SUI" | "USDC";
  inviteLinkExpirationMinutes: number;
  subscriptionDurationDays: number;
  enableAutoKickCron: boolean;
  estimatedMonthlyTraffic?: number;
  freeTelegramConversionRate?: number;
  vipConversionRate?: number;
  suiTokenPriceUsd?: number;
  enableMercadoPago?: boolean;
  mercadoPagoAccessToken?: string;
  mercadoPagoPublicKey?: string;
  mercadoPagoCurrency?: string;
  arsSubscriberPrice?: number;
  mercadoPagoCollectorId?: string;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user" | "system";
  text: string;
  timestamp: string;
  inlineButtons?: { text: string; action: string }[];
  mediaUrl?: string;
  isInviteLink?: boolean;
  showQrCode?: boolean;
  qrData?: string;
}

export interface RepoFile {
  name: string;
  path: string;
  language: string;
  content: string;
  description: string;
}

export interface VideoMotionTemplate {
  id: string;
  title: string;
  category: "dance" | "transition" | "lifestyle" | "fitness" | "runway";
  motionTool: "Kling 3.0" | "Haiper AI" | "Luma Dream Machine" | "Runway Gen-3";
  referenceType: "image-to-video" | "video-to-video" | "motion-brush";
  description: string;
  cameraMovement: string;
  motionStrength: number; // 1 - 10
  klingMotionPrompt: string;
  controlNetGuidance: string;
  musicBpmTarget: number;
  sampleVideoThumbnail: string;
  tips: string[];
}

export interface CharacterConsistencyProfile {
  characterTag: string;
  baseModel: "OpenArt Character Tags" | "Flux.1 LoRA" | "Midjourney v6.1 (--cref)" | "SDXL InstantID/PuLID";
  fixedFeatures: {
    eyeShapeColor: string;
    faceGeometry: string;
    skinTextureDetails: string;
    hairStyleColor: string;
    distinctiveMarks: string;
    bodyProportions: string;
    };
  negativeAnchorTags: string;
  recommendedWeight: number;
}

export interface SubscriberRecord {
  id: string;
  telegramUserId: number | string;
  username: string;
  displayName: string;
  wallet: string;
  txDigest: string;
  tier: "SUI VIP" | "USDC (Sui) VIP" | "Mercado Pago ARS";
  amountPaid: number;
  currency: string;
  paidAt: string; // ISO date
  expiresAt: string; // ISO date
  active: boolean;
  status: "active" | "expiring_soon" | "expired" | "kicked" | "grace_period";
  reminderSent?: boolean;
  kickedAt?: string;
  kickReason?: string;
  lastSimulatedAction?: string;
}

export interface DryRunKickLog {
  id: string;
  timestamp: string;
  subscriberId: string;
  telegramUserId: string | number;
  username: string;
  action: "BAN_CHAT_MEMBER" | "UNBAN_CHAT_MEMBER" | "SEND_EXPIRY_NOTIFICATION" | "DEACTIVATE_DB_RECORD";
  simulatedEndpoint: string;
  payload: Record<string, any>;
  resultStatus: "SIMULATED_SUCCESS" | "SIMULATED_SKIPPED" | "SIMULATED_WARNING";
  details: string;
}

export interface DryRunExecutionSummary {
  runId: string;
  executedAt: string;
  isDryRun: boolean;
  totalSubscribersScanned: number;
  activeCount: number;
  expiredIdentifiedCount: number;
  expiringSoonCount: number;
  simulatedKicksCount: number;
  simulatedNotificationsCount: number;
  actualTelegramApiCallsCount: 0;
  gasCostMist: 0;
  logs: DryRunKickLog[];
}

export interface ModelDatabaseRecord extends AiInfluencer {
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "draft" | "archived" | "vip_ready";
  nicheCategory?: "glamour" | "fitness" | "lifestyle" | "adult_erotic" | "cosplay" | "luxury";
  monetizationModel?: "sui_vip" | "mercadopago_ars" | "hybrid_sui_fiat";
  totalAssetsGenerated?: number;
  isCustomCreated?: boolean;
}

export interface WorkflowStage {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  iconName: string;
  targetTab?: string;
  deliverables: string[];
  checklist: {
    id: string;
    text: string;
    completed: boolean;
    required: boolean;
    quickActionLabel?: string;
    targetTab?: string;
  }[];
  proTips: string[];
}

export interface FaceAssetRecord {
  id: string;
  modelId: string;
  modelName: string;
  assetType: "synthetic_seed" | "custom_upload" | "facial_mask" | "avatar_master" | "rendered_9_16";
  name: string;
  url: string;
  resolution?: string;
  biometricPointsCount?: number;
  characterTagAnchor?: string;
  createdAt: string;
  sourceEngine: "StyleGAN3" | "ThisPersonDoesNotExist" | "InsightFace" | "Flux.1" | "Custom Upload";
  fileSizeKb?: number;
  notes?: string;
}

export interface CloudSyncSnapshot {
  version: string;
  timestamp: string;
  environment: string;
  currentInfluencer: AiInfluencer;
  modelsDatabase: ModelDatabaseRecord[];
  faceAssets: FaceAssetRecord[];
  workflowStages: WorkflowStage[];
  syncStats: {
    totalModels: number;
    totalFaceAssets: number;
    completedChecklistTasks: number;
    cacheSizeBytes: number;
    lastSyncedAt: string;
  };
  metadata?: {
    app: string;
    exportType: "cloud_sync_full_backup";
    generatedBy: string;
  };
}


