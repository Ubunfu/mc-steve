const axios = require('axios');
const botUtils = require('../utils/botUtils.js');
const botUtilsConstants = require('../utils/botUtilsConstants.js');
const botAuthenticator = require('../authenticator/botAuthenticator.js');
const awsHelpers = require('../aws/awsHelpers.js');
const rconClient = require('../rcon/rconClient.js');

async function giveHelp(msg) {
    msg.reply(botUtilsConstants.HELP_MESSAGE);
}

async function rconCommand(msg) {
    const ROLE_RCON = process.env.ROLE_RCON;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg, ROLE_RCON)) {
        rconClient.executeCommand(msg.content);
    }
}

async function tryStartServer(msg) {
    const SERVER_REGION = process.env.SERVER_REGION;
    const SERVER_INSTANCE_ID = process.env.SERVER_INSTANCE_ID;
    const SERVER_KEY_ID = process.env.SERVER_KEY_ID;
    const SERVER_SEC_KEY = process.env.SERVER_SEC_KEY;
    const ROLE_START = process.env.ROLE_START;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg, ROLE_START)) {
        const startResp = await awsHelpers
            .startServer(SERVER_REGION, SERVER_KEY_ID, SERVER_SEC_KEY, SERVER_INSTANCE_ID)
            .catch(err => {
                msg.reply('Technical problem starting the server');
            });
        if (!startResp) {return;}
        if ((startResp.StartingInstances[0].CurrentState.Name === 'starting') ||
            (startResp.StartingInstances[0].CurrentState.Name === 'pending')) {
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
    const ROLE_STOP = process.env.ROLE_STOP;
    if (await botAuthenticator.msgAuthorIsPrivileged(msg, ROLE_STOP)) {
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
    let resp;
    try {
        resp = await axios.get('https://minecraft.fandom.com/api/v1/Search/List', {
            params: {
                query: `${msg.content}`,
                namespaces: 0,
                limit: 3
            }
        });
    } catch (err) {
        console.error(err);
        msg.reply('The wiki returned an error, sorry 😟');
    }
    if (resp) {
        try {
            const results = await botUtils.buildSearchResponse(resp.data.items);
            msg.reply(results);
        } catch (err) {
            console.error(err);
            msg.reply('The wiki responded but I don\'t understand it, sorry 😟');
        }
    }
}

exports.giveHelp = giveHelp;
exports.tryStartServer = tryStartServer;
exports.tryStopServer = tryStopServer;
exports.searchMinecraftWikiForArticles = searchMinecraftWikiForArticles;
exports.rconCommand = rconCommand;