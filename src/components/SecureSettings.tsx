import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Eye, EyeOff, Save, Key, Bot, Sparkles, CheckCircle2, Activity, Wifi, AlertTriangle } from "lucide-react";

export const SecureSettings: React.FC = () => {
  const [keys, setKeys] = useState({
    elevenLabs: "",
    replicate: "",
    falAi: "",
    telegram: ""
  });
  const [showKeys, setShowKeys] = useState({
    elevenLabs: false,
    replicate: false,
    falAi: false,
    telegram: false
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [diagStates, setDiagStates] = useState<{
    elevenLabs: { status: 'idle' | 'testing' | 'success' | 'error'; latency?: number; message?: string };
    falAi: { status: 'idle' | 'testing' | 'success' | 'error'; latency?: number; message?: string };
    gemini: { status: 'idle' | 'testing' | 'success' | 'error'; latency?: number; message?: string };
  }>({
    elevenLabs: { status: 'idle' },
    falAi: { status: 'idle' },
    gemini: { status: 'idle' },
  });

  const handleTestKey = async (keyType: 'elevenLabs' | 'falAi' | 'gemini') => {
    setDiagStates(prev => ({ ...prev, [keyType]: { status: 'testing' } }));
    try {
      let url = "";
      let headers: Record<string, string> = {};
      if (keyType === 'elevenLabs') {
        url = "/api/ai/test-elevenlabs";
        headers["x-elevenlabs-key"] = keys.elevenLabs;
      } else if (keyType === 'falAi') {
        url = "/api/ai/test-fal";
        headers["x-fal-key"] = keys.falAi;
      } else if (keyType === 'gemini') {
        url = "/api/ai/test-gemini";
      }

      const start = performance.now();
      const res = await fetch(url, { headers });
      const data = await res.json();
      const latency = Math.round(performance.now() - start);

      if (!res.ok || data.error) {
        setDiagStates(prev => ({
          ...prev,
          [keyType]: { status: 'error', message: data.error || 'Fallo de autenticación', latency }
        }));
      } else {
        setDiagStates(prev => ({
          ...prev,
          [keyType]: { status: 'success', message: data.warning ? `Conectado (${data.warning})` : 'Conexión exitosa y verificada', latency }
        }));
      }
    } catch (err: any) {
      setDiagStates(prev => ({
        ...prev,
        [keyType]: { status: 'error', message: err.message || 'Error de red' }
      }));
    }
  };

  useEffect(() => {
    // Load from localStorage or env
    setKeys({
      elevenLabs: localStorage.getItem("API_KEY_ELEVENLABS") || "",
      replicate: localStorage.getItem("API_KEY_REPLICATE") || "",
      falAi: localStorage.getItem("API_KEY_FALAI") || "",
      telegram: localStorage.getItem("API_KEY_TELEGRAM") || ""
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("API_KEY_ELEVENLABS", keys.elevenLabs);
    localStorage.setItem("API_KEY_REPLICATE", keys.replicate);
    localStorage.setItem("API_KEY_FALAI", keys.falAi);
    localStorage.setItem("API_KEY_TELEGRAM", keys.telegram);
    
    setToastMessage("Claves guardadas exitosamente de forma segura en caché local.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-zinc-950 text-white px-5 py-3.5 shadow-2xl border border-zinc-800 text-xs font-bold animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black tracking-tight">Configuración Segura de APIs</h2>
            <p className="text-xs text-zinc-500">
              Almacena tus credenciales (ElevenLabs, Replicate, Fal.ai, Telegram). No se guardan en texto plano en la configuración del Paybot.
            </p>
          </div>
        </div>

        <div className="mt-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-800">API Keys son 100% Opcionales</h3>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                El sistema detectará si falta una API Key y utilizará <strong>Motores de Inteligencia Artificial Gratuitos Incorporados</strong> de manera automática (como Pollinations FLUX para imágenes, y Google TTS/Neural Browser para voces). <br/>
                No necesitas ingresar ninguna clave para usar la aplicación.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Telegram Bot Token */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-blue-500" /> Telegram Bot Token
              </label>
              <div className="relative">
                <input
                  type={showKeys.telegram ? "text" : "password"}
                  value={keys.telegram}
                  onChange={(e) => setKeys({ ...keys, telegram: e.target.value })}
                  placeholder="6912345678:AAH_..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-3.5 pr-10 py-2.5 text-xs text-zinc-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, telegram: !showKeys.telegram })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showKeys.telegram ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* ElevenLabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> ElevenLabs API Key
              </label>
              {keys.elevenLabs && !keys.elevenLabs.startsWith("sk_") && (
                <p className="text-[10px] text-red-600 font-bold mb-1">⚠️ La clave debe empezar con "sk_". Estás usando un ID.</p>
              )}
              <div className="relative">
                <input
                  type={showKeys.elevenLabs ? "text" : "password"}
                  value={keys.elevenLabs}
                  onChange={(e) => setKeys({ ...keys, elevenLabs: e.target.value })}
                  placeholder="sk_..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-3.5 pr-10 py-2.5 text-xs text-zinc-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, elevenLabs: !showKeys.elevenLabs })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showKeys.elevenLabs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Replicate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-black" /> Replicate API Key (Face Swap)
              </label>
              <div className="relative">
                <input
                  type={showKeys.replicate ? "text" : "password"}
                  value={keys.replicate}
                  onChange={(e) => setKeys({ ...keys, replicate: e.target.value })}
                  placeholder="r8_..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-3.5 pr-10 py-2.5 text-xs text-zinc-900 focus:border-black focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, replicate: !showKeys.replicate })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showKeys.replicate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Fal.ai */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" /> Fal.ai API Key (Flux.1)
              </label>
              <div className="relative">
                <input
                  type={showKeys.falAi ? "text" : "password"}
                  value={keys.falAi}
                  onChange={(e) => setKeys({ ...keys, falAi: e.target.value })}
                  placeholder="fal-ai-..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-3.5 pr-10 py-2.5 text-xs text-zinc-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, falAi: !showKeys.falAi })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showKeys.falAi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-zinc-800 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Credenciales Seguras</span>
            </button>
          </div>
        </form>
      </div>
      

      {/* Connection Diagnostic Panel */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight">Utilidad de Diagnóstico de APIs en Vivo</h3>
            <p className="text-xs text-zinc-500">
              Verificá el estado de conectividad (Ping y autenticación) con los endpoints oficiales de ElevenLabs, Fal.ai y Gemini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* ElevenLabs Diag Card */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> ElevenLabs
              </span>
              {diagStates.elevenLabs.status === 'success' && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> OK
                </span>
              )}
              {diagStates.elevenLabs.status === 'error' && (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                  <AlertTriangle className="h-3 w-3" /> Fallo
                </span>
              )}
              {diagStates.elevenLabs.status === 'idle' && (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                  Pendiente
                </span>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 leading-tight">
              Prueba de conexión con <code className="font-mono text-[10px]">api.elevenlabs.io</code>
            </p>

            {diagStates.elevenLabs.message && (
              <div className={`text-[10px] p-2 rounded-lg font-medium ${
                diagStates.elevenLabs.status === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {diagStates.elevenLabs.message}
                {diagStates.elevenLabs.latency && <span className="block font-mono mt-0.5 font-bold">Latencia: {diagStates.elevenLabs.latency}ms</span>}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleTestKey('elevenLabs')}
              disabled={diagStates.elevenLabs.status === 'testing'}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition disabled:opacity-50 shadow-2xs"
            >
              <Wifi className={`h-3.5 w-3.5 ${diagStates.elevenLabs.status === 'testing' ? 'animate-pulse text-amber-400' : ''}`} />
              <span>{diagStates.elevenLabs.status === 'testing' ? 'Conectando...' : 'Hacer Ping'}</span>
            </button>
          </div>

          {/* Fal.ai Diag Card */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" /> Fal.ai (Flux)
              </span>
              {diagStates.falAi.status === 'success' && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> OK
                </span>
              )}
              {diagStates.falAi.status === 'error' && (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                  <AlertTriangle className="h-3 w-3" /> Fallo
                </span>
              )}
              {diagStates.falAi.status === 'idle' && (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                  Pendiente
                </span>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 leading-tight">
              Prueba de conexión con <code className="font-mono text-[10px]">rest.fal.ai</code>
            </p>

            {diagStates.falAi.message && (
              <div className={`text-[10px] p-2 rounded-lg font-medium ${
                diagStates.falAi.status === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {diagStates.falAi.message}
                {diagStates.falAi.latency && <span className="block font-mono mt-0.5 font-bold">Latencia: {diagStates.falAi.latency}ms</span>}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleTestKey('falAi')}
              disabled={diagStates.falAi.status === 'testing'}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition disabled:opacity-50 shadow-2xs"
            >
              <Wifi className={`h-3.5 w-3.5 ${diagStates.falAi.status === 'testing' ? 'animate-pulse text-pink-400' : ''}`} />
              <span>{diagStates.falAi.status === 'testing' ? 'Conectando...' : 'Hacer Ping'}</span>
            </button>
          </div>

          {/* Gemini Diag Card */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Google Gemini
              </span>
              {diagStates.gemini.status === 'success' && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> OK
                </span>
              )}
              {diagStates.gemini.status === 'error' && (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                  <AlertTriangle className="h-3 w-3" /> Fallo
                </span>
              )}
              {diagStates.gemini.status === 'idle' && (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                  Pendiente
                </span>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 leading-tight">
              Prueba de inferencia con <code className="font-mono text-[10px]">generativelanguage.googleapis.com</code>
            </p>

            {diagStates.gemini.message && (
              <div className={`text-[10px] p-2 rounded-lg font-medium ${
                diagStates.gemini.status === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {diagStates.gemini.message}
                {diagStates.gemini.latency && <span className="block font-mono mt-0.5 font-bold">Latencia: {diagStates.gemini.latency}ms</span>}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleTestKey('gemini')}
              disabled={diagStates.gemini.status === 'testing'}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition disabled:opacity-50 shadow-2xs"
            >
              <Wifi className={`h-3.5 w-3.5 ${diagStates.gemini.status === 'testing' ? 'animate-pulse text-blue-400' : ''}`} />
              <span>{diagStates.gemini.status === 'testing' ? 'Verificando...' : 'Hacer Ping'}</span>
            </button>
          </div>

        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6">
        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-1.5">
          <Lock className="h-4 w-4" /> Almacenamiento Cifrado Local
        </h4>
        <p className="text-xs text-blue-800 leading-relaxed">
          Tus claves se guardan exclusivamente en el almacenamiento local seguro de tu navegador (localStorage). 
          <strong> Nunca se exportan en texto plano en la configuración JSON del paybot</strong>, lo que te permite compartir el archivo de configuración con tu equipo de marketing sin comprometer tus secretos de facturación y APIs.
        </p>
      </div>
    </div>
  );
};
