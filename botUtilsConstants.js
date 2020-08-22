const UNKNOWN_COMMAND_REPLIES = [
    'I don\'t even know what that means 🙃',
    'Speak plainly, stranger...',
    '*grunts incomprehensibly*',
    'What?...',
    'What is that, some kind of sex thing?...',
    'I see you, but all I hear is circus music',
    'What do you want?'
];

const HELP_MESSAGE = 'This is what I can do: \n'
    + '* `start`: I\'ll start up our Minecraft server \n'
    + '* `stop`: I\'ll stop our Minecraft server \n'
    + '* `search <search terms>`: I\'ll search the Minecraft Wiki\n' 
    + '* `help`: Show this help, since as it stands you can\'t do anything for yourself';

const EMPTY_SEARCH_RESULTS_MESSAGE = "No results!";

exports.UNKNOWN_COMMAND_REPLIES = UNKNOWN_COMMAND_REPLIES;
exports.HELP_MESSAGE = HELP_MESSAGE;
exports.EMPTY_SEARCH_RESULTS_MESSAGE = EMPTY_SEARCH_RESULTS_MESSAGE;