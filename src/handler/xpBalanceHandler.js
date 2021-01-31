const axios = require('axios')
const logger = require('../../src/utils/logger')

async function handle(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^xp balance/, '').trim();
    const messageOperandWords = messageOperands.split(' ');
    const userName = messageOperandWords[0];
    const reqParams = {
        params: {
            userId: userName
        }
    }
    let apiResp
    try {
        logger.log(`[xpBalanceHandler] Looking up XP bank balance for ${userName}`)
        apiResp = await axios.get(process.env.SERVICE_XP_BALANCE_URL, reqParams)
        msg.reply(`${apiResp.data.userId} has ${apiResp.data.balance} XP points banked`)
    } catch (err) {
        logger.log(`[xpBalanceHandler] Error from xp balance service: ${err.message}`)
        await handleXpBalanceError(err, msg, userName)
    }
}

async function handleXpBalanceError(err, msg, userName) {
    if (err.response.status == 404) {
        msg.reply(`${userName} doesn\'t appear to have an XP bank account yet`)
    } else {
        msg.reply(`Somethin\'s fucky... \`HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}\``)
    }
}

exports.handle = handle