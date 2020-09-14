const sinon = require('sinon');
const discord = require('discord.js');
const botCommands = require('../../src/commands/botCommands.js');
const expect = require('chai').expect;
const botUtilsConstants = require('../../src/utils/botUtilsConstants.js');

describe('botCommands.giveHelp(msg)', function() {
    const message = new discord.Message();
    const replyStub = sinon
        .stub(message, "reply")
        .returns(null);
    it('Should reply with correct message', async function() {
        await botCommands.giveHelp(message);

        expect(replyStub.calledOnce).to.be.true;
        expect(replyStub.calledWith(botUtilsConstants.HELP_MESSAGE));
        replyStub.restore();
    });
});