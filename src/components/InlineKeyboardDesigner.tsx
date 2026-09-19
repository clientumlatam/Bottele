import React, { useState } from "react";
import { LayoutGrid, Plus, Trash2, Edit3, MoveUp, MoveDown, Check, Sparkles, MessageSquare, CreditCard, ExternalLink, RefreshCw } from "lucide-react";

export interface InlineButtonConfig {
  id: string;
  text: string;
  action: string;
  category?: "vip" | "payment" | "info" | "custom";
}

interface InlineKeyboardDesignerProps {
  buttons: InlineButtonConfig[];
  onUpdateButtons: (newButtons: InlineButtonConfig[]) => void;
  onResetDefaults: () => void;
}

export const InlineKeyboardDesigner: React.FC<InlineKeyboardDesignerProps> = ({
  buttons,
  onUpdateButtons,
  onResetDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newButtonText, setNewButtonText] = useState("");
  const [newButtonAction, setNewButtonAction] = useState("");

  const handleAddButton = () => {
    if (!newButtonText.trim()) return;
    const newBtn: InlineButtonConfig = {
      id: `btn-${Date.now()}`,
      text: newButtonText.trim(),
      action: newButtonAction.trim().toUpperCase() || `CUSTOM_${Date.now()}`,
      category: "custom",
    };
    onUpdateButtons([...buttons, newBtn]);
    setNewButtonText("");
    setNewButtonAction("");
  };

  const handleDeleteButton = (id: string) => {
    onUpdateButtons(buttons.filter((b) => b.id !== id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= buttons.length) return;
    const updated = [...buttons];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateButtons(updated);
  };

  const handleEditChange = (id: string, text: string, action: string) => {
    onUpdateButtons(
      buttons.map((b) => (b.id === id ? { ...b, text, action } : b))
    );
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-black p-2 text-white shadow-sm">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black tracking-tight flex items-center gap-1.5">
              Diseñador de Teclado Inline Telegram (`Inline Keyboard Designer`)
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold text-zinc-700 uppercase border border-zinc-200">
                Custom Bot Buttons
              </span>
            </h4>
            <p className="text-[11px] text-zinc-500">
              Personalizá el diseño y los botones interactivos que tu bot enviará en el mensaje de bienvenida.
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-all"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Restablecer Predeterminados</span>
        </button>
      </div>

      {/* Button Creator Form */}
      <div className="rounded-xl bg-[#F9FAFB] p-3.5 border border-[#E5E7EB] space-y-3">
        <span className="font-bold text-xs text-black block">
          ➕ Agregar Nuevo Botón al Mensaje:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            placeholder="Texto del botón (ej. 🌟 Ver Galería Exclusiva)"
            value={newButtonText}
            onChange={(e) => setNewButtonText(e.target.value)}
            className="sm:col-span-6 font-semibold text-xs rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
          />
          <input
            type="text"
            placeholder="Acción / Action ID (ej. SHOW_GALLERY)"
            value={newButtonAction}
            onChange={(e) => setNewButtonAction(e.target.value)}
            className="sm:col-span-4 font-mono text-xs rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-zinc-900 focus:border-black focus:outline-none"
          />
          <button
            onClick={handleAddButton}
            disabled={!newButtonText.trim()}
            className="sm:col-span-2 flex items-center justify-center gap-1 rounded-xl bg-black px-3 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar</span>
          </button>
        </div>
      </div>

      {/* Existing Buttons List & Drag Reorder */}
      <div className="space-y-2">
        <span className="font-bold text-xs text-zinc-700 block">
          📋 Botones Configurados ({buttons.length}):
        </span>

        <div className="space-y-2">
          {buttons.map((btn, idx) => (
            <div
              key={btn.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-2.5 shadow-2xs hover:border-zinc-300 transition-all"
            >
              <div className="flex items-center gap-2 flex-1">
                {/* Up / Down Controls */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-0.5 text-zinc-400 hover:text-black disabled:opacity-20"
                  >
                    <MoveUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === buttons.length - 1}
                    className="p-0.5 text-zinc-400 hover:text-black disabled:opacity-20"
                  >
                    <MoveDown className="h-3 w-3" />
                  </button>
                </div>

                {/* Inline Editing or Preview */}
                {editingId === btn.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={btn.text}
                      onChange={(e) => handleEditChange(btn.id, e.target.value, btn.action)}
                      className="flex-1 font-bold text-xs rounded-lg border border-black px-2 py-1 text-black"
                    />
                    <input
                      type="text"
                      value={btn.action}
                      onChange={(e) => handleEditChange(btn.id, btn.text, e.target.value)}
                      className="w-32 font-mono text-[11px] rounded-lg border border-black px-2 py-1 text-zinc-700"
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-black px-2 py-1 text-xs text-white font-bold"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <span className="font-bold text-xs text-zinc-900 rounded-lg bg-zinc-100 border border-zinc-200 px-3 py-1">
                      {btn.text}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                      action: {btn.action}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingId(editingId === btn.id ? null : btn.id)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black transition-all"
                  title="Editar Botón"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteButton(btn.id)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
                  title="Eliminar Botón"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
