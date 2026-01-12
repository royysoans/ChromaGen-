import {
    getColorName,
    hexToRgb,
    rgbToHsl,
    getLuminance,
    getContrastRatio,
    simulateColorBlindness
} from './accessibility.js';
import { templates } from './templates.js';

// Copy to clipboard
export function copyToClipboard(text) {
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
export function renderPalette(palette) {
    const display = document.getElementById('paletteDisplay');
    display.innerHTML = '';

    palette.forEach((color, index) => {
        const colorName = getColorName(color.hex);
        const isLight = getLuminance(color.hex) > 0.5;
        const textColor = isLight ? '#000000' : '#ffffff';

        const card = document.createElement('div');
        card.className = 'swatch-card';
        card.style.backgroundColor = color.hex;
        card.style.color = textColor;
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="swatch-info">
                <div class="role-tag">${color.role || 'Color'}</div>
                <div class="hex-code">${color.hex}</div>
                <div style="font-size: 0.8rem; opacity: 0.6; margin-top: 4px;">${colorName}</div>
            </div>
        `;

        card.onclick = () => copyToClipboard(color.hex);
        display.appendChild(card);
    });
}

// Render templates
export function renderTemplates(palette) {
    const display = document.getElementById('templateDisplay');
    display.innerHTML = templates.website(palette);

    // Add click handlers for template tabs
    document.querySelectorAll('[data-template]').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function () {
            // Update active tab
            document.querySelectorAll('[data-template]').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // Update template display
            const templateName = this.dataset.template;
            if (templates[templateName]) {
                display.innerHTML = templates[templateName](palette);
            }
        });
    });
}

// Render accessibility report
export function renderAccessibility(palette) {
    const contrastReport = generateContrastReport(palette);
    const colorBlindReport = generateColorBlindReport(palette);

    const content = document.getElementById('accessibilityContent');
    content.innerHTML = contrastReport;

    const contrastTab = document.getElementById('contrastTab');
    const colorBlindTab = document.getElementById('colorBlindTab');

    // Reset tabs state
    contrastTab.classList.add('active');
    colorBlindTab.classList.remove('active');

    // Clear old listeners
    const newContrastTab = contrastTab.cloneNode(true);
    contrastTab.parentNode.replaceChild(newContrastTab, contrastTab);

    const newColorBlindTab = colorBlindTab.cloneNode(true);
    colorBlindTab.parentNode.replaceChild(newColorBlindTab, colorBlindTab);

    newContrastTab.addEventListener('click', function () {
        newColorBlindTab.classList.remove('active');
        this.classList.add('active');
        content.innerHTML = contrastReport;
    });

    newColorBlindTab.addEventListener('click', function () {
        newContrastTab.classList.remove('active');
        this.classList.add('active');
        content.innerHTML = colorBlindReport;
    });
}

function generateContrastReport(palette) {
    let html = ''; // Grid layout is handled by CSS container .a11y-grid

    for (let i = 0; i < palette.length; i++) {
        for (let j = i + 1; j < palette.length; j++) {
            const ratio = getContrastRatio(palette[i].hex, palette[j].hex);
            const status = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail';
            // Use simple colors for score
            const scoreClass = ratio >= 4.5 ? 'score-good' : 'score-bad';

            html += `
                <div class="a11y-card">
                    <div style="display:flex; flex-direction:column; gap:0.5rem; align-items:center;">
                         <div style="display:flex;">
                            <div style="width:32px; height:32px; border-radius:50%; background:${palette[i].hex}; margin-right:-10px;"></div>
                            <div style="width:32px; height:32px; border-radius:50%; background:${palette[j].hex};"></div>
                         </div>
                    </div>
                    <div>
                        <div style="font-size:0.8rem; opacity:0.7;">${getColorName(palette[i].hex)} vs ${getColorName(palette[j].hex)}</div>
                        <div class="contrast-score ${scoreClass}">${ratio.toFixed(2)}:1</div>
                        <div style="font-size:0.8rem; font-weight:600;">${status}</div>
                    </div>
                </div>
            `;
        }
    }
    return html;
}

function generateColorBlindReport(palette) {
    const types = ['protanopia', 'deuteranopia', 'tritanopia'];
    const labels = ['Protanopia (Red-Blind)', 'Deuteranopia (Green-Blind)', 'Tritanopia (Blue-Blind)'];

    let html = '<div style="display:flex; flex-direction:column; gap:2rem;">';

    types.forEach((type, index) => {
        html += `
            <div>
                <h4 style="margin-bottom:1rem;">${labels[index]}</h4>
                <div style="display:flex; gap:1rem; overflow-x:auto; padding-bottom:10px;">
        `;

        palette.forEach(color => {
            const simulated = simulateColorBlindness(color.hex, type);
            html += `
                    <div style="text-align:center; min-width:80px;">
                        <div style="width:60px; height:60px; border-radius:12px; background:${simulated}; margin:0 auto 0.5rem; border:1px solid rgba(255,255,255,0.1);"></div>
                        <div style="font-size:0.75rem; opacity:0.5; font-family:monospace;">${simulated}</div>
                    </div>
            `;
        });

        html += '</div></div>';
    });

    html += '</div>';
    return html;
}
