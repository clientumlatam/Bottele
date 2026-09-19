import React, { useState, useRef, useEffect } from "react";
import { AiInfluencer, PaybotConfig, ChatMessage } from "../types";
import { InlineKeyboardDesigner, InlineButtonConfig } from "./InlineKeyboardDesigner";
import { Send, CheckCircle2, Shield, RefreshCw, Copy, Check, Lock, Sparkles, ExternalLink, ArrowLeft, Heart, Image as ImageIcon, QrCode, X, Volume2, Pause, Play, Loader2, Bookmark, Plus, Trash2, Download, Share2, Link } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

interface TelegramBotSimulatorProps {
  influencer: AiInfluencer;
  paybotConfig: PaybotConfig;
}

export const TelegramBotSimulator: React.FC<TelegramBotSimulatorProps> = ({
  influencer,
  paybotConfig,
}) => {
  const [currentView, setCurrentView] = useState<"bot-chat" | "vip-channel">("bot-chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sessionStep, setSessionStep] = useState<"IDLE" | "AWAITING_WALLET" | "VERIFYING" | "PAID">("IDLE");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrType, setQrType] = useState<"invite" | "wallet">("invite");
  const [qrFormat, setQrFormat] = useState<"raw" | "uri">("raw");
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cleanHandle = (influencer.handle || "influencer").replace(/^@/, "");
  const defaultInviteLink = paybotConfig.vipChannelLink || `https://t.me/${cleanHandle}_bot?start=vip_onboard`;
  const [customInviteLink, setCustomInviteLink] = useState(defaultInviteLink);

  // Template Manager State
  interface MessageTemplate {
    id: string;
    title: string;
    category: "Bienvenida" | "Promoción VIP" | "Recordatorio de Pago";
    content: string;
  }

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "t1",
      title: "Bienvenida VIP Estándar",
      category: "Bienvenida",
      content: `👋 ¡Hola! Bienvenido al canal VIP exclusivo de **${influencer.name}**.\n\n👑 **Acceso Exclusivo:** Galerías 4K sin censura, notas de voz personalizadas y chat privado diario.`
    },
    {
      id: "t2",
      title: "Promoción Flash SUI (-50%)",
      category: "Promoción VIP",
      content: `🔥 **OFERTA FLASH 24HS** 🔥\n\nEntrá al canal VIP de ${influencer.name} por solo \`7.5 SUI\` (precio rebajado por tiempo limitado). ¡No te lo pierdas!`
    },
    {
      id: "t3",
      title: "Recordatorio de Renovación SUI",
      category: "Recordatorio de Pago",
      content: `⚠️ Tu membresía VIP de ${influencer.name} vence en 24 horas. Renová enviando SUI a la billetera oficial para mantener tu acceso sin interrupciones.`
    }
  ]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Bienvenida" | "Promoción VIP" | "Recordatorio de Pago">("Bienvenida");
  const [newContent, setNewContent] = useState("");

  const handleSaveTemplate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const item: MessageTemplate = {
      id: `tmpl-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim()
    };
    setTemplates(prev => [item, ...prev]);
    setNewTitle("");
    setNewContent("");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleInsertTemplate = (content: string) => {
    setInputText(content);
    setShowTemplateModal(false);
  };

  const playTTSVoice = async (text: string, msgId: string) => {
    if (activeAudioId === msgId) {
      if (audioRef.current) audioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setActiveAudioId(null);
      return;
    }

    setLoadingAudioId(msgId);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const voiceId = influencer.voiceProfile?.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM';
    const apiKey = localStorage.getItem('API_KEY_ELEVENLABS') || '';

    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-elevenlabs-key': apiKey,
        },
        body: JSON.stringify({
          text,
          voiceId
        })
      });

      if (!response.ok) {
        let errMsg = 'ElevenLabs proxy error';
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setActiveAudioId(null);
      audio.onerror = () => fallbackBrowserVoice(text, msgId);

      await audio.play();
      setActiveAudioId(msgId);
    } catch (err) {
      console.log("ElevenLabs TTS local fallback active:", err);
      fallbackBrowserVoice(text, msgId);
    } finally {
      setLoadingAudioId(null);
    }
  };

  const fallbackBrowserVoice = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.onend = () => setActiveAudioId(null);
      utterance.onerror = () => setActiveAudioId(null);
      setActiveAudioId(msgId);
      window.speechSynthesis.speak(utterance);
    } else {
      setActiveAudioId(null);
    }
  };

  // Custom Inline Buttons State for InlineKeyboardDesigner
  const [customInlineButtons, setCustomInlineButtons] = useState<InlineButtonConfig[]>([
    { id: "b1", text: "🇦🇷 Pagar con Mercado Pago (ARS)", action: "PAY_MERCADOPAGO", category: "payment" },
    { id: "b2", text: "📱 Ver Código QR de Invitación / Pago", action: "SHOW_QR", category: "payment" },
    { id: "b3", text: "💳 Copiar Dirección SUI", action: "COPY_WALLET", category: "payment" },
    { id: "b4", text: "✅ Ya pagué con SUI, verificar", action: "START_VERIFY", category: "vip" },
    { id: "b5", text: "ℹ️ Estado de Suscripción", action: "CHECK_STATUS", category: "info" },
  ]);

  const price = paybotConfig.subscriberPrice || influencer.recommendedPricing.sui;
  const token = paybotConfig.tokenType || "SUI";
  const adminWallet = paybotConfig.adminSuiWallet || "0x7a8b6c4d5e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b";
  const currentQrValue = qrType === "invite" 
    ? customInviteLink 
    : (qrFormat === "uri" ? `sui:${adminWallet}?amount=${price}` : adminWallet);

  const arsPrice = paybotConfig.arsSubscriberPrice || 18500;

  // Initialize bot with welcome message
  const initBot = () => {
    setSessionStep("IDLE");
    setCurrentView("bot-chat");
    setShowQrModal(false);
    setMessages([
      {
        id: "msg-1",
        sender: "bot",
        text: `👋 ¡Hola! Bienvenido al canal VIP exclusivo de **${influencer.name}**.\n\n` +
          `👑 **Acceso Exclusivo:** Galerías 4K sin censura, notas de voz personalizadas y chat privado diario.\n\n` +
          `💎 **Membresía Mensual Web3:** \`${price} ${token}\` (30 días de acceso)\n` +
          `🇦🇷 **Membresía Mercado Pago:** \`$${arsPrice.toLocaleString("es-AR")} ARS/mes\`\n` +
          `⚡ **Red:** Sui Blockchain & Mercado Pago Webhook Instantáneo\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📍 **Dirección oficial SUI:**\n` +
          `\`${adminWallet}\`\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `Elegí tu método de pago favorito abajo:`,
        timestamp: "Just now",
        mediaUrl: influencer.avatarUrl,
        inlineButtons: customInlineButtons.map((b) => ({ text: b.text, action: b.action })),
      },
    ]);
  };

  useEffect(() => {
    initBot();
  }, [influencer, paybotConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(adminWallet);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(customInviteLink);
    setCopiedInviteLink(true);
    setTimeout(() => setCopiedInviteLink(false), 2000);
  };

  const downloadQrCode = (targetId: string, filenameLabel: string) => {
    setIsDownloadingQr(true);
    try {
      const svgElement = document.getElementById(targetId) as unknown as SVGElement | null;
      if (!svgElement) {
        setIsDownloadingQr(false);
        return;
      }

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const canvasWidth = 600;
        const canvasHeight = 720;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (ctx) {
          // Background
          ctx.fillStyle = "#0e1621";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          // Top Header Banner
          ctx.fillStyle = "#2b5278";
          ctx.fillRect(0, 0, canvasWidth, 100);

          // Header Text
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`👑 ${influencer.name} • Telegram VIP`, canvasWidth / 2, 48);

          ctx.fillStyle = "#93c5fd";
          ctx.font = "15px sans-serif";
          ctx.fillText(
            qrType === "invite" ? "Escanea el código QR para unirte al canal VIP" : `Paga ${price} ${token} para acceso instantáneo`,
            canvasWidth / 2,
            80
          );

          // QR Card Background
          ctx.fillStyle = "#ffffff";
          if (ctx.roundRect) {
            ctx.roundRect(80, 130, 440, 440, 24);
          } else {
            ctx.rect(80, 130, 440, 440);
          }
          ctx.fill();

          // Render QR
          ctx.drawImage(image, 110, 160, 380, 380);

          // Bottom Info
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px monospace";
          const subText = qrType === "invite" ? customInviteLink : `${adminWallet.slice(0, 16)}...${adminWallet.slice(-10)}`;
          ctx.fillText(subText, canvasWidth / 2, 610);

          ctx.fillStyle = "#94a3b8";
          ctx.font = "13px sans-serif";
          ctx.fillText("TeleSui AI Influencer Studio • Onboarding Automatizado", canvasWidth / 2, 650);

          // Download PNG
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.download = `${influencer.name.replace(/[^a-zA-Z0-9]/g, "_")}_${filenameLabel}.png`;
          a.href = pngUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setIsDownloadingQr(false);
      };
      image.src = blobURL;
    } catch (err) {
      console.error("Failed to download QR code:", err);
      setIsDownloadingQr(false);
    }
  };

  const handleButtonClick = (action: string) => {
    if (action === "COPY_WALLET") {
      handleCopyWallet();
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `📋 Dirección SUI copiada: \`${adminWallet.slice(0, 10)}...${adminWallet.slice(-6)}\``,
          timestamp: "Just now",
        },
      ]);
    } else if (action === "PAY_MERCADOPAGO") {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text: `🇦🇷 **PAGO CON MERCADO PAGO ARGENTINA** 💙\n\n` +
            `• **Monto:** $${arsPrice.toLocaleString("es-AR")} ARS\n` +
            `• **Alias / CVU:** \`influencer.vip.mp\`\n` +
            `• **Métodos:** Tarjeta de Débito/Crédito, Dinero en cuenta MP o Mercado Crédito.\n\n` +
            `Hacé clic en el enlace para abrir Checkout Pro o presioná «Simular Webhook de Pago Aprobado» para probar la verificación automática:`,
          timestamp: "Just now",
          inlineButtons: [
            { text: "🔗 Enlace de Checkout Pro Mercado Pago", action: "OPEN_MP_LINK" },
            { text: "⚡ Simular Webhook IPN Mercado Pago", action: "CONFIRM_MERCADOPAGO" },
          ],
        },
      ]);
    } else if (action === "OPEN_MP_LINK") {
      window.open("https://www.mercadopago.com.ar", "_blank");
    } else if (action === "CONFIRM_MERCADOPAGO") {
      setSessionStep("PAID");
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-mp-paid-${Date.now()}`,
          sender: "bot",
          text: `🎉 **¡PAGO CONFIRMADO VÍA MERCADO PAGO ARGENTINA!** 🇦🇷💙\n\n` +
            `• **Monto:** $${arsPrice.toLocaleString("es-AR")} ARS\n` +
            `• **Payment ID MP:** \`MP-9874125863\`\n` +
            `• **Estado IPN:** \`approved\`\n\n` +
            `Aquí tienes tu enlace exclusivo de acceso de un solo uso:\n` +
            `👉 **https://t.me/+SuiVip${Math.random().toString(36).substring(2, 8)}**\n\n` +
            `_Nota: Este enlace vence en 5 minutos y es de 1 solo uso._`,
          timestamp: "Just now",
          isInviteLink: true,
          inlineButtons: [
            { text: "🚀 Entrar al Canal VIP Ahora", action: "JOIN_VIP" },
          ],
        },
      ]);
    } else if (action === "SHOW_QR") {
      setShowQrModal(true);
    } else if (action === "START_VERIFY") {
      setSessionStep("AWAITING_WALLET");
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text: `🔍 **Paso 1:** Por favor, escribe y envía tu dirección pública de SUI (empieza con \`0x...\`) desde la cual realizaste el pago de **${price} ${token}**:`,
          timestamp: "Just now",
        },
      ]);
    } else if (action === "CHECK_STATUS") {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text: sessionStep === "PAID"
            ? `👑 **Membresía VIP Activa**\n• Vence en: 30 días\n• Red: Sui Mainnet`
            : `❌ No tienes una suscripción activa. Envía ${price} ${token} para unirte.`,
          timestamp: "Just now",
        },
      ]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    if (currentView === "vip-channel") {
      // In VIP channel: AI Roleplay Chat with Gemini
      setIsAiTyping(true);
      try {
        const res = await fetch("/api/ai/simulate-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona: influencer,
            history: messages.slice(-5),
            userMessage: text,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: data.reply || "Hey babe! So happy you joined my VIP space 🥰",
            timestamp: "Just now",
          },
        ]);
      } catch (err) {
        console.error("Chat error:", err);
      } finally {
        setIsAiTyping(false);
      }
      return;
    }

    // In Bot Chat flow: Check if awaiting wallet
    if (sessionStep === "AWAITING_WALLET") {
      setSessionStep("VERIFYING");
      setIsAiTyping(true);

      // Call verification simulation endpoint
      try {
        const res = await fetch("/api/sui/simulate-validation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userWallet: text.startsWith("0x") ? text : `0x${text}`,
            amount: price,
            tokenType: token,
            adminWallet,
          }),
        });
        const data = await res.json();

        setIsAiTyping(false);

        if (data.success) {
          setSessionStep("PAID");
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-verified-${Date.now()}`,
              sender: "bot",
              text: `🎉 **¡PAGO VERIFICADO CON ÉXITO EN SUI!** 💎\n\n` +
                `• **Monto:** ${data.amountPaid}\n` +
                `• **Tx Hash:** \`${data.txDigest.slice(0, 16)}...\`\n` +
                `• **Confirmación RPC:** ~420ms\n\n` +
                `Aquí tienes tu enlace exclusivo de acceso de un solo uso:\n` +
                `👉 **${data.inviteLink}**\n\n` +
                `_Nota: Este enlace vence en 5 minutos y es de 1 solo uso._`,
              timestamp: "Just now",
              isInviteLink: true,
              inlineButtons: [
                { text: "🚀 Entrar al Canal VIP Ahora", action: "JOIN_VIP" },
              ],
            },
          ]);
        } else {
          setSessionStep("AWAITING_WALLET");
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-fail-${Date.now()}`,
              sender: "bot",
              text: `❌ ${data.error || "No se encontró el pago en Sui. Inténtalo nuevamente."}`,
              timestamp: "Just now",
              inlineButtons: [
                { text: "🔄 Reintentar Validación", action: "START_VERIFY" },
              ],
            },
          ]);
        }
      } catch (err) {
        setIsAiTyping(false);
        setSessionStep("AWAITING_WALLET");
      }
    } else if (text.toLowerCase() === "/start") {
      initBot();
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `Presiona «✅ Ya pagué, verificar» o usa /start para comenzar.`,
          timestamp: "Just now",
          inlineButtons: [{ text: "✅ Ya pagué, verificar", action: "START_VERIFY" }],
        },
      ]);
    }
  };

  const handleEnterVipChannel = () => {
    setCurrentView("vip-channel");
    setMessages([
      {
        id: "vip-welcome",
        sender: "bot",
        text: `👑 **¡Bienvenido al Canal VIP Exclusivo de ${influencer.name}!** 🍾✨\n\n` +
          `Aquí tienes acceso a contenido diario sin censura, fotos 4K en ultra alta resolución y mensajes directos conmigo.\n\n` +
          `💬 *Escríbeme cualquier mensaje abajo para chatear conmigo en tiempo real.*`,
        timestamp: "Just now",
        mediaUrl: influencer.avatarUrl,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Interactive Testbench
            </span>
            <h2 className="text-lg font-bold text-black tracking-tight">
              Live Telegram SUI PayBot Simulator
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Experience the full customer checkout flow on Telegram: /start command, SUI payment verification, 1-time invite links, and VIP companion roleplay!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-900 hover:bg-purple-100 transition shadow-2xs"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Gestor de Plantillas</span>
          </button>
          <button
            onClick={initBot}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Restart Bot
          </button>
        </div>
      </div>

      {/* Simulator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Test Helper Controls & QR Code Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* QR Code Scannable & Downloadable Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-black flex items-center gap-2 tracking-tight">
                <QrCode className="h-4 w-4 text-black" /> Código QR de Onboarding VIP
              </h3>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                Descargable HD
              </span>
            </div>

            {/* Mode Switcher: Telegram Invite Link vs SUI Wallet */}
            <div className="grid grid-cols-2 gap-1 bg-[#F9FAFB] p-1 rounded-xl border border-[#E5E7EB]">
              <button
                onClick={() => setQrType("invite")}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  qrType === "invite"
                    ? "bg-black text-white shadow-2xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <Link className="h-3 w-3" />
                <span>Invitación VIP</span>
              </button>
              <button
                onClick={() => setQrType("wallet")}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  qrType === "wallet"
                    ? "bg-black text-white shadow-2xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <Shield className="h-3 w-3" />
                <span>Billetera SUI</span>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-2xl border border-[#E5E7EB]">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-zinc-200/80">
                <QRCodeSVG
                  id="telegram-invite-qr"
                  value={currentQrValue}
                  size={152}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <div className="mt-3 text-center w-full">
                <div className="text-[11px] font-bold text-black flex items-center justify-center gap-1">
                  {qrType === "invite" ? (
                    <>
                      <span>Telegram VIP Link</span>
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">Direct</span>
                    </>
                  ) : (
                    <span>{price} {token} (Sui Mainnet)</span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate max-w-[220px] mx-auto">
                  {qrType === "invite" ? customInviteLink : adminWallet}
                </div>
              </div>
            </div>

            {/* Custom Invite Link Editor (when invite mode active) */}
            {qrType === "invite" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Enlace de Invitación Telegram:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customInviteLink}
                    onChange={(e) => setCustomInviteLink(e.target.value)}
                    className="flex-1 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] px-2.5 py-1.5 text-[11px] font-mono text-zinc-800 focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    title="Copiar enlace"
                    className="rounded-xl border border-[#E5E7EB] bg-white p-2 text-zinc-700 hover:bg-zinc-100 hover:text-black transition"
                  >
                    {copiedInviteLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* SUI Format selector (when wallet mode active) */}
            {qrType === "wallet" && (
              <div className="flex items-center justify-between text-[11px] bg-[#F9FAFB] p-1.5 rounded-xl border border-[#E5E7EB]">
                <span className="text-zinc-500 px-2">Payload:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setQrFormat("raw")}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[10px] transition-all ${
                      qrFormat === "raw"
                        ? "bg-black text-white"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    Raw 0x Address
                  </button>
                  <button
                    onClick={() => setQrFormat("uri")}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[10px] transition-all ${
                      qrFormat === "uri"
                        ? "bg-black text-white"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    SUI DeepLink
                  </button>
                </div>
              </div>
            )}

            {/* Download & Copy Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => downloadQrCode("telegram-invite-qr", qrType === "invite" ? "Telegram_Invite_QR" : "SUI_PayBot_QR")}
                disabled={isDownloadingQr}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition shadow-xs disabled:opacity-50"
              >
                {isDownloadingQr ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                )}
                <span>Descargar QR (PNG)</span>
              </button>

              <button
                onClick={qrType === "invite" ? handleCopyInviteLink : handleCopyWallet}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white py-2.5 text-xs font-semibold text-black hover:bg-zinc-50 shadow-2xs"
              >
                {(qrType === "invite" ? copiedInviteLink : copiedAddress) ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-500" /> Copiar {qrType === "invite" ? "Enlace" : "Dirección"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Testbench Quick Actions */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-black flex items-center gap-2 tracking-tight">
              <Sparkles className="h-3.5 w-3.5 text-black" /> Testbench Quick Actions
            </h3>
            <p className="text-xs text-zinc-500">
              Click any quick action to test without typing:
            </p>

            <div className="space-y-2">
              <button
                id="btn-quick-vip-chat"
                onClick={handleEnterVipChannel}
                className="w-full text-left rounded-xl bg-black p-2.5 text-xs text-white hover:bg-zinc-800 transition-all flex items-center justify-between shadow-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-300 shrink-0" />
                  <div>
                    <div className="font-semibold">💬 Chatear Directo con {influencer.name}</div>
                    <div className="text-[10px] text-zinc-300">Modo VIP con Gemini 3.6 Flash IA</div>
                  </div>
                </div>
                <Heart className="h-4 w-4 text-rose-400 fill-rose-400 shrink-0" />
              </button>

              <button
                id="btn-quick-wallet-1"
                onClick={() => {
                  if (sessionStep !== "AWAITING_WALLET") {
                    handleButtonClick("START_VERIFY");
                  }
                  setTimeout(() => {
                    handleSendMessage("0x498e72c5a89b0d1e3f2c5a89b0d1e3f2c5a89b0d1e3f2c5a89b0d1e3f2c5a89b");
                  }, 400);
                }}
                className="w-full text-left rounded-xl bg-[#F9FAFB] p-2.5 text-xs text-black border border-[#E5E7EB] hover:bg-zinc-100 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-black">⚡ Simulate Valid SUI Payment</div>
                  <div className="text-[11px] text-zinc-500 font-mono">0x498e...a89b ({price} {token})</div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              </button>

              <button
                id="btn-quick-command-start"
                onClick={() => handleSendMessage("/start")}
                className="w-full text-left rounded-xl bg-[#F9FAFB] p-2.5 text-xs text-zinc-800 border border-[#E5E7EB] hover:bg-zinc-100 transition-all font-mono"
              >
                Send /start Command
              </button>

              <button
                id="btn-quick-status"
                onClick={() => handleSendMessage("/status")}
                className="w-full text-left rounded-xl bg-[#F9FAFB] p-2.5 text-xs text-zinc-800 border border-[#E5E7EB] hover:bg-zinc-100 transition-all font-mono"
              >
                Send /status Command
              </button>
            </div>

            {/* SUI RPC Status indicator */}
            <div className="pt-2 border-t border-[#E5E7EB] text-xs space-y-1">
              <div className="flex justify-between text-zinc-500">
                <span>Destination Wallet:</span>
                <span className="font-mono text-[11px] text-black truncate max-w-[140px]">
                  {adminWallet}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Price:</span>
                <span className="font-bold text-black">{price} {token}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Bot Status:</span>
                <span className="text-zinc-800 font-semibold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Online
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Inline Keyboard Designer */}
          <InlineKeyboardDesigner
            buttons={customInlineButtons}
            onUpdateButtons={(newBtns) => {
              setCustomInlineButtons(newBtns);
              setMessages((prev) => {
                if (prev.length === 0) return prev;
                return prev.map((m) =>
                  m.id === "msg-1"
                    ? { ...m, inlineButtons: newBtns.map((b) => ({ text: b.text, action: b.action })) }
                    : m
                );
              });
            }}
            onResetDefaults={() => {
              const defaults: InlineButtonConfig[] = [
                { id: "b1", text: "🇦🇷 Pagar con Mercado Pago (ARS)", action: "PAY_MERCADOPAGO", category: "payment" },
                { id: "b2", text: "📱 Ver Código QR SUI", action: "SHOW_QR", category: "payment" },
                { id: "b3", text: "💳 Copiar Dirección SUI", action: "COPY_WALLET", category: "payment" },
                { id: "b4", text: "✅ Ya pagué con SUI, verificar", action: "START_VERIFY", category: "vip" },
                { id: "b5", text: "ℹ️ Estado de Suscripción", action: "CHECK_STATUS", category: "info" },
              ];
              setCustomInlineButtons(defaults);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === "msg-1"
                    ? { ...m, inlineButtons: defaults.map((b) => ({ text: b.text, action: b.action })) }
                    : m
                )
              );
            }}
          />
        </div>

        {/* Right Side: Telegram Mobile Phone Mockup */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-full max-w-md rounded-[38px] border-[8px] border-black bg-black p-1.5 shadow-2xl overflow-hidden">
            {/* Phone Screen Container */}
            <div className="relative flex flex-col h-[640px] rounded-[30px] bg-[#0e1621] text-white overflow-hidden">
              {/* Telegram App Header Bar */}
              <div className="flex items-center justify-between bg-[#17212b] px-4 py-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  {currentView === "vip-channel" && (
                    <button
                      onClick={() => setCurrentView("bot-chat")}
                      className="text-zinc-400 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  )}
                  <div className="relative">
                    <img
                      src={influencer.avatarUrl}
                      alt={influencer.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover border border-zinc-700"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#17212b]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm text-white">
                        {currentView === "vip-channel" ? `${influencer.name} VIP 👑` : `${influencer.name} PayBot`}
                      </span>
                      <Shield className="h-3 w-3 text-zinc-400 fill-zinc-400" />
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      {currentView === "vip-channel" ? "VIP Private Channel" : "bot"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg bg-[#0e1621] p-0.5 border border-zinc-700/60">
                    <button
                      onClick={() => setCurrentView("bot-chat")}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                        currentView === "bot-chat"
                          ? "bg-[#2b5278] text-white"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      🤖 PayBot
                    </button>
                    <button
                      onClick={handleEnterVipChannel}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                        currentView === "vip-channel"
                          ? "bg-rose-600 text-white"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      👑 Chat VIP
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Message Bubble Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  const isSys = msg.sender === "system";

                  if (isSys) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block rounded-full bg-[#182533] px-3 py-1 text-[11px] text-zinc-400">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isUser
                            ? "bg-[#2b5278] text-white rounded-tr-xs"
                            : "bg-[#182533] text-zinc-100 rounded-tl-xs border border-zinc-800/40 shadow-sm"
                        }`}
                      >
                        {/* Media attachment if present */}
                        {msg.mediaUrl && (
                          <img
                            src={msg.mediaUrl}
                            alt="Teaser"
                            referrerPolicy="no-referrer"
                            className="mb-2.5 h-44 w-full rounded-xl object-cover"
                          />
                        )}

                        <div className="whitespace-pre-line break-words">{msg.text}</div>

                        <div className={`mt-2 flex items-center justify-between text-[10px] ${isUser ? "text-blue-200" : "text-zinc-400"}`}>
                          {!isUser ? (
                            <button
                              onClick={() => playTTSVoice(msg.text, msg.id)}
                              className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors bg-purple-950/60 hover:bg-purple-900/80 px-2 py-0.5 rounded-md border border-purple-500/30 font-medium"
                            >
                              {loadingAudioId === msg.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : activeAudioId === msg.id ? (
                                <Pause className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Volume2 className="h-3 w-3 text-purple-400" />
                              )}
                              <span>{activeAudioId === msg.id ? "Pausar" : "Escuchar Voz (ElevenLabs)"}</span>
                            </button>
                          ) : <span />}

                          <span>{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* Inline Keyboard Buttons under Bot Messages */}
                      {msg.inlineButtons && msg.inlineButtons.length > 0 && (
                        <div className="mt-2 space-y-1.5 w-[85%]">
                          {msg.inlineButtons.map((btn, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (btn.action === "JOIN_VIP") {
                                  handleEnterVipChannel();
                                } else {
                                  handleButtonClick(btn.action);
                                }
                              }}
                              className={`w-full rounded-xl py-2 px-3 text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
                                btn.action === "JOIN_VIP"
                                  ? "bg-black text-white hover:bg-zinc-800"
                                  : "bg-[#2b5278]/60 hover:bg-[#2b5278] text-blue-200 border border-blue-500/20"
                              }`}
                            >
                              {btn.action === "JOIN_VIP" && <Sparkles className="h-3.5 w-3.5 text-yellow-300" />}
                              {btn.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#182533] px-3 py-2 text-xs text-zinc-400 w-fit">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                    </span>
                    <span>{currentView === "vip-channel" ? `${influencer.name} is typing...` : "Validating Sui RPC..."}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="bg-[#17212b] p-3 border-t border-zinc-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder={
                    sessionStep === "AWAITING_WALLET"
                      ? "Paste SUI address (0x...)"
                      : currentView === "vip-channel"
                      ? `Chat with ${influencer.name}...`
                      : "Type a message or /start..."
                  }
                  className="flex-1 rounded-xl bg-[#0e1621] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none border border-zinc-700/60 focus:border-zinc-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white hover:bg-zinc-800 transition-all shrink-0 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* In-App QR Code Sheet Modal */}
              {showQrModal && (
                <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col justify-end p-4 transition-all">
                  <div className="bg-[#17212b] rounded-3xl p-5 border border-zinc-700 shadow-2xl flex flex-col items-center text-center space-y-3.5 max-h-[92vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <QrCode className="h-4 w-4 text-blue-400" />
                        <span>Código QR de Acceso</span>
                      </div>
                      <button
                        onClick={() => setShowQrModal(false)}
                        className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Dual Mode Switch in Modal */}
                    <div className="w-full grid grid-cols-2 gap-1 bg-[#0e1621] p-1 rounded-xl border border-zinc-700/60">
                      <button
                        onClick={() => setQrType("invite")}
                        className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                          qrType === "invite"
                            ? "bg-[#2b5278] text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        🔗 Enlace VIP Telegram
                      </button>
                      <button
                        onClick={() => setQrType("wallet")}
                        className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                          qrType === "wallet"
                            ? "bg-[#2b5278] text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        💳 Billetera SUI
                      </button>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl shadow-lg">
                      <QRCodeSVG
                        id="modal-qr-code"
                        value={currentQrValue}
                        size={170}
                        level="H"
                        includeMargin={false}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">
                        {qrType === "invite" ? `Invitación VIP: ${influencer.name}` : `${price} ${token}`}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {qrType === "invite"
                          ? "Escanea con la cámara para abrir Telegram directamente"
                          : "Escanea desde Slush, Sui Wallet o @wallet"}
                      </p>
                      <div className="mt-1 text-[10px] font-mono text-zinc-400 truncate max-w-[240px]">
                        {qrType === "invite" ? customInviteLink : adminWallet}
                      </div>
                    </div>

                    <div className="w-full space-y-2 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => downloadQrCode("modal-qr-code", qrType === "invite" ? "Telegram_Invite_QR" : "SUI_PayBot_QR")}
                          disabled={isDownloadingQr}
                          className="py-2 px-3 rounded-xl bg-black hover:bg-zinc-800 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all border border-zinc-700"
                        >
                          <Download className="h-3.5 w-3.5 text-blue-400" />
                          <span>Descargar PNG</span>
                        </button>

                        <button
                          onClick={qrType === "invite" ? handleCopyInviteLink : handleCopyWallet}
                          className="py-2 px-3 rounded-xl bg-[#2b5278] hover:bg-[#346290] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
                        >
                          {(qrType === "invite" ? copiedInviteLink : copiedAddress) ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-300" /> ¡Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copiar {qrType === "invite" ? "Enlace" : "Dirección"}
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setShowQrModal(false);
                          handleButtonClick("START_VERIFY");
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Ya transferí SUI, verificar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Template Manager Modal */}
              {showTemplateModal && (
                <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-4 transition-all">
                  <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-2xl flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                          <Bookmark className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900">Gestor de Plantillas de Mensaje</h3>
                          <p className="text-[11px] text-zinc-500">Guarda y carga borradores de bienvenida o promoción.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowTemplateModal(false)}
                        className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Create New Template */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-800">Crear Nueva Plantilla</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Título de la plantilla (ej. Oferta VIP SUI)"
                          className="rounded-xl bg-white px-3 py-2 text-xs border border-zinc-200 focus:outline-none focus:border-black"
                        />
                        <select
                          value={newCategory}
                          onChange={(e: any) => setNewCategory(e.target.value)}
                          className="rounded-xl bg-white px-3 py-2 text-xs border border-zinc-200 focus:outline-none focus:border-black"
                        >
                          <option value="Bienvenida">Bienvenida</option>
                          <option value="Promoción VIP">Promoción VIP</option>
                          <option value="Recordatorio de Pago">Recordatorio de Pago</option>
                        </select>
                      </div>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Contenido del mensaje (Markdown soportado)..."
                        rows={3}
                        className="w-full rounded-xl bg-white p-3 text-xs border border-zinc-200 focus:outline-none focus:border-black resize-none"
                      />
                      <button
                        onClick={handleSaveTemplate}
                        disabled={!newTitle.trim() || !newContent.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Guardar Plantilla
                      </button>
                    </div>

                    {/* Template List */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-zinc-800">Plantillas Guardadas ({templates.length})</h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {templates.map((tmpl) => (
                          <div key={tmpl.id} className="rounded-xl border border-zinc-200 bg-white p-3 flex flex-col gap-2 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-900">{tmpl.title}</span>
                                <span className="rounded bg-purple-100 px-2 py-0.5 text-[9px] font-bold text-purple-800">
                                  {tmpl.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleInsertTemplate(tmpl.content)}
                                  className="rounded-lg bg-black text-white px-2.5 py-1 text-[11px] font-bold hover:bg-zinc-800 transition"
                                >
                                  Cargar en Bot
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(tmpl.id)}
                                  className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-[11px] text-zinc-600 bg-zinc-50 p-2 rounded-lg font-mono line-clamp-2">
                              {tmpl.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
