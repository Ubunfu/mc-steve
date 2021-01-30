const xpQueryHandler = require('../../src/handler/xpQueryHandler.js')
const sinon = require('sinon')
const axios = require('axios')
const discord = require('discord.js')
const expect = require('chai').expect

const USER_NAME = 'player1'
const XP_AMOUNT = 1000

describe('XP Query Handler Test', function() {
    let replyStub
    let message = new discord.Message()
    message.content = `xp query ${USER_NAME}`

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
                        amount: XP_AMOUNT
                    }
                })
            await xpQueryHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`${USER_NAME} currently holds ${XP_AMOUNT} XP points`)
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
                            amount: XP_AMOUNT
                        }
                    }
                })
            await xpQueryHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`Not sure, ${USER_NAME} doesn\'t appear to be logged in at the moment`)
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
                        error: "xp query failed",
                        errorDetail: "somethin fucky"
                    }
                }
            })
            await xpQueryHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`Somethin\'s fucky... \`HTTP 500: {"error":"xp query failed","errorDetail":"somethin fucky"}\``)
            apiMock.restore()
        })
    })
})