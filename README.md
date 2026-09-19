# 🇦RG AGENCIA TELESUI - AI Influencer Architecture & Sui Bot Platform

Plataforma integral de gestión y monetización de **Influencers de Inteligencia Artificial**, generación de video vertical 9:16, programación semanal automatizada y monetización de canales VIP en **Telegram** mediante cobros peer-to-peer en la **Blockchain de Sui (SUI & USDC)**.

---

## 📄 Documentación Completa del Proyecto

Toda la especificación técnica, lista detallada de funcionalidades, arquitectura del servidor backend y la hoja de ruta para producción se encuentra en:

👉 **[`PROJECT_SPEC.md`](./PROJECT_SPEC.md)**

---

## ⚡ Novedades & Características Principales

- **📊 Dashboard de Mando Renovado:** Control en tiempo real con monitoreo de estado de la red Sui Mainnet, latencia de webhooks de Telegram y navegador interactivo del flujo de trabajo de 7 pasos.
- **📅 Calendario de Contenido Semanal (Drag & Drop):** Planificación visual de lanzamientos automatizados en canales VIP, públicos y Stories de Telegram con reordenamiento arrastrando y soltando tarjetas.
- **🔍 Galería Multimedia 4K con Modal de Inspección:** Vista ampliada de alta resolución para revisar imágenes y videos 9:16, prompts difusores y parámetros de movimiento (Kling 3.0 / Fal.ai) antes de despliegues en masa.
- **👤 Estudio de Influencers IA (Character Lock):** Creación y edición de identidades virtuales consistentes con *Character Tags* ponderados, clones de voz (ElevenLabs) y prompts de generación rápida.
- **🎭 Generador Face Swap 4K:** Sustitución facial hiperrealista (`InsightFace + CodeFormer 4K`) con soporte para previas en fotos y videos 9:16.
- **📱 Simulador de Bot Telegram con QR Sui:** Entorno de pruebas interactivo con renderizado de QR vectores (`qrcode.react`), deep links de billetera Sui y simulador de enlaces de invitación únicos de un solo uso.
- **🌙 Interruptor Modo Nocturno / Alto Contraste:** Interfaz optimizada para largas jornadas de trabajo con tema oscuro persistente.
- **🧠 Backend Node.js con Resiliencia Gemini 3.6 Flash:** Integración robusta con `@google/genai` utilizando `gemini-3.6-flash` y mecanismos de respaldo en cascada ante alta demanda.

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo (Full-Stack Express + Vite en puerto 3000)
npm run dev

# 3. Validar sintaxis y linteo
npm run lint

# 4. Compilar para producción (Frontend dist + Backend CommonJS dist/server.cjs)
npm run build

# 5. Iniciar en producción
npm start
```

---

## 🛠️ Tecnologías & Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Visualización & QR:** `qrcode.react` (Renderizado vectorial SVG de Sui Pay).
- **Backend & Servidor API:** Express, Node.js (`tsx` en desarrollo, `esbuild` en producción), `@google/genai` (SDK oficial Gemini 3.6 Flash).
- **Integración Telegram & Sui:** `telegraf`, `@mysten/sui` (Slush Wallet / Suiet / `@wallet`).
- **Motores IA Soportados:** Flux.1, SDXL, OpenArt, Midjourney v6.1, Kling 3.0, Luma Dream Machine, CodeFormer 4K.

