// Color Theory & Generation Logic
// This module uses mathematical rules to generate harmonious palettes from a single base color.

// --- Conversions ---

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`; // This logic was slightly buggy in previous thought, simplifying to standard hex
}

// Improved HSL to Hex
function hslToHexFixed(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}


// --- Generators ---

export function generateHarmony(baseHex, rule, mood = 'standard') {
    const { h, s, l } = hexToHsl(baseHex);
    let palette = [];

    // Adjust saturation/lightness based on "Mood"
    let sAdj = s;
    let lAdj = l;

    if (mood === 'vibrant') sAdj = Math.min(s + 20, 100);
    if (mood === 'pastel') { sAdj = Math.min(s, 60); lAdj = Math.max(l, 85); }
    if (mood === 'dark') { lAdj = Math.min(l, 40); }

    const makeColor = (hueOffset, satScale = 1, lightScale = 1) => {
        let newH = (h + hueOffset) % 360;
        let newS = Math.min(100, Math.max(0, sAdj * satScale));
        let newL = Math.min(100, Math.max(0, lAdj * lightScale));
        return { hex: hslToHexFixed(newH, newS, newL) };
    };

    // Strategies
    switch (rule.toLowerCase()) {
        case 'analogous':
            // 3 colors next to each other
            palette = [
                { ...makeColor(0), role: 'Primary' },
                { ...makeColor(30, 0.9, 1.1), role: 'Secondary' },
                { ...makeColor(60, 0.8, 0.9), role: 'Accent' }
            ];
            break;
        case 'complementary':
            // Opposite colors
            palette = [
                { ...makeColor(0), role: 'Primary' },
                { ...makeColor(180), role: 'Accent' },
                { ...makeColor(0, 0.8, 1.3), role: 'Secondary' } // Brighter primary
            ];
            break;
        case 'split-complementary':
            palette = [
                { ...makeColor(0), role: 'Primary' },
                { ...makeColor(150), role: 'Secondary' },
                { ...makeColor(210), role: 'Accent' }
            ];
            break;
        case 'triadic':
            palette = [
                { ...makeColor(0), role: 'Primary' },
                { ...makeColor(120), role: 'Secondary' },
                { ...makeColor(240), role: 'Accent' }
            ];
            break;
        case 'monochromatic':
            palette = [
                { ...makeColor(0), role: 'Primary' },
                { ...makeColor(0, 0.7, 1.4), role: 'Secondary' },
                { ...makeColor(0, 1.0, 0.6), role: 'Accent' }
            ];
            break;
        default: // 'Analogous'
            palette = [
                { ...makeColor(0), role: 'Primary' },
                { ...makeColor(30), role: 'Secondary' },
                { ...makeColor(-30), role: 'Accent' }
            ];
    }

    // Generate Background and Text based on Mood
    let bg, text;
    if (mood.toLowerCase() === 'dark' || (mood.toLowerCase() === 'cyberpunk') || l < 20) {
        bg = { hex: '#0a0a0a', role: 'Background' };
        text = { hex: '#f0f0f0', role: 'Text' };
    } else if (mood.toLowerCase() === 'neon') {
        bg = { hex: '#050505', role: 'Background' };
        text = { hex: '#ffffff', role: 'Text' };
    } else {
        // Standard Light
        bg = { hex: '#ffffff', role: 'Background' };
        text = { hex: '#1a1a1a', role: 'Text' };
    }

    // Assemble final array in order: [Background, Text, Primary, Secondary, Accent]
    // This MUST match the destructuring order in templates.js
    return [bg, text, ...palette];
}
