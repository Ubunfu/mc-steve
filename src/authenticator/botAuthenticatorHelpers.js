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

exports.msgAuthorInPrivGuild = msgAuthorInPrivGuild;
exports.msgAuthorHasPrivRole = msgAuthorHasPrivRole;