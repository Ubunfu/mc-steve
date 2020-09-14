const rconClient = require('../../src/rcon/rconClient.js');
const discord = require('discord.js');
const sinon = require('sinon');
const expect = require('chai').expect;
const rcon = require('rcon');

describe('rconClient.executeCommand(msg, command)', function() {
    describe('When command returns response', function() {
        const message = new discord.Message();
        const command = 'some command';
        const rconConnection = new rcon();
        let replyStub, rconConnectionStub, rconSendStub = null;
        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            rconConnectionStub = sinon
                .stub(rconConnection, "connect")
                .returns(null);
            rconSendStub = sinon
                .stub(rconConnection, "send")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
            rconConnectionStub.restore();
            rconSendStub.restore();
        });
        it('Should reply to channel with correct message');
    });
});