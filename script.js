// Create floating particles
function createParticles() {
    const container = document.getElementById('particleContainer');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}
let currentPalette = [];

// Color name mapping
const getColorName = (hex) => {
    const colorNames = {
        '#FF0000': 'Crimson Red', '#FF4500': 'Orange Red', '#FF6347': 'Tomato',
        '#FF69B4': 'Hot Pink', '#FF1493': 'Deep Pink', '#FFC0CB': 'Pink',
        '#FFB6C1': 'Light Pink', '#FFA500': 'Orange', '#FFD700': 'Gold',
        '#FFFF00': 'Yellow', '#FFFFE0': 'Light Yellow', '#FFFACD': 'Lemon Chiffon',
        '#FAFAD2': 'Light Gold', '#FFE4B5': 'Peach', '#FFDAB9': 'Peach Puff',
        '#EEE8AA': 'Pale Gold', '#F0E68C': 'Khaki', '#BDB76B': 'Dark Khaki',
        '#ADFF2F': 'Green Yellow', '#7FFF00': 'Chartreuse', '#7CFC00': 'Lawn Green',
        '#00FF00': 'Lime', '#32CD32': 'Lime Green', '#00FA9A': 'Spring Green',
        '#00FF7F': 'Spring Green', '#90EE90': 'Light Green', '#98FB98': 'Pale Green',
        '#8FBC8F': 'Dark Sea Green', '#228B22': 'Forest Green', '#008000': 'Green',
        '#006400': 'Dark Green', '#9ACD32': 'Yellow Green', '#6B8E23': 'Olive Drab',
        '#808000': 'Olive', '#556B2F': 'Dark Olive', '#00FFFF': 'Cyan',
        '#00CED1': 'Dark Turquoise', '#40E0D0': 'Turquoise', '#48D1CC': 'Turquoise',
        '#AFEEEE': 'Pale Turquoise', '#7FFFD4': 'Aquamarine', '#B0E0E6': 'Powder Blue',
        '#5F9EA0': 'Cadet Blue', '#4682B4': 'Steel Blue', '#6495ED': 'Cornflower',
        '#00BFFF': 'Sky Blue', '#1E90FF': 'Dodger Blue', '#ADD8E6': 'Light Blue',
        '#87CEEB': 'Sky Blue', '#87CEFA': 'Light Sky Blue', '#191970': 'Midnight Blue',
        '#000080': 'Navy', '#00008B': 'Dark Blue', '#0000CD': 'Medium Blue',
        '#0000FF': 'Blue', '#4169E1': 'Royal Blue', '#8A2BE2': 'Blue Violet',
        '#4B0082': 'Indigo', '#483D8B': 'Dark Slate Blue', '#6A5ACD': 'Slate Blue',
        '#7B68EE': 'Medium Slate Blue', '#9370DB': 'Medium Purple', '#8B008B': 'Dark Magenta',
        '#9400D3': 'Violet', '#9932CC': 'Dark Orchid', '#BA55D3': 'Medium Orchid',
        '#800080': 'Purple', '#D8BFD8': 'Thistle', '#DDA0DD': 'Plum',
        '#EE82EE': 'Violet', '#FF00FF': 'Magenta', '#DA70D6': 'Orchid',
        '#C71585': 'Medium Violet Red', '#DB7093': 'Pale Violet Red', '#FFF0F5': 'Lavender Blush',
        '#FFE4E1': 'Misty Rose', '#FFE4C4': 'Bisque', '#FFDEAD': 'Navajo White',
        '#F5DEB3': 'Wheat', '#DEB887': 'Burlywood', '#D2B48C': 'Tan',
        '#BC8F8F': 'Rosy Brown', '#F4A460': 'Sandy Brown', '#DAA520': 'Goldenrod',
        '#B8860B': 'Dark Goldenrod', '#CD853F': 'Peru', '#D2691E': 'Chocolate',
        '#8B4513': 'Saddle Brown', '#A0522D': 'Sienna', '#A52A2A': 'Brown',
        '#800000': 'Maroon', '#FFFFFF': 'White', '#FFFAFA': 'Snow',
        '#F0FFF0': 'Honeydew', '#F5FFFA': 'Mint Cream', '#F0FFFF': 'Azure',
        '#F0F8FF': 'Alice Blue', '#F8F8FF': 'Ghost White', '#F5F5F5': 'White Smoke',
        '#FFF5EE': 'Seashell', '#F5F5DC': 'Beige', '#FDF5E6': 'Old Lace',
        '#FFFAF0': 'Floral White', '#FFFFF0': 'Ivory', '#FAEBD7': 'Antique White',
        '#FAF0E6': 'Linen', '#FFF8DC': 'Cornsilk', '#C0C0C0': 'Silver',
        '#808080': 'Gray', '#696969': 'Dim Gray', '#708090': 'Slate Gray',
        '#2F4F4F': 'Dark Slate Gray', '#000000': 'Black'
    };

    // Find closest color name
    const hexUpper = hex.toUpperCase();
    if (colorNames[hexUpper]) return colorNames[hexUpper];

    // If exact match not found, find closest color
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    let closestColor = 'Custom Color';
    let minDistance = Infinity;

    for (const [colorHex, colorName] of Object.entries(colorNames)) {
        const cr = parseInt(colorHex.slice(1, 3), 16);
        const cg = parseInt(colorHex.slice(3, 5), 16);
        const cb = parseInt(colorHex.slice(5, 7), 16);

        const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = colorName;
        }
    }

    return closestColor;
};

