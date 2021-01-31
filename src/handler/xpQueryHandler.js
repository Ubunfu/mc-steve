const axios = require('axios')
const logger = require('../../src/utils/logger')

async function handle(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^xp query/, '').trim();
    const messageOperandWords = messageOperands.split(' ');
    const userName = messageOperandWords[0];
    const reqParams = {
        params: {
            userId: userName
        }
    }
    let apiResp
    try {
        logger.log(`[xpQueryHandler] Looking up current XP held by ${userName}`)
        apiResp = await axios.get(process.env.SERVICE_XP_QUERY_URL, reqParams)
        msg.reply(`${apiResp.data.userId} currently holds ${apiResp.data.amount} XP points`)
    } catch (err) {
        logger.log(`[xpQueryHandler] Error from xp query service: ${err.message}`)
        await handleXpQueryError(err, msg, userName)
    }
}

async function handleXpQueryError(err, msg, userName) {
    if (err.response.status == 404) {
        msg.reply(`Not sure, ${userName} doesn\'t appear to be logged in at the moment`)
    } else {
        msg.reply(`Somethin\'s fucky... \`HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}\``)
    }
}

exports.handle = handle