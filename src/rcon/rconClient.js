const RCON = require('rcon');
const discord = require('discord.js');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_RCON_PORT = process.env.SERVER_RCON_PORT;
const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS;
const SERVER_RCON_CONNECT_DELAY_MS = process.env.SERVER_RCON_CONNECT_DELAY_MS;

let rconClient = new RCON(SERVER_HOST, SERVER_RCON_PORT, SERVER_RCON_PASS);
let message;

rconClient.on('auth', function() {
    console.log("Authenticated!");
}).on('response', function(resp) {
    console.log(`Got response: ${resp}`);
    message.reply(`***Server says...*** ${resp}`);
    return resp;
}).on('end', function() {
    console.log("Socket closed!");
}).on('error', function(err) {
    console.log("RCON error!");
    console.log(err);
    message.reply('The server didn\'t respond 😐')
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function executeCommand(msg, command) {
    message = msg;
    await rconClient.connect();
    await sleep(SERVER_RCON_CONNECT_DELAY_MS);
    await rconClient.send(command);
    rconClient.disconnect();
}

exports.executeCommand = executeCommand;