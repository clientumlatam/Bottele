import React, { useState, useRef, useEffect } from 'react';
import { AiInfluencer } from '../types';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  CheckCheck, 
  Heart, 
  Loader2, 
  Lock,
  Bot,
  Minimize2,
  Play,
  Pause,
  Radio,
  Image as ImageIcon
} from 'lucide-react';

interface FloatingChatWidgetProps {
  influencer: AiInfluencer;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isAudio?: boolean;
  audioDuration?: string;
  mediaUrl?: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ influencer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `¡Hola bombón! 🥰 Qué lindo tenerte por acá. Soy ${influencer.name}, ¿en qué andás hoy?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playTTSVoice = async (text: string, msgId: string) => {
    if (activeAudioId === msgId) {
      if (audioRef.current) audioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setActiveAudioId(null);
      return;
    }

    setLoadingAudioId(msgId);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const voiceId = influencer.voiceProfile?.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM';
    const apiKey = localStorage.getItem('API_KEY_ELEVENLABS') || '';

    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-elevenlabs-key': apiKey,
        },
        body: JSON.stringify({
          text,
          voiceId
        })
      });

      if (!response.ok) {
        let errMsg = 'ElevenLabs proxy error';
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setActiveAudioId(null);
      audio.onerror = () => {
        fallbackBrowserVoice(text, msgId);
      };

      await audio.play();
      setActiveAudioId(msgId);
    } catch (err) {
      console.log("ElevenLabs TTS local fallback active:", err);
      fallbackBrowserVoice(text, msgId);
    } finally {
      setLoadingAudioId(null);
    }
  };

  const fallbackBrowserVoice = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.onend = () => setActiveAudioId(null);
      utterance.onerror = () => setActiveAudioId(null);
      setActiveAudioId(msgId);
      window.speechSynthesis.speak(utterance);
    } else {
      setActiveAudioId(null);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    try {
      const history = messages.slice(-5).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/ai/simulate-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: {
            name: influencer.name,
            vibe: influencer.vibe,
            bio: influencer.bio,
            nationality: 'Argentina / Miami',
          },
          userMessage: textToSend,
          history
        })
      });

      const data = await res.json();
      const botReply = data.reply || `¡Hola corazón! 🥰 Me encanta hablar vos. Si querés contenido exclusivo decime y te paso mi pase VIP ✨`;
      const isAudioPrompt = textToSend.toLowerCase().includes('audio') || textToSend.toLowerCase().includes('voz');

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAudio: isAudioPrompt,
        audioDuration: '0:14'
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // Auto play ElevenLabs voice if requested
      if (isAudioPrompt) {
        setTimeout(() => {
          playTTSVoice(botReply, newBotMsg.id);
        }, 300);
      }

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error simulating chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `¡Ay bombón! 🥰 Gracias por escribirme. ¿Cómo va tu día? Contame un poco más de vos 💕`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "¡Hola hermosa! 🥰",
    "¿Qué estás haciendo hoy?",
    "¿Tenes fotos exclusivas? 🔥",
    "Enviar audio VIP 🎙️"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Floating Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[400px] h-[540px] max-h-[82vh] rounded-3xl bg-[#0e1621] border border-zinc-700/70 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#17212b] px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-purple-500/50 shrink-0">
                <img src={influencer.avatarUrl} alt={influencer.name} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black"></span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white truncate">{influencer.name}</h3>
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-purple-500 text-[9px] font-black text-white">✓</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  En línea • Voice API ElevenLabs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Minimizar chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subheader Badge */}
          <div className="bg-purple-950/40 px-3 py-1.5 border-b border-purple-900/30 flex items-center justify-between text-[11px] text-purple-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Radio className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              Gemini 3.6 + ElevenLabs Voice
            </span>
            <span className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-md font-mono text-[10px] border border-purple-500/20 flex items-center gap-1">
              <Volume2 className="h-3 w-3" /> ElevenLabs
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1621] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-xs'
                      : 'bg-[#182533] text-zinc-100 rounded-bl-xs border border-zinc-700/40'
                  }`}
                >
                  {/* Voice Note Badge if audio msg */}
                  {msg.isAudio && msg.sender === 'bot' && (
                    <div className="mb-2 p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center gap-3">
                      <button
                        onClick={() => playTTSVoice(msg.text, msg.id)}
                        className="h-9 w-9 rounded-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
                      >
                        {loadingAudioId === msg.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : activeAudioId === msg.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] text-purple-200 font-medium">
                          <span>Nota de voz VIP</span>
                          <span>{msg.audioDuration || '0:14'}</span>
                        </div>
                        {/* Audio Wave Visualizer representation */}
                        <div className="mt-1 flex items-center gap-0.5 h-3">
                          {[40, 70, 30, 90, 60, 100, 50, 80, 40, 60, 90, 30, 70, 50].map((h, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full transition-all ${
                                activeAudioId === msg.id ? 'bg-purple-300 animate-pulse' : 'bg-purple-500/40'
                              }`}
                              style={{ height: `${activeAudioId === msg.id ? Math.max(20, Math.round(h * Math.random())) : h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <div className={`mt-1.5 flex items-center justify-between text-[9px] ${msg.sender === 'user' ? 'text-purple-200' : 'text-zinc-400'}`}>
                    {msg.sender === 'bot' ? (
                      <button
                        onClick={() => playTTSVoice(msg.text, msg.id)}
                        className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors bg-purple-950/50 hover:bg-purple-900/70 px-2 py-0.5 rounded-md border border-purple-500/30 font-medium"
                      >
                        {loadingAudioId === msg.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : activeAudioId === msg.id ? (
                          <Pause className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Volume2 className="h-3 w-3 text-purple-400" />
                        )}
                        <span>{activeAudioId === msg.id ? "Pausar Voz" : "Escuchar Voz ElevenLabs"}</span>
                      </button>
                    ) : <span />}

                    <div className="flex items-center gap-1">
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck className="h-3 w-3 text-purple-200" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 bg-[#182533] text-[11px] px-3 py-2 rounded-2xl w-fit border border-zinc-700/40">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                <span>{influencer.name} está grabando audio...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-[#17212b] border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap rounded-xl bg-zinc-800/80 hover:bg-purple-600 hover:text-white px-2.5 py-1 text-[11px] font-medium text-zinc-300 border border-zinc-700/50 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#17212b] border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Mensaje a ${influencer.name}...`}
              className="flex-1 bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2.5 border border-zinc-700 focus:outline-none focus:border-purple-500 placeholder-zinc-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Widget Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 rounded-full bg-black hover:bg-zinc-900 text-white p-2.5 sm:px-4 sm:py-3 shadow-2xl border-2 border-purple-500/80 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-purple-400 shrink-0">
          <img src={influencer.avatarUrl} alt={influencer.name} className="h-full w-full object-cover" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black"></span>
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider leading-none">Simulador Chat & Voz</span>
          <span className="text-xs font-black text-white leading-tight">{influencer.name}</span>
        </div>

        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white">
          {isOpen ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </div>

        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-black animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

