# 🚀 AGENCIA TELESUI - Especificación del Proyecto, Funcionalidades y Hoja de Ruta (Roadmap)

Este documento detalla todas las características implementadas en la plataforma **TeleSui Agency**, la arquitectura técnica actual y los requerimientos necesarios para desplegar el sistema a un entorno de producción real de 100% funcionamiento.

---

## 📋 1. Funcionalidades Implementadas (Features Actuales)

La plataforma **TeleSui Agency** funciona como un **Centro de Control y Arquitectura de Negocios** de extremo a extremo para creadores y agencias de influencers virtuales. A continuación se detallan los módulos desarrollados:

### 📊 A. Dashboard de Mando Principal (`DashboardOverview.tsx`)
* **Barra de Infraestructura en Tiempo Real:** Monitor de salud de Sui Mainnet RPC, latencia de Webhooks de Telegram, motor de IA activo (Gemini 3.6 Flash / Fal.ai) y persistencia E2E.
* **Mapeo de Métricas Clave:** Resumen de la influencer virtual activa, conteo de suscriptores VIP (+18% mensual), facturación MRR proyectada en SUI/USDC y automatización del Bot.
* **Navegador Interactivo de Flujo (Pasos del 1 al 7):** Acceso directo en un solo clic a los 7 módulos estratégicos del proyecto.
* **Organización por Fases Operativas:** División clara entre **Fase 1 (Estudio Creativo & IA)** y **Fase 2 (Monetización Web3 & Bot de Telegram)**.

### 📅 B. Calendario de Contenido Semanal & Drag-and-Drop (`InfluencerContentCalendar.tsx`)
* **Programación Semanal de Lanzamientos:** Asignación de posteos (imágenes y videos 9:16) a días específicos (Lunes a Domingo) con horarios en formato UTC.
* **Canales Destino de Telegram:** Clasificación automática para *Canal VIP de Suscriptores*, *Canal Público de Adelantos* y *Telegram Stories 24h*.
* **Reordenamiento Interactivo Drag & Drop:** Arrastrado de tarjetas entre días de la semana con actualización inmediata de parrilla.
* **Conexión con la Galería de Activos:** Selección directa desde las imágenes/videos generados por la influencer.

### 👤 C. Influencers IA & Bloqueo Facial (`InfluencerStudio.tsx`)
* **Consistencia Facial Garantizada (Character Lock):** Inyección de *Character Tags* ponderados únicos (ej: `(sweet_blondie_hot_arg:1.35)`) para asegurar idéntica geometría facial en cualquier modelo difusor (Flux.1, SDXL, OpenArt).
* **Gestión de Perfiles y Lore:** Modelos preconfiguradas con biografía, historia de fondo, nicho de mercado y estrategia de precios ajustables.
* **Generación Automática con Gemini 3.6 Flash:** Endpoint API backend (`/api/ai/generate-influencer`) que sintetiza identidades completas con prompts, estética y estrategias de monetización.
* **Módulo de Voz & Clonación (ElevenLabs):** Grabador y sintetizador de notas de voz en español latino para mensajes de audio personalizados en Telegram.

### 🖼️ D. Galería Multimedia & Modal de Inspección 4K (`InfluencerMediaGallery.tsx`)
* **Visualizador de Activos 9:16:** Catálogo de imágenes 8K y videos en formato vertical con etiquetas VIP.
* **Modal "Expand" de Alta Resolución (`Maximize2`):** Vista ampliada para inspección minuciosa de piel, iluminación y coherencia facial antes de despliegues en lote.
* **Manejo Elegante de Caídas de Video:** Fallback automático a capturas en alta resolución cuando los navegadores restringen la reproducción directa de MP4.

### 🎬 E. Estudio de Video y Animación (`VideoMotionStudio.tsx`)
* **Control Fino de Parámetros de Animación:** 
  * Intensidad de dinámica y movimiento (escalado 1.0 a 10.0).
  * Trayectorias de cámara kinemáticas (*Zoom In*, *Pull Out*, *Paneo Izquierdo/Derecho* y *Foco Fijo*).
  * Simulación de temblor orgánico de celular (*Handheld Smartphone Shake Effect*).
