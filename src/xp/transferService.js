const logger = require('../utils/logger')
const axios = require('axios')

async function transferXp(payerUserId, payeeUserId, amount) {
    const reqBody = {
        payerUserId: payerUserId,
        payeeUserId: payeeUserId,
        amount: amount
    }
    try {
        logger.log(`[transferService] Request to transfer API: ${JSON.stringify(reqBody)}`)
        await axios.post(process.env.SERVICE_XP_TRANSFER_URL, reqBody)
    } catch (err) {
        logger.log(`[transferService] Error from transfer API: ${err.message} ${JSON.stringify(err.response.data)}`)
        await handleApiError(err)
    }
}

async function handleApiError(err) {
    if ((err.response != undefined) && (err.response.status == 403)) {
        throw Error('insufficient funds')
    } else if ((err.response != undefined) && (err.response.status == 404)) {
        throw Error('insufficient funds')
    } else {
        throw err
    }
}

exports.transferXp = transferXp