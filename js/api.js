import { generateHarmony } from './color-theory.js';

export async function fetchPalette(textPrompt) {
    const messages = [
        {
            role: "system",
            content: `You are an expert Color Architect.
    Your task is NOT to generate the full palette, but to define the **Core Visual DNA** for the request.
    
    INSTRUCTIONS:
    1. Analyze the User's Request (Mood, Theme, Emotion).
    2. Determine the single best **Base Color** (Hex) that represents this theme.
    3. Choose the best **Harmony Rule** (Analogous, Complementary, Split-Complementary, Triadic, Monochromatic).
    4. Define the **Mood** (Standard, Vibrant, Pastel, Dark, Cyberpunk).
    
    EXAMPLES:
    - "Cyberpunk city": { "baseColor": "#00ff9d", "harmony": "Split-Complementary", "mood": "Cyberpunk" }
    - "Corporate bank": { "baseColor": "#1e3a8a", "harmony": "Monochromatic", "mood": "Standard" }
    - "Sunset vibes": { "baseColor": "#fb923c", "harmony": "Analogous", "mood": "Vibrant" }
    
    OUTPUT FORMAT:
    Return strictly a JSON object:
    {
      "baseColor": "#RRGGBB",
      "harmony": "string",
      "mood": "string"
    }`
        }
    ];

    if (!textPrompt) {
        throw new Error("No input provided");
    }

    messages.push({
        role: "user",
        content: `Define the visual DNA for: ${textPrompt}`
    });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON
        let params;
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            params = JSON.parse(cleanContent);
        } catch (e) {
            console.error("JSON Parse Error, using fallback:", content);
            params = { baseColor: "#3b82f6", harmony: "Analogous", mood: "Standard" };
        }

        // HYBRID GENERATION:
        console.log("AI Architect DNA:", params);
        return generateHarmony(params.baseColor, params.harmony, params.mood);

    } catch (error) {
        console.error('Fetch Palette Error:', error);
        throw error;
    }
}


