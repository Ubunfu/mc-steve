const botCommands = require('../../src/commands/botCommands.js');
const sinon = require('sinon');
const axios = require('axios');
const discord = require('discord.js');
const expect = require('chai').expect;

describe('botCommands.buyItem(msg)', function() {
    describe('When item purchase is requested', function() {
        let replyStub;
        let message = new discord.Message();
        message.content = 'buy player1 5 Cobblestone';

        beforeEach(function() {
            replyStub = sinon
                .stub(message, "reply")
                .returns(null);
        });
        afterEach(function() {
            replyStub.restore();
        });

        it('Call mc-shop API with correct parameters', async function() {
            const apiMock = sinon.stub(axios, "post").returns({status: 200});
            const MC_SHOP_REQ_BODY_EXPECTED = {
                player: "player1",
                itemName: "Cobblestone",
                quantity: 5
            };
            await botCommands.buyItem(message);
            expect(apiMock.calledOnce).to.be.true;
            expect(apiMock.lastCall.args[1]).to.be.deep.equal(MC_SHOP_REQ_BODY_EXPECTED);
            apiMock.restore();
        });
        describe('And mc-shop API fails', function() {
            it('Replies with correct error message', async function() {
                const apiMock = sinon.stub(axios, "post").throws({
                    response: {
                        status: 500,
                        data: {
                            error: 'error',
                            errorDetail: 'error details'
                        }
                    }
                });
                await botCommands.buyItem(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.equal('Purchase failed: ```HTTP 500: {"error":"error","errorDetail":"error details"}```');
                apiMock.restore();
            });
        });
        describe('When mc-shop API succeeds', function() {
            it('Replies with correct response message', async function() {
                const apiMock = sinon.stub(axios, "post").returns({status: 200});
                await botCommands.buyItem(message);
                expect(replyStub.calledOnce).to.be.true;
                expect(replyStub.lastCall.args[0]).to.be.equal('Purchase successful');
                apiMock.restore();
            });
        });
    });
    
});