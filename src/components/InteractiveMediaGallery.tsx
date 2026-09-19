import React, { useState, useMemo, useRef } from "react";
import {
  Film,
  Image as ImageIcon,
  Copy,
  Check,
  Eye,
  Download,
  Trash2,
  Maximize2,
  X,
  Search,
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Plus,
  RefreshCw,
  FolderOpen,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Layers,
  FileCode,
  Tag
} from "lucide-react";
import { AiInfluencer, ModelMediaItem } from "../types";

interface InteractiveMediaGalleryProps {
  currentInfluencer: AiInfluencer;
  mediaItems: ModelMediaItem[];
  onDeleteItem?: (id: string) => void;
  onAddNewMedia?: (item: ModelMediaItem) => void;
  onSendToTelegramSimulator?: (item: ModelMediaItem) => void;
  onSetAsAvatar?: (item: ModelMediaItem) => void;
}

export const InteractiveMediaGallery: React.FC<InteractiveMediaGalleryProps> = ({
  currentInfluencer,
  mediaItems,
  onDeleteItem,
  onAddNewMedia,
  onSendToTelegramSimulator,
  onSetAsAvatar,
}) => {
  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<"all" | "photo" | "video">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "type">("newest");
  const [columnsCount, setColumnsCount] = useState<2 | 3 | 4 | 5>(4);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Active preview modal
  const [previewItem, setPreviewItem] = useState<ModelMediaItem | null>(null);
  const [previewMuted, setPreviewMuted] = useState<boolean>(false);

  // Copied path feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>("");
  const [manualType, setManualType] = useState<"photo" | "video">("photo");
  const [manualCategory, setManualCategory] = useState<"lingerie" | "swimwear" | "lifestyle" | "fitness" | "nightlife">("lifestyle");
  const [manualUrl, setManualUrl] = useState<string>("");
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Hover video play state
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

  // Show temporary toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Copy media path / URL handler
  const handleCopyPath = (item: ModelMediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Generate clean canonical path or data URI
    const pathString = item.url.startsWith("data:") 
      ? `data:media/${item.type};base64,[...${item.url.slice(15, 45)}...]` 
      : item.url;

    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    triggerToast(`Path copiado: ${item.title}`);

    setTimeout(() => {
      setCopiedId((prev) => (prev === item.id ? null : prev));
    }, 2000);
  };

  // Copy all visible media paths
  const handleCopyAllPaths = () => {
    if (filteredMedia.length === 0) return;
    const paths = filteredMedia.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      category: m.category,
      path: m.url,
    }));
    navigator.clipboard.writeText(JSON.stringify(paths, null, 2));
    triggerToast(`¡${paths.length} paths copiados al portapapeles en formato JSON!`);
  };

  // Download media item
  const handleDownload = (item: ModelMediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.url;
    link.download = `${currentInfluencer.name.toLowerCase().replace(/\s+/g, "_")}_${item.title.toLowerCase().replace(/\s+/g, "_")}.${item.type === "video" ? "mp4" : "jpg"}`;
    link.click();
    triggerToast(`Descargando: ${item.title}`);
  };

  // Manual asset upload
  const handleManualUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const newItem: ModelMediaItem = {
      id: `custom-media-${Date.now()}`,
      type: manualType,
      title: manualTitle.trim() || `Contenido de ${currentInfluencer.name}`,
      url: manualUrl.trim(),
      category: manualCategory,
      aspectRatio: "9:16",
      duration: manualType === "video" ? "0:10" : undefined,
    };

    if (onAddNewMedia) {
      onAddNewMedia(newItem);
    }
    setIsUploadModalOpen(false);
    setManualTitle("");
    setManualUrl("");
    triggerToast("¡Nuevo medio agregado a la galería con éxito!");
  };

  // Processed Media list filtered & sorted
  const filteredMedia = useMemo(() => {
    return mediaItems
      .filter((item) => {
        // Type filter
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        // Category filter
        if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          const matchPrompt = item.promptUsed ? item.promptUsed.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchCategory && !matchPrompt) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "type") return a.type.localeCompare(b.type);
        if (sortBy === "oldest") return a.id.localeCompare(b.id);
        // default newest
        return b.id.localeCompare(a.id);
      });
  }, [mediaItems, typeFilter, categoryFilter, searchQuery, sortBy]);

  // Statistics
  const photoCount = mediaItems.filter((m) => m.type === "photo").length;
  const videoCount = mediaItems.filter((m) => m.type === "video").length;

  return (
    <div id="interactive-media-gallery-section" className="space-y-4 pt-2">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-zinc-950 text-white px-5 py-3 shadow-2xl border border-zinc-800 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 shadow-2xs">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  Galería Interactiva de Face Swaps & Videos Procesados
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-800 border border-purple-200">
                    Live Masonry
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Banco de assets generados en 4K para <strong className="text-zinc-800">{currentInfluencer.name}</strong>. Acceso directo para previsualizar, copiar paths o enviar al Bot VIP.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200/80 text-[11px] font-bold text-zinc-700">
              <span className="px-2 py-0.5 flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-zinc-500" />
                <span>{photoCount} Fotos</span>
              </span>
              <span className="text-zinc-300">|</span>
              <span className="px-2 py-0.5 flex items-center gap-1">
                <Film className="h-3.5 w-3.5 text-purple-600" />
                <span>{videoCount} Videos</span>
              </span>
              <span className="text-zinc-300">|</span>
              <span className="px-2 py-0.5 text-zinc-900">
                {mediaItems.length} Total
              </span>
            </div>

            <button
              id="btn-copy-all-media-paths"
              onClick={handleCopyAllPaths}
              title="Copiar paths de todos los medios visibles en JSON"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black transition"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar Todos</span>
            </button>

            <button
              id="btn-open-add-media-modal"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-black text-white px-3.5 py-2 text-xs font-bold hover:bg-zinc-800 transition shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir Medio</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-50/80 p-3.5 rounded-2xl border border-zinc-200/80">
          {/* Left: Search input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, categoría o prompt..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Center: Type tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-2xs">
            <button
              id="btn-filter-media-all"
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                typeFilter === "all"
                  ? "bg-black text-white shadow-2xs"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Todos ({mediaItems.length})
            </button>
            <button
              id="btn-filter-media-photo"
              onClick={() => setTypeFilter("photo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                typeFilter === "photo"
                  ? "bg-black text-white shadow-2xs"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Fotos ({photoCount})</span>
            </button>
            <button
              id="btn-filter-media-video"
              onClick={() => setTypeFilter("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                typeFilter === "video"
                  ? "bg-black text-white shadow-2xs"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Videos ({videoCount})</span>
            </button>
          </div>

          {/* Right: Category filter & Sort */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="all">Todas las Categorías</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="swimwear">Swimwear / Bikini</option>
              <option value="lingerie">Lingerie / Boudoir</option>
              <option value="fitness">Fitness</option>
              <option value="nightlife">Nightlife</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="newest">Más Recientes</option>
              <option value="oldest">Más Antiguos</option>
              <option value="title">Título A-Z</option>
              <option value="type">Tipo (Video/Foto)</option>
            </select>

            {/* Column density toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-2xs">
              {([2, 3, 4, 5] as const).map((cols) => (
                <button
                  key={cols}
                  onClick={() => setColumnsCount(cols)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    columnsCount === cols
                      ? "bg-purple-100 text-purple-800"
                      : "text-zinc-400 hover:text-zinc-700"
                  }`}
                  title={`${cols} columnas`}
                >
                  {cols}C
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Masonry Grid Viewport */}
        <div
          className={`relative transition-all duration-300 ${
            isExpanded ? "max-h-none" : "max-h-[720px] overflow-y-auto pr-1"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          {filteredMedia.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50">
              <ImageIcon className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-700">No se encontraron medios procesados</p>
              <p className="text-xs text-zinc-400 mt-1">
                Intenta cambiar los filtros de búsqueda o realiza un nuevo Face Swap arriba.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setCategoryFilter("all");
                }}
                className="mt-4 rounded-xl bg-zinc-200 px-4 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-300 transition"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div
              className={`
                gap-4 space-y-4
                ${columnsCount === 2 ? "columns-1 sm:columns-2" : ""}
                ${columnsCount === 3 ? "columns-1 sm:columns-2 md:columns-3" : ""}
                ${columnsCount === 4 ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4" : ""}
                ${columnsCount === 5 ? "columns-2 sm:columns-3 md:columns-4 lg:columns-5" : ""}
              `}
            >
              {filteredMedia.map((item, idx) => {
                const isCopied = copiedId === item.id;
                const isVideo = item.type === "video";
                const isHovered = hoveredVideoId === item.id;

                // Subtle variable aspect ratios for authentic masonry rhythm
                const aspectClass = idx % 5 === 0 
                  ? "aspect-[4/5]" 
                  : idx % 3 === 0 
                    ? "aspect-[9/16]" 
                    : "aspect-[9/16]";

                return (
                  <div
                    key={item.id}
                    id={`media-card-${item.id}`}
                    onMouseEnter={() => isVideo && setHoveredVideoId(item.id)}
                    onMouseLeave={() => isVideo && setHoveredVideoId(null)}
                    className="break-inside-avoid group relative rounded-2xl bg-zinc-950 border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Media Render */}
                    <div className={`relative w-full ${aspectClass} overflow-hidden bg-zinc-900 cursor-pointer`} onClick={() => setPreviewItem(item)}>
                      {isVideo ? (
                        <>
                          <video
                            src={item.url}
                            poster={item.thumbnailUrl}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            ref={(el) => {
                              if (el) {
                                if (isHovered) {
                                  el.play().catch(() => {});
                                } else {
                                  el.pause();
                                  el.currentTime = 0;
                                }
                              }
                            }}
                          />
                          {!isHovered && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition">
                              <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-md group-hover:scale-110 transition">
                                <Play className="h-4 w-4 ml-0.5 fill-white" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${
                            isVideo 
                              ? "bg-purple-950/80 text-purple-200 border border-purple-500/30" 
                              : "bg-zinc-900/80 text-zinc-100 border border-white/20"
                          }`}>
                            {isVideo ? "VIDEO 9:16" : "FOTO 4K"}
                          </span>
                          {item.category && (
                            <span className="rounded-lg bg-black/50 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-zinc-200 border border-white/10 uppercase">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {item.duration && (
                          <span className="rounded-lg bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-white border border-white/10">
                            {item.duration}
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay with Quick Access Buttons */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 pointer-events-auto">
                        
                        {/* Top corner actions */}
                        <div className="flex justify-end gap-1.5">
                          {onDeleteItem && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                                triggerToast(`Elemento eliminado`);
                              }}
                              className="h-7 w-7 rounded-lg bg-black/70 hover:bg-rose-600 text-white backdrop-blur-md flex items-center justify-center transition"
                              title="Eliminar de la galería"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Bottom Information & Action Buttons */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-black text-white line-clamp-1 leading-tight drop-shadow-sm">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-zinc-300 mt-0.5 line-clamp-1">
                              Modelo: {currentInfluencer.name}
                            </p>
                          </div>

                          {/* Quick Access Action Bar */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {/* Copy Path Quick Button */}
                            <button
                              type="button"
                              id={`btn-copy-path-${item.id}`}
                              onClick={(e) => handleCopyPath(item, e)}
                              className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-black transition shadow-sm ${
                                isCopied
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white/95 hover:bg-white text-zinc-900 hover:scale-[1.02]"
                              }`}
                              title="Copiar path del archivo"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5 text-zinc-600" />
                                  <span>Copy Path</span>
                                </>
                              )}
                            </button>

                            {/* Preview Quick Button */}
                            <button
                              type="button"
                              id={`btn-preview-media-${item.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                              }}
                              className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-2 text-[11px] font-black transition hover:scale-[1.02] shadow-sm"
                              title="Ver en pantalla completa con reproductor y metadatos"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Preview</span>
                            </button>
                          </div>

                          {/* Secondary Fast Tools: Download & Telegram */}
                          <div className="flex items-center justify-between gap-1 pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => handleDownload(item, e)}
                              className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 py-1 text-[10px] font-bold transition"
                              title="Descargar archivo original"
                            >
                              <Download className="h-3 w-3" />
                              <span>Descargar</span>
                            </button>

                            {onSendToTelegramSimulator && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSendToTelegramSimulator(item);
                                  triggerToast(`Enviado al Simulador de Telegram VIP`);
                                }}
                                className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white py-1 text-[10px] font-bold transition"
                                title="Enviar al chat VIP de Telegram"
                              >
                                <Send className="h-3 w-3" />
                                <span>A Telegram</span>
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>

                    {/* Subtle Permanent Footer for Quick Reference */}
                    <div className="p-3 bg-white border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-zinc-900 truncate">
                          {item.title}
                        </span>
                        <span className="block text-[10px] text-zinc-400 font-mono truncate">
                          {item.url.slice(0, 30)}...
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopyPath(item, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition shrink-0"
                        title="Copiar Path"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expand / Collapse Grid Toggle */}
        {filteredMedia.length > 6 && (
          <div className="flex justify-center pt-2 border-t border-zinc-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 text-xs font-bold transition"
            >
              <span>{isExpanded ? "Colapsar Galería" : `Ver Todos los ${filteredMedia.length} Medios`}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
            
            {/* Left/Main: Player or High-Res Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] md:min-h-[540px] p-2">
              {previewItem.type === "video" ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  loop
                  muted={previewMuted}
                  className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain"
                />
              )}

              {/* Close Button Top-Left on Mobile */}
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 md:hidden h-9 w-9 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/20 z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Right: Technical Details & Actions Sidebar */}
            <div className="w-full md:w-80 lg:w-96 bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[92vh]">
              
              <div className="space-y-5">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      {previewItem.type === "video" ? <Film className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Detalles del Asset
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="hidden md:flex h-8 w-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 items-center justify-center transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Title & Influencer */}
                <div>
                  <h4 className="text-base font-black text-white leading-tight">
                    {previewItem.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={currentInfluencer.avatarUrl}
                      alt={currentInfluencer.name}
                      className="h-6 w-6 rounded-full object-cover border border-zinc-700"
                    />
                    <span className="text-xs text-zinc-300 font-bold">
                      {currentInfluencer.name}
                    </span>
                  </div>
                </div>

                {/* Path Box with Quick Copy */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 flex items-center justify-between">
                    <span>Path del Archivo</span>
                    <span className="font-mono text-purple-400">{previewItem.type.toUpperCase()}</span>
                  </label>
                  <div className="flex items-center gap-2 rounded-xl bg-zinc-950 p-2.5 border border-zinc-800">
                    <input
                      type="text"
                      readOnly
                      value={previewItem.url}
                      className="flex-1 bg-transparent text-xs text-zinc-300 font-mono outline-none truncate"
                    />
                    <button
                      onClick={() => handleCopyPath(previewItem)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition shrink-0"
                    >
                      {copiedId === previewItem.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-medium">Categoría</span>
                    <span className="font-bold text-white capitalize">{previewItem.category || "General"}</span>
                  </div>
                  <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-medium">Aspect Ratio</span>
                    <span className="font-bold text-white">{previewItem.aspectRatio || "9:16"}</span>
                  </div>
                  <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-medium">Motor Face Swap</span>
                    <span className="font-bold text-emerald-400">InsightFace 4K</span>
                  </div>
                  <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-medium">Restauración</span>
                    <span className="font-bold text-white">CodeFormer 0.85</span>
                  </div>
                </div>

                {previewItem.promptUsed && (
                  <div className="rounded-xl bg-zinc-950/80 p-3 border border-zinc-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Prompt Original</span>
                    <p className="text-[11px] text-zinc-300 font-mono leading-relaxed line-clamp-4">
                      {previewItem.promptUsed}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800 space-y-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleDownload(previewItem)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 py-2.5 text-xs font-bold transition shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Archivo ({previewItem.type === "video" ? "MP4" : "JPG"})</span>
                </button>

                {onSendToTelegramSimulator && (
                  <button
                    type="button"
                    onClick={() => {
                      onSendToTelegramSimulator(previewItem);
                      setPreviewItem(null);
                      triggerToast(`Enviado al Simulador de Telegram VIP`);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>Enviar al Simulador Telegram VIP</span>
                  </button>
                )}

                {onSetAsAvatar && previewItem.type === "photo" && (
                  <button
                    type="button"
                    onClick={() => {
                      onSetAsAvatar(previewItem);
                      triggerToast(`Foto fijada como Avatar Maestro`);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 text-xs font-bold transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Usar como Avatar de la Modelo</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* QUICK ADD MEDIA MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full rounded-3xl bg-white border border-zinc-200 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-black text-zinc-900">Añadir Medio a la Galería</h4>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleManualUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Título o Descripción del Asset
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ej: Sesión Bikini Atardecer Punta del Este"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Tipo de Medio
                  </label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-800"
                  >
                    <option value="photo">Foto 4K</option>
                    <option value="video">Video 9:16</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-800"
                  >
                    <option value="lifestyle">Lifestyle</option>
                    <option value="swimwear">Swimwear</option>
                    <option value="lingerie">Lingerie</option>
                    <option value="fitness">Fitness</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  URL del Medio o Carga Local
                </label>
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... o data URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-800 focus:outline-none focus:border-purple-500"
                />
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">o también:</span>
                  <input
                    type="file"
                    ref={quickFileInputRef}
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const url = URL.createObjectURL(file);
                        setManualUrl(url);
                        setManualType(file.type.startsWith("video/") ? "video" : "photo");
                        if (!manualTitle) setManualTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => quickFileInputRef.current?.click()}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 underline cursor-pointer"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>Seleccionar archivo de tu PC</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!manualUrl}
                  className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-40 transition"
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
