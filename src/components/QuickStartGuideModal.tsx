import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, ArrowRight, X, Bot, ShieldCheck, Database, Wand2, RefreshCw, Users, Code2 } from "lucide-react";

interface QuickStartGuideModalProps {
  onStart: (tabId: string) => void;
}

export const QuickStartGuideModal: React.FC<QuickStartGuideModalProps> = ({ onStart }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("telesui_quick_start_dismissed");
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("telesui_quick_start_dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const steps = [
    { num: "01", title: "Rostro Maestro & Creación IA", desc: "Sube una foto de cara y genera automáticamente identidad, prompts 8K, bio y voz.", tab: "step-1-face", icon: Wand2 },
    { num: "02", title: "Voz Natural 100% Free", desc: "Motor de voz natural sin suscripciones ni API keys. Acentos latinos, modulación y descarga MP3.", tab: "step-2-voice", icon: Sparkles },
    { num: "03", title: "Face Swap de Fotos & Videos", desc: "Sube tus propios videos y fotos por modelo para transferir el rostro en 4K con InsightFace.", tab: "step-3-faceswap", icon: RefreshCw },
    { num: "04", title: "Simulador de Telegram Bot VIP", desc: "Prueba el bot en vivo con las notas de voz, fotos/videos generados y pasarela de cobro.", tab: "step-4-telegram", icon: Bot },
    { num: "05", title: "Suscriptores & Pagos Web3 SUI", desc: "Monitorea suscripciones activas, renovaciones en SUI y control del Kick-Bot automático.", tab: "step-5-subscribers", icon: Users },
    { num: "06", title: "Código & Despliegue Node.js", desc: "Configuración y descarga del bot en TypeScript listo para producción en tu servidor.", tab: "step-6-deploy", icon: Code2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-extrabold text-purple-800 uppercase tracking-wide">
              Guía de Inicio Rápido • TeleSui Suite
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              Bienvenido al Ecosistema de Influencers IA & Web3
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              Sigue estos 7 pasos numerados para dominar la plataforma de monetización automatizada en Telegram.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[55vh] overflow-y-auto pr-1">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                onClick={() => {
                  onStart(s.tab);
                  handleDismiss();
                }}
                className="group flex items-start gap-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 hover:border-purple-500 hover:bg-purple-50/20 transition cursor-pointer shadow-2xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white font-mono text-xs font-bold group-hover:bg-purple-600 transition shadow-xs">
                  {s.num}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-900 group-hover:text-purple-700 transition truncate">
                      {s.title}
                    </h3>
                    <Icon className="h-3.5 w-3.5 text-zinc-400 group-hover:text-purple-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium">
            💡 Puedes reabrir esta guía en cualquier momento desde el menú de configuración.
          </div>
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-xs font-bold text-white hover:bg-zinc-800 transition shadow-md"
          >
            <span>¡Empezar a Utilizar TeleSui!</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
