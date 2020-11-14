const botCommands = require('../../src/commands/botCommands.js');
const sinon = require('sinon');
const axios = require('axios');
const discord = require('discord.js');
const expect = require('chai').expect;

const RESP_GET_WALLET_200 = {
    status: 200,
    data: {
        WalletId: 'player1',
        Balance: 100
    }
}

const RESP_GET_WALLET_500 = {
    response: {
        status: 500,
        data: {
            error: 'error',
            errorDetail: 'error details'
        }
    }
}

describe('botCommands.getWallet(msg)', function() {
    describe('When get wallet is requested', function() {
        let replyStub;
        let message = new discord.Message();
        message.content = 'wallet player1';

        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
        });

        it('Calls mc-wallet Get Wallet API with correct params', async function() {
            const apiMock = sinon.stub(axios, "get").returns(RESP_GET_WALLET_200);
            const MC_WALLET_REQ_PARAM_EXPECTED = {
                params: {
                    id: 'player1'
                }
            };
            await botCommands.getWallet(message);
            expect(apiMock.calledOnce).to.be.true;
            expect(apiMock.lastCall.args[1]).to.be.deep.equal(MC_WALLET_REQ_PARAM_EXPECTED);
            apiMock.restore();
        });

        describe('And Mc-Wallet API fails', function() {
            it('Replies with correct error message', async function() {
                const apiMock = sinon.stub(axios, "get").throws(RESP_GET_WALLET_500);
                await botCommands.getWallet(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.equal('Failed to check wallet: ```HTTP 500: {"error":"error","errorDetail":"error details"}```');
                apiMock.restore();
            });
        });
        describe('And Mc-Shop API succeeds', function() {
            it('Replies with correct message', async function() {
                const apiMock = sinon.stub(axios, "get").returns(RESP_GET_WALLET_200);
                await botCommands.getWallet(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.equal('player1 has 100 in their wallet');
                apiMock.restore();
            });
        });
    });
});