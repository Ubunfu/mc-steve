async function msgAuthorIsPrivileged(msg) {
    const privGuild = process.env.PRIV_GUILD;
    const privRole = process.env.PRIV_ROLE;``
    if (! await msgAuthorInPrivGuild(msg, privGuild)) {
        msg.reply(`Message me from the \'${privGuild}\' Guild to do that.'`);
        return false;
    }
    if (! await msgAuthorHasPrivRole(msg, privRole)) {
        msg.reply(`You need to have the \'${privRole}\' role to do that.`);
        return false;
    }
    return true;
}

async function msgAuthorInPrivGuild(msg, privGuild) {
    if (msg.guild === null || msg.guild === undefined) { return false; }
    if (msg.guild.name === privGuild) { 
        return true; 
    } else {
        return false;
    }
}

async function msgAuthorHasPrivRole(msg, privRole) {
    let resultRole = msg.guild.roles.cache
        .find(role => role.name === privRole);
    if (resultRole === undefined) { return false; }
    
    let privRoleMembers = resultRole.members;
    if (privRoleMembers.some(guildMember => guildMember.user.username === msg.author.username)) {
        return true;
    }
    return false;
}

exports.msgAuthorIsPrivileged = msgAuthorIsPrivileged;
exports.msgAuthorInPrivGuild = msgAuthorInPrivGuild;
exports.msgAuthorHasPrivRole = msgAuthorHasPrivRole;