// Color conversion functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Accessibility functions
function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const linearRgb = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
}

function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Color blindness simulation
function simulateColorBlindness(hex, type) {
    const { r, g, b } = hexToRgb(hex);

    const transformMatrix = {
        protanopia: [
            [0.567, 0.433, 0],
            [0.558, 0.442, 0],
            [0, 0.242, 0.758]
        ],
        deuteranopia: [
            [0.625, 0.375, 0],
            [0.7, 0.3, 0],
            [0, 0.3, 0.7]
        ],
        tritanopia: [
            [0.95, 0.05, 0],
            [0, 0.433, 0.567],
            [0, 0.475, 0.525]
        ]
    };

    const matrix = transformMatrix[type];
    const r_new = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
    const g_new = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
    const b_new = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

    return '#' + [r_new, g_new, b_new]
        .map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
        .join('');
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Copied!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });
}

// Render palette
function renderPalette(palette) {
    const display = document.getElementById('paletteDisplay');
    display.innerHTML = '';

    palette.forEach((color, index) => {
        const colorName = getColorName(color.hex);
        const rgb = hexToRgb(color.hex);
        const hsl = rgbToHsl(rgb);
        const isLight = getLuminance(color.hex) > 0.5;

        const card = document.createElement('div');
        card.className = 'color-card rounded-2xl p-4 shadow-xl border border-gray-700';
        card.style.backgroundColor = color.hex;
        card.style.animationDelay = `${index * 0.1}s`;

        const textColor = isLight ? 'text-gray-900' : 'text-white';

        card.innerHTML = `
            <div class="h-24 md:h-32 flex flex-col justify-between">
                <h3 class="font-bold text-sm md:text-base ${textColor}">${colorName}</h3>
                <div class="space-y-1">
                    <p class="text-xs ${textColor} opacity-90 font-mono cursor-pointer hover:underline" onclick="copyToClipboard('${color.hex}')">${color.hex}</p>
                    <p class="text-xs ${textColor} opacity-75 hidden md:block">RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</p>
                </div>
            </div>
        `;

        display.appendChild(card);
    });
}

// Generate templates
function generateTemplates(palette) {
    const templates = {
        website: createWebsiteTemplate(palette),
        mobile: createMobileTemplate(palette),
        dashboard: createDashboardTemplate(palette),
        card: createCardTemplate(palette),
        poster: createPosterTemplate(palette)
    };

    return templates;
}

