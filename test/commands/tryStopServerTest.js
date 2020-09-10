const sinon = require('sinon');
const discord = require('discord.js');
const botCommands = require('../../src/commands/botCommands.js');
const expect = require('chai').expect;
const botAuthenticator = require('../../src/authenticator/botAuthenticator.js');
const awsHelpers = require('../../src/aws/awsHelpers.js');
const awsHelpersTestConstants = require('../aws/awsHelpersTestConstants.js');

describe('botCommands.tryStopServer(msg)', function() {
    let botAuthStub, replyStub = null;
    const message = new discord.Message();
    beforeEach(function() {
        replyStub = sinon
            .stub(message, "reply")
            .returns(null);
    });
    afterEach(function() {
        replyStub.restore();
    });

    describe('When message author is not privileged', function() {
        let awsStopSpy = null;
        beforeEach(function() {
            botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(false);
            awsStopSpy = sinon
                .spy(awsHelpers, "stopServer"); 
        });
        afterEach(function() {
            botAuthStub.restore();
            awsStopSpy.restore();
        });
        it('Should not try to stop server', async function() {
            await botCommands.tryStopServer(new discord.Message());
            expect(awsStopSpy.callCount).to.be.equal(0);
        });
    });

    describe('When message author is privileged', function() {
        let awsStopStub = null;
        beforeEach(function() {
            botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
        });
        afterEach(function() {
            botAuthStub.restore();
        });

        it('Should try to stop server', async function() {
            awsStopStub = sinon
                .stub(awsHelpers, "stopServer")
                .resolves(null);
            
            await botCommands.tryStopServer(new discord.Message());

            expect(awsStopStub.calledOnce).to.be.true;
            awsStopStub.restore();
        });

        describe('When AWS stop returns server in \'stopping\' state', function() {
            beforeEach(function() {
                awsStopStub = sinon
                    .stub(awsHelpers, "stopServer")
                    .resolves(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_STOPPING);
            });
            afterEach(function() {
                awsStopStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStopServer(message);
                expect(replyStub.calledOnceWith('Stopping server')).to.be.true;
            });
        });

        describe('When AWS stop returns server in \'stopped\' state', function() {
            beforeEach(function() {
                awsStopStub = sinon
                    .stub(awsHelpers, "stopServer")
                    .resolves(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_STOPPED);
            });
            afterEach(function() {
                awsStopStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStopServer(message);
                expect(replyStub.calledOnceWith('The server is already stopped')).to.be.true;
            });
        });

        describe('When AWS stop returns unexpected response', function() {
            beforeEach(function() {
                awsStopStub = sinon
                    .stub(awsHelpers, "stopServer")
                    .resolves(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_UNEXPECTED);
            });
            afterEach(function() {
                awsStopStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStopServer(message);
                expect(replyStub.calledOnceWith('I couldn\'t stop the server')).to.be.true;
            });
        });

        describe('When AWS stop returns error', function() {
            beforeEach(function() {
                awsStopStub = sinon
                    .stub(awsHelpers, "stopServer")
                    .rejects();
            });
            afterEach(function() {
                awsStopStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStopServer(message);
                expect(replyStub.calledOnceWith('Technical problem stopping the server')).to.be.true;
            });
        });
    });
});