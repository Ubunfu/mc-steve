const sinon = require('sinon');
const axios = require('axios');
const walletService = require('../../src/wallet/walletService.js');
const expect = require('chai').expect;

const PLAYER_1 = 'player1';
const PLAYER_2 = 'player2';
const AMOUNT = 10000;

describe('walletService.payPlayer(payer, payee, amount)', function() {
    describe('When payPlayer is called', function() {
        describe('And wallet service fails', function() {
            it('Throws an error with the returned detail message', async function() {
                const apiStub = sinon.stub(axios, "post").throws({
                        response: {
                            status: 500,
                            data: {
                                error: 'error',
                                errorDetail: 'error details'
                            }
                        }
                    });
                try {
                    await walletService.payPlayer(PLAYER_1, PLAYER_2, AMOUNT);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal('error details');
                }
                apiStub.restore();
            });
        });

        describe('And wallet service succeeds', function() {
            it('Calls Charge and Pay APIs once', async function() {
                const apiStub = sinon.stub(axios, "post").returns();
                await walletService.payPlayer(PLAYER_1, PLAYER_2, AMOUNT);
                expect(apiStub.calledTwice).to.be.true;
                expect(apiStub.firstCall.args[1]).to.be.deep.equal({player: PLAYER_1, amount: AMOUNT});
                expect(apiStub.lastCall.args[1]).to.be.deep.equal({player: PLAYER_2, amount: AMOUNT});
                apiStub.restore();
            });
        });
    });
});