// Template creation functions
function createWebsiteTemplate(palette) {
    const [primary, secondary, accent, bg, text] = palette.map(c => c.hex);
    return `
        <div class="template-card rounded-xl p-6">
            <div class="mb-4">
                <div class="h-12 rounded-t-lg flex items-center px-4" style="background: ${primary}">
                    <div class="flex gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div class="p-4" style="background: ${bg}">
                    <div class="h-8 mb-3 rounded" style="background: ${secondary}"></div>
                    <div class="space-y-2">
                        <div class="h-2 rounded" style="background: ${text}; opacity: 0.3"></div>
                        <div class="h-2 rounded w-4/5" style="background: ${text}; opacity: 0.3"></div>
                        <div class="h-2 rounded w-3/5" style="background: ${text}; opacity: 0.3"></div>
                    </div>
                    <button class="mt-4 px-4 py-2 rounded text-white text-sm" style="background: ${accent}">
                        Call to Action
                    </button>
                </div>
            </div>
            <h4 class="text-white font-medium">Website Layout</h4>
        </div>
    `;
}

function createMobileTemplate(palette) {
    const [primary, secondary, accent, bg, text] = palette.map(c => c.hex);
    return `
        <div class="template-card rounded-xl p-6">
            <div class="mx-auto w-32">
                <div class="rounded-2xl border-2 border-gray-700 p-2" style="background: ${bg}">
                    <div class="h-6 rounded-t-xl flex items-center justify-center" style="background: ${primary}">
                        <div class="w-16 h-1 rounded-full bg-black opacity-30"></div>
                    </div>
                    <div class="p-2 space-y-2">
                        <div class="h-20 rounded-lg" style="background: ${secondary}"></div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="h-12 rounded" style="background: ${accent}"></div>
                            <div class="h-12 rounded" style="background: ${accent}; opacity: 0.7"></div>
                        </div>
                        <div class="h-8 rounded-full" style="background: ${primary}"></div>
                    </div>
                </div>
            </div>
            <h4 class="text-white font-medium mt-4 text-center">Mobile App</h4>
        </div>
    `;
}

function createDashboardTemplate(palette) {
    const [primary, secondary, accent, bg, text] = palette.map(c => c.hex);
    return `
        <div class="template-card rounded-xl p-6">
            <div class="rounded-lg overflow-hidden" style="background: ${bg}">
                <div class="flex">
                    <div class="w-12 h-40" style="background: ${primary}"></div>
                    <div class="flex-1 p-3">
                        <div class="h-8 mb-3 rounded" style="background: ${secondary}"></div>
                        <div class="grid grid-cols-3 gap-2 mb-3">
                            <div class="h-16 rounded" style="background: ${accent}; opacity: 0.8"></div>
                            <div class="h-16 rounded" style="background: ${accent}; opacity: 0.6"></div>
                            <div class="h-16 rounded" style="background: ${accent}; opacity: 0.4"></div>
                        </div>
                        <div class="h-20 rounded" style="background: linear-gradient(45deg, ${primary}, ${secondary})"></div>
                    </div>
                </div>
            </div>
            <h4 class="text-white font-medium mt-4">Dashboard</h4>
        </div>
    `;
}

function createCardTemplate(palette) {
    const [primary, secondary, accent, bg, text] = palette.map(c => c.hex);
    return `
        <div class="template-card rounded-xl p-6">
            <div class="rounded-xl overflow-hidden shadow-lg" style="background: ${bg}">
                <div class="h-24" style="background: linear-gradient(135deg, ${primary}, ${secondary})"></div>
                <div class="p-4">
                    <div class="w-16 h-16 rounded-full -mt-12 mb-3 border-4" style="background: ${accent}; border-color: ${bg}"></div>
                    <div class="space-y-2">
                        <div class="h-3 rounded w-3/4" style="background: ${text}; opacity: 0.8"></div>
                        <div class="h-2 rounded" style="background: ${text}; opacity: 0.3"></div>
                        <div class="h-2 rounded w-5/6" style="background: ${text}; opacity: 0.3"></div>
                    </div>
                </div>
            </div>
            <h4 class="text-white font-medium mt-4">Card Design</h4>
        </div>
    `;
}

