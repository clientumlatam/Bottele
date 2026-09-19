const fs = require('fs');

let wizardContent = fs.readFileSync('src/components/BatchCloneWizard.tsx', 'utf8');

// Replace niche and personality references which were removed from newProfile definition,
// but they still need to match the UI if we changed AiInfluencer, 
// wait, AiInfluencer has 'vibe', 'facialCharacteristics', 'bio'.
wizardContent = wizardContent.replace('{generatedProfile.niche}', '{generatedProfile.vibe}');
wizardContent = wizardContent.replace('"{generatedProfile.personality}"', '"{generatedProfile.facialCharacteristics}"');
wizardContent = wizardContent.replace('{generatedProfile.voicePrompt}', '{generatedProfile.bio.substring(0, 50)}...');

fs.writeFileSync('src/components/BatchCloneWizard.tsx', wizardContent);
