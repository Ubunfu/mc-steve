const axios = require('axios')
const sinon = require('sinon')
const expect = require('chai').expect
const depositService = require('../../src/xp/depositService')

const USER_ID = 'player'
const XP_AMOUNT = 1000

describe('Deposit Service Test', function() {
    describe('When API returns 403', function() {
        it('Throws insufficient funds error', async function() {
            const apiMock = sinon.stub(axios, "post").throws({
                    response: {
                        status: 403
                    }
                })
            try {
                await depositService.depositXp(USER_ID, XP_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal('insufficient funds')
            } finally {
                apiMock.restore()
            }
        })
    })
    describe('When API returns 404', function() {
        it('Throws user not found error', async function() {
            const apiMock = sinon.stub(axios, "post").throws({
                    response: {
                        status: 404
                    }
                })
            try {
                await depositService.depositXp(USER_ID, XP_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal('user not found')
            } finally {
                apiMock.restore()
            }
        })
    })
    describe('When API returns other error', function() {
        it('Throws the same error', async function() {
            const apiMock = sinon.stub(axios, "post").throws({
                response: {
                    status: 500,
                    data: {}
                }
            })
        try {
            await depositService.depositXp(USER_ID, XP_AMOUNT)
            expect(true).to.be.false
        } catch (err) {
            expect(err).to.be.deep.equal({response: {status: 500, data:{}}})
        } finally {
            apiMock.restore()
        }
        })
    })
})