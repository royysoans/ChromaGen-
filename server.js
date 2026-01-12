import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Proxy endpoint for Groq API
app.post('/api/generate', async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'Server configuration error: GROQ_API_KEY missing' });
    }

    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    try {
        const fetch = (await import('node-fetch')).default;

        const payload = {
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: req.body.messages,
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" } // Force JSON mode if available, or just rely on prompt
        };

        const groqResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload),
        });

        if (!groqResponse.ok) {
            const error = await groqResponse.json();
            throw new Error(error.error?.message || 'Groq API request failed');
        }

        const data = await groqResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error proxying to Groq API:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
