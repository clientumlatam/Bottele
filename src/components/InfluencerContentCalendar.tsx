import React, { useState } from "react";
import { AiInfluencer, ModelMediaItem } from "../types";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Send, 
  Image as ImageIcon, 
  Film, 
  Sparkles, 
  GripVertical,
  CheckCircle2,
  CalendarDays,
  Bot
} from "lucide-react";

interface ScheduledPost {
  id: string;
  dayOfWeek: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";
  time: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType: "photo" | "video";
  status: "scheduled" | "sent";
  channel: "VIP Channel" | "Free Preview Channel" | "Stories";
}

interface InfluencerContentCalendarProps {
  influencer: AiInfluencer;
  onUpdateInfluencer: (updated: AiInfluencer) => void;
}

const DAYS_OF_WEEK: ("Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo")[] = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

export const InfluencerContentCalendar: React.FC<InfluencerContentCalendarProps> = ({
  influencer,
  onUpdateInfluencer,
}) => {
  // Initial sample scheduled posts if none stored in influencer or state
  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: "post-1",
      dayOfWeek: "Lunes",
      time: "09:00",
      title: "Morning Golden Hour Teaser",
      caption: "Buenos días mis amores... ¿Listos para arrancar la semana con toda la energía? 🔥☕",
      mediaUrl: influencer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      mediaType: "photo",
      status: "scheduled",
      channel: "VIP Channel"
    },
    {
      id: "post-2",
      dayOfWeek: "Miércoles",
      time: "18:30",
      title: "Kling AI VIP Motion Preview",
      caption: "Nuevo reel exclusivo generado en Kling 3.0. Disponible ahora en el canal VIP 🎬✨",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lights-42999-large.mp4",
      mediaType: "video",
      status: "scheduled",
      channel: "VIP Channel"
    },
    {
      id: "post-3",
      dayOfWeek: "Viernes",
      time: "21:00",
      title: "Weekend Nightlife Preview",
      caption: "Preparándome para salir... ¿Quién me acompaña esta noche? 🍸🖤",
      mediaUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      mediaType: "photo",
      status: "scheduled",
      channel: "Free Preview Channel"
    }
  ]);

  const [activeDayTab, setActiveDayTab] = useState<"Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo">("Lunes");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Drag and drop state
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const [newDay, setNewDay] = useState<"Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo">("Lunes");
  const [newCaption, setNewCaption] = useState("");
  const [newChannel, setNewChannel] = useState<"VIP Channel" | "Free Preview Channel" | "Stories">("VIP Channel");
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>(influencer.avatarUrl || "");
  const [newMediaType, setNewMediaType] = useState<"photo" | "video">("photo");

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      dayOfWeek: newDay,
      time: newTime,
      title: newTitle,
      caption: newCaption || `Nuevo contenido exclusivo de ${influencer.name}`,
      mediaUrl: selectedMediaUrl || influencer.avatarUrl,
      mediaType: newMediaType,
      status: "scheduled",
      channel: newChannel
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewCaption("");
    setIsAddModalOpen(false);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedPostId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDay = (e: React.DragEvent, targetDay: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo") => {
    e.preventDefault();
    if (!draggedPostId) return;

    setPosts(posts.map(post => {
      if (post.id === draggedPostId) {
        return { ...post, dayOfWeek: targetDay };
      }
      return post;
    }));
    setDraggedPostId(null);
  };

  const galleryItems = influencer.galleryMedia || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Automatización Telegram
              </span>
              <h3 className="text-lg font-bold text-black tracking-tight">
                Calendario de Contenido Semanal ({influencer.name})
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Programa, arrastra y suelta posteos automatizados (fotos/videos) para los canales VIP y de adelantos de tu influencer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Programar Nuevo Posteo</span>
            </button>
          </div>
        </div>

        {/* Days of Week Tabs / Drop Targets */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const count = posts.filter(p => p.dayOfWeek === day).length;
            const isActive = activeDayTab === day;
            return (
              <div
                key={day}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnDay(e, day)}
                onClick={() => setActiveDayTab(day)}
                className={`cursor-pointer rounded-xl border p-3 transition-all text-center flex flex-col justify-between ${
                  isActive 
                    ? "border-black bg-black text-white shadow-sm" 
                    : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-zinc-300" : "text-zinc-400"}`}>
                    Día
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive ? "bg-zinc-800 text-purple-300" : "bg-purple-100 text-purple-800"
                  }`}>
                    {count}
                  </span>
                </div>
                <h4 className="text-sm font-black mt-2">{day}</h4>
                <p className={`text-[10px] mt-1 ${isActive ? "text-zinc-400" : "text-zinc-500"}`}>
                  {count === 0 ? "Sin posteos" : `${count} programado${count > 1 ? 's' : ''}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Posts List (Drag and Drop enabled) */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-600" />
            <h4 className="font-bold text-sm text-zinc-900">
              Posteos Programados para el <span className="text-purple-600 underline">{activeDayTab}</span>
            </h4>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            💡 Consejo: Puedes arrastrar tarjetas entre los días de la semana arriba.
          </span>
        </div>

        {posts.filter(p => p.dayOfWeek === activeDayTab).length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 space-y-3">
            <Calendar className="h-10 w-10 text-zinc-300 mx-auto" />
            <div>
              <p className="text-xs font-bold text-zinc-700">No hay posteos programados para el {activeDayTab}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Haz clic en el botón superior para programar contenido automático en Telegram.</p>
            </div>
            <button
              onClick={() => {
                setNewDay(activeDayTab);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-black px-3.5 py-2 text-xs font-bold text-white hover:bg-zinc-800"
            >
              <Plus className="h-3.5 w-3.5" /> Programar en {activeDayTab}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts
              .filter(p => p.dayOfWeek === activeDayTab)
              .map((post) => (
                <div
                  key={post.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, post.id)}
                  className="group relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-xl bg-zinc-900 overflow-hidden shrink-0 relative">
                        {post.mediaType === "video" ? (
                          <video src={post.mediaUrl} className="h-full w-full object-cover" muted />
                        ) : (
                          <img src={post.mediaUrl} alt={post.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-purple-100 text-purple-800 px-1.5 py-0.2 text-[9px] font-bold">
                            {post.channel}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1 font-bold">
                            <Clock className="h-3 w-3" /> {post.time}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-zinc-900 mt-1 line-clamp-1">{post.title}</h5>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400 group-hover:text-zinc-700">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 line-clamp-2 italic">
                    "{post.caption}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Telegram Bot Listo
                    </span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-rose-600 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Eliminar posteo programado"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Scheduled Post Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-base text-zinc-900">Programar Posteo Automático en Telegram</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-7 w-7 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Título de la Campaña / Post</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Teaser exclusivo bañador VIP"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Día de la Semana</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Hora de Envío (UTC)</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Canal de Telegram Destino</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                  >
                    <option value="VIP Channel">Canal VIP de Suscriptores</option>
                    <option value="Free Preview Channel">Canal Público / Adelantos</option>
                    <option value="Stories">Telegram Stories 24h</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Tipo de Archivo</label>
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                  >
                    <option value="photo">Foto 4K (Flux)</option>
                    <option value="video">Video (Kling Motion)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Seleccionar desde Galería Multimedia</label>
                <select
                  value={selectedMediaUrl}
                  onChange={(e) => setSelectedMediaUrl(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
                >
                  <option value={influencer.avatarUrl}>Avatar Principal ({influencer.name})</option>
                  {galleryItems.map(item => (
                    <option key={item.id} value={item.url}>{item.title} ({item.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Texto del Post / Caption para Telegram</label>
                <textarea
                  rows={3}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Escribe el mensaje que acompañará la foto o video..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold text-xs shadow-sm"
                >
                  Programar en Calendario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