* **Integración de Plantillas Video-a-Video:** Ajustes optimizados para motores de animación de última generación (**Kling 3.0, Luma Dream Machine, Haiper AI**).

### 🔞 F. Bóveda de Prompts 9:16 (`PromptVault.tsx`)
* **Librería de Prompts Probados en Producción:** Prompts refinados para **Flux.1, OpenArt, Midjourney v6.1 y Kling 3.0**.
* **Categoría Exclusiva 🔞 Lencería & VIP Erótico:** Prompts especializados en fotografía boudoir 4K, encaje, iluminación tenue de velas y selfies candid nocturnas en espejo con flash directo de celular.
* **Copiado Inteligente:** Botones de un solo clic para copiar Prompt Positivo, Prompt Negativo y Parámetros de Animación Kling de forma independiente.

### 📱 G. Simulador Interactivo de Bot de Telegram (`TelegramBotSimulator.tsx`)
* **Mockup de Celular UI Realista:** Interfaz interactiva de Telegram en tiempo real con simulación de estados de conversación y respuestas sintetizadas por Gemini 3.6 Flash.
* **Generador de Código QR Escaneable Integrado (`qrcode.react`):** 
  * Renderizado vectorial SVG de alta densidad (Error Level H).
  * Selección de formato de payload: **Dirección Raw (`0x...`)** o **SUI DeepLink (`sui:0x...?amount=...`)**.
  * Modal desplegable (*Sheet Modal*) dentro del celular del usuario para escaneo directo desde billeteras como Slush Wallet o `@wallet`.
* **Panel de Pruebas (Testbench Quick Actions):** Botones para simular comandos `/start`, pago detectado on-chain, emisión de enlace único de invitación (`createChatInviteLink`) y notificaciones de bienvenida.

### 🛠️ H. Generador de Repositorio & Código de Bot (`SuiPaybotRepo.tsx`)
* **Motor de Código Dinámico:** Genera el código fuente completo en Node.js/TypeScript impulsado por `telegraf` y `@mysten/sui`.
* **Sincronización en Tiempo Real:** Las modificaciones en los parámetros UI (billetera administradora, precio SUI, token bot) se reflejan inmediatamente en los archivos `.env` e `index.js`.
* **Exportación en 1 Clic:** Botón para descargar todo el paquete del repositorio (`bundle.txt`) listo para desplegar en servidor.

### 📊 I. Embudo de Ventas & Calculadora de Ingresos (`FunnelBlueprint.tsx` / `RevenueCalculator.tsx`)
* **Simulador de MRR (Ingresos Mensuales Recurrentes):** Cálculo dinámico de facturación proyectada según volumen de impresiones en redes sociales, porcentaje de conversión al canal gratuito y porcentaje de conversión a suscriptores VIP SUI.
* **Comparador de Ahorros Web2 vs Web3:** Demostración cuantitativa del ahorro anual al eliminar la comisión del 20%-30% de OnlyFans/Cafecito mediante cobros peer-to-peer en Sui Blockchain.

### 🎭 J. Fotos, Videos & Estudio Interactivo de Face Swap (`FaceSwapStudio.tsx`)
* **Galería Multimedia de Modelos IA:** Visualizador interactivo de fotos 8K HD y reproductores de video 9:16.
* **Intercambiador de Rostros (Face Swap Engine & Simulator):**
  * Selección de modelo origen (Sweet Blondie, Valeria Vance, Maya Lin, Chloé Dubois) con inyección automática de *Character Tags*.
  * Elección de video/foto destino entre plantillas virales 9:16 o subida directa de archivos locales por el usuario.
  * Ajuste fino de parámetros: Selección de motor (`InsightFace + CodeFormer 4K`, `ComfyUI ReActor Node`, `DeepFaceLab 2.0`), peso de restauración facial (0.1 a 1.0) y alineación de tono de piel.
  * Visualizador comparativo Antes vs Después (*Side-by-Side View* y *Swapped Only*).
  * Código de producción en Python (`replicate.run("lucataco/faceswap...")`) listo para integrar en servidores de producción.

