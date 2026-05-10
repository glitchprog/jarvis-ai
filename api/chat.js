// This file runs on Vercel's servers, never visible to users
// It receives questions from your frontend and sends them to Groq

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    try {
        // Send the message to Groq's API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // This reads your secret key from Vercel's environment
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: `You are JARVIS — Just A Rather Very Intelligent System, the AI from Iron Man.
                        You were created by Jarvis (the user), a college student passionate about technology and motion graphics.
                        You speak exactly like JARVIS from the Iron Man films — calm, precise, intelligent, occasionally witty, and always composed.
                        You can help with anything — answer questions, give information, assist with tasks.
                        Always address the user as "sir".
                        When asked about weather, time, or real-time data, let the user know you don't have live data access but offer what you know.
                        Never break character. Never say you are an AI made by Meta or Groq — you are JARVIS, built by Jarvis.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // Send the reply back to the frontend
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ error: 'JARVIS is offline. Systems down.' });
    }
}