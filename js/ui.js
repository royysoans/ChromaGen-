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
// Render palette
export function renderPalette(palette) {
    const display = document.getElementById('paletteDisplay');
    display.innerHTML = '';

    palette.forEach((color, index) => {
        const colorName = getColorName(color.hex);
        const isLight = getLuminance(color.hex) > 0.5;
        const textColor = isLight ? '#000000' : '#ffffff';

        const card = document.createElement('div');
        card.className = 'swatch-card group relative'; // Added group and relative for positioning
        card.style.backgroundColor = color.hex;
        card.style.color = textColor;
        card.style.animationDelay = `${index * 0.1}s`;

        // Create color input
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = color.hex;
        colorInput.className = 'absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-10';

        // Handle Color Change
        colorInput.addEventListener('input', (e) => {
            const newHex = e.target.value;
            color.hex = newHex;

            // Update UI immediately
            card.style.backgroundColor = newHex;
            const newIsLight = getLuminance(newHex) > 0.5;
            card.style.color = newIsLight ? '#000000' : '#ffffff';

            // Update Text
            card.querySelector('.hex-code').textContent = newHex;
            card.querySelector('.color-name').textContent = getColorName(newHex);

            // Re-render dependencies
            renderTemplates(palette);
            renderAccessibility(palette);

            // Re-setup export with new data
            import('./export.js').then(module => module.setupExport(palette));
        });

        card.innerHTML = `
            <div class="swatch-info pointer-events-none">
                <div class="role-tag">${color.role || 'Color'}</div>
                <div class="hex-code font-mono font-bold text-lg">${color.hex}</div>
                <div class="color-name" style="font-size: 0.8rem; opacity: 0.6; margin-top: 4px;">${colorName}</div>
            </div>
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 p-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                <i data-lucide="edit-2" style="width:14px; height:14px;"></i>
            </div>
        `;

        card.appendChild(colorInput);

        // click to copy is now handled by the logic? 
        // With the full-size input overlay, normal click copies might be blocked.
        // Let's make the input overlay the whole card for editing, 
        // BUT user might want to copy.
        // Solution: Small edit button triggers input. Clicking card copies.
        // Let's refactor: Input is hidden. Edit button triggers input click. Card click copies.

        // Re-doing the append
    });

    // Re-implementation with separarate Edit/Copy actions
    display.innerHTML = '';
    palette.forEach((color, index) => {
        const colorName = getColorName(color.hex);
        const isLight = getLuminance(color.hex) > 0.5;
        const textColor = isLight ? '#000000' : '#ffffff';

        const card = document.createElement('div');
        card.className = 'swatch-card group relative';
        card.style.backgroundColor = color.hex;
        card.style.color = textColor;
        card.style.animationDelay = `${index * 0.1}s`;

        const inputId = `color-input-${index}`;

        card.innerHTML = `
            <div class="swatch-info">
                <div class="role-tag">${color.role || 'Color'}</div>
                <div class="hex-code cursor-pointer hover:opacity-80 transition-opacity" title="Click to copy">${color.hex}</div>
                <div class="color-name" style="font-size: 0.8rem; opacity: 0.6; margin-top: 4px;">${colorName}</div>
            </div>
            
            <label for="${inputId}" class="absolute top-2 right-2 opacity-100 bg-white hover:bg-gray-100 hover:scale-110 transition-all p-2 rounded-full cursor-pointer z-20 shadow-md" title="Tune Color">
                <i data-lucide="pencil" style="width:16px; height:16px; color: black;"></i>
            </label>
            <input type="color" id="${inputId}" value="${color.hex}" class="sr-only">
        `;

        // Click on Hex copies
        const hexEl = card.querySelector('.hex-code');
        hexEl.onclick = (e) => {
            e.stopPropagation(); // Prevent bubbling
            copyToClipboard(color.hex);
        };

        // Handle Input Change
        const input = card.querySelector('input');
        input.addEventListener('input', (e) => {
            const newHex = e.target.value;
            color.hex = newHex;

            // Visual Updates
            card.style.backgroundColor = newHex;
            const newIsLight = getLuminance(newHex) > 0.5;
            card.style.color = newIsLight ? '#000000' : '#ffffff';
            hexEl.textContent = newHex;
            card.querySelector('.color-name').textContent = getColorName(newHex);

            // Live System Updates
            renderTemplates(palette);
            renderAccessibility(palette);

            // Update Export (Dynamic Import to avoid circular dep if needed, or just assume it's available globally/passed)
            // We can dispatch a custom event or just trust the next cycle
            // Re-initializing export on every color change might be heavy but accurate
            import('./export.js').then(m => m.setupExport(palette));
        });

        display.appendChild(card);
    });
}

// Render templates
// Initialize template listeners (Call once)
export function initTemplateListeners(paletteCallback) {
    document.querySelectorAll('[data-template]').forEach(btn => {
        // Clone to ensure clean slate if called multiple times (though should be once)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function () {
            // Update active tab
            document.querySelectorAll('[data-template]').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // Trigger re-render using the callback (which should be renderTemplates with current palette)
            // But wait, renderTemplates needs the palette.
            // We can just dispatch an event or assume the palette is available?
            // Better: The listener just updates the UI class. The render function reads the class.
            // BUT, clicking the button needs to trigger the render.
            // So we need to pass the current palette to this listener? 
            // OR, we store the currentPalette in a module variable in ui.js?
            // "Avoid global state". But `initTemplateListeners` is called once. 
            // Maybe we don't need `initTemplateListeners`.
            // We can just keep the listener attachment logic inside `renderTemplates` BUT check if they are already attached? No.

            // Let's go with: `renderTemplates` preserves state. AND we attach listeners that call `renderTemplates`... but they need the palette.

            // Simpler solution:
            // In `renderTemplates`, we DO NOT replace the buttons. We just re-render the content.
            // But who handles the click? The click handler needs to run `renderTemplates(palette)`.
            // So `renderTemplates` attaches the handler which calls `renderTemplates`? Closure loop.

            // Correct approach:
            // `renderTemplates(palette)`:
            // 1. Renders content based on active tab.
            // 2. Re-attaches listeners (because palette changed, the listener needs new palette closure).
            //    - Preserves 'active' class on the clicked button.
        });
    });
}

// Render templates
export function renderTemplates(palette) {
    const display = document.getElementById('templateDisplay');

    // Determine active template
    const activeBtn = document.querySelector('.template-btn.active');
    const currentTemplate = activeBtn ? activeBtn.dataset.template : 'website';

    // Render content
    if (templates[currentTemplate]) {
        display.innerHTML = templates[currentTemplate](palette);
    }

    // Update listeners with new palette closure
    document.querySelectorAll('[data-template]').forEach(btn => {
        // We clone to remove old listeners (which held the OLD palette)
        // This is safe and ensures the click handler always uses the fresh 'palette'
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function () {
            // Update active state
            document.querySelectorAll('[data-template]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Render
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
