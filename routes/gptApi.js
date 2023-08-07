const express = require("express");
const openai = require('openai');
const router = express.Router();

// Set your OpenAI API key here
const openaiApiKey = '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';
openai.apiKey = openaiApiKey;

router.get("/", async (req, res) => {
    res.json({ msg: "Welcome to GPT API" });
});

router.post("/chatgpt", async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const response = await openai.Completion.create({
            engine: 'text-davinci-002',
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.5,
        });

        res.json({ text: response.choices[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;
