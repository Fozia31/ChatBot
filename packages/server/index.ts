import express from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
import dotenv from 'dotenv';
// import OpenAI from 'openai';
import Groq from 'groq-sdk';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app =express();

app.use(express.json());

const chatSchema = z.object({
    message:z.string()
            .min(1, 'Message cannot be empty')
            .max(1500, 'Message cannot exceed 500 characters')
    
})
const client = new Groq({
    apiKey: process.env.Groq_API_KEY
});

const conversationHistory: Array<{role: string, content: string}> = [];

app.get('/',(req:Request,res:Response) => {
    res.send('Welcome to ChatBot API!');
});
app.post('/api/chat',async(req:Request,res:Response) => {
    try{

        const { message } = req.body;
        conversationHistory.push({ role: 'user', content: message });
        const validation = chatSchema.safeParse({ message });
            if (!validation.success) {
                return res.status(400).json({
                    error: validation.error.errors.map(err => err.message).join(', ')
                });
            }
    
        const response = await client.chat.completions.create({
            model:'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful chatbot assistant.'
                },
                ...conversationHistory.slice(-5) ,
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature:0.7,
            max_tokens:300,
        })
        const botResponse = response.choices[0]?.message?.content || 'No response';
        conversationHistory.push({ role: 'assistant', content: botResponse });
        res.json({message:botResponse});
    }catch(error){
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' 
        });
    }

});
app.get('/api/hello',(req:Request,res:Response) => {
    res.send('Hello from the server!');
    res.end();
});
app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`);
})