const axios = require('axios');

const SERVICE_WALLET_CHARGE_URL = process.env.SERVICE_WALLET_CHARGE_URL;
const SERVICE_WALLET_PAY_URL = process.env.SERVICE_WALLET_PAY_URL;

async function payPlayer(payer, payee, amount) {
    try {
        await charge(payer, amount);
        await pay(payee, amount);
    } catch (err) {
        console.log('[walletService] Response: HTTP ' 
            + err.response.status + ': ' 
            + JSON.stringify(err.response.data));
        throw Error(err.response.data.errorDetail);
    }
}

async function charge(player, amount) {
    await axios.post(
        SERVICE_WALLET_CHARGE_URL,
        {
            player: player,
            amount: amount
        });
}

async function pay(player, amount) {
    await axios.post(
        SERVICE_WALLET_PAY_URL,
        {
            player: player,
            amount: amount
        });
}

exports.payPlayer = payPlayer;