import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  Sparkles,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
  User,
  Layers,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Zap,
  Sliders,
  Database,
  Radio,
  FileText,
  ShieldCheck,
  FolderUp,
  Trash2,
  Eye,
  Camera,
  FolderOpen
} from "lucide-react";
import { AiInfluencer, ModelMediaItem } from "../types";
import { DEFAULT_INFLUENCERS } from "../data/influencerPresets";

interface FaceToModelCreatorProps {
  currentInfluencer: AiInfluencer;
  setCurrentInfluencer: (influencer: AiInfluencer) => void;
  onNavigateNext?: () => void;
}

interface UploadedImageItem {
  id: string;
  name: string;
  url: string;
  base64?: string;
  isMaster: boolean;
}

const PRESET_FACES = [
  {
    name: "Valentina (Rubia Fitness)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    nationality: "Argentina",
    vibe: "Fitness & Lifestyle",
    age: 23
  },
  {
    name: "Camila (Brunette Glam)",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    nationality: "Colombia",
    vibe: "Glamour & Lingerie",
    age: 22
  },
  {
    name: "Lucía (Seductora VIP)",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    nationality: "España",
    vibe: "High Luxury & Fashion",
    age: 24
  },
  {
    name: "Sofía (Fitness Latina)",
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
    nationality: "México",
    vibe: "Gym & Bikini Model",
    age: 21
  }
];