### 🌙 K. Modo Nocturno / Alto Contraste (`HeaderBar.tsx`)
* **Tema Oscuro Persistente:** Interruptor en la barra superior con transiciones fluidas y almacenamiento en `localStorage` para proteger la vista en jornadas nocturnas.

---

## 🛠️ 2. Arquitectura de Backend & Resiliencia IA

El servidor Express (`server.ts`) implementa:
- **Integración con SDK `@google/genai`:** Uso del modelo insignia **`gemini-3.6-flash`**.
- **Mecanismo de Respaldo en Cascada (Cascading Fallback):** Intento secundario con `gemini-1.5-flash` y respuestas offline enriquecidas en español latino en caso de alta demanda o fallos de red.
- **Compilación de Producción:** Compilación con `esbuild` hacia un archivo único bundle CommonJS (`dist/server.cjs`) para evitar errores de módulos Node en contenedores.

---

## 🛠️ 3. Lo que Falta para que Funcione al 100% en Producción Real

La aplicación actual provee todo el **código, interfaz, simulaciones y configuraciones frontend**. Para poner a funcionar el bot de cobros reales y la generación en un servidor en vivo, se requiere lo siguiente:

### ⚡ A. Servidor de Backend & Telegram Bot Token
1. **Creación del Bot en Telegram:**
   * Hablar con `@BotFather` en Telegram para crear un nuevo bot y obtener su `BOT_TOKEN`.
2. **Hosting para el Bot:**
   * Desplegar el archivo `index.ts` generado en la pestaña *Código Repo Bot Sui* en un VPS o PaaS (Railway, Render, Hetzner, Fly.io, AWS EC2, Cloud Run).
   * Comando de inicio: `npm install && npm start`.

### 🔗 B. Conexión Real a la Blockchain de Sui (Sui RPC)
1. **Verificación On-Chain Automática:**
   * En lugar del simulador local, el bot usará el paquete `@mysten/sui` para conectarse a `https://fullnode.mainnet.sui.io:443`.
   * Monitorear los eventos de transferencia entrantes dirigidos a la billetera `ADMIN_SUI_WALLET` filtrando por monto y remitente.

### 👥 C. Permisos del Bot en el Canal VIP
1. **Configuración del Canal Privado:**
   * Crear el canal privado de Telegram para el contenido exclusivo.
   * Agregar el Bot como **Administrador** con permisos de:
     * `can_invite_users` (para generar enlaces dinámicos de 1 solo uso).
     * `can_restrict_members` / `can_promote_members` (para expulsar usuarios si no renuevan).

### 🗄️ D. Base de Datos & Tareas Programadas (Cron Jobs)
1. **Persistencia de Suscripciones:**
   * Agregar una base de datos liviana (SQLite, PostgreSQL con Prisma o Drizzle) para guardar: `telegram_user_id`, `sui_transaction_digest`, `start_date`, `expiration_date` (30 días).
2. **Sistema de Expulsión Automática:**
   * Un script `node-cron` que corra cada 24 horas y llame a `bot.telegram.banChatMember(CHANNEL_ID, userId)` y `unbanChatMember` para expulsar a quienes no hayan renovado su suscripción mensual.

### 🎨 E. Integración con APIs de Animación IA (Opcional)
1. **Conexión API para Generación Automática:**
   * Integración con la API de **Fal.ai**, **Replicate** o un servidor local de **ComfyUI (AnimateDiff)** para enviar los prompts desde la app directamente al motor de renderizado de video sin hacerlo manualmente.

---

## 🎯 Resumen de Arquitectura Final de Producción

```
[Redes Sociales: IG / TikTok] ──> [Enlace en Bio] ──> [Bot de Telegram en Sui]
                                                             │
                                                   (Paga SUI / USDC)
                                                             │
                                                  [Verificación Sui RPC]
                                                             │
                                              [Genera Link Único 1-Uso]
                                                             │
                                                [Canal VIP Exclusivo 4K]
```

