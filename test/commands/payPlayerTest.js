const botCommands = require('../../src/commands/botCommands.js');
const sinon = require('sinon');
const discord = require('discord.js');
const expect = require('chai').expect;
const walletService = require('../../src/wallet/walletService.js');
const userService = require('../../src/user/userService.js');

const PLAYER_1 = 'player1';
const PLAYER_2 = 'player2';
const AMOUNT = 10000;
const A_USER = {
    discordUser: PLAYER_1,
    minecraftUser: PLAYER_1
}
const REPLY_USER_NOT_FOUND = 'I didn\'t find a Minecraft username associated with your Discord '
    + 'handle.  One must be registered before you can pay players.';
const REPLY_USER_SERVICE_FAILED = 'I wasn\'t able to look up your Minecraft username.  Please try again.';

describe('botCommands.payPlayer(msg)', function() {
    describe('When player2player payment is requested', function() {
        let replyStub;
        let message = new discord.Message();
        message.content = `pay ${PLAYER_2} ${AMOUNT}`;
        message.author = {
            username: PLAYER_1
        }

        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
        });

        describe('And user service does not find a minecraft username', function() {
            it('Replies with unknown user message', async function() {
                const userServiceMock = sinon.stub(userService, "getUser")
                    .throws('errorName', 'user not found');
                await botCommands.payPlayer(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.deep.equal(REPLY_USER_NOT_FOUND);
                userServiceMock.restore();
            });
        });
        describe('And user service fails unexpectedly', function() {
            it('Replies with retry message', async function() {
                const userServiceMock = sinon.stub(userService, "getUser")
                    .throws('errorName', 'unexpected error');
                await botCommands.payPlayer(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.deep.equal(REPLY_USER_SERVICE_FAILED);
                userServiceMock.restore();
            });
        });
        describe('And user service returns a minecraft username', function() {
            it('Calls walletService with correct parameters', async function() {
                const userServiceMock = sinon.stub(userService, "getUser").returns(A_USER);
                const walletServiceSpy = sinon.spy(walletService, "payPlayer");
                await botCommands.payPlayer(message);
                expect(walletServiceSpy.calledOnce).to.be.true;
                expect(walletServiceSpy.lastCall.args).to.be.deep.equal([PLAYER_1, PLAYER_2, AMOUNT]);
                userServiceMock.restore();
                walletServiceSpy.restore();
            });
            describe('And wallet Service throws an error', function() {
                it('Replies with base message and detailed description', async function() {
                    const userServiceMock = sinon.stub(userService, "getUser").returns(A_USER);
                    const walletServiceStub = sinon.stub(walletService, "payPlayer")
                        .throws('errorName', `${PLAYER_1} has insufficient funds`);
                    await botCommands.payPlayer(message);
                    expect(replyStub.calledOnce).to.be.true;
                    expect(replyStub.lastCall.args).to.be.deep.equal(['Payment failed because: ' + `${PLAYER_1} has insufficient funds`]);
                    userServiceMock.restore();
                    walletServiceStub.restore();
                });
            });
            describe('And wallet Service succeeds', function() {
                it('Replies with transaction summary', async function() {
                    const userServiceMock = sinon.stub(userService, "getUser").returns(A_USER);
                    const walletServiceStub = sinon.stub(walletService, "payPlayer").returns();
                    await botCommands.payPlayer(message);
                    expect(replyStub.calledOnce).to.be.true;
                    expect(replyStub.lastCall.args).to.be.deep.equal([`${PLAYER_1} paid ${PLAYER_2} ${AMOUNT}`]);
                    userServiceMock.restore();
                    walletServiceStub.restore();
                });
            });
        });

    });
});