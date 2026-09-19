import React, { useState } from "react";
import { PaybotConfig, AiInfluencer } from "../types";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Terminal, 
  Rocket, 
  Server, 
  ShieldCheck, 
  ExternalLink, 
  Code2, 
  RefreshCw,
  Zap,
  Sliders
} from "lucide-react";

interface DeploymentReadinessChecklistProps {
  paybotConfig: PaybotConfig;
  influencer?: AiInfluencer;
}

export const DeploymentReadinessChecklist: React.FC<DeploymentReadinessChecklistProps> = ({
  paybotConfig,
  influencer,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<"railway" | "docker" | "systemd_pm2" | "bash">("bash");

  // Check each required variable
  const tokenValid = Boolean(
    paybotConfig.telegramBotToken &&
    paybotConfig.telegramBotToken.includes(":") &&
    !paybotConfig.telegramBotToken.includes("YOUR_")
  );

  const channelValid = Boolean(
    paybotConfig.vipChannelId &&
    (paybotConfig.vipChannelId.startsWith("-100") || paybotConfig.vipChannelId.startsWith("-"))
  );

  const walletValid = Boolean(
    paybotConfig.adminSuiWallet &&
    paybotConfig.adminSuiWallet.startsWith("0x") &&
    paybotConfig.adminSuiWallet.length >= 20
  );

  const rpcValid = Boolean(
    paybotConfig.suiRpcUrl &&
    paybotConfig.suiRpcUrl.startsWith("http")
  );

  const priceValid = Number(paybotConfig.subscriberPrice) > 0;

  const mpEnabled = Boolean(paybotConfig.enableMercadoPago);
  const mpAccessTokenValid = !mpEnabled || Boolean(
    paybotConfig.mercadoPagoAccessToken &&
    paybotConfig.mercadoPagoAccessToken.length > 10 &&
    !paybotConfig.mercadoPagoAccessToken.includes("YOUR_")
  );

  const mpPublicKeyValid = !mpEnabled || Boolean(
    paybotConfig.mercadoPagoPublicKey &&
    paybotConfig.mercadoPagoPublicKey.length > 5
  );

  const mpPriceValid = !mpEnabled || Number(paybotConfig.arsSubscriberPrice) > 0;

  const checklistItems = [
    {
      key: "TELEGRAM_BOT_TOKEN",
      label: "Telegram Bot Token",
      value: paybotConfig.telegramBotToken ? `${paybotConfig.telegramBotToken.slice(0, 10)}...` : "No configurado",
      isReady: tokenValid,
      category: "Core Telegram",
      hint: "Debe ser obtenido en @BotFather (ej. 7891234567:AAFx...)",
    },
    {
      key: "VIP_CHANNEL_ID",
      label: "Telegram VIP Channel ID",
      value: paybotConfig.vipChannelId || "No configurado",
      isReady: channelValid,
      category: "Core Telegram",
      hint: "Debe empezar con -100 (ej. -1002345678901)",
    },
    {
      key: "ADMIN_SUI_WALLET",
      label: "SUI Admin Recipient Wallet",
      value: paybotConfig.adminSuiWallet ? `${paybotConfig.adminSuiWallet.slice(0, 10)}...${paybotConfig.adminSuiWallet.slice(-6)}` : "No configurado",
      isReady: walletValid,
      category: "Sui Blockchain",
      hint: "Dirección hexadecimal SUI 0x... receptora de pagos",
    },
    {
      key: "SUI_RPC_URL",
      label: "SUI RPC Endpoint",
      value: paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443",
      isReady: rpcValid,
      category: "Sui Blockchain",
      hint: "Endpoint RPC Mainnet / Testnet activo",
    },
    {
      key: "SUBSCRIBER_PRICE",
      label: `Precio ${paybotConfig.tokenType || "SUI"}`,
      value: `${paybotConfig.subscriberPrice} ${paybotConfig.tokenType || "SUI"}`,
      isReady: priceValid,
      category: "Pricing & Billing",
      hint: "Monto requerido para habilitar invitación VIP",
    },
    {
      key: "MERCADO_PAGO_CONFIG",
      label: "Mercado Pago Fiat (ARS)",
      value: mpEnabled 
        ? (mpAccessTokenValid && mpPublicKeyValid ? `$${paybotConfig.arsSubscriberPrice?.toLocaleString()} ARS (Activo)` : "Credenciales incompletas")
        : "Opcional / Deshabilitado",
      isReady: !mpEnabled || (mpAccessTokenValid && mpPublicKeyValid && mpPriceValid),
      isOptional: !mpEnabled,
      category: "Fiat Payment Gateway",
      hint: mpEnabled ? "Access Token & Public Key verificados" : "Activá Mercado Pago si deseás cobrar en pesos argentinos",
    },
  ];

  const totalRequired = checklistItems.filter(i => !i.isOptional).length;
  const readyCount = checklistItems.filter(i => i.isReady && !i.isOptional).length;
  const readinessPercent = Math.round((readyCount / totalRequired) * 100);
  const isFullyReady = readinessPercent === 100;

  // Generate full .env text
  const generateEnvFileText = () => {
    return `# ========================================================
# SUI & MERCADO PAGO TELEGRAM PAYBOT - PRODUCTION ENV
# Generated: ${new Date().toISOString()}
# Influencer: ${influencer?.name || "VIP Model"}
# ========================================================

# Telegram Bot API Credentials
TELEGRAM_BOT_TOKEN=${paybotConfig.telegramBotToken || "YOUR_TELEGRAM_BOT_TOKEN"}
VIP_CHANNEL_ID=${paybotConfig.vipChannelId || "-1001234567890"}

# Sui Network Configuration
ADMIN_SUI_WALLET=${paybotConfig.adminSuiWallet || "0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b"}
SUI_RPC_URL=${paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443"}
TOKEN_TYPE=${paybotConfig.tokenType || "SUI"}
SUBSCRIBER_PRICE=${paybotConfig.subscriberPrice || 12}

# Subscription Rules
INVITE_LINK_EXPIRATION_MINUTES=${paybotConfig.inviteLinkExpirationMinutes || 15}
SUBSCRIPTION_DURATION_DAYS=${paybotConfig.subscriptionDurationDays || 30}
ENABLE_AUTO_KICK_CRON=${paybotConfig.enableAutoKickCron ? "true" : "false"}

# Mercado Pago Integration (ARS Fiat Payments)
ENABLE_MERCADO_PAGO=${paybotConfig.enableMercadoPago ? "true" : "false"}
MERCADO_PAGO_ACCESS_TOKEN=${paybotConfig.mercadoPagoAccessToken || ""}
MERCADO_PAGO_PUBLIC_KEY=${paybotConfig.mercadoPagoPublicKey || ""}
MERCADO_PAGO_COLLECTOR_ID=${paybotConfig.mercadoPagoCollectorId || ""}
MERCADO_PAGO_CURRENCY=${paybotConfig.mercadoPagoCurrency || "ARS"}
ARS_SUBSCRIBER_PRICE=${paybotConfig.arsSubscriberPrice || 18500}

# Server Environment
PORT=3000
NODE_ENV=production
`;
  };

  // Generate Deployment Script according to target
  const generateDeploymentScript = () => {
    switch (selectedTarget) {
      case "railway":
        return `#!/usr/bin/env bash
# ==============================================================================
# RAILWAY ONE-CLICK INITIALIZATION SCRIPT
# ==============================================================================
set -e

echo "🚀 Initializing Sui Paybot Deployment on Railway..."

# 1. Install Railway CLI if not present
if ! command -v railway &> /dev/null; then
  echo "📦 Installing Railway CLI via npm..."
  npm install -g @railway/cli
fi

# 2. Login & Link Project
echo "🔑 Logging into Railway..."
railway login

# 3. Create or Link Project
echo "📂 Initializing Railway Project..."
railway init -n "sui-telegram-paybot"

# 4. Set Environment Variables
echo "⚙️ Setting production environment variables..."
railway variables set TELEGRAM_BOT_TOKEN="${paybotConfig.telegramBotToken || "YOUR_BOT_TOKEN"}" \\
  VIP_CHANNEL_ID="${paybotConfig.vipChannelId || "-1001234567890"}" \\
  ADMIN_SUI_WALLET="${paybotConfig.adminSuiWallet || "0x..."}" \\
  SUI_RPC_URL="${paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443"}" \\
  TOKEN_TYPE="${paybotConfig.tokenType || "SUI"}" \\
  SUBSCRIBER_PRICE="${paybotConfig.subscriberPrice || 12}" \\
  SUBSCRIPTION_DURATION_DAYS="${paybotConfig.subscriptionDurationDays || 30}" \\
  ENABLE_AUTO_KICK_CRON="${paybotConfig.enableAutoKickCron ? "true" : "false"}" \\
  ENABLE_MERCADO_PAGO="${paybotConfig.enableMercadoPago ? "true" : "false"}" \\
  MERCADO_PAGO_ACCESS_TOKEN="${paybotConfig.mercadoPagoAccessToken || ""}" \\
  MERCADO_PAGO_PUBLIC_KEY="${paybotConfig.mercadoPagoPublicKey || ""}" \\
  ARS_SUBSCRIBER_PRICE="${paybotConfig.arsSubscriberPrice || 18500}" \\
  PORT="3000" \\
  NODE_ENV="production"

# 5. Deploy App
echo "🚢 Deploying application to Railway..."
railway up --detach

echo "✅ Server successfully deployed! Checking status..."
railway status
`;

      case "docker":
        return `#!/usr/bin/env bash
# ==============================================================================
# DOCKER CONTAINER BUILD & RUN SCRIPT
# ==============================================================================
set -e

echo "🐳 Building Sui Paybot Docker Image..."
docker build -t sui-telegram-paybot:latest .

echo "🛑 Stopping existing container if running..."
docker rm -f sui-paybot-instance 2>/dev/null || true

echo "🚀 Launching Production Docker Container on port 3000..."
docker run -d \\
  --name sui-paybot-instance \\
  --restart always \\
  -p 3000:3000 \\
  -e TELEGRAM_BOT_TOKEN="${paybotConfig.telegramBotToken || "YOUR_BOT_TOKEN"}" \\
  -e VIP_CHANNEL_ID="${paybotConfig.vipChannelId || "-1001234567890"}" \\
  -e ADMIN_SUI_WALLET="${paybotConfig.adminSuiWallet || "0x..."}" \\
  -e SUI_RPC_URL="${paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443"}" \\
  -e TOKEN_TYPE="${paybotConfig.tokenType || "SUI"}" \\
  -e SUBSCRIBER_PRICE="${paybotConfig.subscriberPrice || 12}" \\
  -e ENABLE_MERCADO_PAGO="${paybotConfig.enableMercadoPago ? "true" : "false"}" \\
  -e MERCADO_PAGO_ACCESS_TOKEN="${paybotConfig.mercadoPagoAccessToken || ""}" \\
  -e MERCADO_PAGO_PUBLIC_KEY="${paybotConfig.mercadoPagoPublicKey || ""}" \\
  -e ARS_SUBSCRIBER_PRICE="${paybotConfig.arsSubscriberPrice || 18500}" \\
  -e PORT="3000" \\
  -e NODE_ENV="production" \\
  sui-telegram-paybot:latest

echo "✅ Container is running in background. Inspect logs with: docker logs -f sui-paybot-instance"
`;

      case "systemd_pm2":
        return `#!/usr/bin/env bash
# ==============================================================================
# VPS / UBUNTU PM2 SERVER INITIALIZATION SCRIPT
# ==============================================================================
set -e

echo "⚡ Initializing Node.js Paybot Server with PM2..."

# 1. Update packages & install Node.js 20+
sudo apt update -y
sudo apt install -y curl git build-essential

# 2. Install PM2 process manager
npm install -g pm2 tsx typescript

# 3. Install repo dependencies
npm install --production

# 4. Build application
npm run build

# 5. Start PM2 cluster with automatic restarts
pm2 start dist/server.cjs --name "sui-paybot" --time --max-memory-restart 300M

# 6. Save startup configuration for system reboots
pm2 save
pm2 startup

echo "✅ Server started under PM2! Status:"
pm2 status
`;

      case "bash":
      default:
        return `#!/usr/bin/env bash
# ==============================================================================
# SUI & MERCADO PAGO TELEGRAM PAYBOT - SERVER INITIALIZATION
# Generated for: ${influencer?.name || "VIP Model"}
# ==============================================================================
set -e

echo "🚀 ===================================================="
echo "🚀 SUI TELEGRAM PAYBOT - PRODUCTION SERVER STARTUP"
echo "🚀 ===================================================="

# 1. Verify Node.js version
NODE_VERSION=$(node -v 2>/dev/null || echo "not_found")
if [ "$NODE_VERSION" = "not_found" ]; then
  echo "❌ Error: Node.js is not installed. Please install Node.js 18+."
  exit 1
fi
echo "✅ Node.js Version: $NODE_VERSION"

# 2. Write .env configuration file
echo "📝 Writing production .env configuration..."
cat << 'EOF' > .env
TELEGRAM_BOT_TOKEN=${paybotConfig.telegramBotToken || "YOUR_TELEGRAM_BOT_TOKEN"}
VIP_CHANNEL_ID=${paybotConfig.vipChannelId || "-1001234567890"}
ADMIN_SUI_WALLET=${paybotConfig.adminSuiWallet || "0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b"}
SUI_RPC_URL=${paybotConfig.suiRpcUrl || "https://fullnode.mainnet.sui.io:443"}
TOKEN_TYPE=${paybotConfig.tokenType || "SUI"}
SUBSCRIBER_PRICE=${paybotConfig.subscriberPrice || 12}
INVITE_LINK_EXPIRATION_MINUTES=${paybotConfig.inviteLinkExpirationMinutes || 15}
SUBSCRIPTION_DURATION_DAYS=${paybotConfig.subscriptionDurationDays || 30}
ENABLE_AUTO_KICK_CRON=${paybotConfig.enableAutoKickCron ? "true" : "false"}
ENABLE_MERCADO_PAGO=${paybotConfig.enableMercadoPago ? "true" : "false"}
MERCADO_PAGO_ACCESS_TOKEN=${paybotConfig.mercadoPagoAccessToken || ""}
MERCADO_PAGO_PUBLIC_KEY=${paybotConfig.mercadoPagoPublicKey || ""}
MERCADO_PAGO_COLLECTOR_ID=${paybotConfig.mercadoPagoCollectorId || ""}
MERCADO_PAGO_CURRENCY=${paybotConfig.mercadoPagoCurrency || "ARS"}
ARS_SUBSCRIBER_PRICE=${paybotConfig.arsSubscriberPrice || 18500}
PORT=3000
NODE_ENV=production
EOF

# 3. Install production dependencies
echo "📦 Installing npm dependencies..."
npm install --silent

# 4. Build TypeScript / Vite production bundle
echo "🔨 Compiling server and client artifacts..."
npm run build

# 5. Start Server
echo "⚡ Starting Sui Paybot Server on port 3000..."
echo "🤖 Telegram Bot listener & Sui RPC transaction poller active."
node dist/server.cjs
`;
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateDeploymentScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(generateEnvFileText());
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-white p-5 shadow-sm space-y-5">
      {/* Header & Overall Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-sm">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-indigo-950 tracking-tight">
                Lista de Verificación de Despliegue (`Deployment Readiness`)
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                isFullyReady
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}>
                {readinessPercent}% Listo para Producción
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Valida que todas las variables de entorno de Telegram, Sui Blockchain y Mercado Pago estén configuradas antes de lanzar a producción.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-copy-env-file"
            onClick={handleCopyEnv}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-50 transition-all shadow-2xs"
          >
            {copiedEnv ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span>¡.env Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-indigo-600" />
                <span>Copiar Archivo .env</span>
              </>
            )}
          </button>

          <button
            id="btn-copy-deployment-script"
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
          >
            {copiedScript ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-300" />
                <span>¡Script Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Terminal className="h-3.5 w-3.5 text-white" />
                <span>Copiar Script de Despliegue</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {checklistItems.map((item) => (
          <div
            key={item.key}
            className={`rounded-xl border p-3 flex items-start gap-3 transition-all ${
              item.isReady
                ? "border-green-200 bg-green-50/40"
                : item.isOptional
                ? "border-zinc-200 bg-zinc-50/50"
                : "border-rose-200 bg-rose-50/50"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.isReady ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : item.isOptional ? (
                <AlertTriangle className="h-4 w-4 text-zinc-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-zinc-900 truncate">
                  {item.label}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white border border-zinc-200 text-zinc-500 shrink-0">
                  {item.category}
                </span>
              </div>

              <p className="font-mono text-[11px] font-semibold text-zinc-700 truncate mt-0.5">
                {item.value}
              </p>

              <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                {item.hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Deployment Target Switcher & Preview */}
      <div className="rounded-xl border border-indigo-200 bg-white p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold text-zinc-900">
              Seleccionar Entorno de Despliegue (Target):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedTarget("bash")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedTarget === "bash"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Bash Script (.sh)
            </button>
            <button
              onClick={() => setSelectedTarget("railway")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedTarget === "railway"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Railway CLI
            </button>
            <button
              onClick={() => setSelectedTarget("docker")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedTarget === "docker"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Docker Run
            </button>
            <button
              onClick={() => setSelectedTarget("systemd_pm2")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedTarget === "systemd_pm2"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Ubuntu VPS / PM2
            </button>
          </div>
        </div>

        {/* Script Code Viewer */}
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] bg-zinc-900 text-zinc-400 px-3 py-1.5 rounded-t-xl border-x border-t border-zinc-800">
            <span className="font-mono flex items-center gap-1.5 text-zinc-300">
              <Terminal className="h-3 w-3 text-indigo-400" />
              deploy-{selectedTarget}.sh
            </span>
            <button
              onClick={handleCopyScript}
              className="text-indigo-300 hover:text-white font-bold flex items-center gap-1"
            >
              {copiedScript ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedScript ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <pre className="rounded-b-xl bg-zinc-950 p-3.5 font-mono text-[11px] text-indigo-300 overflow-x-auto max-h-56 border border-zinc-800 leading-relaxed">
            {generateDeploymentScript()}
          </pre>
        </div>
      </div>
    </div>
  );
};
