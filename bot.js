// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const botUtils = require('./botUtils.js');

async function tryStartServer(msg) {
    const OP_ROLE = process.env.OP_ROLE;
    const URL_SERVER_START = process.env.URL_SERVER_START;
    if (await botUtils.msgAuthorHasRole(msg, OP_ROLE)) {
        axios.get(URL_SERVER_START)
        .then(res => {
            msg.reply('Server is starting');
        })
        .catch(err => {
            msg.reply('I tried, but the server said no!')
            console.error(URL_SERVER_START + ": " + err.response.status + ": " + err.response.statusText);
        });
    } else {
        msg.reply("You need the " + OP_ROLE + " role to do that");
    }
}

async function tryStopServer(msg) {
    const OP_ROLE = process.env.OP_ROLE;
    const URL_SERVER_STOP = process.env.URL_SERVER_STOP;
    if (await botUtils.msgAuthorHasRole(msg, OP_ROLE)) {
        axios.get(URL_SERVER_STOP)
        .then(res => {
            msg.reply('Server is stopping');
        })
        .catch(err => {
            msg.reply('I tried, but the server said no!')
            console.error(URL_SERVER_STOP + ": " + err.response.status + ": " + err.response.statusText);
        });
    } else {
        msg.reply("You need the " + OP_ROLE + " role to do that");
    }
}

async function handleMention(msg) {
    msg.content = await botUtils.stripMentions(msg.content);
    switch (msg.content) {
        case "help":
            await botUtils.giveHelp(msg);
            break;
        case "start":
            await tryStartServer(msg);
            break;
        case "stop":
            await tryStopServer(msg);
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