function createPosterTemplate(palette) {
    const [primary, secondary, accent, bg, text] = palette.map(c => c.hex);
    return `
        <div class="template-card rounded-xl p-6">
            <div class="rounded-lg aspect-[3/4] flex flex-col" style="background: linear-gradient(180deg, ${primary}, ${secondary})">
                <div class="flex-1 flex items-center justify-center p-4">
                    <div class="text-center">
                        <div class="w-20 h-20 rounded-full mx-auto mb-3" style="background: ${accent}"></div>
                        <div class="h-4 rounded w-24 mx-auto mb-2" style="background: ${bg}"></div>
                        <div class="h-3 rounded w-20 mx-auto" style="background: ${bg}; opacity: 0.7"></div>
                    </div>
                </div>
                <div class="p-4" style="background: ${bg}">
                    <div class="h-2 rounded mb-1" style="background: ${text}; opacity: 0.5"></div>
                    <div class="h-2 rounded w-4/5" style="background: ${text}; opacity: 0.3"></div>
                </div>
            </div>
            <h4 class="text-white font-medium mt-4">Poster</h4>
        </div>
    `;
}

// Render templates
function renderTemplates(palette) {
    const templates = generateTemplates(palette);
    const display = document.getElementById('templateDisplay');
    display.innerHTML = templates.website;

    // Add click handlers for template tabs
    document.querySelectorAll('[data-template]').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active tab
            document.querySelectorAll('[data-template]').forEach(b => {
                b.classList.remove('active', 'bg-sky-500', 'text-white');
                b.classList.add('bg-gray-800', 'text-gray-300');
            });
            this.classList.add('active', 'bg-sky-500', 'text-white');
            this.classList.remove('bg-gray-800', 'text-gray-300');

            // Update template display
            display.innerHTML = templates[this.dataset.template];
        });
    });
}

// Render accessibility report
function renderAccessibility(palette) {
    const contrastReport = generateContrastReport(palette);
    const colorBlindReport = generateColorBlindReport(palette);

    const content = document.getElementById('accessibilityContent');
    content.innerHTML = contrastReport;

    // Tab handlers
    document.getElementById('contrastTab').addEventListener('click', function() {
        document.getElementById('colorBlindTab').classList.remove('active', 'bg-sky-500', 'text-white');
        document.getElementById('colorBlindTab').classList.add('bg-gray-800', 'text-gray-300');
        this.classList.add('active', 'bg-sky-500', 'text-white');
        this.classList.remove('bg-gray-800', 'text-gray-300');
        content.innerHTML = contrastReport;
    });

    document.getElementById('colorBlindTab').addEventListener('click', function() {
        document.getElementById('contrastTab').classList.remove('active', 'bg-sky-500', 'text-white');
        document.getElementById('contrastTab').classList.add('bg-gray-800', 'text-gray-300');
        this.classList.add('active', 'bg-sky-500', 'text-white');
        this.classList.remove('bg-gray-800', 'text-gray-300');
        content.innerHTML = colorBlindReport;
    });
}

