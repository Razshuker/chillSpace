const express = require("express");
// const openai = require('openai');
const router = express.Router();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);



// Set your OpenAI API key here
// const openaiApiKey = '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';
// apiKey = openaiApiKey;

// router.get("/", async (req, res) => {
//     res.json({ msg: "Welcome to GPT API" });
// });

router.post("/chatgpt", async (req, res) => {
    const prompt = req.body.prompt;
    try {
        // const response = await openai.Completion.create({
        //     engine: 'text-davinci-002',
        //     prompt: prompt,
        // });
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        console.log(chatCompletion.data.choices[0].message);
        res.json({ text: chatCompletion.data.choices[0].message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;
