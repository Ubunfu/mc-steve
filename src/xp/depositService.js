const axios = require('axios')
const logger = require('../utils/logger')

async function depositXp(userId, amount) {
    const reqBody = {
        userId: userId,
        amount: amount
    }
    try {
        logger.log(`[depositService] Request to deposit API: ${JSON.stringify(reqBody)}`)
        const apiResp = await axios.post(process.env.SERVICE_XP_DEPOSIT_URL, reqBody)
    } catch (err) {
        logger.log(`[depositService] Error from deposit API: ${err.message} ${JSON.stringify(err.response.data)}`)
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

exports.depositXp = depositXp