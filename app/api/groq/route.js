import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req) {
    try {
        const { diseaseName, confidence } = await req.json();

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || "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",
        });

const prompt = `
As a medical AI assistant, provide comprehensive medical advice for ${diseaseName} (confidence: ${confidence}%).

Please format your response using Markdown with the following guidelines:

### Formatting rules:
- Use ### for headers (e.g., ### What this condition means)
- Use **bold** for emphasis on key terms
- Use *italic* for emphasis on important points
- Use numbered or dashed lists for multiple points (do NOT use asterisks *)
- Use blockquotes (>) for important notes or warnings
- Use emojis to enhance visual appeal and help with understanding
- Keep each line concise; wrap text as needed to avoid overflow

### Please include the following sections:

1. ### What this condition means  
   - Clear and concise explanation of the condition  
   - Use bold and italics to highlight important concepts  

2. ### Immediate precautions to take  
   - List essential first steps or precautions  
   - Include any urgent warnings or alerts  

3. ### Recommended treatments  
   - Outline common and effective treatment options  

4. ### When to seek medical attention  
   - Describe warning signs or symptoms requiring urgent care  
   - Use blockquotes for emphasizing critical information  

5. ### Prevention tips  
   - Provide actionable steps to avoid or reduce risk  
   - Use emojis for motivation and clarity  

6. ### Lifestyle recommendations  
   - Suggest lifestyle changes that support recovery or management  
   - Use lists and bold/italic formatting to highlight key points  

---

Ensure the response is informative yet easy to understand for patients, structured for readability, and visually engaging.
`;


        const chatCompletion = await groq.chat.completions.create({
            messages: [{
                role: "user",
                content: prompt,
            }, ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 1.0,
            stream: true,
            stop: null
        });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of chatCompletion) {
                        const content = chunk.choices && chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content;
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (error) {
                    console.error('Streaming error:', error);
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        console.error('Groq API error:', error);
        return NextResponse.json({ error: 'Failed to generate medical advice', details: error.message }, { status: 500 });
    }
}
