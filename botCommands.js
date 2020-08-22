const axios = require('axios');
const botUtils = require('./botUtils.js');
const botUtilsConstants = require('./botUtilsConstants.js');
const botAuthenticator = require('./botAuthenticator.js');

async function giveHelp(msg) {
    msg.reply(botUtilsConstants.HELP_MESSAGE);
}
async function tryStartServer(msg) {
    const URL_SERVER_START = process.env.URL_SERVER_START;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg)) {
        axios.get(URL_SERVER_START)
        .then(res => {
            msg.reply('Server is starting');
        })
        .catch(err => {
            msg.reply('I tried, but the server said no!')
            console.error(URL_SERVER_START + ": " + err.response.status + ": " + err.response.statusText);
        });
    }
}

async function tryStopServer(msg) {
    const URL_SERVER_STOP = process.env.URL_SERVER_STOP;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg)) {
        axios.get(URL_SERVER_STOP)
        .then(res => {
            msg.reply('Server is stopping');
        })
        .catch(err => {
            msg.reply('I tried, but the server said no!')
            console.error(URL_SERVER_STOP + ": " + err.response.status + ": " + err.response.statusText);
        });
    }
}

async function searchMinecraftWikiForArticles(msg) {
    msg.content = msg.content.replace(/^search/, '').trim();
    const resp = await axios.get('https://minecraft.fandom.com/api/v1/Search/List', {
        params: {
            query: `${msg.content}`,
            namespaces: 0,
            limit: 3
        }
    });
    const results = await botUtils.buildSearchResponse(resp.data.items);
    msg.reply(results);
}

exports.giveHelp = giveHelp;
exports.tryStartServer = tryStartServer;
exports.tryStopServer = tryStopServer;
exports.searchMinecraftWikiForArticles = searchMinecraftWikiForArticles;