
const axios = require('axios');
const botUtils = require('./botUtils.js');
const botUtilsConstants = require('./botUtilsConstants.js');

async function giveHelp(msg) {
    msg.reply(botUtilsConstants.HELP_MESSAGE);
}
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

async function searchMinecraftWikiForArticles() {

}

exports.giveHelp = giveHelp;
exports.tryStartServer = tryStartServer;
exports.tryStopServer = tryStopServer;
exports.searchMinecraftWikiForArticles = searchMinecraftWikiForArticles;