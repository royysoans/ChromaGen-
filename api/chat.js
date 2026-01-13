export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY; 

  if (!apiKey) {
      return response.status(500).json({ message: 'Server configuration error: GROQ_API_KEY missing' });
  }

  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  try {
    const payload = {
        model: "meta-llama/llama-3.2-90b-vision-preview", // or similar valid model
        messages: request.body.messages,
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" }
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
    response.status(200).json(data);

  } catch (error) {
    console.error('Error proxying to Groq API:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
}
