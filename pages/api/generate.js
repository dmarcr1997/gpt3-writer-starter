import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `
Give me specific circuit components, connectors, and housings that will allow me to make a machine that meets the following specifications: 
Parts List:
`;
const generateAction = async (req, res) => {
    // Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `${basePromptPrefix}${req.body.userInput}/n`,
        temperature: 0.9,
        max_tokens: 450,
    });
    
    const basePromptOutput = baseCompletion.data.choices.pop();

    const secondPrompt =
    `
    Take the list of parts below and find specific components that will meet each of these specifications for the use case below:

    Use Case: ${req.body.userInput}

    Parts List: ${basePromptOutput.text}

    Detailed List:
    `
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `${secondPrompt}`,
        // I set a higher temperature for this one. Up to you!
        temperature: 0.9,
            // I also increase max_tokens.
        max_tokens: 750,
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();
    res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;