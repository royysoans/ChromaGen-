// Template generation functions - Redesigned for Editorial Impact & Strict Readability

// --- Accessibility Helpers ---
function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1, hex2) {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// STRICT helper: Returns pure Black or White for maximum readability. 
function getStrictTextColor(bgColor) {
    const contrastWhite = getContrastRatio(bgColor, '#FFFFFF');
    const contrastBlack = getContrastRatio(bgColor, '#000000');
    return contrastWhite >= contrastBlack ? '#FFFFFF' : '#000000';
}

function isLight(hex) {
    return getLuminance(hex) > 0.5;
}

// --- Templates ---

// NOTE: Palette order from color-theory.js is [Background, Text, Primary, Secondary, Accent]
function createWebsiteTemplate(palette) {
    const [bg, text, primary, secondary, accent] = palette.map(c => c.hex);

    // Strict Black/White for text
    const safeBodyColor = getStrictTextColor(bg);
    const safePrimaryText = getStrictTextColor(primary);

    return `
        <div class="template-card w-full h-full min-h-[600px] flex flex-col font-sans relative overflow-hidden shadow-2xl transition-all duration-500" style="background-color: ${bg}; color: ${safeBodyColor}">
            
            <!-- Navbar -->
            <nav class="flex items-center justify-between px-10 py-8 z-20">
                <div class="font-black text-3xl tracking-tighter mix-blend-normal" style="color: ${safeBodyColor}">
                    KROMA
                </div>
                <div class="hidden md:flex gap-12 font-bold text-sm tracking-widest uppercase opacity-100">
                    <span class="hover:underline decoration-2 underline-offset-4 cursor-pointer">Collections</span>
                    <span class="hover:underline decoration-2 underline-offset-4 cursor-pointer">Artists</span>
                    <span class="hover:underline decoration-2 underline-offset-4 cursor-pointer">About</span>
                </div>
                <button class="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110" style="background-color: ${safeBodyColor}; color: ${bg}">
                   <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </nav>

            <!-- Editorial Hero -->
            <div class="flex-1 flex flex-col justify-center px-10 relative z-10">
                
                <div class="max-w-5xl">
                     <p class="font-mono text-xs md:text-sm font-bold tracking-[0.2em] mb-6 uppercase" style="color: ${accent}">
                        // Spring Collection 2026
                     </p>
                    
                    <h1 class="text-7xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-10 mix-blend-normal">
                        VISUAL <br>
                        <span style="color: transparent; -webkit-text-stroke: 2px ${safeBodyColor}; opacity: 0.5">LANGUAGE</span> <br>
                        SYSTEM
                    </h1>
                </div>

                <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-t-2 pt-8 mt-4" style="border-color: ${safeBodyColor}">
                    <div class="max-w-md">
                        <p class="text-lg md:text-xl font-medium leading-relaxed">
                            We curate digital experiences. A comprehensive bold approach to modern interface design.
                        </p>
                    </div>
                    
                    <button class="px-10 py-5 text-lg font-bold tracking-tight transition-all hover:px-12 flex items-center gap-4" 
                            style="background-color: ${primary}; color: ${safePrimaryText}">
                        EXPLORE WORK 
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>

            </div>

            <!-- Bold Graphic Element -->
            <div class="absolute top-0 right-0 w-1/3 h-full mix-blend-multiply opacity-80 hidden md:block" style="background-color: ${secondary}"></div>
            <div class="absolute bottom-20 right-20 w-64 h-64 rounded-full blur-[80px] opacity-60 pointer-events-none" style="background-color: ${accent}"></div>
        </div>
    `;
}

function createMobileTemplate(palette) {
    const [bg, text, primary, secondary, accent] = palette.map(c => c.hex);

    const safeText = getStrictTextColor(bg);
    const isDarkBg = !isLight(bg);
    const cardBg = isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const cardText = isDarkBg ? '#FFFFFF' : '#000000';

    return `
        <div class="template-card w-full h-full flex items-center justify-center p-8 bg-gray-100/5">
            <!-- iPhone Frame -->
            <div class="relative w-[340px] h-[680px] rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden bg-black ring-1 ring-white/10">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-30"></div>
                
                <!-- App Screen -->
                <div class="w-full h-full flex flex-col relative" style="background-color: ${bg}; color: ${safeText}">
                    
                    <div class="pt-16 px-6 pb-6 flex justify-between items-end">
                        <h2 class="text-3xl font-black tracking-tighter">Feed.</h2>
                        <div class="w-10 h-10 rounded-full border-2 p-0.5" style="border-color: ${accent}">
                            <div class="w-full h-full rounded-full bg-gray-300"></div>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar space-y-6">
                        
                        <div class="aspect-[4/5] w-full rounded-3xl relative overflow-hidden shadow-lg group">
                            <div class="absolute inset-0 bg-gray-800"></div> 
                            <div class="absolute inset-0" style="background: linear-gradient(45deg, ${primary}, ${secondary}); opacity: 0.8"></div>
                            
                            <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                                NEW
                            </div>

                            <div class="absolute bottom-0 left-0 p-6 w-full text-white">
                                <p class="text-xs font-bold opacity-70 mb-1 uppercase tracking-wider">Highlight</p>
                                <h3 class="text-3xl font-black leading-none mb-4">Summer<br>Vibes</h3>
                                <button class="w-full py-3 bg-white text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">
                                    View Details
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                            ${['All', 'Trending', 'Art', 'Music'].map((cat, i) => `
                                <div class="px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap" 
                                     style="background-color: ${i === 0 ? safeText : cardBg}; color: ${i === 0 ? bg : safeText}">
                                    ${cat}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="absolute bottom-6 left-6 right-6 h-16 bg-black/90 backdrop-blur-xl rounded-full flex items-center justify-around px-4 z-30 shadow-2xl skew-x-0" style="border: 1px solid rgba(255,255,255,0.1)">
                        <div class="p-2" style="color: ${primary}"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
                        <div class="p-2 text-white/40"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                         <div class="p-2 text-white/40"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDashboardTemplate(palette) {
    const [bg, text, primary, secondary, accent] = palette.map(c => c.hex);

    // FIXED: Use the actual palette Logic for backgrounds. 
    // If the mood was dark, 'bg' is already dark. If light, 'bg' is light.
    const bgIsLight = isLight(bg);
    const textOnShell = getStrictTextColor(bg);

    // Derived colors for cards (slightly lighter/darker than bg)
    const cardSurface = bgIsLight ? '#ffffff' : 'rgba(255,255,255,0.05)';
    const border = bgIsLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

    return `
        <div class="template-card w-full h-full min-h-[600px] rounded-xl flex overflow-hidden font-sans shadow-2xl border" style="background-color: ${bg}; color: ${textOnShell}; border-color: ${border}">
            
            <!-- Sidebar -->
            <aside class="w-16 lg:w-64 flex flex-col border-r py-6 items-center lg:items-stretch px-0 lg:px-6 relative z-10" style="border-color: ${border}; background-color: ${bg}">
                <div class="mb-10 flex justify-center lg:justify-start items-center gap-3">
                    <div class="w-8 h-8 rounded-lg" style="background-color: ${primary}"></div>
                    <span class="font-bold text-lg hidden lg:block tracking-tight">Dash.</span>
                </div>
                
                <div class="space-y-1 flex-1 w-full">
                    ${['Overview', 'Performance', 'Settings'].map((item, i) => `
                        <div class="p-3 lg:px-4 rounded-lg cursor-pointer flex items-center justify-center lg:justify-start gap-4 ${i === 0 ? 'font-bold' : 'opacity-60 hover:opacity-100'}"
                             style="${i === 0 ? `background-color: ${bgIsLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'};` : ''}">
                            <div class="w-4 h-4 rounded-full" style="background-color: ${i === 0 ? accent : 'currentColor'}"></div>
                            <span class="hidden lg:block text-sm">${item}</span>
                        </div>
                    `).join('')}
                </div>
            </aside>

            <!-- Main Dashboard -->
            <main class="flex-1 p-8 lg:p-10 overflow-y-auto">
                <header class="flex justify-between items-center mb-10">
                    <div>
                        <h2 class="text-3xl font-bold tracking-tight mb-1">Overview</h2>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Main Card -->
                    <div class="md:col-span-2 rounded-2xl p-8 relative overflow-hidden shadow-lg" style="background-color: ${primary}; color: ${getStrictTextColor(primary)}">
                         <div class="relative z-10">
                             <div class="text-sm font-bold opacity-80 mb-2">Revenue</div>
                             <div class="text-5xl font-black mb-8">$124,500</div>
                             <div class="flex gap-4">
                                 <span class="px-3 py-1 bg-black/20 rounded-md text-sm font-bold">+12%</span>
                                 <span class="px-3 py-1 bg-black/20 rounded-md text-sm font-bold">vs last month</span>
                             </div>
                         </div>
                         <div class="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                             <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                         </div>
                    </div>

                    <!-- Stat Card -->
                    <div class="rounded-2xl p-6 flex flex-col justify-between border" style="background-color: ${cardSurface}; border-color: ${border}">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-md" style="background-color: ${accent}">
                            ★
                        </div>
                        <div class="text-3xl font-bold">4.9/5</div>
                        <div class="text-sm opacity-50">Customer Rating</div>
                    </div>
                </div>
            </main>
        </div>
    `;
}

function createPosterTemplate(palette) {
    const [bg, text, primary, secondary, accent] = palette.map(c => c.hex);
    const safeText = getStrictTextColor(bg);

    return `
        <div class="template-card w-full h-full flex items-center justify-center p-8 bg-[#111]">
            <div class="w-[450px] aspect-[3/4] bg-white rounded-none shadow-2xl relative overflow-hidden flex flex-col p-8" style="background-color: ${bg}; color: ${safeText}">
                
                <div class="border-b-4 pb-4 mb-auto flex justify-between items-start" style="border-color: ${safeText}">
                    <h2 class="text-6xl font-black leading-none tracking-tighter">TYPO<br>GRA<br>PHY.</h2>
                    <div class="w-16 h-16 rounded-full" style="background-color: ${primary}"></div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-auto">
                    <div class="aspect-square w-full" style="background-color: ${secondary}"></div>
                    <div class="flex flex-col justify-between">
                         <div class="text-sm font-bold leading-tight">
                            International <br> Design <br> Summit
                         </div>
                         <div class="text-xs font-mono">
                            BERLIN / 2026
                         </div>
                    </div>
                </div>
                
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-black opacity-10 select-none pointer-events-none" style="color: ${accent}">
                    01
                </div>
            </div>
        </div>
    `;
}

export const templates = {
    website: createWebsiteTemplate,
    mobile: createMobileTemplate,
    dashboard: createDashboardTemplate,
    poster: createPosterTemplate
};
