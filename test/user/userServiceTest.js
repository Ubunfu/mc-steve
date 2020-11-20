const axios = require('axios');
const userService = require('../../src/user/userService.js');
const expect = require('chai').expect;
const sinon = require('sinon');

const A_USER = {
    discordUser: 'dUser',
    minecraftUser: 'mUser'
}

const RESP_GET_USER_200 = {
    status: 200,
    data: {
        discordUser: 'dUser',
        minecraftUser: 'mUser'
    }
}

const RESP_GET_USER_404 = {
    response: {
        status: 404,
        data: {
            error: 'get user failed',
            errorDetail: 'user not found'
        }
    }
}

const RESP_GET_USER_500 = {
    response: {
        status: 500,
        data: {
            error: 'error',
            errorDetail: 'error details'
        }
    }
}

describe('userService: When get user is called', function() {
    it('Calls API with correct params', async function() {
        const getUserMock = sinon.stub(axios, "get").returns(RESP_GET_USER_200);
        const REQ_PARAMS_GET_USER_EXPECTED = {
            params: {
                discordUser: 'dUser'
            }
        }
        await userService.getUser('dUser');
        expect(getUserMock.calledOnce).to.be.true;
        expect(getUserMock.lastCall.args[1]).to.be.deep.equal(REQ_PARAMS_GET_USER_EXPECTED)
        getUserMock.restore();
    });
    describe('And API returns a user', function() {
        it('Returns the user', async function() {
            const getUserMock = sinon.stub(axios, "get").returns(RESP_GET_USER_200);
            const apiResp = await userService.getUser('dUser');
            expect(apiResp).to.be.deep.equal(A_USER);
            getUserMock.restore();
        });
    });
    describe('And API does not find any matching user', function() {
        it('Throws a \'user not found\' error', async function() {
            const getUserMock = sinon.stub(axios, "get").throws(RESP_GET_USER_404);
            try {
                await userService.getUser('dUser');
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal('user not found');
            }
            getUserMock.restore();
        });
    });
    describe('And the API returns any other error', function() {
        it('Throws the error up', async function() {
            const getUserMock = sinon.stub(axios, "get").throws(RESP_GET_USER_500);
            try {
                await userService.getUser('dUser');
                expect(true).to.be.false;
            } catch (err) {
                expect(err).to.be.equal(RESP_GET_USER_500);
            }
            getUserMock.restore();
        });
    });
});