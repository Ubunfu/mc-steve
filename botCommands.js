const axios = require('axios');
const botUtils = require('./botUtils.js');
const botUtilsConstants = require('./botUtilsConstants.js');
const botAuthenticator = require('./botAuthenticator.js');
const awsHelpers = require('./awsHelpers.js');

async function giveHelp(msg) {
    msg.reply(botUtilsConstants.HELP_MESSAGE);
}

async function tryStartServer(msg) {
    const SERVER_REGION = process.env.SERVER_REGION;
    const SERVER_INSTANCE_ID = process.env.SERVER_INSTANCE_ID;
    const SERVER_KEY_ID = process.env.SERVER_KEY_ID;
    const SERVER_SEC_KEY = process.env.SERVER_SEC_KEY;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg)) {
        const startResp = await awsHelpers
            .startServer(SERVER_REGION, SERVER_KEY_ID, SERVER_SEC_KEY, SERVER_INSTANCE_ID)
            .catch(err => {
                msg.reply('Technical problem starting the server');
            });
        if (!startResp) {return;}
        if (startResp.StartingInstances[0].CurrentState.Name === 'starting') {
            msg.reply('Starting server');
        } else if (startResp.StartingInstances[0].CurrentState.Name === 'running') {
            msg.reply('The server is already running');
        } else {
            msg.reply('I couldn\'t start the server');
        }
    }
}

async function tryStopServer(msg) {
    const SERVER_REGION = process.env.SERVER_REGION;
    const SERVER_INSTANCE_ID = process.env.SERVER_INSTANCE_ID;
    const SERVER_KEY_ID = process.env.SERVER_KEY_ID;
    const SERVER_SEC_KEY = process.env.SERVER_SEC_KEY;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg)) {
        const stopResp = await awsHelpers
            .stopServer(SERVER_REGION, SERVER_KEY_ID, SERVER_SEC_KEY, SERVER_INSTANCE_ID)
            .catch(err => {
                msg.reply('Technical problem stopping the server');
            });
        if (!stopResp) {return;}
        if (stopResp.StoppingInstances[0].CurrentState.Name === 'stopping') {
            msg.reply('Stopping server');
        } else if (stopResp.StoppingInstances[0].CurrentState.Name === 'stopped') {
            msg.reply('The server is already stopped');
        } else {
            msg.reply('I couldn\'t stop the server');
        }
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