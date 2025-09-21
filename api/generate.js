// /api/generate.js

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY; // Securely accessed on the server
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  try {
    const googleApiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body), // Forward the body from our frontend
    });

    if (!googleApiResponse.ok) {
        const error = await googleApiResponse.json();
        throw new Error(error.message || 'Google API request failed');
    }

    const data = await googleApiResponse.json();
    // Send the successful response back to the frontend
    response.status(200).json(data);

  } catch (error) {
    console.error('Error proxying to Google API:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
}