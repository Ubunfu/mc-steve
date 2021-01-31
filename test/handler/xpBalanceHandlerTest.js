const xpBalanceHandler = require('../../src/handler/xpBalanceHandler')
const sinon = require('sinon')
const axios = require('axios')
const discord = require('discord.js')
const expect = require('chai').expect

const USER_NAME = 'player1'
const XP_AMOUNT = 1000

describe('XP Balance Handler Test', function() {
    let replyStub
    let message = new discord.Message()
    message.content = `xp balance ${USER_NAME}`

    beforeEach(function() {
        replyStub = sinon
            .stub(message, "reply")
            .returns(null)
    });
    afterEach(function() {
        replyStub.restore()
    });
    describe('When mx-xp-bank returns successfully', function() {
        it('Replies with players current xp point count', async function() {
            const apiMock = sinon.stub(axios, "get")
                .returns({
                    status: 200,
                    data: {
                        userId: USER_NAME,
                        balance: XP_AMOUNT
                    }
                })
            await xpBalanceHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`${USER_NAME} has ${XP_AMOUNT} XP points banked`)
            apiMock.restore()
        })
    })
    describe('When mc-xp-bank returns HTTP 404', function() {
        it('Replies with player not found message', async function() {
            const apiMock = sinon.stub(axios, "get")
                .throws({
                    response: {
                        status: 404,
                        data: {
                            userId: USER_NAME,
                            balance: XP_AMOUNT
                        }
                    }
                })
            await xpBalanceHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`${USER_NAME} doesn\'t appear to have an XP bank account yet`)
            apiMock.restore()
        })
    })
    describe('When mc-xp-bank returns HTTP 500', function() {
        it('Replies with server response details', async function() {
            const apiMock = sinon.stub(axios, "get")
                .throws({
                    response: {
                        status: 500,
                        data: {
                            error: "error",
                            errorDetail: "errorDetail"
                        }
                    }
                })
            await xpBalanceHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`Somethin\'s fucky... \`HTTP 500: {"error":"error","errorDetail":"errorDetail"}\``)
            apiMock.restore()
        })
    })
})