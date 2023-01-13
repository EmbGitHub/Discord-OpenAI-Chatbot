// Description: This is the main file for the discord bot
import { Configuration, OpenAIApi } from "openai"
import { Client, GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()
//get prefix from .env
const prefix = process.env.PREFIX
//create a discord bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

//Connect to openai api
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//Check for whene a message is sent
client.on('messageCreate', async message => {
    //Check if the message is from the bot
    if (message.author.bot) return;    

    if (message.content === '!ping') {
        message.reply('Pong!')
    }
    //check if the message start with the prefix  
    else if (message.content.startsWith(`${prefix}`)) {
        
        //remove the prefix from the message
        message.content = message.content.replace(`${prefix}`, '')
        //get response from openai
        try {
            const completion = await openai.createCompletion({
                "model": "text-davinci-003",
                "prompt": `${message.content}`,
                "max_tokens": 1000,
                "temperature": 0.5,
            });
            //check if completion is ok
            if (completion.data.choices) {
                message.reply(completion.data.choices[0].text)
            } else {
                message.reply('I have no idea what you are talking about')
            }
            return
        }
        catch (error) {
            console.log(error)
        }
    } else {
        return
    }
})

//Login to discord
client.login(process.env.DISCORD_KEY)
//tell the developer that the bot is running
console.log('Bot is running')