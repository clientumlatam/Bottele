import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Coins,
  Bot,
  Terminal,
  Settings,
  ArrowRight,
  Sparkles,
  Server,
  Lock,
  Layers,
  ChevronRight,
} from "lucide-react";

export const SuiTelegramGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"no-code" | "developer">("no-code");
  const [selectedToken, setSelectedToken] = useState<"SUI" | "USDC">("SUI");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Guía Completa de Configuración
              </span>
              <h2 className="text-lg font-bold text-black tracking-tight">
                Bot Automatizado de Suscripciones VIP en Telegram con Sui Blockchain
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500 max-w-3xl">
              Elegí entre la <strong>Opción Sin Código (No-Code)</strong> (usando bots listos y @wallet de Telegram) o la <strong>Opción para Desarrolladores</strong> (bot personalizado en Node.js/TypeScript con verificación automática en la red Sui).
            </p>
          </div>

          {/* Track Switcher */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] p-1 rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => setActiveTab("no-code")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "no-code"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Camino Sin Código</span>
            </button>

            <button
              onClick={() => setActiveTab("developer")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "developer"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Camino Desarrollador</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUI vs USDC on Sui Specs Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setSelectedToken("SUI")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all space-y-2 ${
            selectedToken === "SUI"
              ? "border-black bg-white shadow-sm ring-1 ring-black"
              : "border-[#E5E7EB] bg-white hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-black text-sm">
              <Coins className="h-4 w-4 text-black" />
              Opción 1: Pagos Nativos en SUI
            </span>
            <span className="rounded bg-zinc-100 text-zinc-700 px-2 py-0.5 text-[10px] font-mono font-bold">
              9 Decimales (MIST)
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            La experiencia más rápida y directa. 1 SUI = 1.000.000.000 MIST. Confirmación en menos de 1 segundo (~400ms) con comisiones casi nulas.
          </p>
          <div className="pt-2 text-[11px] font-mono text-zinc-600 border-t border-[#E5E7EB]">
            Precio Recomendado: <strong>10 - 25 SUI / mes</strong>
          </div>
        </div>

        <div
          onClick={() => setSelectedToken("USDC")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all space-y-2 ${
            selectedToken === "USDC"
              ? "border-black bg-white shadow-sm ring-1 ring-black"
              : "border-[#E5E7EB] bg-white hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-black text-sm">
              <Shield className="h-4 w-4 text-black" />
              Opción 2: USDC en Sui (Moneda Estable)
            </span>
            <span className="rounded bg-zinc-100 text-zinc-700 px-2 py-0.5 text-[10px] font-mono font-bold">
              6 Decimales
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Eliminá la volatilidad y cobrá ingresos estables en dólares usando el token oficial de USDC en Sui.
          </p>
          <div className="pt-2 text-[11px] font-mono text-zinc-600 border-t border-[#E5E7EB]">
            Tipo de Moneda: <code>0xdba34672e30cb065b...::usdc::USDC</code>
          </div>
        </div>
      </div>

      {/* TRACK 1: NO-CODE SOLUTION */}
      {activeTab === "no-code" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-6">
            <div>
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                No-Code Fast Track
              </span>
              <h3 className="text-base font-bold text-black mt-2">
                Turn-Key VIP Subscription Setup (No Coding Required)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Deploy your automated Telegram VIP paywall in under 10 minutes using existing subscription bot infrastructure with Sui & crypto rails.
              </p>
            </div>

            {/* 5-Step Visual Steps */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs">
                  1
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-black text-sm">
                    Create Your Telegram Bot in @BotFather
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Open Telegram and search for <strong>@BotFather</strong> (the official Telegram bot manager). Send <code>/newbot</code>, choose a name (e.g. <em>"Valeria Vance VIP Bot"</em>) and a username ending in bot (e.g. <code>@ValeriaVipPayBot</code>). Save the HTTP API Token provided.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs">
                  2
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-black text-sm">
                    Create Private VIP Channel & Assign Admin Permissions
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Create a new <strong>Private Channel</strong> in Telegram where your AI influencer's 4K uncensored photoshoots and daily voice notes will be posted. Go to <strong>Channel Settings &gt; Administrators &gt; Add Administrator</strong> and add your bot. Ensure you grant <strong>"Invite Users via Link"</strong> and <strong>"Ban Users"</strong> permissions so it can manage member lifecycles.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs">
                  3
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-black text-sm">
                    Connect Sui Wallet (Slush Wallet / Telegram @wallet)
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Get a dedicated Sui address from <strong>Slush Wallet</strong> or Telegram's native <strong>@wallet</strong>. In your subscription bot dashboard (such as Telepay or InviteMember with Sui integration), set your destination address. 100% of subscriber payments bypass platform intermediaries and land directly in your wallet.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs">
                  4
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-black text-sm">
                    Configure Monthly Pricing & Auto-Revocation Rules
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Set subscription tier pricing (e.g. <strong>15 SUI or 25 USDC</strong> for 30 days). Enable automated grace period reminders (sent 3 days before expiration) and automatic access removal upon non-renewal.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs">
                  5
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-black text-sm">
                    Embed Bot Link in AI Influencer Social Bios
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Place your bot link (<code>https://t.me/ValeriaVipPayBot</code>) in your AI influencer's Instagram Bio, TikTok Linktree, and free Telegram teaser channel. When traffic clicks, the bot greets them and guides them through 1-click checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACK 2: DEVELOPER-FOCUSED ARCHITECTURE */}
      {activeTab === "developer" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-6">
            <div>
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Developer Blueprint
              </span>
              <h3 className="text-base font-bold text-black mt-2">
                Telegram Bot API + Sui Payment Kit Standard & Telegraf
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Full programmatic control with sub-second RPC verification, dynamic single-use invite links (<code>createChatInviteLink</code> with <code>member_limit: 1</code>), and automated cron-based access revoking.
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-black" /> 1. Telegram Controller
                </span>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Built on <strong>Telegraf 4.x</strong>. Handles <code>/start</code>, interactive inline keyboards, DM payment flows, and single-use invite generation.
                </p>
              </div>

              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-black" /> 2. Sui RPC Verifier
                </span>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Uses <strong>@mysten/sui/client</strong>. Queries Sui fullnode RPC (<code>queryTransactionBlocks</code> & <code>getTransactionBlock</code>) to confirm balances & digests.
                </p>
              </div>

              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <Server className="h-4 w-4 text-black" /> 3. Expiration Daemon
                </span>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Hourly <strong>node-cron</strong> scheduler. Automatically revokes access via <code>banChatMember</code> and <code>unbanChatMember</code> when 30 days elapse.
                </p>
              </div>
            </div>

            {/* Code Snippets Accordion */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-black text-xs uppercase tracking-wider">
                Core Implementation Snippets
              </h4>

              {/* Snippet 1: Dynamic Single-Use Invite Link Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black font-mono">
                    // 1. Generate 1-Time Single-Use Invite Link (5 min expiration)
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `const inviteLink = await ctx.telegram.createChatInviteLink(VIP_CHANNEL_ID, {\n  expire_date: Math.floor(Date.now() / 1000) + 300, // 5 minutes\n  member_limit: 1, // Only 1 user can join with this link\n  name: \`VIP-\${ctx.from.id}-\${Date.now()}\`,\n});`,
                        "snip-1"
                      )
                    }
                    className="font-semibold text-black hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === "snip-1" ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 text-zinc-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-[#E5E7EB]">
{`const inviteLink = await ctx.telegram.createChatInviteLink(VIP_CHANNEL_ID, {
  expire_date: Math.floor(Date.now() / 1000) + 300, // 5 minutes validity
  member_limit: 1, // Prevents link sharing (1-time use only)
  name: \`VIP-\${ctx.from.id}-\${Date.now()}\`,
});`}
                </pre>
              </div>

              {/* Snippet 2: Sui RPC Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black font-mono">
                    // 2. Verify Sui Transaction Block with @mysten/sui
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';\nconst client = new SuiClient({ url: getFullnodeUrl('mainnet') });\n\nexport async function checkPayment(txDigest, expectedMist, targetAddress) {\n  const tx = await client.getTransactionBlock({\n    digest: txDigest,\n    options: { showBalanceChanges: true, showEffects: true },\n  });\n  const isSuccess = tx.effects?.status?.status === 'success';\n  const adminChange = tx.balanceChanges?.find((b) => b.owner?.AddressOwner?.toLowerCase() === targetAddress.toLowerCase());\n  return isSuccess && adminChange && BigInt(adminChange.amount) >= BigInt(expectedMist);\n}`,
                        "snip-2"
                      )
                    }
                    className="font-semibold text-black hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === "snip-2" ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 text-zinc-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-[#E5E7EB]">
{`import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

export async function checkPayment(txDigest, expectedMist, targetAddress) {
  const tx = await client.getTransactionBlock({
    digest: txDigest,
    options: { showBalanceChanges: true, showEffects: true },
  });

  const isSuccess = tx.effects?.status?.status === 'success';
  const adminChange = tx.balanceChanges?.find(
    (b) => b.owner?.AddressOwner?.toLowerCase() === targetAddress.toLowerCase()
  );

  return isSuccess && adminChange && BigInt(adminChange.amount) >= BigInt(expectedMist);
}`}
                </pre>
              </div>

              {/* Snippet 3: Automated Member Revocation Cron */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black font-mono">
                    // 3. Automated Access Revocation on 30-Day Expiration
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `cron.schedule('0 * * * *', async () => {\n  const expired = db.getExpiredSubscribers();\n  for (const sub of expired) {\n    await bot.telegram.banChatMember(VIP_CHANNEL_ID, sub.telegramUserId);\n    await bot.telegram.unbanChatMember(VIP_CHANNEL_ID, sub.telegramUserId); // Unban so they can rejoin on renewal\n    await bot.telegram.sendMessage(sub.telegramUserId, '⏰ Tu suscripción VIP ha vencido. Renueva con /start');\n    db.deactivateSubscriber(sub.telegramUserId);\n  }\n});`,
                        "snip-3"
                      )
                    }
                    className="font-semibold text-black hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === "snip-3" ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 text-zinc-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-[#E5E7EB]">
{`cron.schedule('0 * * * *', async () => {
  const expired = db.getExpiredSubscribers();
  for (const sub of expired) {
    // Remove expired user from VIP channel
    await bot.telegram.banChatMember(VIP_CHANNEL_ID, sub.telegramUserId);
    await bot.telegram.unbanChatMember(VIP_CHANNEL_ID, sub.telegramUserId); // Unban so user can rejoin upon renewal
    
    // Notify in DM
    await bot.telegram.sendMessage(
      sub.telegramUserId,
      '⏰ Tu pase VIP ha vencido. Renueva con /start para mantener tu acceso.'
    );
    db.deactivateSubscriber(sub.telegramUserId);
  }
});`}
                </pre>
              </div>
            </div>

            {/* Quick Terminal Deployment */}
            <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-xs">
                  Quick Cloud / VPS Deployment Commands
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      "git clone https://github.com/your-repo/sui-telegram-paybot.git\ncd sui-telegram-paybot\nnpm install\ncp .env.example .env\nnpm start",
                      "cli-commands"
                    )
                  }
                  className="text-black hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedSection === "cli-commands" ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" /> Copied CLI
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy CLI
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 bg-zinc-950 text-zinc-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
{`# 1. Clone Paybot Repo
git clone https://github.com/your-username/sui-telegram-paybot.git
cd sui-telegram-paybot

# 2. Install dependencies (@mysten/sui, telegraf, node-cron)
npm install

# 3. Configure secrets
cp .env.example .env
nano .env # Set TELEGRAM_BOT_TOKEN, VIP_CHANNEL_ID, ADMIN_SUI_WALLET

# 4. Start Production Server
npm start`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
