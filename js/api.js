export async function fetchPalette(textPrompt, imageFile) {
    const messages = [
        {
            role: "system",
            content: `You are an expert UI/UX Designer and Color Theorist with a focus on High-Impact Visuals.
    Your task is to generate a perfect 5-color palette based strictly on the user's input theme.
    
    CRITICAL INSTRUCTIONS:
    1. **Adhere strictly to the requested mood**:
       - If user says "Neon" or "Cyberpunk": You MUST use fully saturated, high-brightness colors (e.g., #FF00FF, #00FF00, #00FFFF) against a near-black background. Do NOT generate pastel or muted colors for these requests.
       - If user says "Pastel": Use desaturated, high-value colors.
       - If user says "Professional": Use deep blues, grays, and reliable accents.
    
    2. **Apply Color Theory**: Select the most appropriate color harmony for the theme (Analogous, Complementary, Triadic, etc.).
    
    3. **Define Roles Strictly**:
       - "Background": The canvas color. specific to the theme (Dark for neon/dark modes, Light for clean/minimal).
       - "Text": Must possess high contrast against the "Background" (WCAG AA compliant).
       - "Primary": The dominant brand color representing the theme.
       - "Secondary": A clear supporting color that harmonizes with Primary.
       - "Accent": A vibrant color for call-to-actions, distinct from the others.
    
    OUTPUT FORMAT:
    Return a valid JSON object with a single key "palette" containing the array of 5 colors.
    Example:
    {
      "palette": [
        { "hex": "#050505", "role": "Background" },
        { "hex": "#ffffff", "role": "Text" },
        { "hex": "#00ff9d", "role": "Primary" },
        { "hex": "#b026ff", "role": "Secondary" },
        { "hex": "#ff0055", "role": "Accent" }
      ]
    }`
        }
    ];

    const userContent = [];

    // Handle text prompt
    if (textPrompt) {
        userContent.push({ type: "text", text: `Create a palette for: ${textPrompt}` });
    }

    // Handle image input
    if (imageFile) {
        if (!textPrompt) {
            userContent.push({ type: "text", text: "Extract a palette from this image:" });
        }

        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // Keep full data URI for OpenAI/Groq format
            reader.onerror = error => reject(error);
            reader.readAsDataURL(imageFile);
        });

        userContent.push({
            type: "image_url",
            image_url: {
                url: base64
            }
        });
    }

    if (userContent.length === 0) {
        throw new Error("No input provided");
    }

    messages.push({
        role: "user",
        content: userContent
    });

    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
    });

    if (!response.ok) {
        const errorInfo = await response.json();
        throw new Error(errorInfo.message || 'The request to the server failed.');
    }

    const result = await response.json();
    const jsonText = result.choices?.[0]?.message?.content;

    console.log("Raw AI Response:", jsonText); // Debugging

    if (jsonText) {
        //Robust JSON extraction: find the first '[' and the last ']'
        const start = jsonText.indexOf('[');
        const end = jsonText.lastIndexOf(']');

        if (start !== -1 && end !== -1) {
            const cleanJson = jsonText.substring(start, end + 1);
            try {
                const parsed = JSON.parse(cleanJson);
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    throw new Error("Parsed JSON is not an array");
                }
            } catch (e) {
                console.error("JSON Parse Error:", e);
                // Fallback: try removing markdown code blocks if the substring method failed (rare)
                const fallbackJson = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                return JSON.parse(fallbackJson);
            }
        } else {
            // Maybe it returned a JSON object wrapping the array?
            try {
                const cleanJson = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                if (parsed.colors && Array.isArray(parsed.colors)) return parsed.colors;
                if (parsed.palette && Array.isArray(parsed.palette)) return parsed.palette;

                // Handle object keys as roles (e.g. { "Background": {...}, "Text": {...} })
                const values = Object.values(parsed);
                if (values.length >= 5 && values.every(v => v && v.hex && v.role)) {
                    return values;
                }

                throw new Error("Could not find array in JSON object");
            } catch (e) {
                throw new Error("No valid JSON array found in response");
            }
        }
    } else {
        throw new Error("No valid content returned from the API.");
    }
}
