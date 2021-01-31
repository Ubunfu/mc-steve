const logger = require('../utils/logger')
const userService = require('../user/userService')
const withdrawService = require('../xp/withdrawService')

async function handle(msg) {
    let userServiceResp
    try {
        logger.log(`[xpWithdrawHandler] Looking up minecraft username of Discord user: ${msg.author.username}`)
        userServiceResp = await userService.getUser(msg.author.username)
    } catch (err) {
        logger.log(`[xpWithdrawHandler] Error from user service: ${err.message}`)
        await handleUserServiceError(err, msg)
    }
    if (userServiceResp) {
        await requestWithdraw(msg, userServiceResp.minecraftUser, await parseWithdrawAmount(msg))
    }
}

async function parseWithdrawAmount(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^xp withdraw/, '').trim();
    const messageOperandWords = messageOperands.split(' ');
    return parseInt(messageOperandWords[0]);
}

async function requestWithdraw(msg, userId, amount) {
    try {
        logger.log(`[xpWithdrawHandler] User ${userId} is attempting to withdraw ${amount} XP`)
        await withdrawService.withdrawXp(userId, amount)
        msg.reply(`Withdrew ${amount} XP from your XP bank`)
    } catch (err) {
        logger.log(`[xpWithdrawHandler] Error from withdraw service: ${err.message}`)
        await handleWithdrawServiceError(err, msg)
    }
}

async function handleWithdrawServiceError(err, msg) {
    if (err.message == 'insufficient funds') {
        msg.reply('You don\'t have enough XP to make that withdraw')
    } else if (err.message == 'user not found') {
        msg.reply('You don\'t appear to be online at the moment.  Log in to make your withdraw.')
    } else {
        msg.reply(`Not able to process the withdraw at the moment: HTTP ${err.response.status} \`${JSON.stringify(err.response.data)}\``)
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

exports.handle = handle