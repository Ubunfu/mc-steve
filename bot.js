// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

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

async function tryStartServer(msg, opRole) {
    if (await msgAuthorHasRole(msg, opRole)) {
        msg.reply("Starting the server");
    } else {
        msg.reply("You need the " + opRole + " role to do that");
    }
}

client.on('message', msg => {

    const OP_ROLE = process.env.OP_ROLE;

    if (msg.content === "!s") {
        tryStartServer(msg, OP_ROLE)
            .catch((err) => {
                console.log(err);
                msg.reply("Sorry, something went wrong");
            });
    }
    
    if (msg.content === '!up') {

        axios.get('https://httpbin.org/status/200')
            .then(res => {
                console.log(res.data);
                msg.reply('Started up the server')
            })
            .catch(err => {
                msg.reply('I tried, but the server said no.')
                console.error(err.response.status + ": " + err.response.statusText);
            });
    }
});

client.login(process.env.DISCORD_TOKEN);
