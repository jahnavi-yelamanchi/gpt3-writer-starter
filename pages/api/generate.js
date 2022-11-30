import {Configuration,OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Make the following text into 3 concise bullet points: 
Text:
`

const generateAction = async (req,res)=>{
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.7,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    //followup prompt

    const secondPrompt =
    `
    Take one important topic from the bullet points below and give 2 references along with the topic name. Give a short summary under each reference.
    Text: ${req.body.userInput}
    Points: ${basePromptOutput.text}
    Explanation:
    `

    //second call to api

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature:0.9,
        max_tokens:500,
    });

    //get output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();
    // res.status(200).json({output: basePromptOutput});
    res.status(200).json({output: secondPromptOutput});
};

export default generateAction;
