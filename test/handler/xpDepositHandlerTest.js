const discord = require('discord.js')
const expect = require('chai').expect
const sinon = require('sinon')
const xpDepositHandler = require('../../src/handler/xpDepositHandler.js')
const userService = require('../../src/user/userService.js')
const depositService = require('../../src/xp/depositService')

const USER_NAME = 'player1'
const XP_AMOUNT = 1000

describe('XP Deposit Handler Test', function() {
    let replyStub
    let message = new discord.Message()
    message.content = `xp deposit ${XP_AMOUNT}`
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
            await xpDepositHandler.handle(message)
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
            await xpDepositHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('I wasn\'t able to look up your Minecraft username: HTTP 500 `{"error":"error","errorDetail":"errorDetail"}`')
            userServiceMock.restore()
        })
    })
    describe('When deposit service throws insufficient funds error', function() {
        it('Replies with insufficient funds message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
                .returns({
                    minecraftUsername: USER_NAME
                })
            const depositServiceMock = sinon.stub(depositService, "depositXp")
                .throws('', 'insufficient funds')
            await xpDepositHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('You don\'t have enough XP to make that deposit')
            depositServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When deposit service throws player not found error', function() {
        it('Replies with player not found', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUsername: USER_NAME
            })
            const depositServiceMock = sinon.stub(depositService, "depositXp")
                .throws('', 'user not found')
            await xpDepositHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('You don\'t appear to be online at the moment.  Log in to make your deposit.')
            depositServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When deposit service throws unexpected error', function() {
        it('Replies with error details', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUsername: USER_NAME
            })
            const depositServiceMock = sinon.stub(depositService, "depositXp").throws({
                    response: {
                        status: 500,
                        data: {
                            error: 'error',
                            errorDetail: 'errorDetail'
                        }
                    }
                })
            await xpDepositHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('Not able to process the deposit at the moment: HTTP 500 `{"error":"error","errorDetail":"errorDetail"}`')
            depositServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When everything seems to work', function() {
        it('Replies with successful message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUsername: USER_NAME
            })
            const depositServiceMock = sinon.stub(depositService, "depositXp")
                .returns()
            await xpDepositHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`Deposited ${XP_AMOUNT} XP into your XP bank`)
            depositServiceMock.restore()
            userServiceMock.restore()
        })
    })
})