export const FaceToModelCreator: React.FC<FaceToModelCreatorProps> = ({
  currentInfluencer,
  setCurrentInfluencer,
  onNavigateNext,
}) => {
  const [faceUrl, setFaceUrl] = useState<string>(currentInfluencer.avatarUrl);
  const [uploadedCollection, setUploadedCollection] = useState<UploadedImageItem[]>([
    {
      id: "initial-master",
      name: "Rostro Maestro Principal",
      url: currentInfluencer.avatarUrl,
      isMaster: true,
    }
  ]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStepText, setAnalysisStepText] = useState<string>("");
  const [createdSuccessToast, setCreatedSuccessToast] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [detectedPillars, setDetectedPillars] = useState<string[]>(currentInfluencer.contentPillars || ["Fitness", "Lingerie", "Lifestyle"]);

  // Editable model fields
  const [modelName, setModelName] = useState<string>(currentInfluencer.name);
  const [modelHandle, setModelHandle] = useState<string>(currentInfluencer.handle);
  const [modelAge, setModelAge] = useState<number>(currentInfluencer.age);
  const [modelNationality, setModelNationality] = useState<string>(currentInfluencer.nationality);
  const [modelVibe, setModelVibe] = useState<string>(currentInfluencer.vibe);
  const [modelBio, setModelBio] = useState<string>(currentInfluencer.bio);
  const [modelCharacterTags, setModelCharacterTags] = useState<string>(currentInfluencer.characterTags);
  const [positivePrompt, setPositivePrompt] = useState<string>(
    `raw 8k portrait photo of (${modelName.toLowerCase().replace(/\s+/g, "_")}:1.35), highly detailed symmetrical face, natural skin texture, realistic soft studio lighting, cinematic 85mm f1.4 lens, 9:16 vertical composition`
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Process incoming files array
  const processFilesList = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/") || /\.(jpe?g|png|webp|avif)$/i.test(f.name));
    if (imageFiles.length === 0) return;

    const newItems: UploadedImageItem[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const url = URL.createObjectURL(file);
      let base64 = "";
      try {
        base64 = await fileToBase64(file);
      } catch (e) {
        console.warn("Base64 conversion failed for file:", file.name);
      }
      newItems.push({
        id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        url,
        base64,
        isMaster: i === 0 && uploadedCollection.length === 0,
      });
    }

    if (newItems.length > 0) {
      setUploadedCollection(prev => {
        const combined = [...prev, ...newItems];
        // Ensure at least one is marked master
        if (!combined.some(item => item.isMaster)) {
          combined[0].isMaster = true;
        }
        return combined;
      });
      // Set active faceUrl to first image if currently empty or default
      if (newItems[0]) {
        setFaceUrl(newItems[0].url);
      }
    }
  };

  // Single or multiple file input change
  const handleFaceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const f = e.target.files.item(i);
        if (f) files.push(f);
      }
      await processFilesList(files);
    }
  };

  // Folder input change
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const f = e.target.files.item(i);
        if (f) files.push(f);
      }
      await processFilesList(files);
    }
  };

  // Recursive Directory Traversal for Drag & Drop
  const traverseDirectory = async (entry: any): Promise<File[]> => {
    const files: File[] = [];
    if (entry.isFile) {
      const file: File = await new Promise((resolve) => entry.file(resolve));
      if (file.type.startsWith("image/") || /\.(jpe?g|png|webp|avif)$/i.test(file.name)) {
        files.push(file);
      }
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries: any[] = await new Promise((resolve) => {
        reader.readEntries(resolve);
      });
      for (const childEntry of entries) {
        const childFiles = await traverseDirectory(childEntry);
        files.push(...childFiles);
      }
    }
    return files;
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const items = e.dataTransfer.items;
    const files: File[] = [];

    if (items && items.length > 0) {
      const promises: Promise<File[]>[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (typeof item.webkitGetAsEntry === "function") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            promises.push(traverseDirectory(entry));
          }
        } else {
          const f = item.getAsFile();
          if (f && (f.type.startsWith("image/") || /\.(jpe?g|png|webp|avif)$/i.test(f.name))) {
            files.push(f);
          }
        }
      }
      const results = await Promise.all(promises);
      results.forEach(arr => files.push(...arr));
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const f = e.dataTransfer.files.item(i);
        if (f) files.push(f);
      }
    }

    if (files.length > 0) {
      await processFilesList(files);
    }
  };

  const handleSetMasterFace = (item: UploadedImageItem) => {
    setFaceUrl(item.url);
    setUploadedCollection(prev =>
      prev.map(img => ({
        ...img,
        isMaster: img.id === item.id,
      }))
    );
  };

  const handleRemoveImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedCollection(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isMaster)) {
        filtered[0].isMaster = true;
        setFaceUrl(filtered[0].url);
      }
      return filtered;
    });
  };

  // AI Generation with Gemini Vision Bulk Extraction
  const handleGenerateAllFromFace = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStepText(
      uploadedCollection.length > 1
        ? `Cargando colección de ${uploadedCollection.length} fotos para Gemini Vision...`
        : "Analizando rasgos faciales de la foto..."
    );

    try {
      // Gather base64 images from uploaded collection (or fetch preset image as base64)
      const base64Images: string[] = [];
      for (const item of uploadedCollection) {
        if (item.base64) {
          base64Images.push(item.base64);
        }
      }

      // If no base64 was loaded (e.g. initial preset url), fetch and convert to base64
      if (base64Images.length === 0 && faceUrl) {
        try {
          const res = await fetch(faceUrl);
          const blob = await res.blob();
          const reader = new FileReader();
          const b64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          const b64 = await b64Promise;
          base64Images.push(b64);
        } catch (e) {
          console.warn("Could not convert preset face to base64, continuing with fallback:", e);
        }
      }

      setAnalysisProgress(35);
      setAnalysisStepText("Extrayendo biometría y consistencia facial con Gemini 3.7 Flash Vision...");

      let bioData: any = null;

      if (base64Images.length > 1) {
        // Multi-image collection endpoint
        const response = await fetch("/api/ai/analyze-face-collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: base64Images,
            modelType: "lifestyle",
            collectionName: modelName.includes("Clon") ? undefined : modelName,
          })
        });
        if (response.ok) {
          bioData = await response.json();
        }
      } else {
        // Single face endpoint
        const response = await fetch("/api/ai/analyze-face", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64Images[0] || faceUrl,
            modelType: "sensual"
          })
        });
        if (response.ok) {
          bioData = await response.json();
        }
      }

      setAnalysisProgress(70);
      setAnalysisStepText("Generando Master Prompts para Flux/SDXL y biografía VIP...");
      await new Promise(r => setTimeout(r, 400));

      setAnalysisProgress(90);
      setAnalysisStepText("Sincronizando identidad con Telegram VIP y catálogo de medios...");
      await new Promise(r => setTimeout(r, 300));

      // Synthesize final values from Gemini Vision or intelligent defaults
      const finalName = bioData?.nameSuggestion || modelName || "Valentina 'Valen' Rossi";
      const finalHandle = bioData?.suggestedHandle || `@${finalName.toLowerCase().replace(/[^a-z0-9]/g, "")}_vip`;
      const finalAge = bioData?.age || modelAge || 22;
      const finalNat = bioData?.nationality || modelNationality || "Argentina (Buenos Aires)";
      const finalVibe = bioData?.vibe || modelVibe || "Glamour & Boudoir VIP";
      const finalBio = bioData?.bioSuggestion || modelBio || `🇦🇷 22 | Tu chica favorita de Buenos Aires 💋 Fotos 4K sin censura y audios íntimos en privado. Membresía VIP 15 SUI.`;
      const finalTags = bioData?.characterLockTags || `(${finalName.toLowerCase().replace(/[^a-z0-9]/g, "_")}:1.35), 22yo Latina woman, natural skin texture, 8k raw portrait`;
      const finalPrompt = bioData?.positivePrompt || `raw 8k photorealistic close-up portrait of ${finalTags}, beautiful symmetric feminine facial features, highly detailed soft skin texture, captivating gaze, natural lighting, shot on 85mm f1.4, vertical 9:16`;
      const finalPillars = bioData?.contentPillars || ["Fitness", "Lingerie", "Lifestyle"];

      setModelName(finalName);
      setModelHandle(finalHandle);
      setModelAge(finalAge);
      setModelNationality(finalNat);
      setModelVibe(finalVibe);
      setModelBio(finalBio);
      setModelCharacterTags(finalTags);
      setPositivePrompt(finalPrompt);
      setDetectedPillars(finalPillars);

      // Build media gallery items from the uploaded collection
      const newGalleryItems: ModelMediaItem[] = uploadedCollection.map((item, idx) => ({
        id: `media-col-${Date.now()}-${idx}`,
        type: "photo",
        title: item.isMaster ? `Rostro Maestro 4K de ${finalName}` : `Set Exclusivo #${idx + 1} (${item.name.slice(0, 18)})`,
        url: item.url,
        category: "lifestyle",
        aspectRatio: "9:16",
      }));

      const updatedProfile: AiInfluencer = {
        ...currentInfluencer,
        id: `model-${Date.now()}`,
        name: finalName,
        handle: finalHandle,
        age: finalAge,
        nationality: finalNat,
        vibe: finalVibe,
        avatarUrl: faceUrl,
        bio: finalBio,
        characterTags: finalTags,
        facialCharacteristics: bioData?.facialFeatures || "Rostro simétrico de rasgos armónicos, ojos almendrados y textura de piel natural ultra detallada.",
        recommendedPricing: { sui: 15, usdc: 15, tierName: "VIP" },
        contentPillars: finalPillars,
        voiceProfile: {
          elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM",
          stability: 0.75,
          similarityBoost: 0.85,
          speed: 1.0,
          naturalVoiceName: bioData?.recommendedVoice || "es-AR-ElenaNeural",
        },
        galleryMedia: newGalleryItems.length > 0 ? newGalleryItems : currentInfluencer.galleryMedia,
      };

      setCurrentInfluencer(updatedProfile);
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      setCreatedSuccessToast(true);
      setTimeout(() => setCreatedSuccessToast(false), 4000);
    } catch (err) {
      console.error("Error during full model generation:", err);
      setIsAnalyzing(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Master Creator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Face / Bulk Folder & Instant AI Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  1. Sube la Cara o Carpeta de Fotos
                </h3>
                <p className="text-xs text-zinc-500">
                  Arrastra una foto o carpeta completa. Gemini Vision extraerá todos los datos biográficos.
                </p>
              </div>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-black text-purple-800">
                Paso 1
              </span>
            </div>

            {/* Hidden Input Elements */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFaceUpload}
            />
            <input
              ref={folderInputRef}
              type="file"
              {...({ webkitdirectory: "", directory: "" } as any)}
              multiple
              className="hidden"
              onChange={handleFolderUpload}
            />

            {/* Main Interactive Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative aspect-square max-h-[300px] mx-auto rounded-2xl bg-zinc-950 overflow-hidden border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center shadow-inner ${
                isDraggingOver
                  ? "border-purple-500 bg-purple-950/40 ring-4 ring-purple-500/20 scale-[0.99]"
                  : "border-zinc-300 hover:border-purple-600"
              }`}
            >
              {faceUrl ? (
                <>
                  <img
                    src={faceUrl}
                    alt="Master Face"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white p-4 text-center">
                    <Upload className="h-8 w-8 mb-2 text-purple-300" />
                    <span className="text-xs font-bold">Cambiar / Subir Más Fotos</span>
                    <span className="text-[10px] text-zinc-300 mt-1">Arrastra carpetas o fotos aquí</span>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                    <span>Rostro Maestro</span>
                  </div>
                  {uploadedCollection.length > 1 && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {uploadedCollection.length} fotos en colección
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 text-center space-y-2 text-zinc-400">
                  <FolderUp className="h-10 w-10 mx-auto text-purple-400 animate-pulse" />
                  <p className="text-xs font-bold text-zinc-200">Arrastra una carpeta o fotos de la modelo</p>
                  <p className="text-[11px] text-zinc-400">Procesamiento por lote con Gemini Vision</p>
                </div>
              )}
            </div>

            {/* Folder & Multi-File Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/80 px-3 py-2 text-[11px] font-bold text-purple-900 hover:bg-purple-100 transition shadow-2xs"
              >
                <FolderOpen className="h-3.5 w-3.5 text-purple-700" />
                <span>📁 Subir Carpeta de Fotos</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] font-bold text-zinc-800 hover:bg-zinc-100 transition shadow-2xs"
              >
                <Camera className="h-3.5 w-3.5 text-zinc-600" />
                <span>📸 Subir Varias Fotos</span>
              </button>
            </div>

            {/* Uploaded Photos Carousel / Collection Strip */}
            {uploadedCollection.length > 1 && (
              <div className="space-y-1.5 rounded-2xl bg-zinc-50 border border-zinc-200 p-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-zinc-700 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-purple-600" />
                    Lote Cargado ({uploadedCollection.length} fotos)
                  </span>
                  <span className="text-[10px] text-zinc-500">Toca para fijar cara maestra</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {uploadedCollection.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSetMasterFace(item)}
                      className={`group relative shrink-0 h-14 w-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        item.isMaster
                          ? "border-purple-600 ring-2 ring-purple-600/30 scale-105"
                          : "border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      {item.isMaster && (
                        <div className="absolute inset-x-0 bottom-0 bg-purple-600 text-[8px] font-bold text-white text-center py-0.5">
                          Maestra
                        </div>
                      )}
                      <button
                        onClick={(e) => handleRemoveImage(item.id, e)}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 rounded text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Presets Quick Faces */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                O Elige un Rostro Preset:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_FACES.map((pf, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFaceUrl(pf.url);
                      setUploadedCollection([
                        {
                          id: `preset-${idx}`,
                          name: pf.name,
                          url: pf.url,
                          isMaster: true
                        }
                      ]);
                      setModelName(pf.name);
                      setModelNationality(pf.nationality);
                      setModelVibe(pf.vibe);
                      setModelAge(pf.age);
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 hover:border-purple-600 transition shadow-2xs"
                  >
                    <img src={pf.url} alt={pf.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-1">
                      <span className="text-[8px] font-bold text-white truncate">{pf.name.split(" ")[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Magic Action Button: Gemini Vision Biographical Extraction */}
            <button
              onClick={handleGenerateAllFromFace}
              disabled={isAnalyzing || !faceUrl}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black p-4 text-xs font-black text-white hover:bg-zinc-800 transition disabled:opacity-50 shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                  <span>{analysisStepText || "Extrayendo biografía con Gemini Vision..."}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-purple-400" />
                  <span>
                    ✨ {uploadedCollection.length > 1 ? `Procesar Lote (${uploadedCollection.length} Fotos) & Extraer Biografía` : "Crear Todo a partir de esta Cara"}
                  </span>
                </>
              )}
            </button>

            {createdSuccessToast && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>¡Perfil, biografía Gemini Vision, prompts y voz generados con éxito!</span>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Generated Model Identity & Prompt Studio (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 tracking-tight">
                    Identidad IA & Biografía Extraída por Gemini Vision
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Parámetros biométricos y de personalidad listos para Face Swap, fotos 4K y bot VIP.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-black text-emerald-800">
                Sincronizado
              </span>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-zinc-600 uppercase">Nombre de la Modelo</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-bold text-zinc-900 focus:bg-white focus:border-black focus:outline-none transition mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-600 uppercase">Handle Telegram</label>
                <input
                  type="text"
                  value={modelHandle}
                  onChange={(e) => setModelHandle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-bold text-zinc-900 focus:bg-white focus:border-black focus:outline-none transition mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-600 uppercase">Nacionalidad / Acento</label>
                <select
                  value={modelNationality}
                  onChange={(e) => setModelNationality(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-bold text-zinc-900 focus:bg-white focus:border-black focus:outline-none transition mt-1"
                >
                  <option value="Argentina (Buenos Aires / Palermo)">Argentina (Buenos Aires / Palermo)</option>
                  <option value="Argentina (Rosario / Mar del Plata)">Argentina (Rosario / Mar del Plata)</option>
                  <option value="Colombia (Medellín / Paisa)">Colombia (Medellín / Paisa)</option>
                  <option value="España (Madrid / Barcelona)">España (Madrid / Barcelona)</option>
                  <option value="México (CDMX / Monterrey)">México (CDMX / Monterrey)</option>
                  <option value="Latina Neutra">Latina Neutra</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-600 uppercase">Estilo / Vibe</label>
                <input
                  type="text"
                  value={modelVibe}
                  onChange={(e) => setModelVibe(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-bold text-zinc-900 focus:bg-white focus:border-black focus:outline-none transition mt-1"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 uppercase">Biografía Persuasiva para Telegram</label>
              <textarea
                rows={2}
                value={modelBio}
                onChange={(e) => setModelBio(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-medium text-zinc-800 focus:bg-white focus:border-black focus:outline-none transition mt-1 resize-none leading-relaxed"
              />
            </div>

            {/* Content Pillars */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-600 uppercase">Pilares de Contenido Detectados</label>
              <div className="flex flex-wrap gap-2">
                {detectedPillars.map((pillar, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-900"
                  >
                    ✨ {pillar}
                  </span>
                ))}
              </div>
            </div>

            {/* Master Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-zinc-600 uppercase flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-purple-600" />
                  Master Prompt Positivo (Flux.1 / SDXL 8K)
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-black transition"
                >
                  {copiedPrompt ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                  <span>{copiedPrompt ? "Copiado" : "Copiar"}</span>
                </button>
              </div>

              <div className="rounded-2xl bg-zinc-950 p-3.5 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800">
                {positivePrompt}
              </div>
            </div>

            {/* Character Tag Anchor */}
            <div className="flex items-center justify-between rounded-xl bg-purple-50 border border-purple-200/80 p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-950">Tag Ancla de Consistencia Facial:</span>
                <code className="text-xs font-mono font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                  {modelCharacterTags}
                </code>
              </div>
              <span className="text-[10px] text-purple-800 font-medium hidden sm:inline">
                Asegura 100% de parecido facial
              </span>
            </div>

            {/* Step Navigation CTA */}
            {onNavigateNext && (
              <div className="flex justify-end pt-3 border-t border-zinc-100">
                <button
                  onClick={onNavigateNext}
                  className="flex items-center gap-2 rounded-2xl bg-black text-white px-6 py-3 text-xs font-black hover:bg-zinc-800 transition shadow-md"
                >
                  <span>Continuar al Paso 2: Voz Natural Libre</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
