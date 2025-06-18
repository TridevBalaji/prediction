import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req) {
    try {
        const { diseaseName, confidence } = await req.json();

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || "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",
        });

        const prompt = `As a medical AI assistant, provide comprehensive medical advice for ${diseaseName} (confidence: ${confidence}%). 
    
    Please include:
    1. What this condition means
    2. Immediate precautions to take
    3. Recommended treatments
    4. When to seek medical attention
    5. Prevention tips
    6. Lifestyle recommendations
    
    Format the response in a clear, structured manner with bullet points and sections. 
    Keep it informative but easy to understand for patients.`;

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