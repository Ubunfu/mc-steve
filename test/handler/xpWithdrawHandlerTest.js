const discord = require('discord.js')
const expect = require('chai').expect
const sinon = require('sinon')
const xpWithdrawHandler = require('../../src/handler/xpWithdrawHandler.js')
const userService = require('../../src/user/userService.js')
const withdrawService = require('../../src/xp/withdrawService')

const USER_NAME = 'player1'
const XP_AMOUNT = 1000

describe('XP Withdraw Handler Test', function() {
    let replyStub
    let message = new discord.Message()
    message.content = `xp withdraw ${XP_AMOUNT}`
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
            await xpWithdrawHandler.handle(message)
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
            await xpWithdrawHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('I wasn\'t able to look up your Minecraft username: HTTP 500 `{"error":"error","errorDetail":"errorDetail"}`')
            userServiceMock.restore()
        })
    })
    describe('When withdraw service throws insufficient funds error', function() {
        it('Replies with insufficient funds message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
                .returns({
                    minecraftUsername: USER_NAME
                })
            const withdrawServiceMock = sinon.stub(withdrawService, "withdrawXp")
                .throws('', 'insufficient funds')
            await xpWithdrawHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('You don\'t have enough XP to make that withdraw')
            withdrawServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When withdraw service throws player not found error', function() {
        it('Replies with player not found', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUsername: USER_NAME
            })
            const withdrawServiceMock = sinon.stub(withdrawService, "withdrawXp")
                .throws('', 'user not found')
            await xpWithdrawHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('You don\'t appear to be online at the moment.  Log in to make your withdraw.')
            withdrawServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When withdraw service throws unexpected error', function() {
        it('Replies with error details', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUsername: USER_NAME
            })
            const withdrawServiceMock = sinon.stub(withdrawService, "withdrawXp").throws({
                    response: {
                        status: 500,
                        data: {
                            error: 'error',
                            errorDetail: 'errorDetail'
                        }
                    }
                })
            await xpWithdrawHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal('Not able to process the withdraw at the moment: HTTP 500 `{"error":"error","errorDetail":"errorDetail"}`')
            withdrawServiceMock.restore()
            userServiceMock.restore()
        })
    })
    describe('When everything seems to work', function() {
        it('Replies with successful message', async function() {
            const userServiceMock = sinon.stub(userService, "getUser")
            .returns({
                minecraftUsername: USER_NAME
            })
            const withdrawServiceMock = sinon.stub(withdrawService, "withdrawXp")
                .returns()
            await xpWithdrawHandler.handle(message)
            expect(replyStub.calledOnce).to.be.true
            expect(replyStub.lastCall.args[0]).to.be.equal(`Withdrew ${XP_AMOUNT} XP from your XP bank`)
            withdrawServiceMock.restore()
            userServiceMock.restore()
        })
    })
})