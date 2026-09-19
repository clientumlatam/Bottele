# 📘 Documentación Oficial, Manual de 6 Pasos & Roadmap Estratégico
**Plataforma Integral de Gestión, Monetización y Generación Multimedia de Influencers IA (Sui Network + Telegram VIP)**

---

## 📑 Tabla de Contenidos
1. [Resumen Ejecutivo & Arquitectura del Sistema](#1-resumen-ejecutivo--arquitectura-del-sistema)
2. [Manual Técnico de Operación: El Flujo de 6 Pasos](#2-manual-técnico-de-operación-el-flujo-de-6-pasos)
   - [Paso 1: Rostro Maestro & Creación de Modelo (FaceToModelCreator)](#paso-1-rostro-maestro--creación-de-modelo-facetomodelcreator)
   - [Paso 2: Estudio de Voz Natural Libre (FreeNaturalVoiceStudio)](#paso-2-estudio-de-voz-natural-libre-freenaturalvoicestudio)
   - [Paso 3: Face Swap 4K en Fotos & Videos 9:16 (CustomMediaFaceSwapStudio)](#paso-3-face-swap-4k-en-fotos--videos-916-custommediafaceswapstudio)
   - [Paso 4: Simulador de Bot de Telegram VIP (TelegramBotSimulator)](#paso-4-simulador-de-bot-de-telegram-vip-telegrambotsimulator)
   - [Paso 5: Gestión de Suscriptores & Pagos SUI (SubscriberManagement)](#paso-5-gestión-de-suscriptores--pagos-sui-subscribermanagement)
   - [Paso 6: Código & Despliegue Backend Paybot (SuiPaybotRepo)](#paso-6-código--despliegue-backend-paybot-suipaybotrepo)
3. [Guías Rápidas de Configuración de APIs](#3-guías-rápidas-de-configuración-de-apis)
   - [3.1 Google Gemini API (Imprescindible)](#31-google-gemini-api-imprescindible)
   - [3.2 ElevenLabs API (Síntesis Vocal Premium Opcional)](#32-elevenlabs-api-síntesis-vocal-premium-opcional)
   - [3.3 Fal.ai Cloud API (Aceleración GPU & Face Swap Serverless)](#33-falai-cloud-api-aceleración-gpu--face-swap-serverless)
4. [Hitos de Escalabilidad para PayBot SUI & Red Web3](#4-hitos-de-escalabilidad-para-paybot-sui--red-web3)
5. [Optimizaciones para el Flujo de Trabajo de Modelos IA](#5-optimizaciones-para-el-flujo-de-trabajo-de-modelos-ia)
6. [Roadmap Estratégico de Producto (Línea de Tiempo v1.5 - v3.0)](#6-roadmap-estratégico-de-producto-línea-de-tiempo-v15---v30)

---

## 1. Resumen Ejecutivo & Arquitectura del Sistema

TeleSui Agency Studio es una suite integral **All-in-One** diseñada para agencias de influencers virtuales, creadores de contenido y administradores de comunidades VIP. La arquitectura conecta tres pilares clave:

```
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│ Generación IA Multimedia│ ───► │ Motor Vocal & Persona   │ ───► │ PayBot Web3 Sui Network │
│ InsightFace + CodeFormer│      │ Web Speech API & Gemini │      │ Telegram VIP Automation │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

1. **Generación Multimedia 4K**: Transferencia facial (Face Swap) ultrarrealista sobre fotos y videos 9:16 mediante motores InsightFace y restauración facial CodeFormer.
2. **Síntesis Vocal & Personalidad IA**: Motor de voz natural 100% gratuito sin requerir API keys de pago, modulable según personalidad (**Seductora, Profesional, Divertida, Formal**).
3. **Monetización Web3 en Sui Network**: Cobro automatizado de membresías VIP en tokens SUI/ARS a través de Telegram Paybots, verificación en la cadena de bloques Sui y gestión de tesorería con Liquid Staking.

---

## 2. Manual Técnico de Operación: El Flujo de 6 Pasos

### Paso 1: Rostro Maestro & Creación de Modelo (FaceToModelCreator)
- **Objetivo**: Establecer la identidad visual primaria y los parámetros genéricos de la modelo virtual.
- **Flujo de Operación**:
  1. Haz clic en **Sustituir Rostro Maestro** o selecciona un perfil predeterminado.
  2. Sube una fotografía frontal clara (resolución recomendada 1024x1024 px).
  3. Ejecuta el análisis automático: el sistema derivará vectores faciales, nombre artístico, biografía en español e inglés, prompt maestro para Stable Diffusion/Flux y voz sugerida.
  4. Presiona **Guardar en Catálogo** o exporta la configuración completa en formato `.json` o `.zip`.

### Paso 2: Estudio de Voz Natural Libre (FreeNaturalVoiceStudio)
- **Objetivo**: Producir notas de voz y saludos en español e inglés sin costo de consumo API.
- **Flujo de Operación**:
  1. Selecciona un guión de prueba de la biblioteca ("Saludo VIP", "Promoción Suscripción") o escribe un texto personalizado.
  2. Elige la acentuación deseada (Español Latino, México, España, EE.UU.) y selecciona la tonalidad conversacional.
  3. Modula la velocidad (rate) y el tono (pitch) con los controles deslizantes.
  4. Genera la pista y escúchala en la onda interactiva. Puedes descargar el archivo en MP3/WAV o presionar **Enviar a Simulador Telegram** para audicionar la respuesta del bot.

### Paso 3: Face Swap 4K en Fotos & Videos 9:16 (CustomMediaFaceSwapStudio)
- **Objetivo**: Transferir el rostro de la modelo virtual sobre cualquier foto o video vertical (TikTok/Reels).
- **Flujo de Operación**:
  1. Sube un archivo de video MP4 o foto base por cada modelo.
  2. Configura los parámetros de restauración facial:
     - **CodeFormer Weight**: (Recomendado `0.80 - 0.90`) restaura poros, pestañas y detalles 4K.
     - **Skin Tone Alignment**: (`80% - 95%`) mezcla la coloración del rostro origen con la luz ambiental del medio destino.
  3. Haz clic en **Ejecutar Face Swap 4K**.
  4. Copia las descripciones y hashtags autogenerados por Gemini AI para TikTok/Reels/X y revisa la pieza en la **Galería Interactiva Masonry**.

### Paso 4: Simulador de Bot de Telegram VIP (TelegramBotSimulator)
- **Objetivo**: Audicionar la experiencia del usuario final en el canal privado de Telegram.
- **Flujo de Operación**:
  1. Utiliza el emulador de chat en pantalla para enviar comandos `/start`, `/pay` o mensajes de texto.
  2. Observa la respuesta interactiva del bot con teclados inline de pago.
  3. Simula una transacción en Sui Network: el bot verificará el digest en Sui Mainnet y responderá con un enlace de invitación temporal de uso único.
  4. Recibe notas de voz de la modelo directamente dentro de la ventana de chat.

### Paso 5: Gestión de Suscriptores & Pagos SUI (SubscriberManagement)
- **Objetivo**: Administrar la tesorería, auditoría de miembros y automatizar expulsiones por membresía vencida.
- **Flujo de Operación**:
  1. Revisa la tabla de suscriptores con filtros de estado (**Activo**, **Por Vencer <48h**, **Expirado**).
  2. Examina el gráfico interactivo de **Lifetime Value (LTV)** por origen de tráfico (Telegram VIP vs. Enlace Directo).
  3. Activa o desactiva el **Cron de Auto-Kick** (Kick-Bot) para mantener el canal libre de usuarios impagos.
  4. Utiliza el calculador de **Liquid Staking Sui** para delegar ingresos en nodos de validación (Volo / Haedal) y generar rendimientos pasivos en SUI.

### Paso 6: Código & Despliegue Backend Paybot (SuiPaybotRepo)
- **Objetivo**: Obtener el código fuente de producción en Node.js / TypeScript listo para despliegue en VPS o Docker.
- **Flujo de Operación**:
  1. Define las variables de entorno (`TELEGRAM_BOT_TOKEN`, `ADMIN_SUI_WALLET`, `SUBSCRIBER_PRICE`).
  2. Copia el archivo `server.ts` empaquetado o descarga el archivo `.zip` del repositorio.
  3. Ejecuta los comandos:
     ```bash
     npm install
     npm run build
     npm start
     ```
  4. Valida el funcionamiento enviando webhooks de prueba desde el probador de endpoints integrado.

---

## 3. Guías Rápidas de Configuración de APIs

### 3.1 Google Gemini API (Imprescindible)
La API de Gemini alimenta la creación de biografías, prompts de difusión, copies para redes sociales y la lógica conversacional del bot de Telegram.

1. Visita [Google AI Studio](https://aistudio.google.com/) e inicia sesión con tu cuenta de Google.
2. Haz clic en **Get API Key** y crea una clave en un proyecto nuevo o existente.
3. Configura la clave en el archivo `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy_tu_clave_de_google_ai_studio
   ```
4. Verificación en código (Server-side):
   ```typescript
   import { GoogleGenAI } from "@google/genai";
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
   ```

### 3.2 ElevenLabs API (Síntesis Vocal Premium Opcional)
Para agencias que requieren clonación exacta de voz a partir de audios de muestra de 1 minuto:

1. Crea una cuenta en [ElevenLabs](https://elevenlabs.io/).
2. Ve a **Profile Settings -> API Keys** y genera un nuevo API Key.
3. En la sección **Voice Lab**, clona la voz de tu modelo y copia su `Voice ID`.
4. Agrega las credenciales en `.env`:
   ```env
   ELEVENLABS_API_KEY=xi_tu_clave_elevenlabs
   ```

### 3.3 Fal.ai Cloud API (Aceleración GPU & Face Swap Serverless)
Para procesar cientos de videos de alta duración sin saturar servidores locales:

1. Crea una cuenta en [Fal.ai](https://fal.ai/).
2. Copia tu `FAL_KEY` desde el Dashboard.
3. Agrega la clave a tu entorno:
   ```env
   FAL_KEY=fal_tu_clave_secret
   ```
4. Invoca los modelos serverless `fal-ai/insightface` y `fal-ai/codeformer` directamente vía HTTP REST con webhooks de finalización.

---

## 4. Hitos de Escalabilidad para PayBot SUI & Red Web3

Para llevar el bot de Telegram a decenas de miles de suscriptores concurrentes, el roadmap contempla los siguientes hitos técnicos:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     HITOS DE ESCALABILIDAD SUI PAYBOT                       │
├───────────────────────┬───────────────────────┬─────────────────────────────┤
│ 1. Webhook Multi-Node │ 2. Sui Move Contracts │ 3. Staking Yield Auto-Route │
│ Redis + Worker Threads│ Vault & Allowances    │ Auto-re-investing in SUI    │
└───────────────────────┴───────────────────────┴─────────────────────────────┘
```

1. **Gestión de Webhooks Concurrentes con Cluster Redis**:
   - Transición de HTTP Polling tradicional a Webhooks de alta velocidad procesados con **BullMQ + Redis**.
   - Capacidad de procesar más de 2,000 eventos de Telegram por segundo sin bloqueo de bucle de eventos en Node.js.

2. **Smart Contracts de Suscripción Recurrente en Sui Move (`subscription_vault.move`)**:
   - Creación de un contrato inteligente Move en Sui que permite autorizaciones de débito periódico (allowance) en SUI o USDC nativo.
   - Eliminación de la necesidad de transferencias manuales mensuales por parte del usuario.

3. **Pools de Nodos RPC con Fallback Automático**:
   - Conexión simultánea a múltiples proveedores de nodos Sui (Mysten Labs, Chainstack, QuickNode).
   - Conmutación automática de peticiones RPC en caso de latencia superior a 400 ms o caídas temporales de la red.

4. **Automatización de Rendimiento por Liquid Staking**:
   - Integración con SDKs de **Volo (vSUI)** y **Haedal (haSUI)** para delegar automáticamente el 80% de los fondos recaudados en validadores de alto rendimiento.
   - Generación de un 7% a 9% APY adicional sobre la tesorería de la agencia en tokens SUI.

---

## 5. Optimizaciones para el Flujo de Trabajo de Modelos IA

Para acelerar la entrega de contenido multimedia de 15 minutos a menos de 5 segundos por video:

1. **Extracción y Cacheado Permanente de Embeddings Faciales 512d**:
   - Cálculo único de la mímica facial del rostro maestro mediante InsightFace (ArcFace 512-dimensional vector).
   - Almacenamiento en caché en memoria (In-Memory Tensor Cache) para evitar la re-evaluación del rostro origen en cada renderizado.

2. **Aceleración TensorRT & CUDA FP16**:
   - Compilación de los modelos ONNX de InsightFace y CodeFormer a ejecutables nativos TensorRT FP16.
   - Incremento del rendimiento de procesado de 12 FPS a 110 FPS en GPUs NVIDIA RTX 4090 / A10G.

3. **Arquitectura Cascading Fallback (Cloud Serverless + Local GPU)**:
   - Procesamiento local para vistas previas rápidas en baja resolución.
   - Derivación automática de videos 4K de más de 30 segundos a clústeres serverless en Fal.ai / Replicate con respuesta vía WebSockets.

4. **Sincronización Labial 3D (Wav2Lip + SadTalker)**:
   - Inserción de un pase secundario de deformación de malla bucal alineando los fonemas del audio sintetizado con el movimiento de los labios en el video.

---

## 6. Roadmap Estratégico de Producto (Línea de Tiempo v1.5 - v3.0)

| Versión | Período | Hito Principal | Estado | Entregables Clave |
|---|---|---|---|---|
| **v1.5** | Q3 2026 | Infraestructura Base & Studio 4K | **COMPLETADO** | Face Swap fotos/videos 9:16, CodeFormer, Voz Natural Free, Simulador Telegram, LTV Recharts, Exportación ZIP/JSON. |
| **v2.0** | Q4 2026 | Auto-Poster & Aceleración Cloud | **EN DESARROLLO** | Publicador automático Telegram/X, Fal.ai Cloud GPU Fallbacks, Wav2Lip 3D Lipsync, Multi-modelo per-agent. |
| **v2.5** | Q1 2027 | Agentes RAG & Sui Move Contracts | **PLANIFICADO** | Chatters IA con memoria a largo plazo en Firestore Vector, Contratos Move en Sui para pagos recurrentes, Dashboard de agencias multi-tenant. |
| **v3.0** | Q2 2027 | Marketplace NFT & Avatar Live | **PLANIFICADO** | Tokenización de identidades de modelos en Sui Kiosk, Emisiones Live en tiempo real con WebRTC, SDK pública REST/GraphQL. |

---

*Documento técnico actualizado automáticamente para TeleSui Agency Studio v1.5.*
