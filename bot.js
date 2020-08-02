// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!up') {
        axios.get('https://httpbin.org/status/500')
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
