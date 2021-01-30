const axios = require('axios');
const logger = require('../utils/logger')

async function getUser(discordUsername) {
    try {
        const apiResp = await axios.get(
            process.env.SERVICE_USERS_GET_USER_URL,
            {
                params: {
                    discordUser: discordUsername
                }
            });
        return apiResp.data;
    } catch (err) {
        if ((err.response != undefined) && (err.response.status == 404)) {
            logger.log(`[userService] user not found`)
            throw Error('user not found');
        } else {
            logger.log(`[userService] Error from user API: ${err.message} ${JSON.stringify(err.response.data)}`);
            throw err;
        }
    }
}

exports.getUser = getUser;