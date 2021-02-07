const logger = require('../../src/utils/logger')
const userService = require('../user/userService')
const transferService = require('../xp/transferService')

async function handle(msg) {
    let userServiceResp
    try {
        logger.log(`[xpTransferHandler] Looking up minecraft username of Discord user: ${msg.author.username}`)
        userServiceResp = await userService.getUser(msg.author.username)
    } catch (err) {
        logger.log(`[xpTransferHandler] Error from user service: ${err.message}`)
        await handleUserServiceError(err, msg)
    }
    if (userServiceResp) {
        logger.log(`[xpTransferHandler] user API resp: ${JSON.stringify(userServiceResp)}`)
        await requestTransfer(
            msg, userServiceResp.minecraftUser, await parsePayeeUserId(msg), await parseTransferAmount(msg))
    }
}

async function parsePayeeUserId(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^xp transfer/, '').trim();
    return messageOperands.split(' ')[0];
}

async function parseTransferAmount(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^xp transfer/, '').trim();
    return messageOperands.split(' ')[1];
}

async function requestTransfer(msg, payerUserId, payeeUserId, amount) {
    try {
        logger.log(`[xpTransferHandler] ${payerUserId} is attempting to transfer ${amount} XP to ${payeeUserId}`)
        await transferService.transferXp(payerUserId, payeeUserId, amount)
        msg.reply(`Transferred ${amount} XP to ${payeeUserId}\'s bank`)
    } catch (err) {
        logger.log(`[xpTransferHandler] Error from transfer service: ${err.message}`)
        await handleTransferServiceError(err, msg)
    }
}

async function handleUserServiceError(err, msg) {
    if (err.message == 'user not found') {
        msg.reply('I didn\'t find a Minecraft username associated with your Discord '
            + 'handle.  One must be registered before you can use the XP bank.')
    } else {
        msg.reply(`I wasn't able to look up your Minecraft username: HTTP ${err.response.status} \`${JSON.stringify(err.response.data)}\``)
    }
}

async function handleTransferServiceError(err, msg) {
    if (err.message == 'insufficient funds') {
        msg.reply('You don\'t have enough XP to make that transfer')
    } else {
        msg.reply(`Not able to process the transfer at the moment: HTTP ${err.response.status} \`${JSON.stringify(err.response.data)}\``)
    }
}

exports.handle = handle