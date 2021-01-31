const logger = require('../utils/logger')
const axios = require('axios')

async function withdrawXp(userId, amount) {
    const reqBody = {
        userId: userId,
        amount: amount
    }
    try {
        logger.log(`[withdrawService] Request to withdraw API: ${JSON.stringify(reqBody)}`)
        await axios.post(process.env.SERVICE_XP_WITHDRAW_URL, reqBody)
    } catch (err) {
        logger.log(`[withdrawService] Error from withdraw API: ${err.message} ${JSON.stringify(err.response.data)}`)
        await handleApiError(err)
    }
}

async function handleApiError(err) {
    if ((err.response != undefined) && (err.response.status == 403)) {
        throw Error('insufficient funds')
    } else if ((err.response != undefined) && (err.response.status == 404)) {
        throw Error('user not found')
    } else {
        throw err
    }
}

exports.withdrawXp = withdrawXp