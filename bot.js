// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const botUtils = require('./botUtils.js');
const botCommands = require('./botCommands.js');

async function handleMention(msg) {
    msg.content = await botUtils.stripMentions(msg.content);
    switch (msg.content) {
        case "help":
            await botCommands.giveHelp(msg);
            break;
        case "start":
            await botCommands.tryStartServer(msg);
            break;
        case "stop":
            await botCommands.tryStopServer(msg);
            break;
        case "search":
            await botCommands.searchMinecraftWikiForArticles(msg);
            break;
        default:
            msg.reply(await botUtils.getUnknownCommandReply());
            break;
    }
}

client.on('message', msg => {
    const BOT_USERNAME = process.env.BOT_USERNAME;
    if (msg.mentions.users.find(user => user.username === BOT_USERNAME)) {
        handleMention(msg);
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);