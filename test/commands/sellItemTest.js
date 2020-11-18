const botCommands = require('../../src/commands/botCommands.js');
const sinon = require('sinon');
const axios = require('axios');
const discord = require('discord.js');
const expect = require('chai').expect;

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
        message.content = 'sell player1 5 Sand';

        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
        });

        it('Calls mc-shop Sell Item API with correct params', async function() {
            const apiMock = sinon.stub(axios, "post").returns(RESP_SELL_ITEM_200);
            const MC_SELL_REQ_PARAM_EXPECTED = {
                player: 'player1',
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