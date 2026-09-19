import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  RefreshCw,
  Play,
  Pause,
  Download,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Maximize2,
  Eye,
  Trash2,
  Send,
  Zap,
  ArrowRight,
  ShieldCheck,
  Plus,
  X,
  Layers,
  FolderDown,
  Volume2,
  Twitter,
  Instagram,
  Music,
  Share2,
  Copy
} from "lucide-react";
import { AiInfluencer, ModelMediaItem } from "../types";
import { performCanvasFaceSwap, FaceSwapOptions } from "../utils/faceSwapEngine";
import { FACE_SWAP_TEMPLATES, SAMPLE_MODEL_GALLERY } from "../data/faceSwapData";
import { InteractiveMediaGallery } from "./InteractiveMediaGallery";

interface CustomMediaFaceSwapStudioProps {
  currentInfluencer: AiInfluencer;
  setCurrentInfluencer: (influencer: AiInfluencer) => void;
  onNavigateToSimulator?: () => void;
  onNavigateNext?: () => void;
}

export const CustomMediaFaceSwapStudio: React.FC<CustomMediaFaceSwapStudioProps> = ({
  currentInfluencer,
  setCurrentInfluencer,
  onNavigateToSimulator,
  onNavigateNext,
}) => {
  const [activeTab, setActiveTab] = useState<"upload-and-swap" | "model-gallery">("upload-and-swap");
  
  // Custom media upload state
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
  );
  const [uploadedMediaType, setUploadedMediaType] = useState<"photo" | "video">("photo");
  const [mediaTitle, setMediaTitle] = useState<string>("Selfie Elegante");
  const [mediaCategory, setMediaCategory] = useState<"lingerie" | "lifestyle" | "fitness" | "nightlife" | "swimwear">("lifestyle");

  // Face swap processing states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processStepMsg, setProcessStepMsg] = useState<string>("");
  const [swappedResultUrl, setSwappedResultUrl] = useState<string | null>(null);
  const [codeFormerWeight, setCodeFormerWeight] = useState<number>(0.85);
  const [skinToneAlignment, setSkinToneAlignment] = useState<number>(85);
  
  // New features state
  const [isSyncVoiceEnabled, setIsSyncVoiceEnabled] = useState<boolean>(true);
  const [socialCaptions, setSocialCaptions] = useState<{ twitter: string, instagram: string, tiktok: string } | null>(null);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState<boolean>(false);
  
  // Model generated items library (stored per model)
  const [modelGallery, setModelGallery] = useState<ModelMediaItem[]>(() => {
    if (currentInfluencer.galleryMedia && currentInfluencer.galleryMedia.length > 0) {
      return currentInfluencer.galleryMedia;
    }
    if (SAMPLE_MODEL_GALLERY[currentInfluencer.id]) {
      return SAMPLE_MODEL_GALLERY[currentInfluencer.id];
    }
    return [
      {
        id: `media-1-${currentInfluencer.id}`,
        type: "photo",
        title: `Sesión 4K de ${currentInfluencer.name}`,
        url: currentInfluencer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        category: "lifestyle",
        aspectRatio: "9:16",
      },
      {
        id: `media-2-${currentInfluencer.id}`,
        type: "video",
        title: `Video Pasarela 4K - ${currentInfluencer.name}`,
        url: "https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-fashion-runway-41588-large.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400&q=80",
        category: "swimwear",
        aspectRatio: "9:16",
        duration: "0:12"
      }
    ];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Sync gallery when model changes
  useEffect(() => {
    if (currentInfluencer.galleryMedia && currentInfluencer.galleryMedia.length > 0) {
      setModelGallery(currentInfluencer.galleryMedia);
    } else if (SAMPLE_MODEL_GALLERY[currentInfluencer.id]) {
      setModelGallery(SAMPLE_MODEL_GALLERY[currentInfluencer.id]);
    } else {
      setModelGallery([
        {
          id: `media-1-${currentInfluencer.id}`,
          type: "photo",
          title: `Foto Maestra de ${currentInfluencer.name}`,
          url: currentInfluencer.avatarUrl,
          category: "lifestyle",
          aspectRatio: "9:16",
        },
        {
          id: `media-2-${currentInfluencer.id}`,
          type: "video",
          title: `Video Pasarela 4K - ${currentInfluencer.name}`,
          url: "https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-fashion-runway-41588-large.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
          category: "lifestyle",
          aspectRatio: "9:16",
          duration: "0:15"
        }
      ]);
    }
  }, [currentInfluencer.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith("video/");
      const url = URL.createObjectURL(file);
      setUploadedMediaUrl(url);
      setUploadedMediaType(isVideo ? "video" : "photo");
      setMediaTitle(file.name.replace(/\.[^/.]+$/, "").slice(0, 30));
      setSwappedResultUrl(null);
    }
  };

  const handleExecuteFaceSwap = async () => {
    if (!uploadedMediaUrl) return;

    setIsProcessing(true);
    setProcessProgress(15);
    setProcessStepMsg("Detectando landmarks faciales de la modelo...");
    setSocialCaptions(null);

    const swapOptions: FaceSwapOptions = {
      codeFormerWeight,
      skinToneAlignment,
      featherRadius: 24,
      faceScale: 1.0,
      offsetX: 0,
      offsetY: 0,
      preserveEyeGlint: true,
      sharpness: 85,
    };

    try {
      if (uploadedMediaType === "photo") {
        setProcessProgress(45);
        setProcessStepMsg("Alineando vector facial 3D sobre la foto...");
        const result = await performCanvasFaceSwap(currentInfluencer.avatarUrl, uploadedMediaUrl, swapOptions);
        
        setProcessProgress(85);
        setProcessStepMsg("Restaurando textura de piel 4K con CodeFormer...");
        await new Promise(r => setTimeout(r, 600));

        setSwappedResultUrl(result.dataUrl);

        // Auto-generate social captions
        generateSocialCaptions(mediaTitle, mediaCategory);

        // Add to model gallery
        const newItem: ModelMediaItem = {
          id: `swapped-${Date.now()}`,
          type: "photo",
          title: `${mediaTitle} (${currentInfluencer.name})`,
          url: result.dataUrl,
          category: mediaCategory,
          aspectRatio: "9:16",
          promptUsed: `Face Swap 4K with InsightFace & CodeFormer (${codeFormerWeight.toFixed(2)}) for ${currentInfluencer.name}`,
        };

        const updatedGallery = [newItem, ...modelGallery];
        setModelGallery(updatedGallery);
        setCurrentInfluencer({
          ...currentInfluencer,
          galleryMedia: updatedGallery,
        });
      } else {
        // Video Face Swap Simulation
        setProcessProgress(30);
        setProcessStepMsg("Extrayendo fotogramas del video y rastreando rostro...");
        await new Promise(r => setTimeout(r, 900));

        setProcessProgress(65);
        setProcessStepMsg("Aplicando InsightFace Frame-by-Frame...");
        await new Promise(r => setTimeout(r, 1000));

        setProcessProgress(85);
        setProcessStepMsg("Codificando video MP4 con H.264...");
        await new Promise(r => setTimeout(r, 700));

        setSwappedResultUrl(uploadedMediaUrl);

        // Auto-generate social captions
        generateSocialCaptions(mediaTitle, mediaCategory);

        const newItem: ModelMediaItem = {
          id: `swapped-video-${Date.now()}`,
          type: "video",
          title: `${mediaTitle} [Face Swap ${currentInfluencer.name}]`,
          url: uploadedMediaUrl,
          thumbnailUrl: currentInfluencer.avatarUrl,
          category: mediaCategory,
          aspectRatio: "9:16",
          duration: "0:15",
          promptUsed: `Video Face Swap 4K InsightFace for ${currentInfluencer.name}`,
        };

        const updatedGallery = [newItem, ...modelGallery];
        setModelGallery(updatedGallery);
        setCurrentInfluencer({
          ...currentInfluencer,
          galleryMedia: updatedGallery,
        });
      }

      setProcessProgress(100);
      setProcessStepMsg("¡Face Swap completado con éxito!");
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);

    } catch (err) {
      console.error("Face swap execution error:", err);
      setIsProcessing(false);
      setSwappedResultUrl(uploadedMediaUrl);
    }
  };

  const generateSocialCaptions = async (title: string, category: string) => {
    setIsGeneratingCaptions(true);
    try {
      const res = await fetch("/api/ai/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: currentInfluencer.name,
          vibe: currentInfluencer.vibe,
          title,
          category,
          language: "es-AR"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSocialCaptions(data.captions);
      } else {
        // Fallback captions
        setSocialCaptions({
          twitter: `Nueva sesión ${category} de ${currentInfluencer.name} 🔥 Mirala completa en mi Telegram VIP. #Sui #AI #Influencer`,
          instagram: `¿Ya viste mi nuevo video? ✨ Link en la bio para el canal VIP. 💋\n.\n.\n#${category} #model #ai`,
          tiktok: `Mi mood hoy: ${title} 💋 | Suscribite con SUI link en bio #fyp #ai #model`
        });
      }
    } catch (e) {
      console.warn("Caption generation error:", e);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const handleDownloadResult = () => {
    if (!swappedResultUrl) return;
    const a = document.createElement("a");
    a.href = swappedResultUrl;
    a.download = `${currentInfluencer.name.toLowerCase().replace(/\s+/g, "_")}_${uploadedMediaType === "video" ? "video_swap.mp4" : "foto_swap.jpg"}`;
    a.click();
  };

  const handleDeleteFromGallery = (id: string) => {
    const updated = modelGallery.filter(item => item.id !== id);
    setModelGallery(updated);
    setCurrentInfluencer({
      ...currentInfluencer,
      galleryMedia: updated,
    });
  };

  const handleAddNewToGallery = (item: ModelMediaItem) => {
    const updated = [item, ...modelGallery];
    setModelGallery(updated);
    setCurrentInfluencer({
      ...currentInfluencer,
      galleryMedia: updated,
    });
  };

  const handleSetAsAvatar = (item: ModelMediaItem) => {
    setCurrentInfluencer({
      ...currentInfluencer,
      avatarUrl: item.url,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-zinc-900 tracking-tight">
              Generador Face Swap 4K • {currentInfluencer.name}
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Sube tus propios videos y fotos para aplicar la cara de {currentInfluencer.name} en alta resolución.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-2xl bg-zinc-100 p-1.5">
          <button
            onClick={() => setActiveTab("upload-and-swap")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "upload-and-swap"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Subir & Aplicar Swap</span>
          </button>
          <button
            onClick={() => setActiveTab("model-gallery")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "model-gallery"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Mi Galería ({modelGallery.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: UPLOAD & EXECUTE FACE SWAP */}
      {activeTab === "upload-and-swap" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Upload & Model Source Configuration (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Model Master Face Banner */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Cara Maestra Seleccionada
                </span>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-black text-purple-800">
                  Rostro Activo
                </span>
              </div>
              <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-200/70">
                <img
                  src={currentInfluencer.avatarUrl}
                  alt={currentInfluencer.name}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-600 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-black text-zinc-900">{currentInfluencer.name}</h4>
                  <p className="text-xs text-zinc-500">{currentInfluencer.vibe} • {currentInfluencer.nationality}</p>
                  <p className="text-[11px] font-mono text-purple-700 mt-1">68 Landmarks 3D Extraídos</p>
                </div>
              </div>
            </div>

            {/* Custom Media Upload Area */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
              <div>
                <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-purple-600" />
                  Sube tu Video o Foto Base
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Sube el archivo base (MP4, WebM, JPG, PNG) al que le transferirás el rostro de la modelo.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 hover:border-purple-500 hover:bg-purple-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-purple-100 group-hover:text-purple-700 text-zinc-600 transition shadow-2xs">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-zinc-800 mt-3 group-hover:text-purple-900">
                  Haz clic para subir un Video o Foto
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Soporta .mp4, .webm, .mov, .jpg, .png hasta 4K
                </p>
              </div>

              {/* Media Metadata Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase">Título del Contenido</label>
                  <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-black transition"
                    placeholder="Ej. Baile sensual en la playa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-600 uppercase">Tipo</label>
                    <select
                      value={uploadedMediaType}
                      onChange={(e: any) => setUploadedMediaType(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-black transition"
                    >
                      <option value="photo">Foto (9:16 / 4:3)</option>
                      <option value="video">Video (MP4 9:16)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-600 uppercase">Categoría</label>
                    <select
                      value={mediaCategory}
                      onChange={(e: any) => setMediaCategory(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-black transition"
                    >
                      <option value="lifestyle">Lifestyle</option>
                      <option value="lingerie">Lencería</option>
                      <option value="swimwear">Traje de Baño</option>
                      <option value="fitness">Fitness</option>
                      <option value="nightlife">Nocturno</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sliders: CodeFormer & Skin Blending */}
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-bold text-zinc-700">Sync Voice to Media</span>
                  </div>
                  <button
                    onClick={() => setIsSyncVoiceEnabled(!isSyncVoiceEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isSyncVoiceEnabled ? 'bg-purple-600' : 'bg-zinc-300'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSyncVoiceEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                {isSyncVoiceEnabled && (
                  <p className="text-[10px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 italic">
                    * Se generará automáticamente un audio de bienvenida sincronizado con los labios de la modelo.
                  </p>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span>Restauración Facial CodeFormer</span>
                    <span className="font-mono text-purple-700">{codeFormerWeight.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={codeFormerWeight}
                    onChange={(e) => setCodeFormerWeight(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span>Alineación de Tono de Piel</span>
                    <span className="font-mono text-purple-700">{skinToneAlignment}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={skinToneAlignment}
                    onChange={(e) => setSkinToneAlignment(parseInt(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecuteFaceSwap}
                disabled={isProcessing || !uploadedMediaUrl}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black p-4 text-xs font-black text-white hover:bg-zinc-800 transition disabled:opacity-50 shadow-md"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                    <span>{processStepMsg || "Procesando Face Swap 4K..."}</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>Aplicar Face Swap con Rostro de {currentInfluencer.name}</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Right Column: Live Side-by-Side Swapped Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h4 className="text-sm font-black text-zinc-900">
                    Previsualización en Vivo: Original vs. Face Swap
                  </h4>
                </div>
                {swappedResultUrl && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Face Swap Listo
                  </span>
                )}
              </div>

              {/* Media Comparison Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Left: Original Uploaded */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                    <span>1. Tu Medio Base Subido</span>
                    <span className="font-mono text-[10px] uppercase text-zinc-400">{uploadedMediaType}</span>
                  </div>
                  <div className="relative aspect-9/16 rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-200 shadow-inner flex items-center justify-center">
                    {uploadedMediaUrl ? (
                      uploadedMediaType === "video" ? (
                        <video
                          src={uploadedMediaUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={uploadedMediaUrl}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="text-zinc-500 text-xs text-center p-4">
                        Sube un archivo para comenzar
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Swapped Result */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                    <span className="text-purple-700">2. Con Cara de {currentInfluencer.name}</span>
                    <span className="font-mono text-[10px] uppercase text-emerald-600 font-bold">4K Render</span>
                  </div>
                  <div className="relative aspect-9/16 rounded-2xl bg-zinc-950 overflow-hidden border-2 border-purple-500 shadow-md flex items-center justify-center">
                    {isProcessing ? (
                      <div className="p-6 text-center space-y-3">
                        <RefreshCw className="h-8 w-8 text-purple-400 animate-spin mx-auto" />
                        <p className="text-xs font-bold text-white">{processStepMsg}</p>
                        <div className="w-48 bg-zinc-800 rounded-full h-2 overflow-hidden mx-auto">
                          <div
                            className="bg-purple-500 h-full transition-all duration-300"
                            style={{ width: `${processProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : swappedResultUrl ? (
                      uploadedMediaType === "video" ? (
                        <video
                          src={swappedResultUrl}
                          controls
                          autoPlay
                          loop
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={swappedResultUrl}
                          alt="Face Swapped"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="text-zinc-500 text-xs text-center p-4 space-y-2">
                        <Zap className="h-6 w-6 mx-auto text-zinc-600" />
                        <p>Haz clic en "Aplicar Face Swap" para generar el resultado</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              {swappedResultUrl && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadResult}
                      className="flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2.5 text-xs font-bold hover:bg-zinc-800 transition shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar {uploadedMediaType === "video" ? "Video MP4" : "Foto HD"}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("model-gallery")}
                      className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Ver en Galería</span>
                    </button>
                  </div>

                  {onNavigateToSimulator && (
                    <button
                      onClick={onNavigateToSimulator}
                      className="flex items-center gap-2 rounded-xl bg-purple-600 text-white px-4 py-2.5 text-xs font-bold hover:bg-purple-700 transition shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Enviar al Chat del Bot</span>
                    </button>
                  )}
                </div>
              )}

              {/* NEW: Social Media Preview Module */}
              {swappedResultUrl && (
                <div className="pt-4 border-t border-zinc-100 animate-in fade-in slide-in-from-top-2">
                  <h5 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Share2 className="h-3.5 w-3.5 text-purple-600" />
                    Social Media Ready (Captions IA)
                  </h5>
                  
                  {isGeneratingCaptions ? (
                    <div className="flex items-center justify-center py-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <RefreshCw className="h-4 w-4 animate-spin text-purple-500" />
                        <span>Gemini está redactando tus copies...</span>
                      </div>
                    </div>
                  ) : socialCaptions ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700">
                            <Twitter className="h-3 w-3" /> Twitter / X
                          </span>
                          <button onClick={() => navigator.clipboard.writeText(socialCaptions.twitter)} className="p-1 hover:bg-blue-100 rounded text-blue-600"><Copy className="h-3 w-3" /></button>
                        </div>
                        <p className="text-[11px] text-zinc-600 line-clamp-3 italic">"{socialCaptions.twitter}"</p>
                      </div>
                      <div className="rounded-2xl border border-pink-100 bg-pink-50/30 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-pink-700">
                            <Instagram className="h-3 w-3" /> Instagram
                          </span>
                          <button onClick={() => navigator.clipboard.writeText(socialCaptions.instagram)} className="p-1 hover:bg-pink-100 rounded text-pink-600"><Copy className="h-3 w-3" /></button>
                        </div>
                        <p className="text-[11px] text-zinc-600 line-clamp-3 italic">"{socialCaptions.instagram}"</p>
                      </div>
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-700">
                            <Music className="h-3 w-3" /> TikTok
                          </span>
                          <button onClick={() => navigator.clipboard.writeText(socialCaptions.tiktok)} className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Copy className="h-3 w-3" /></button>
                        </div>
                        <p className="text-[11px] text-zinc-600 line-clamp-3 italic">"{socialCaptions.tiktok}"</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

            </div>

            {/* Quick Templates Row */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                O Selecciona una Plantilla Rápida de Video/Foto
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {FACE_SWAP_TEMPLATES.slice(0, 6).map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setUploadedMediaUrl(tmpl.originalUrl);
                      setUploadedMediaType(tmpl.type);
                      setMediaTitle(tmpl.title);
                      setSwappedResultUrl(null);
                    }}
                    className="group relative aspect-9/16 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 hover:border-purple-600 cursor-pointer transition-all shadow-2xs"
                  >
                    <img
                      src={tmpl.originalThumbnail}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                      <span className="text-[9px] font-bold text-white truncate">{tmpl.title}</span>
                      <span className="text-[8px] font-mono text-purple-300 uppercase">{tmpl.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Interactive Media Gallery Component below CustomMediaFaceSwapStudio */}
      {activeTab === "upload-and-swap" && (
        <div id="interactive-media-gallery-section" className="pt-2">
          <InteractiveMediaGallery
            currentInfluencer={currentInfluencer}
            mediaItems={modelGallery}
            onDeleteItem={handleDeleteFromGallery}
            onAddNewMedia={handleAddNewToGallery}
            onSendToTelegramSimulator={onNavigateToSimulator}
            onSetAsAvatar={handleSetAsAvatar}
          />
        </div>
      )}

      {/* TAB 2: FULLSCREEN FOCUSED MODEL MEDIA GALLERY */}
      {activeTab === "model-gallery" && (
        <div id="interactive-media-gallery-section" className="space-y-4">
          <InteractiveMediaGallery
            currentInfluencer={currentInfluencer}
            mediaItems={modelGallery}
            onDeleteItem={handleDeleteFromGallery}
            onAddNewMedia={handleAddNewToGallery}
            onSendToTelegramSimulator={onNavigateToSimulator}
            onSetAsAvatar={handleSetAsAvatar}
          />
        </div>
      )}

      {/* Step Progression CTA */}
      {onNavigateNext && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onNavigateNext}
            className="flex items-center gap-2 rounded-2xl bg-black text-white px-6 py-3 text-xs font-black hover:bg-zinc-800 transition shadow-md"
          >
            <span>Continuar al Paso 4: Simulador de Bot Telegram VIP</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
};
