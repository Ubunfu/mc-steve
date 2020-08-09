// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

async function msgAuthorHasRole(msg, opRole) {
    let resultRole = msg.guild.roles.cache
    .find(role => role.name === opRole);
    
    if (resultRole === undefined) { return false; }
    
    let opRoleMembers = resultRole.members;
    
    if (opRoleMembers.some(guildMember => guildMember.user.username === msg.author.username)) {
        return true;
    }
    
    return false;
}

async function tryStartServer(msg) {
    const OP_ROLE = process.env.OP_ROLE;
    const URL_SERVER_START = process.env.URL_SERVER_START;
    if (await msgAuthorHasRole(msg, OP_ROLE)) {
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
    if (await msgAuthorHasRole(msg, OP_ROLE)) {
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

async function stripMentions(msgContent) {
    const regex = /<@!(\d*)>/g;
    let result = msgContent.replace(regex, "").trim();
    return result;
}

async function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function getUnknownCommandReply() {
    const replies = [
        "I don't even know what that means 🙃",
        "Speak plainly, stranger...",
        "*grunts incomprehensibly*",
        "What?...",
        "What is that, some kind of sex thing?...",
        "I see you, but all I hear is circus music",
        "What do you want?"
    ];
    return replies[await getRandomInt(replies.length)];
}

async function giveHelp(msg) {
    const helpMsg = "This is what I can do: \n"
        + "* `start`: I'll start up our Minecraft server \n"
        + "* `stop`: I'll stop our Minecraft server \n"
        + "* `help`: Show this help, since as it stands you can't do anything for yourself"
    msg.reply(helpMsg);
}

async function handleMention(msg) {
    msg.content = await stripMentions(msg.content);
    switch (msg.content) {
        case "help":
            await giveHelp(msg);
            break;
        case "start":
            await tryStartServer(msg);
            break;
        case "stop":
            await tryStopServer(msg);
            break;
        default:
            msg.reply(await getUnknownCommandReply());
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