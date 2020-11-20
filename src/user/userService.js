const axios = require('axios');

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
            throw Error('user not found');
        } else {
            console.log(`[userService] Error calling get user service: ${JSON.stringify(err.response)}`);
            throw err;
        }
    }
}

exports.getUser = getUser;