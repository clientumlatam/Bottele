import React from "react";
import { Layers, ShieldCheck, Zap, ArrowRight, Video, MessageSquare, Lock, DollarSign, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { PaybotConfig, AiInfluencer } from "../types";
import { ProjectedEarningsWidget } from "./ProjectedEarningsWidget";

interface FunnelBlueprintProps {
  paybotConfig?: PaybotConfig;
  onUpdateConfig?: (newConfig: PaybotConfig) => void;
  currentInfluencer?: AiInfluencer;
}

export const FunnelBlueprint: React.FC<FunnelBlueprintProps> = ({
  paybotConfig,
  onUpdateConfig,
  currentInfluencer,
}) => {
  const steps = [
    {
      step: 1,
      title: "Tráfico Viral y Videos con Movimiento (Top del Embudo)",
      platform: "Instagram Reels, TikTok y YouTube Shorts",
      icon: Video,
      color: "from-pink-500 to-rose-600",
      description: "Producí videos verticales 9:16 de alta retención usando tags de consistencia facial (OpenArt / Flux) combinados con control de movimiento en Kling 3.0 para sumarte a bailes y audios virales.",
      actionItems: [
        "Renderizá en resolución 2K vertical en formato 9:16",
        "Bloqueá la geometría del rostro con Character Tags (peso :1.3 a :1.4)",
        "Colocá el enlace al canal de Telegram en la bio ('Galería diaria exclusiva en la bio')",
      ],
    },
    {
      step: 2,
      title: "Canal Gratuito Anticensura (Medio del Embudo)",
      platform: "Canal Público de Difusión en Telegram",
      icon: ShieldCheck,
      color: "from-blue-500 to-cyan-600",
      description: "Las redes sociales suelen censurar o limitar el alcance de las modelos de IA. Telegram es tu activo permanente sin censura donde mantenés el 100% de tus seguidores.",
      actionItems: [
        "Publicá adelantos diarios, detrás de escena y vistas previas",
        "Añadí botones directos de 1 clic para suscribirse con el Bot de Sui",
        "0% dependencia de algoritmos: 100% de tasa de entrega a los miembros",
      ],
    },
    {
      step: 3,
      title: "Muro de Pago Web3 en Sui y Bot de Invitaciones (Conversión)",
      platform: "Bot de Telegram en Sui (telegraf + @mysten/sui)",
      icon: Zap,
      color: "from-indigo-600 to-blue-700",
      description: "Los suscriptores envían SUI o USDC directamente desde Slush Wallet o el @wallet nativo de Telegram. El bot valida la transferencia en el RPC de Sui en menos de 1 segundo y genera un link de acceso dinámico.",
      actionItems: [
        "Verificación en blockchain instantánea sin riesgo de contracargos",
        "Enlace de invitación dinámico e intransferible (member_limit: 1, vence en 5 min)",
        "Cobro directo de usuario a tu billetera privada",
      ],
    },
    {
      step: 4,
      title: "Bóveda VIP Exclusiva y Acompañante IA (Retención)",
      platform: "Canal VIP Privado y Bot de Rol 1 a 1",
      icon: Lock,
      color: "from-purple-600 to-pink-600",
      description: "Los miembros VIP reciben fotoshoots 4K sin censura, mensajes de voz personalizados y chats interactivos con IA alimentados por Gemini para maximizar la retención mensual.",
      actionItems: [
        "Publicaciones semanales en 4K y publicaciones exclusivas estilo vida",
        "Verificación de renovaciones automatizada cada 30 días",
        "Promedio de retención por suscriptor: más de 3.5 meses recurrentes",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Guía de Arquitectura
          </span>
          <h2 className="text-lg font-bold text-black tracking-tight">
            Embudo de Monetización y Flujo de Trabajo para Influencers de IA 2026
          </h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500 max-w-3xl">
          La estrategia exacta que usan las agencias de modelos digitales para facturar miles de dólares mensuales en ingresos recurrentes (MRR) combinando generación por IA, infraestructura en Telegram y pagos en la Blockchain de Sui.
        </p>
      </div>

      {/* 4-Step Funnel Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => {
          return (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-black text-white font-bold text-xs">
                    {s.step}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">Phase 0{s.step}</span>
                </div>

                <h3 className="mt-3 text-xs font-bold text-black tracking-tight">
                  {s.title}
                </h3>
                <p className="text-[11px] font-semibold text-zinc-600 mt-0.5">
                  {s.platform}
                </p>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#E5E7EB]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Key Tactics:
                </span>
                {s.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-700">
                    <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Projected Monthly Earnings Widget linked to subscriberPrice & conversion rates */}
      <ProjectedEarningsWidget
        paybotConfig={paybotConfig}
        onUpdateConfig={onUpdateConfig}
        currentInfluencer={currentInfluencer}
      />

      {/* Strategic Comparison: SUI Crypto Paywalls vs Traditional Web2 Gateways */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-black flex items-center gap-2 tracking-tight">
          <Zap className="h-4 w-4 text-black" />
          Por qué la combinación de Sui Blockchain y Telegram supera a las plataformas tradicionales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-[#E5E7EB] p-4 bg-[#F9FAFB] space-y-2">
            <span className="font-bold text-black block">
              1. Cero Comisiones de Plataforma
            </span>
            <p className="text-zinc-500 leading-relaxed">
              OnlyFans y Cafecito se quedan con entre el <strong>20% y el 30%</strong> de cada transacción. Con tu propio Bot de Pagos en Sui, el 100% de los fondos va directo a tu billetera privada.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] p-4 bg-[#F9FAFB] space-y-2">
            <span className="font-bold text-black block">
              2. Inmune a Contracargos y Congelamientos
            </span>
            <p className="text-zinc-500 leading-relaxed">
              Los procesadores de tarjetas de crédito congelan seguido las cuentas de creadores de contenido. Las transacciones en la red Sui son irrevocables e instantáneas.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] p-4 bg-[#F9FAFB] space-y-2">
            <span className="font-bold text-black block">
              3. Integración Directa con @wallet en Telegram
            </span>
            <p className="text-zinc-500 leading-relaxed">
              Los usuarios de Telegram pueden pagar directamente sin salir de la app usando la interfaz nativa de <code>@wallet</code> o la Slush Wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
