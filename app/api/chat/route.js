export async function POST(req) {
    try {
        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Messages array is required" }), { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key is missing" }), { status: 500 });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages, // Send conversation history
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch from OpenAI API");
        }

        const data = await response.json();
        return new Response(JSON.stringify({ answer: data.choices[0].message.content }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
