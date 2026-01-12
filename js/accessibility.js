// Accessibility functions

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHsl({ r, g, b }) {
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

export function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const linearRgb = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
}

export function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

export function simulateColorBlindness(hex, type) {
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

export function getColorName(hex) {
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
    const { r, g, b } = hexToRgb(hex);

    let closestColor = 'Custom Color';
    let minDistance = Infinity;

    for (const [colorHex, colorName] of Object.entries(colorNames)) {
        const { r: cr, g: cg, b: cb } = hexToRgb(colorHex);
        const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = colorName;
        }
    }

    return closestColor;
}
