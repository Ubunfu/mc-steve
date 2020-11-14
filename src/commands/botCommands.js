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
        const command = msg.content.replace('run', '').trim();
        rconClient.executeCommand(msg, command);
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

async function buyItem(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^buy/, '').trim();
    const messageOperandWords = messageOperands.split(' ');
    const playerName = messageOperandWords[0];
    const itemQuantity = messageOperandWords[1];
    const nameAndQuantRegex = new RegExp(`^${playerName} ${itemQuantity}`);
    const itemName = messageOperands.replace(nameAndQuantRegex, '').trim();
    const reqBody = {
        player: playerName,
        itemName: itemName,
        quantity: parseInt(itemQuantity)
    };
    try {
        console.log('Request: ' + JSON.stringify(reqBody));
        const resp = await axios.post(process.env.SERVICE_SHOP_BUY_ITEM_URL,reqBody);
        console.log(`Response: HTTP ${resp.status}`);
        msg.reply('Purchase successful');
    } catch (err) {
        console.log('Error purchasing items:');
        console.log('Response: HTTP ' 
            + err.response.status + ': ' 
            + JSON.stringify(err.response.data));
        const errorReply = 'Purchase failed: '
            + '\`\`\`'
            + `HTTP ${err.response.status}: `
            + JSON.stringify(err.response.data)
            + '\`\`\`';
        msg.reply(errorReply);
    }
}

async function getItem(msg) {
    let messageContent = msg.content;
    const itemName = messageContent.replace(/^price/, '').trim();
    const reqParams = {
        params: {
            item: itemName
        }
    }
    try {
        console.log(`Retrieving item: ${itemName}`);
        const resp = await axios.get(process.env.SERVICE_SHOP_GET_ITEM_URL,reqParams);
        console.log(`Response: HTTP ${resp.status}`);
        msg.reply(`${itemName} is valued at ${resp.data.price}`);
    } catch (err) {
        console.log('Error getting item:');
        console.log('Response: HTTP ' 
            + err.response.status + ': ' 
            + JSON.stringify(err.response.data));
        const errorReply = 'Price check failed: '
            + '\`\`\`'
            + `HTTP ${err.response.status}: `
            + JSON.stringify(err.response.data)
            + '\`\`\`';
        msg.reply(errorReply);
    }
}

async function getWallet(msg) {
    let messageContent = msg.content;
    const userName = messageContent.replace(/^wallet/, '').trim();
    const reqParams = {
        params: {
            id: userName
        }
    }
    try {
        console.log(`Retrieving wallet: ${userName}`);
        const resp = await axios.get(process.env.SERVICE_WALLET_GET_WALLET_URL,reqParams);
        console.log(`Response: HTTP ${resp.status}`);
        msg.reply(`${userName} has ${resp.data.Balance} in their wallet`);
    } catch (err) {
        console.log('Error getting wallet:');
        console.log('Response: HTTP ' 
            + err.response.status + ': ' 
            + JSON.stringify(err.response.data));
        const errorReply = 'Failed to check wallet: '
            + '\`\`\`'
            + `HTTP ${err.response.status}: `
            + JSON.stringify(err.response.data)
            + '\`\`\`';
        msg.reply(errorReply);
    }
}

exports.giveHelp = giveHelp;
exports.tryStartServer = tryStartServer;
exports.tryStopServer = tryStopServer;
exports.searchMinecraftWikiForArticles = searchMinecraftWikiForArticles;
exports.rconCommand = rconCommand;
exports.buyItem = buyItem;
exports.getItem = getItem;
exports.getWallet = getWallet;