function generateContrastReport(palette) {
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    for (let i = 0; i < palette.length; i++) {
        for (let j = i + 1; j < palette.length; j++) {
            const ratio = getContrastRatio(palette[i].hex, palette[j].hex);
            const status = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail';
            const statusColor = ratio >= 7 ? 'text-green-400' : ratio >= 4.5 ? 'text-yellow-400' : ratio >= 3 ? 'text-orange-400' : 'text-red-400';

            html += `
                <div class="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div class="flex gap-2">
                        <div class="w-8 h-8 rounded" style="background: ${palette[i].hex}"></div>
                        <div class="w-8 h-8 rounded" style="background: ${palette[j].hex}"></div>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-400">${getColorName(palette[i].hex)} / ${getColorName(palette[j].hex)}</p>
                        <p class="font-bold ${statusColor}">${ratio.toFixed(2)}:1 - ${status}</p>
                    </div>
                </div>
            `;
        }
    }

    html += '</div>';
    return html;
}

function generateColorBlindReport(palette) {
    const types = ['protanopia', 'deuteranopia', 'tritanopia'];
    const labels = ['Protanopia (Red-Blind)', 'Deuteranopia (Green-Blind)', 'Tritanopia (Blue-Blind)'];

    let html = '<div class="space-y-6">';

    types.forEach((type, index) => {
        html += `
            <div>
                <h4 class="text-white font-medium mb-3">${labels[index]}</h4>
                <div class="flex gap-3">
        `;

        palette.forEach(color => {
            const simulated = simulateColorBlindness(color.hex, type);
            html += `
                    <div class="text-center">
                        <div class="w-16 h-16 rounded-lg border border-gray-700" style="background: ${simulated}"></div>
                        <p class="text-xs text-gray-400 mt-1">${simulated}</p>
                    </div>
            `;
        });

        html += '</div></div>';
    });

    html += '</div>';
    return html;
}

async function generatePalette() {
    const textPrompt = document.getElementById('textPrompt').value.trim();
    const imageFile = document.getElementById('imageUpload').files[0];

    if (!textPrompt && !imageFile) {
        alert('Please provide a description or upload an image');
        return;
    }

    // Show loading state and hide previous results
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    const parts = [];
    const systemPrompt = `Generate exactly 5 colors as a JSON array. Each color should have:
        - "hex": color value (e.g., "#FF5733")
        - "role": purpose (Primary, Secondary, Accent, Background, Text)
        Return ONLY valid JSON array.`;

    // Handle text prompt input
    if (textPrompt) {
        parts.push({ text: `${systemPrompt}\n\nCreate palette for: ${textPrompt}` });
    }
    
    // Handle image input and convert it to base64
    if (imageFile) {
        // This 'if' block is a small addition to ensure the system prompt is added for image-only requests
        if (!textPrompt) {
             parts.push({ text: `${systemPrompt}\n\nExtract palette from image:` });
        }
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(imageFile);
        });
        parts.push({ inlineData: { mimeType: imageFile.type, data: base64 } });
    }

    // This is the main updated section
    try {
        // 1. Call your own backend endpoint, not the Google API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 2. Send the parts array inside the correct body structure
            body: JSON.stringify({ contents: [{ parts }] })
        });

        if (!response.ok) {
            const errorInfo = await response.json();
            throw new Error(errorInfo.message || 'The request to the server failed.');
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) {
            const cleanJson = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            currentPalette = JSON.parse(cleanJson);

            // Render all the results sections
            renderPalette(currentPalette);
            renderTemplates(currentPalette);
            renderAccessibility(currentPalette);

            // Show results and hide loading
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('resultsSection').classList.remove('hidden');

            // Re-initialize Lucide icons if they exist in new content
            if (window.lucide) {
                lucide.createIcons();
            }
        } else {
             throw new Error("No valid content returned from the API.");
        }
    } catch (error) {
        console.error('Error in generatePalette:', error);
        alert(`Failed to generate palette: ${error.message}`);
        document.getElementById('loadingState').classList.add('hidden');
    }
}
// Event listeners
document.getElementById('generateBtn').addEventListener('click', generatePalette);

document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
    }
});

// Drag and drop
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-sky-400');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('border-sky-400');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-sky-400');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        document.getElementById('imageUpload').files = e.dataTransfer.files;
        document.getElementById('fileName').textContent = file.name;
    }
});

lucide.createIcons();