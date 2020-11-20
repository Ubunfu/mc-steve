const botCommands = require('../../src/commands/botCommands.js');
const sinon = require('sinon');
const axios = require('axios');
const discord = require('discord.js');
const expect = require('chai').expect;
const userService = require('../../src/user/userService.js');

const A_USER = {
    discordUser: 'discordUser',
    minecraftUser: 'minecraftUser'
}
const REPLY_UNREGISTERED_USER = 'I didn\'t find a Minecraft username associated with your Discord '
    + 'handle.  One must be registered before you can purchase or sell items.';
const REPLY_GET_USER_FAILED = 'I wasn\'t able to look up your Minecraft username.  Please try again.';

const RESP_SELL_ITEM_200 = {
    status: 200
}
const RESP_SELL_ITEM_500 = {
    response: {
        status: 500,
        data: {
            error: 'error',
            errorDetail: 'error details'
        }
    }
}

describe('botCommands.sellItem(msg)', function() {
    describe('When sell item is requested', function() {
        let replyStub;
        let message = new discord.Message();
        message.content = 'sell 5 Sand';
        message.author = {
            username: 'dUser'
        }

        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
        });

        describe('And mc-user does not return a user', function() {
            it('Replies with unregistered user message', async function() {
                const userServiceMock = sinon.stub(userService, "getUser")
                    .throws('errorName', 'user not found');
                await botCommands.sellItem(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.deep.equal(REPLY_UNREGISTERED_USER);
                userServiceMock.restore();
            });
        });
        describe('And mc-user check fails unexpectedly', function() {
            it('Replies with unregistered user message', async function() {
                const userServiceMock = sinon.stub(userService, "getUser")
                    .throws('errorName', 'unexpected error');
                await botCommands.sellItem(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.deep.equal(REPLY_GET_USER_FAILED);
                userServiceMock.restore();
            });
        });
        
        describe('And mc-user returns a user', function() {
            let userServiceMock;
            beforeEach(function() {
                userServiceMock = sinon.stub(userService, "getUser").returns(A_USER);
            });
            afterEach(function() {
                userServiceMock.restore();
            });

            it('Calls mc-shop Sell Item API with correct params', async function() {
                const apiMock = sinon.stub(axios, "post").returns(RESP_SELL_ITEM_200);
                const MC_SELL_REQ_PARAM_EXPECTED = {
                    player: 'minecraftUser',
                    itemName: 'Sand',
                    quantity: 5
                };
                await botCommands.sellItem(message);
                expect(apiMock.calledOnce).to.be.true;
                expect(apiMock.lastCall.args[1]).to.be.deep.equal(MC_SELL_REQ_PARAM_EXPECTED);
                apiMock.restore();
            });
    
            describe('And Mc-Shop API fails', function() {
                it('Replies with correct error message', async function() {
                    const apiMock = sinon.stub(axios, "post").throws(RESP_SELL_ITEM_500);
                    await botCommands.sellItem(message);
                    expect(replyStub.calledOnce).to.be.true;
                    expect(replyStub.lastCall.args[0]).to.be.equal('Item sale failed: ```HTTP 500: {"error":"error","errorDetail":"error details"}```');
                    apiMock.restore();
                });
            });
            describe('And Mc-Shop API succeeds', function() {
                it('Replies with correct message', async function() {
                    const apiMock = sinon.stub(axios, "post").returns(RESP_SELL_ITEM_200);
                    await botCommands.sellItem(message);
                    expect(replyStub.calledOnce).to.be.true;
                    expect(replyStub.lastCall.args[0]).to.be.equal('Sale request submitted');
                    apiMock.restore();
                });
            });
        });
    });
});