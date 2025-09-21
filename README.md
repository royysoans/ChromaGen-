# ChromaGen  
**AI-Powered Generative Palettes for Designers**

---
                                                                            
## Project Abstract
Color is a fundamental element of user experience—capable of evoking emotion, guiding attention, and shaping brand identity. Yet crafting a palette that is both visually harmonious **and** meets strict accessibility standards can be time-consuming and tedious.

**ChromaGen** is an AI-powered web tool that streamlines this process.  
Using prompts, ChromaGen generates complete, ready-to-use color palettes **automatically checked for WCAG accessibility compliance**. Designers and developers can focus on creativity while the system ensures great color choices.

---

## Key Features
- **Multi-Modal Prompting** – Describe a mood/brand or upload an image to inspire your palette.
- **Generative Color Engine** – AI model creates a harmonious set of 5–7 colors based on your input.
- **Structured Output** – Each color is labeled with a role (Primary, Secondary, Accent) plus HEX, RGB, and HSL codes for easy copy/paste.
- **Automated Accessibility Auditing** – Built-in WCAG AA/AAA contrast checks and color-blindness simulations (protanopia, deuteranopia, tritanopia).

---

## Tech Stack
- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript  
- **Backend**: Serverless Functions (Vercel) running on Node.js  
- **AI Generation**: Google Gemini API (Generative Language)  
- **Accessibility Tools**: Custom WCAG contrast-ratio calculations and color-blindness simulation

---

## 📂 Repository Structure
- **README.md**
- **index.html**
- **style.css**
- **script.js**