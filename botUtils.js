const botUtilsConstants = require('./botUtilsConstants.js');
const mathUtils = require('./mathUtils.js');

async function stripMentions(msgContent) {
    const regex = /<@!?(\d*)>/g;
    let result = msgContent.replace(regex, '').trim();
    return result;
}

async function getUnknownCommandReply() {
    const replies = botUtilsConstants.UNKNOWN_COMMAND_REPLIES;
    return replies[await mathUtils.getRandomInt(replies.length)];
}

async function buildSearchResponse(items) {
    if (items.length === 0) {
        return botUtilsConstants.EMPTY_SEARCH_RESULTS_MESSAGE;
    }

    let resp = '';
    for (const item of items) {
        const cleanSnippet = await removeSpans(item.snippet);
        resp = resp.concat(`\n* **${item.title}**: <${item.url}>\n${cleanSnippet}\n`);
    }
    return resp;
}

async function removeSpans(snippet) {
    const snippetWithoutOpeningSpans = snippet.replace(/<span(.*?)>/g, '');
    return snippetWithoutOpeningSpans.replace(/<\/span>/g, '');
}

exports.stripMentions = stripMentions;
exports.getUnknownCommandReply = getUnknownCommandReply;
exports.buildSearchResponse = buildSearchResponse;
exports.removeSpans = removeSpans;