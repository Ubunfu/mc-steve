const expect = require('chai').expect;
const mathUtils = require('../mathUtils');
const sinon = require('sinon');

describe('getRandomInt(max)', function() {
    describe('When Math.random() returns 0.5 and max == 10', function() {
        it('Returns 5', async function() {
            const mathStub = sinon.stub(Math, 'random').returns(0.5);
            const result = await mathUtils.getRandomInt(10);
            mathStub.restore();
            expect(result).to.be.equal(5);
        });
    });
    describe('When Math.random() returns 0.1234 and max == 19', function() {
        it('Returns 2', async function() {
            const mathStub = sinon.stub(Math, 'random').returns(0.1234);
            const result = await mathUtils.getRandomInt(19);
            mathStub.restore();
            expect(result).to.be.equal(2);
        })
    })
});