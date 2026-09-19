import { AiInfluencer, PaybotConfig } from "../types";

export interface ServerBootstrapExport {
  schemaVersion: string;
  exportedAt: string;
  influencer: {
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
    voiceProfile?: any;
    recommendedPricing: {
      sui: number;
      usdc: number;
      tierName: string;
    };
    contentPillars: string[];
    promptPresets: Array<{
      scene: string;
      prompt: string;
      klingMotion: string;
    }>;
  };
  botSettings: PaybotConfig;
  envVars: Record<string, string>;
  quickStartInstructions: {
    deploymentCommand: string;
    steps: string[];
  };
}

export function exportServerBootstrapJson(
  influencer: AiInfluencer,
  paybotConfig: PaybotConfig
): void {
  const exportData: ServerBootstrapExport = {
    schemaVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    influencer: {
      id: influencer.id,
      name: influencer.name,
      handle: influencer.handle,
      age: influencer.age,
      nationality: influencer.nationality,
      vibe: influencer.vibe,
      bio: influencer.bio,
      avatarUrl: influencer.avatarUrl,
      facialCharacteristics: influencer.facialCharacteristics,
      characterTags: influencer.characterTags,
      voiceProfile: influencer.voiceProfile,
      recommendedPricing: influencer.recommendedPricing,
      contentPillars: influencer.contentPillars || [],
      promptPresets: influencer.promptPresets || [],
    },
    botSettings: paybotConfig,
    envVars: {
      TELEGRAM_BOT_TOKEN: paybotConfig.telegramBotToken,
      VIP_CHANNEL_ID: paybotConfig.vipChannelId,
      ADMIN_SUI_WALLET: paybotConfig.adminSuiWallet,
      SUI_RPC_URL: paybotConfig.suiRpcUrl,
      SUBSCRIBER_PRICE: String(paybotConfig.subscriberPrice),
      PAYMENT_TOKEN: paybotConfig.tokenType,
      INVITE_LINK_EXPIRE_SECONDS: String((paybotConfig.inviteLinkExpirationMinutes || 5) * 60),
      SUBSCRIPTION_DAYS: String(paybotConfig.subscriptionDurationDays || 30),
      ENABLE_AUTO_KICK_CRON: String(paybotConfig.enableAutoKickCron),
      INFLUENCER_ID: influencer.id,
      INFLUENCER_NAME: influencer.name,
      CHARACTER_TAGS: influencer.characterTags,
      ELEVENLABS_VOICE_ID: influencer.voiceProfile?.elevenLabsVoiceId || "21m00Tcm4TlvDq8ikWAM",
      EDGE_TTS_VOICE: influencer.voiceProfile?.edgeTtsVoice || "es-AR-ElenaNeural",
      VOICE_STABILITY: String(influencer.voiceProfile?.stability || 0.42),
      VOICE_SIMILARITY: String(influencer.voiceProfile?.similarityBoost || 0.88),
    },
    quickStartInstructions: {
      deploymentCommand: "npm install && npm start",
      steps: [
        "1. Create your Telegram Bot with @BotFather and set TELEGRAM_BOT_TOKEN.",
        "2. Create your private Telegram Channel, add your bot as Admin with invite link permissions, and get VIP_CHANNEL_ID.",
        "3. Set your SUI wallet address as ADMIN_SUI_WALLET.",
        "4. Save this JSON file into your server config directory or load envVars into your .env file.",
        "5. Run `npm start` or deploy to Railway / Render / Hetzner VPS."
      ]
    }
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const filename = `telesui-config-${influencer.id.toLowerCase().replace(/[^a-z0-9]/g, "_")}-${new Date().toISOString().slice(0, 10)}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
