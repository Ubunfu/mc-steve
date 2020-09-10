const sinon = require('sinon');
const discord = require('discord.js');
const botCommands = require('../../src/commands/botCommands.js');
const expect = require('chai').expect;
const botAuthenticator = require('../../src/authenticator/botAuthenticator.js');
const rconClient = require('../../src/rcon/rconClient.js');

describe('botCommands.runRconCommand(msg)', function() {
    let botAuthStub, replyStub = null;
    let message = new discord.Message();
    beforeEach(function() {
        replyStub = sinon
            .stub(message, "reply")
            .returns(null);
    });
    afterEach(function() {
        replyStub.restore();
    });
    describe('When message author is not privileged', function() {
        let rconExecuteSpy = null;
        beforeEach(function() {
            botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(false);
            rconExecuteSpy = sinon
                .spy(rconClient, "executeCommand");
        });
        afterEach(function() {
            botAuthStub.restore();
            rconExecuteSpy.restore();
        });
        it('Should not execute RCON command', async function() {
            await botCommands.rconCommand(message);
            expect(rconExecuteSpy.callCount).to.equal(0);
        });
    });
    describe('When message author is privileged', function() {
        let rconExecuteStub, msgContentStub = null;
        message.content = 'run some rcon command';
        beforeEach(async function() {
            botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            rconExecuteStub = sinon
                .stub(rconClient, "executeCommand")
                .returns(null);
            await botCommands.rconCommand(message);
        });
        afterEach(function() {
            botAuthStub.restore();
        });
        it('Should execute correct RCON command', function() {
            expect(rconExecuteStub.calledOnceWith('some rcon command')).to.be.true;
            rconExecuteStub.restore();
        });
    });
});