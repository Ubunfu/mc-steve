const RCON = require('rcon');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_RCON_PORT = process.env.SERVER_RCON_PORT;
const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS;
const SERVER_RCON_CONNECT_DELAY_MS = process.env.SERVER_RCON_CONNECT_DELAY_MS;

let rconClient = new RCON(SERVER_HOST, SERVER_RCON_PORT, SERVER_RCON_PASS);

rconClient.on('auth', function() {
    console.log("Authenticated!");
}).on('response', function(resp) {
    console.log(`Got response: ${resp}`);
    return resp;
}).on('end', function() {
    console.log("Socket closed!");
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function executeCommand(command) {
    await rconClient.connect();
    await sleep(SERVER_RCON_CONNECT_DELAY_MS);
    await rconClient.send(command);
    rconClient.disconnect();
}

exports.executeCommand = executeCommand;