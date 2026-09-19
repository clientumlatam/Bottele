const fs = require('fs');

// 1. Fix App.tsx missing Sparkles
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
const iconImportLine = 'import { ArrowUp, Database, Wand2, RefreshCw, Bot, Users, Code2, ShieldCheck } from "lucide-react";';
if (appContent.includes(iconImportLine)) {
  appContent = appContent.replace(
    iconImportLine,
    'import { ArrowUp, Database, Wand2, RefreshCw, Bot, Users, Code2, ShieldCheck, Sparkles } from "lucide-react";'
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

// 2. Fix BatchCloneWizard.tsx type errors
let wizardContent = fs.readFileSync('src/components/BatchCloneWizard.tsx', 'utf8');
// 'niche' is not in AiInfluencer, but 'vibe' and 'handle' and 'nationality' are required.
const newProfileStr = `const newProfile: AiInfluencer = {
        id: "auto-gen-" + Date.now(),
        name: "Valentina (Clon IA)",
        handle: "@valentina_clon",
        age: 23,
        nationality: "Argentina",
        vibe: "Lifestyle & Fitness",
        avatarUrl: faceUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        bio: "Chica fitness de Buenos Aires. Amante del gym, la vida sana y los viajes.",
        facialCharacteristics: "Rubia, rostro simétrico, pecas.",
        characterTags: "valentina, blonde hair, fitness model, sharp facial features, highly detailed face",
        recommendedPricing: { sui: 15, usdc: 15, tierName: "VIP" },
        contentPillars: ["Fitness", "Lifestyle"],
        promptPresets: []
      };`;
// Replace the old profile string. Let's use regex to replace everything between const newProfile: AiInfluencer = { and };
wizardContent = wizardContent.replace(/const newProfile: AiInfluencer = \{[\s\S]*?\};\n/g, newProfileStr + '\n');

// Replace status type casting
wizardContent = wizardContent.replace(
  'Object.values(batchResults).filter(v => v.status === \'done\')',
  'Object.values(batchResults).filter((v: any) => v.status === \'done\')'
);

fs.writeFileSync('src/components/BatchCloneWizard.tsx', wizardContent);
