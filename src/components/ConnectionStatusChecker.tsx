import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, AlertCircle, RefreshCw, Server, Zap, ShieldAlert, Cpu } from 'lucide-react';

type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'fallback' | 'error';

interface ServiceStatus {
  name: string;
  status: ConnectionStatus;
  message: string;
  latency?: number;
  icon: React.ReactNode;
}

export const ConnectionStatusChecker: React.FC = () => {
  const [services, setServices] = useState<Record<string, ServiceStatus>>({
    gemini: {
      name: 'Google Gemini (LLM & Vision)',
      status: 'idle',
      message: 'Esperando prueba...',
      icon: <Cpu className="h-5 w-5 text-indigo-500" />
    },
    elevenlabs: {
      name: 'ElevenLabs (Voces AI)',
      status: 'idle',
      message: 'Esperando prueba...',
      icon: <Activity className="h-5 w-5 text-emerald-500" />
    },
    fal: {
      name: 'Fal.ai (Generación de Imágenes)',
      status: 'idle',
      message: 'Esperando prueba...',
      icon: <Zap className="h-5 w-5 text-amber-500" />
    }
  });

  const [isTestingAll, setIsTestingAll] = useState(false);

  const testService = async (key: string, endpoint: string, headerKey: string, localStorageKey: string) => {
    setServices(prev => ({
      ...prev,
      [key]: { ...prev[key], status: 'testing', message: 'Probando conexión...' }
    }));

    try {
      const apiKeyValue = localStorage.getItem(localStorageKey) || "";
      const headers: Record<string, string> = {};
      if (apiKeyValue) {
        headers[headerKey] = apiKeyValue;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers
      });

      const data = await response.json();

      if (response.ok) {
        if (data.warning) {
          // Fallback / Free mode
          setServices(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: 'fallback',
              message: 'Falta API Key - ' + data.warning,
              latency: data.latency
            }
          }));
        } else {
          // Success with real key
          setServices(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: 'connected',
              message: 'Conexión exitosa al servidor remoto',
              latency: data.latency
            }
          }));
        }
      } else {
        // Error from server (rejected, invalid key, etc)
        setServices(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            status: 'error',
            message: data.error || 'Conexión rechazada por el servidor',
            latency: data.latency
          }
        }));
      }
    } catch (err: any) {
      // Network error
      setServices(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          status: 'error',
          message: 'Error de red: ' + err.message
        }
      }));
    }
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    
    await Promise.allSettled([
      testService('gemini', '/api/ai/test-gemini', 'x-gemini-key', 'API_KEY_GEMINI'),
      testService('elevenlabs', '/api/ai/test-elevenlabs', 'x-elevenlabs-key', 'API_KEY_ELEVENLABS'),
      testService('fal', '/api/ai/test-fal', 'x-fal-key', 'API_KEY_FALAI')
    ]);

    setIsTestingAll(false);
  };

  // Run automatically on mount
  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'idle':
        return <div className="h-2 w-2 rounded-full bg-zinc-300" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'fallback':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-rose-500" />;
    }
  };

  const getStatusBadge = (status: ConnectionStatus) => {
    switch (status) {
      case 'idle':
        return <span className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">En Espera</span>;
      case 'testing':
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Verificando...</span>;
      case 'connected':
        return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Conectado</span>;
      case 'fallback':
        return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Modo Gratuito Activo</span>;
      case 'error':
        return <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Error de Conexión</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
          <Server className="h-7 w-7 text-indigo-500" />
          Verificador de Estado de Conexión
        </h2>
        <p className="text-zinc-500 mt-2 text-sm leading-relaxed max-w-2xl">
          Supervisa el estado de las conexiones a las APIs de Inteligencia Artificial. Este panel comprueba 
          si las claves están configuradas correctamente o si el sistema ha activado los motores de contingencia locales (Modo Gratuito).
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-zinc-400" />
            <h3 className="font-bold text-sm text-zinc-700">Diagnóstico de Endpoints</h3>
          </div>
          <button
            onClick={runAllTests}
            disabled={isTestingAll}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isTestingAll ? 'animate-spin' : ''}`} />
            {isTestingAll ? 'Probando...' : 'Re-evaluar Conexiones'}
          </button>
        </div>
        
        <div className="divide-y divide-zinc-100">
          {Object.entries(services).map(([key, service]) => (
            <div key={key} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-2xl flex items-center justify-center shrink-0 ${
                  service.status === 'error' ? 'bg-rose-50' :
                  service.status === 'fallback' ? 'bg-amber-50' :
                  service.status === 'connected' ? 'bg-emerald-50' :
                  'bg-zinc-100'
                }`}>
                  {service.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{service.name}</h4>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className={`text-xs ${
                      service.status === 'error' ? 'text-rose-600 font-medium' :
                      service.status === 'fallback' ? 'text-amber-700' :
                      'text-zinc-500'
                    }`}>
                      {service.message}
                    </p>
                    {service.latency !== undefined && (
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Latencia: {service.latency}ms
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-14 sm:ml-0">
                {getStatusBadge(service.status)}
                <div className="h-8 w-8 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-xs">
                  {getStatusIcon(service.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
        <h4 className="font-bold text-sm text-indigo-900 mb-2">Acerca del Modo Gratuito</h4>
        <p className="text-xs text-indigo-800/80 leading-relaxed">
          Si el panel muestra <strong className="text-indigo-900">Modo Gratuito Activo</strong>, significa que no se encontró una API Key válida 
          para ese servicio. El backend interceptará las llamadas y retornará respuestas simuladas locales de alta calidad o utilizará 
          modelos <i>open-source</i> gratuitos (como GoTTS o Pollinations FLUX) para que la aplicación siga funcionando sin interrupciones.
        </p>
      </div>
    </div>
  );
};
