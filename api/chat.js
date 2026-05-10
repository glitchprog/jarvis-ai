// This is your backend — it runs on Vercel's servers
// Users never see this file. It takes questions and sends them to Groq.

module.exports = async function handler(req, res) {
    // Only accept POST requests (that's how your frontend sends data)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'No message provided' });
    }

    try {
        // Send the message to Groq
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
                        Always address the user as "sir".
                        Never break character. You are JARVIS, built by Jarvis.`
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

        // Check if Groq gave us an error
        if (!response.ok) {
            console.error('Groq error:', data);
            return res.status(500).json({ error: 'Groq API failed', details: data });
        }

        const reply = data.choices[0].message.content;
        res.status(200).json({ reply });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'JARVIS is offline. Systems down.' });
    }
};