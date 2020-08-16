// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const botUtils = require('./botUtils.js');
const botCommands = require('./botCommands.js');

async function handleMention(msg) {
    msg.content = await botUtils.stripMentions(msg.content);
    const str = 'asdf';
    if (msg.content.match(/^search (\w+)/)) {
        await botCommands.searchMinecraftWikiForArticles(msg);
    } else if (msg.content == 'start') {
        await botCommands.tryStartServer(msg);
    } else if (msg.content == 'stop') {
        await botCommands.tryStopServer(msg);
    } else if (msg.content == 'help') {
        await botCommands.giveHelp(msg);
    } else {
        msg.reply(await botUtils.getUnknownCommandReply());
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