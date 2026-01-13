import { renderPalette, renderTemplates, renderAccessibility } from './ui.js';
import { setupExport } from './export.js';

const STORAGE_KEY = 'chromagen_history';
const MAX_HISTORY = 10;

export function addToHistory(palette, prompt) {
    if (!palette || !prompt) return;

    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        prompt: prompt,
        palette: palette
    };

    let history = getHistory();

    // Add new item to the beginning
    history.unshift(historyItem);

    // Limit to max
    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    renderHistoryUI();
}

function getHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse history', e);
        return [];
    }
}

export function renderHistoryUI() {
    const historyContainer = document.getElementById('historyList');
    if (!historyContainer) return;

    const history = getHistory();
    historyContainer.innerHTML = '';

    if (history.length === 0) {
        historyContainer.innerHTML = '<div class="text-center opacity-50 text-sm py-4">No history yet</div>';
        return;
    }

    history.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors mb-2 border border-white/5';

        // Preview dots
        const dots = item.palette.map(c =>
            `<div style="width:12px; height:12px; border-radius:50%; background:${c.hex}; display:inline-block; margin-right:2px;"></div>`
        ).join('');

        el.innerHTML = `
            <div class="font-medium text-sm truncate mb-2 text-white/90">${item.prompt}</div>
            <div class="flex">${dots}</div>
            <div class="text-xs opacity-40 mt-2">${new Date(item.timestamp).toLocaleDateString()}</div>
        `;

        el.addEventListener('click', () => {
            // Restore Prompt
            const promptInput = document.getElementById('textPrompt');
            if (promptInput) promptInput.value = item.prompt;

            // Render
            renderPalette(item.palette);
            renderTemplates(item.palette);
            renderAccessibility(item.palette);
            setupExport(item.palette);

            // Show results
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('resultsSection').classList.remove('hidden');

            // Close sidebar if mobile (optional, but good UX)
            if (window.innerWidth < 1024) {
                const historySection = document.getElementById('historySection');
                if (historySection) historySection.classList.add('hidden');
            }
        });

        historyContainer.appendChild(el);
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', renderHistoryUI);
