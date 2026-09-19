import React, { useState, useRef } from "react";
import { Upload, Sparkles, Wand2, RefreshCw, CheckCircle2, Video, Image as ImageIcon, Play, Mic, User, Layers, ArrowRight, Loader2, Download } from "lucide-react";
import { AiInfluencer } from "../types";

interface BatchCloneWizardProps {
  onProfileCreated: (profile: AiInfluencer) => void;
}

const MOCK_TEMPLATES = [
  { id: "t1", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-the-camera-41584-large.mp4", thumb: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400&q=80" },
  { id: "t2", type: "photo", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", thumb: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80" },
  { id: "t3", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-fashion-runway-41588-large.mp4", thumb: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80" },
  { id: "t4", type: "photo", url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80", thumb: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80" },
  { id: "t5", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-mat-41585-large.mp4", thumb: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80" },
  { id: "t6", type: "photo", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
];

export const BatchCloneWizard: React.FC<BatchCloneWizardProps> = ({ onProfileCreated }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [faceUrl, setFaceUrl] = useState<string | null>(null);
  
  // Step 2 States
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<AiInfluencer | null>(null);

  // Step 3 States
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatching, setIsBatching] = useState(false);
  const [batchResults, setBatchResults] = useState<Record<string, { status: "pending" | "processing" | "done"; url?: string }>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFaceUrl(url);
    }
  };

  const startAiProfileGeneration = () => {
    setStep(2);
    setIsGeneratingProfile(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const newProfile: AiInfluencer = {
        id: "auto-gen-" + Date.now(),
        name: "Valentina (Clon IA)",
        handle: "@valentina_clon",
        age: 23,
        nationality: "Argentina",
        vibe: "Lifestyle & Fitness",
        avatarUrl: faceUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        bio: "Chica fitness de Buenos Aires. Amante del gym, la vida sana y los viajes.",
        facialCharacteristics: "Rubia, rostro simétrico, pecas.",
        characterTags: "valentina, blonde hair, fitness model, sharp facial features, highly detailed face",
        recommendedPricing: { sui: 15, usdc: 15, tierName: "VIP" },
        contentPillars: ["Fitness", "Lifestyle"],
        promptPresets: []
      };
      setGeneratedProfile(newProfile);
      setIsGeneratingProfile(false);
      onProfileCreated(newProfile);
      
      // Initialize batch status
      const initialBatch: Record<string, any> = {};
      MOCK_TEMPLATES.forEach(t => {
        initialBatch[t.id] = { status: "pending" };
      });
      setBatchResults(initialBatch);
    }, 2500);
  };

  const startBatchGeneration = async () => {
    setIsBatching(true);
    setBatchProgress(0);

    for (let i = 0; i < MOCK_TEMPLATES.length; i++) {
      const template = MOCK_TEMPLATES[i];
      
      // Mark as processing
      setBatchResults(prev => ({ ...prev, [template.id]: { status: "processing" } }));
      
      // Simulate heavy processing (Face Swap 4K + Video Rendering)
      await new Promise(r => setTimeout(r, template.type === "video" ? 3000 : 1500));
      
      // Mark as done
      setBatchResults(prev => ({ 
        ...prev, 
        [template.id]: { 
          status: "done", 
          url: template.url // In a real scenario, this is the swapped output URL
        } 
      }));
      
      setBatchProgress(Math.round(((i + 1) / MOCK_TEMPLATES.length) * 100));
    }
    
    setIsBatching(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Stepper Header */}
      <div className="bg-zinc-950 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          Clonador Auto-Mágico 1-Click
        </h3>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-2.5 py-1 rounded-full ${step >= 1 ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>1. Rostro</span>
          <div className="w-4 h-px bg-zinc-700"></div>
          <span className={`px-2.5 py-1 rounded-full ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>2. Identidad</span>
          <div className="w-4 h-px bg-zinc-700"></div>
          <span className={`px-2.5 py-1 rounded-full ${step >= 3 ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>3. Batch 4K</span>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {/* STEP 1: UPLOAD FACE */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div>
              <h2 className="text-2xl font-black text-black">Sube una Foto de la Cara</h2>
              <p className="text-zinc-500 text-sm mt-2">
                A partir de una única foto, la IA extraerá los landmarks faciales, generará una personalidad de voz compatible y preparará el motor de Face Swap para videos.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-8 border-2 border-dashed border-zinc-300 rounded-3xl p-12 hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] group"
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFaceUpload}
              />
              {faceUrl ? (
                <div className="relative">
                  <img src={faceUrl} alt="Face" className="h-48 w-48 object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-transform" />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-20 w-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-10 w-10" />
                  </div>
                  <p className="font-bold text-zinc-900 text-lg">Haz click para subir el Rostro Base</p>
                  <p className="text-zinc-400 text-xs mt-1">Formato JPG o PNG. Rostro iluminado de frente.</p>
                </>
              )}
            </div>

            {faceUrl && (
              <button 
                onClick={startAiProfileGeneration}
                className="w-full md:w-auto mx-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl"
              >
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span>Analizar Rostro y Generar Identidad</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        )}

        {/* STEP 2: AUTO-PROFILE */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            {isGeneratingProfile ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black animate-pulse">Ingeniería de Identidad en proceso...</h3>
                  <p className="text-zinc-500 text-sm mt-2">Analizando biometría facial, clonando voz en ElevenLabs y escribiendo Prompts Maestros.</p>
                </div>
              </div>
            ) : generatedProfile && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Photo & Basic Info */}
                  <div className="w-full md:w-1/3 space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden border border-zinc-200 shadow-md">
                      <img src={generatedProfile.avatarUrl} alt="Generated" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                      <h3 className="font-black text-xl text-black">{generatedProfile.name}</h3>
                      <p className="text-sm font-bold text-emerald-600">{generatedProfile.vibe}</p>
                      <p className="text-xs text-zinc-500 mt-1">{generatedProfile.age} años</p>
                    </div>
                  </div>

                  {/* Generated Details */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-start gap-4">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-xl shrink-0"><User className="h-5 w-5" /></div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">Bio & Personalidad</h4>
                        <p className="text-sm text-zinc-600 mt-1">{generatedProfile.bio}</p>
                        <p className="text-xs text-zinc-400 font-medium italic mt-2">"{generatedProfile.facialCharacteristics}"</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-start gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0"><Mic className="h-5 w-5" /></div>
                      <div className="w-full">
                        <h4 className="font-bold text-sm text-zinc-900">Voz Sintetizada (ElevenLabs)</h4>
                        <p className="text-xs text-zinc-500 mt-1">{generatedProfile.bio.substring(0, 50)}...</p>
                        
                        <div className="mt-3 flex items-center gap-3 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                          <button className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 hover:bg-zinc-800">
                            <Play className="h-4 w-4 ml-1" />
                          </button>
                          <div className="flex-1">
                            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-1/3"></div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">0:04</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-start gap-4">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0"><Layers className="h-5 w-5" /></div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">Stable Diffusion Character Lock</h4>
                        <p className="text-xs font-mono text-zinc-500 mt-1 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                          {generatedProfile.characterTags}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-zinc-100">
                  <button 
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-md"
                  >
                    <span>Continuar a Generación Batch</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: BATCH GENERATOR */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-black">Generador de Contenido en Lote (Batch 4K)</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Se generarán automáticamente 6 piezas de contenido (Videos y Fotos) reemplazando el rostro original por el de <strong>{generatedProfile?.name}</strong>.
                </p>
              </div>
              
              {!isBatching && batchProgress !== 100 && (
                <button 
                  onClick={startBatchGeneration}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Generar 6 Archivos Ahora</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {(isBatching || batchProgress > 0) && (
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Progreso del Batch</span>
                  <span>{batchProgress}% ({Object.values(batchResults).filter((v: any) => v.status === 'done').length} / {MOCK_TEMPLATES.length})</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${batchProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Grid of contents */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {MOCK_TEMPLATES.map((template) => {
                const status = batchResults[template.id]?.status || "pending";
                
                return (
                  <div key={template.id} className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black border border-zinc-200 shadow-sm group">
                    <img 
                      src={status === "done" ? template.url : template.thumb} 
                      alt="Template" 
                      className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'processing' ? 'opacity-40 blur-sm' : 'opacity-100'}`}
                    />
                    
                    {/* Badge Video/Photo */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white p-1.5 rounded-lg">
                      {template.type === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {status === "processing" && (
                        <div className="bg-black/80 text-emerald-400 p-3 rounded-full animate-pulse shadow-xl">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      )}
                      {status === "done" && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <a href={template.url} target="_blank" rel="noopener noreferrer" className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform">
                            <Download className="h-5 w-5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {batchProgress === 100 && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in duration-500">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-emerald-900">¡Archivos Generados Exitosamente!</h3>
                <p className="text-sm text-emerald-700 max-w-lg mx-auto">
                  La modelo fue clonada y se generaron todos los videos y fotos en alta resolución. Ya puedes descargar los archivos para publicarlos en Reels, TikTok o enviarlos por Telegram.
                </p>
                <button 
                  onClick={() => {
                    // Reset to test again if needed, or navigate away
                    setStep(1);
                    setFaceUrl(null);
                    setGeneratedProfile(null);
                    setBatchProgress(0);
                  }}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 shadow-md"
                >
                  Crear Nueva Modelo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
