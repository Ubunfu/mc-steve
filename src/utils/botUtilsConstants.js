const UNKNOWN_COMMAND_REPLIES = [
    'I don\'t even know what that means 🙃',
    'Speak plainly, stranger...',
    '*grunts incomprehensibly*',
    'What?...',
    'What is that, some kind of sex thing?...',
    'I see you, but all I hear is circus music',
    'What do you want?',
    'If you can\'t say something nice, don\'t say anything at all...',
    'I like you. You remind me of me when I was young and stupid.',
    'I see you\'ve set aside this special time to humiliate yourself in public.',
    'I refuse to have a battle of wits with an unarmed person.',
    'How about never? Is never good for you?',
    'Don\'t worry. I forgot your name, too.',
    'I\'ll try being nicer if you\'ll try being smarter.'
];

const HELP_MESSAGE = 'This is what I can do: \n'
    + '* `start`: I\'ll start up our Minecraft server \n'
    + '* `stop`: I\'ll stop our Minecraft server \n'
    + '* `search <search terms>`: I\'ll search the Minecraft Wiki\n'
    + '* `run <command>`: I\'ll run a command on the server\n'
    + '* `wallet <username>`: I\'ll check how much money you have in your wallet\n'
    + '* `price <itemName>`: I\'ll price check an item from the Shop\n'
    + '* `buy <quantity> <itemName>`: I\'ll buy you items from the Shop\n'
    + '* `sell <quantity> <itemName>`: I\'ll sell your items to the Shop\n'
    + '* `pay <username> <amount>`: I\'ll pay another player from your wallet\n'
    + '* `xp query <username>`: I\'ll tell you how much XP a player has\n'
    + '* `xp deposit <amount>`: I\'ll deposit your XP points into your XP bank\n'
    + '* `xp withdraw <amount>`: I\'ll withdraw your XP points from your XP bank\n'
    + '* `help`: Show this help, since as it stands you can\'t do anything for yourself';

const EMPTY_SEARCH_RESULTS_MESSAGE = "No results!";

exports.UNKNOWN_COMMAND_REPLIES = UNKNOWN_COMMAND_REPLIES;
exports.HELP_MESSAGE = HELP_MESSAGE;
exports.EMPTY_SEARCH_RESULTS_MESSAGE = EMPTY_SEARCH_RESULTS_MESSAGE;