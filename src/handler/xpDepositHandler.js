const logger = require('../../src/utils/logger')
const userService = require('../user/userService')
const depositService = require('../xp/depositService')

async function handle(msg) {
    let userServiceResp
    try {
        logger.log(`[xpDepositHandler] Looking up minecraft username of Discord user: ${msg.author.username}`)
        userServiceResp = await userService.getUser(msg.author.username)
    } catch (err) {
        logger.log(`[xpDepositHandler] Error from user service: ${err.message}`)
        await handleUserServiceError(err, msg)
    }
    if (userServiceResp) {
        await requestDeposit(msg, userServiceResp.minecraftUser, await parseDepositAmount(msg))
    }
}

async function parseDepositAmount(msg) {
    let messageContent = msg.content;
    const messageOperands = messageContent.replace(/^xp deposit/, '').trim();
    const messageOperandWords = messageOperands.split(' ');
    return parseInt(messageOperandWords[0]);
}

async function requestDeposit(msg, userId, amount) {
    try {
        logger.log(`[xpDepositHandler] User ${userId} is attempting to deposit ${amount} XP`)
        await depositService.depositXp(userId, amount)
        msg.reply(`Deposited ${amount} XP into your XP bank`)
    } catch (err) {
        logger.log(`[xpDepositHandler] Error from deposit service: ${err.message}`)
        await handleDepositServiceError(err, msg)
    }
}

async function handleDepositServiceError(err, msg) {
    if (err.message == 'insufficient funds') {
        msg.reply('You don\'t have enough XP to make that deposit')
    } else if (err.message == 'user not found') {
        msg.reply('You don\'t appear to be online at the moment.  Log in to make your deposit.')
    } else {
        msg.reply(`Not able to process the deposit at the moment: HTTP ${err.response.status} \`${JSON.stringify(err.response.data)}\``)
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