const axios = require('axios')
const sinon = require('sinon')
const expect = require('chai').expect
const transferService = require('../../src/xp/transferService')

const PAYER_USER_ID = 'player 1'
const PAYEE_USER_ID = 'player 2'
const XP_AMOUNT = 1000

describe('Transfer Service Test', function() {
    describe('When API returns 403', function() {
        it('Throws insufficient funds error', async function() {
            const apiMock = sinon.stub(axios, "post").throws({
                response: {
                    status: 403
                }
            })
            try {
                await transferService.transferXp(PAYER_USER_ID, PAYEE_USER_ID, XP_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal('insufficient funds')
            } finally {
                apiMock.restore()
            }
        })
    })
    describe('When API returns 404', function() {
        it('Throws insufficient funds error', async function() {
            const apiMock = sinon.stub(axios, "post").throws({
                response: {
                    status: 404
                }
            })
            try {
                await transferService.transferXp(PAYER_USER_ID, PAYEE_USER_ID, XP_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal('insufficient funds')
            } finally {
                apiMock.restore()
            }
        })
    })
    describe('When API returns some other error', function() {
        it('Throws the same error', async function() {
            const apiMock = sinon.stub(axios, "post").throws({
                response: {
                    status: 500,
                    data: {}
                }
            })
            try {
                await transferService.transferXp(PAYER_USER_ID, PAYEE_USER_ID, XP_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err).to.be.deep.equal({response: {status: 500, data:{}}})
            } finally {
                apiMock.restore()
            }
        })
    })
})