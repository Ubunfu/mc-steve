const sinon = require('sinon')
const discord = require('discord.js')
const expect = require('chai').expect
const xpTransferHandler = require('../../src/handler/xpTransferHandler')
const userService = require('../../src/user/userService')
const transferService = require('../../src/xp/transferService')

const USER_NAME = 'player1'
const XP_AMOUNT = 1000

describe('XP Transfer Handler Test', function() {
    let replyStub
    let message = new discord.Message()
    message.content = `xp transfer ${USER_NAME} ${XP_AMOUNT}`
    message.author = {
        username: USER_NAME
    }

    beforeEach(function() {
        replyStub = sinon
            .stub(message, "reply")
            .returns(null)
    });
    afterEach(function() {
        replyStub.restore()
    });
    describe('When user service throws user not found error', function() {
        it('Replies with you need to register message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
                .throws('', 'user not found')
            await xpTransferHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('I didn\'t find a Minecraft username associated with your Discord '
                + 'handle.  One must be registered before you can use the XP bank.')
            userServiceMock.restore()
        })
    })
    describe('When user service throws other error', function() {
        it('Replies with the error details', async function() {
            const userServiceMock = sinon.stub(userService, "getUser").throws({
                    response: {
                        status: 500,
                        data: {
                            error: 'error',
                            errorDetail: 'errorDetail'
                        }
                    }
                })
            await xpTransferHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('I wasn\'t able to look up your Minecraft username: HTTP 500 `{"error":"error","errorDetail":"errorDetail"}`')
            userServiceMock.restore()
        })
    })
    describe('When transfer service throws insufficient funds error', function() {
        it('Replies with insufficient funds message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
                .returns({
                    minecraftUser: USER_NAME
                })
            const transferServiceMock = sinon.stub(transferService, "transferXp")
                .throws('', 'insufficient funds')
            await xpTransferHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('You don\'t have enough XP to make that transfer')
            transferServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When transfer service throws unexpected error', function() {
        it('Replies with error details', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUser: USER_NAME
            })
            const transferServiceMock = sinon.stub(transferService, "transferXp").throws({
                    response: {
                        status: 500,
                        data: {
                            error: 'error',
                            errorDetail: 'errorDetail'
                        }
                    }
                })
            await xpTransferHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('Not able to process the transfer at the moment: HTTP 500 `{"error":"error","errorDetail":"errorDetail"}`')
            transferServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When everything seems to work', function() {
        it('Replies with successful message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUser: USER_NAME
            })
            const transferServiceMock = sinon.stub(transferService, "transferXp")
                .returns()
            await xpTransferHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`Transferred ${XP_AMOUNT} XP to ${USER_NAME}\'s bank`)
            transferServiceMock.restore()
            userServiceMock.restore()
        })
    })
})