import { fetchPalette } from './js/api.js';
import { renderPalette, renderTemplates, renderAccessibility } from './js/ui.js';
import { setupExport } from './js/export.js';
import { addToHistory } from './js/history.js';

let currentPalette = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {


    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// Main Generation Logic
async function handleGenerate() {
    const textPrompt = document.getElementById('textPrompt').value.trim();

    if (!textPrompt) {
        alert('Please provide a description');
        return;
    }

    // Show loading state and hide previous results
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        currentPalette = await fetchPalette(textPrompt);

        // Render all the results sections
        renderPalette(currentPalette);
        renderTemplates(currentPalette);
        renderAccessibility(currentPalette);
        setupExport(currentPalette);
        addToHistory(currentPalette, textPrompt);

        // Show results and hide loading
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');

        // Re-initialize Lucide icons if they exist in new content
        if (window.lucide) {
            window.lucide.createIcons();
        }

    } catch (error) {
        console.error('Error in handleGenerate:', error);
        alert(`Failed to generate palette: ${error.message}`);
        document.getElementById('loadingState').classList.add('hidden');
    }
}

async function handleRefine() {
    const instruction = document.getElementById('refineInput').value.trim();
    if (!instruction) return;

    // Loading State (Re-use main loading or create subtle one? Re-use for now)
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        const newPalette = await refinePalette(currentPalette, instruction);
        currentPalette = newPalette;

        // Render
        renderPalette(currentPalette);
        renderTemplates(currentPalette);
        renderAccessibility(currentPalette);
        setupExport(currentPalette);
        addToHistory(currentPalette, `Refined: ${instruction}`);

        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');

        // Clear input logic? Maybe keep it for further refinement. 
        // document.getElementById('refineInput').value = ''; 

        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error('Error in handleGenerate:', error);
        alert(`Failed to generate palette: ${error.message}`);
        document.getElementById('loadingState').classList.add('hidden');
    }
}

// Event Listeners
document.getElementById('generateBtn').addEventListener('click', handleGenerate);