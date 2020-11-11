const botCommands = require('../../src/commands/botCommands.js');
const sinon = require('sinon');
const axios = require('axios');
const discord = require('discord.js');
const expect = require('chai').expect;

const RESP_GET_ITEM_200 = {
    status: 200,
    data: {
        itemName: 'Iron Ingot',
        price: 100
    }
}

describe('botCommands.getItem(msg)', function() {
    describe('When get item is requested', function() {
        let replyStub;
        let message = new discord.Message();
        message.content = 'price Iron Ingot';

        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
        });

        it('Calls mc-shop Get Item API with correct params', async function() {
            const apiMock = sinon.stub(axios, "get").returns(RESP_GET_ITEM_200);
            const MC_SHOP_REQ_PARAM_EXPECTED = {
                params: {
                    item: 'Iron Ingot'
                }
            };
            await botCommands.getItem(message);
            expect(apiMock.calledOnce).to.be.true;
            expect(apiMock.lastCall.args[1]).to.be.deep.equal(MC_SHOP_REQ_PARAM_EXPECTED);
            apiMock.restore();
        });

        describe('And Mc-Shop API fails', function() {
            it('Replies with correct error message', async function() {
                const apiMock = sinon.stub(axios, "get").throws({
                    response: {
                        status: 500,
                        data: {
                            error: 'error',
                            errorDetail: 'error details'
                        }
                    }
                });
                await botCommands.getItem(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.equal('Price check failed: ```HTTP 500: {"error":"error","errorDetail":"error details"}```');
                apiMock.restore();
            });
        });
        describe('And Mc-Shop API succeeds', function() {
            it('Replies with correct message', async function() {
                const apiMock = sinon.stub(axios, "get").returns(RESP_GET_ITEM_200);
                await botCommands.getItem(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.equal('Iron Ingot is valued at 100');
                apiMock.restore();
            });
        });
    });
});