import { copyToClipboard } from './ui.js';

export function setupExport(palette) {
    const exportBtn = document.getElementById('exportBtn');
    const exportModal = document.getElementById('exportModal');
    const closeExport = document.getElementById('closeExport');
    const copyCssBtn = document.getElementById('copyCss');
    const copyTailwindBtn = document.getElementById('copyTailwind');
    const copyJsonBtn = document.getElementById('copyJson');

    if (!exportBtn || !exportModal) return;

    // Open Modal
    // We clone the button to remove old listeners if re-initializing
    const newExportBtn = exportBtn.cloneNode(true);
    exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);

    newExportBtn.addEventListener('click', () => {
        exportModal.classList.remove('hidden');
    });

    // Close Modal
    closeExport.addEventListener('click', () => {
        exportModal.classList.add('hidden');
    });

    // Close on click outside
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            exportModal.classList.add('hidden');
        }
    });

    // Copy Handlers
    copyCssBtn.onclick = () => {
        const cssContent = generateCSS(palette);
        copyToClipboard(cssContent);
    };

    copyTailwindBtn.onclick = () => {
        const tailwindContent = generateTailwind(palette);
        copyToClipboard(tailwindContent);
    };

    copyJsonBtn.onclick = () => {
        const jsonContent = JSON.stringify(palette, null, 2);
        copyToClipboard(jsonContent);
    };
}

function generateCSS(palette) {
    let css = ':root {\n';
    palette.forEach(color => {
        const name = color.role.toLowerCase().replace(' ', '-');
        css += `  --color-${name}: ${color.hex};\n`;
    });
    css += '}\n';
    return css;
}

function generateTailwind(palette) {
    let tailwind = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n';
    palette.forEach(color => {
        const name = color.role.toLowerCase().replace(' ', '-');
        tailwind += `        '${name}': '${color.hex}',\n`;
    });
    tailwind += '      }\n    }\n  }\n}';
    return tailwind;
}
