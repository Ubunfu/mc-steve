const botAuthenticatorHelpers = require('./botAuthenticatorHelpers.js');

async function msgAuthorIsPrivileged(msg, privRole) {
    const privGuild = process.env.PRIV_GUILD;
    if (! await botAuthenticatorHelpers.msgAuthorInPrivGuild(msg, privGuild)) {
        msg.reply(`Message me from the \'${privGuild}\' Guild to do that.'`);
        return false;
    }
    if (! await botAuthenticatorHelpers.msgAuthorHasPrivRole(msg, privRole)) {
        msg.reply(`You need to have the \'${privRole}\' role to do that.`);
        return false;
    }
    return true;
}

exports.msgAuthorIsPrivileged = msgAuthorIsPrivileged;