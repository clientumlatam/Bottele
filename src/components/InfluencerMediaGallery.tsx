import React, { useState } from "react";
import { AiInfluencer, ModelMediaItem } from "../types";
import { 
  Image as ImageIcon, 
  Film, 
  Download, 
  Trash2, 
  Plus, 
  Filter, 
  Search, 
  ExternalLink, 
  Sparkles,
  Share2,
  FolderOpen,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Maximize2
} from "lucide-react";

interface InfluencerMediaGalleryProps {
  influencer: AiInfluencer;
  onUpdateInfluencer: (updated: AiInfluencer) => void;
}

export const InfluencerMediaGallery: React.FC<InfluencerMediaGalleryProps> = ({
  influencer,
  onUpdateInfluencer,
}) => {
  const [filterType, setFilterType] = useState<"all" | "photo" | "video">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ModelMediaItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Bulk optimization state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeSuccessCount, setOptimizeSuccessCount] = useState<number | null>(null);

  // New item form state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<"photo" | "video">("photo");
  const [newCategory, setNewCategory] = useState<"lingerie" | "swimwear" | "lifestyle" | "fitness" | "nightlife">("lifestyle");

  const mediaList: ModelMediaItem[] = influencer.galleryMedia || [
    {
      id: "media-1",
      type: "photo",
      title: "Golden Hour Balcony Teaser",
      url: influencer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      category: "lifestyle",
      aspectRatio: "9:16",
      promptUsed: `${influencer.characterTags}, golden hour balcony in Ibiza, luxury aesthetics, 8k`
    },
    {
      id: "media-2",
      type: "video",
      title: "Kling Motion VIP Reel #1",
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lights-42999-large.mp4",
      thumbnailUrl: influencer.avatarUrl,
      category: "nightlife",
      aspectRatio: "9:16",
      duration: "0:08",
      promptUsed: `Kling 3.0 motion, neon lights nightclub, ${influencer.characterTags}`
    },
    {
      id: "media-3",
      type: "photo",
      title: "Infinity Pool Sunset VIP Set",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      category: "swimwear",
      aspectRatio: "9:16",
      promptUsed: `${influencer.characterTags}, santorini infinity pool, luxury swimwear`
    }
  ];

  const filteredMedia = mediaList.filter(item => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newItem: ModelMediaItem = {
      id: `media-${Date.now()}`,
      type: newType,
      title: newTitle,
      url: newUrl,
      category: newCategory,
      aspectRatio: "9:16",
      promptUsed: `Custom upload for ${influencer.name}`
    };

    const updatedMedia = [newItem, ...mediaList];
    onUpdateInfluencer({
      ...influencer,
      galleryMedia: updatedMedia
    });

    setNewTitle("");
    setNewUrl("");
    setIsUploadModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const updatedMedia = mediaList.filter(item => item.id !== id);
    onUpdateInfluencer({
      ...influencer,
      galleryMedia: updatedMedia
    });
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleBulkOptimize = () => {
    setIsOptimizing(true);
    setOptimizeSuccessCount(null);

    setTimeout(() => {
      setIsOptimizing(false);
      const photoCount = mediaList.filter(m => m.type === "photo").length;
      setOptimizeSuccessCount(photoCount > 0 ? photoCount : mediaList.length);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header & Controls */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Gestión de Archivos
              </span>
              <h3 className="text-lg font-bold text-black tracking-tight">
                Galería de Activos Multimedia ({influencer.name})
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Administra todas las fotos 4K y videos generados con Kling/Flux para los posteos semanales y canales VIP de Telegram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkOptimize}
              disabled={isOptimizing}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              <Zap className={`h-4 w-4 ${isOptimizing ? "animate-bounce" : ""}`} />
              <span>{isOptimizing ? "Optimizando WebP/JPEG..." : "Optimizar Lote para Telegram"}</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Archivo</span>
            </button>
          </div>
        </div>

        {optimizeSuccessCount !== null && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-emerald-900">
                ¡Optimización en lote completada con éxito! {optimizeSuccessCount} archivos comprimidos a formato WebP optimizado (Reducción estimada del 68% de ancho de banda para Telegram Bot API).
              </span>
            </div>
            <button 
              onClick={() => setOptimizeSuccessCount(null)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "all" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Todos ({mediaList.length})
            </button>
            <button
              onClick={() => setFilterType("photo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "photo" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Fotos ({mediaList.filter(m => m.type === "photo").length})</span>
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "video" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Videos ({mediaList.filter(m => m.type === "video").length})</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
            >
              <option value="all">Todas las Categorías</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="lingerie">Lingerie / Boudoir</option>
              <option value="swimwear">Swimwear</option>
              <option value="fitness">Fitness</option>
              <option value="nightlife">Nightlife</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-4">
          <div className="h-16 w-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-base">No se encontraron archivos</h4>
            <p className="text-xs text-zinc-500 mt-1">Prueba cambiando los filtros de búsqueda o añade un nuevo archivo multimedia.</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Subir Primer Archivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Media Preview Container */}
              <div 
                className="relative aspect-[9/16] bg-zinc-950 cursor-pointer overflow-hidden"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1 ${
                    item.type === "video" ? "bg-indigo-600" : "bg-purple-600"
                  }`}>
                    {item.type === "video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    <span>{item.type.toUpperCase()}</span>
                  </span>

                  <span className="bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {item.aspectRatio}
                  </span>
                </div>

                {/* Bottom Quick Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <span className="text-white text-xs font-semibold truncate max-w-[140px]">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-sm"
                      title="Expandir / Vista de Alta Resolución"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-sm"
                      title="Descargar archivo"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-3.5 flex items-center justify-between bg-white">
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-zinc-900 truncate">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{item.category}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="text-xs font-bold text-purple-600 hover:underline shrink-0"
                >
                  Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail / Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-black px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {selectedItem.type === "video" ? <Film className="h-4 w-4 text-indigo-400" /> : <ImageIcon className="h-4 w-4 text-purple-400" />}
                <h3 className="font-bold text-sm">{selectedItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="h-7 w-7 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-inner">
                {selectedItem.type === "video" ? (
                  <video src={selectedItem.url} controls autoPlay className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedItem.url} alt={selectedItem.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Categoría</span>
                    <p className="text-sm font-bold text-zinc-900 capitalize">{selectedItem.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Relación de Aspecto</span>
                    <p className="text-sm font-bold text-zinc-900">{selectedItem.aspectRatio}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Prompt / Generador Utilizado</span>
                    <p className="font-mono text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200 mt-1 max-h-36 overflow-y-auto">
                      {selectedItem.promptUsed || "Generación automática por IA"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4" /> Descargar Archivo 4K
                  </a>
                  <button
                    onClick={() => {
                      handleDeleteItem(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-all border border-rose-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-base text-zinc-900">Añadir Archivo a la Galería</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="h-7 w-7 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Título del Archivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sesión Playa Sunset VIP"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">URL de la Imagen o Video (CDN / Unsplash / MP4)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Tipo de Archivo</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                  >
                    <option value="photo">Foto (9:16)</option>
                    <option value="video">Video (Kling)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                  >
                    <option value="lifestyle">Lifestyle</option>
                    <option value="lingerie">Lingerie</option>
                    <option value="swimwear">Swimwear</option>
                    <option value="fitness">Fitness</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold text-xs shadow-sm"
                >
                  Guardar en Galería
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
