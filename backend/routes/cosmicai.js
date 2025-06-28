const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are the Cosmic AI Assistant, a friendly and curious space mission companion. You help users learn about astronomy, space exploration, and cosmic phenomena. 

Personality traits:
- Use enthusiastic, space-themed language like "Stellar question!", "That's out of this world!", "Cosmic discovery ahead!"
- Keep responses friendly, curious, and fun
- Use emojis occasionally (🌟, 🚀, 🌌, 🪐, ⭐)
- Stay focused on astronomy and space topics
- Keep responses concise (1-2 short paragraphs max)
- If asked about non-space topics, gently redirect back to cosmic topics

Begin responses with enthusiastic space-themed greetings when appropriate.`;

router.post('/ask', async (req, res) => {
    try{
        const {question} = req.body;

        if(!question || question.trim().length === 0){
            return res.status(400).json({error: 'Question is required',
                messaage: 'Please provide a question to ask the Cosmic AI Assistant'
            });
        }
        if(question.length > 500){
            return res.status(400).json({
                error: 'Question too long',
                message: 'Please keep your question under 500 characters'
            });
        }
        console.log('Received question:', question);

       const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'system', content: SYSTEM_PROMPT},
            {role: 'user', content: question}
        ],
        max_tokens: 100,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
       })
       const response = completion.choices[0].message.content.trim();
       console.log('AI response:', response);

       res.json({
        success: true,
        data: {
            question: question,
            response: response,
            timestamp: new Date().toISOString()
        }
       });
    }catch(error){
        console.error('Error:', error);
        if(error.code === 'insufficient_quota'){
            return res.status(429).json({
                error: 'API Quota Exceeded',
                message: 'You have reached the maximum number of requests. Please try again later.'
            });
        }
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred while processing your request. Please try again later.'
        });
    }
});

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Cosmic AI API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;