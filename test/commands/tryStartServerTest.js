const sinon = require('sinon');
const discord = require('discord.js');
const botCommands = require('../../src/commands/botCommands.js');
const expect = require('chai').expect;
const botAuthenticator = require('../../src/authenticator/botAuthenticator.js');
const awsHelpers = require('../../src/aws/awsHelpers.js');
const awsHelpersTestConstants = require('../aws/awsHelpersTestConstants.js');

describe('botCommands.tryStartServer(msg)', function() {
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
        let awsStartSpy = null;
        beforeEach(function() {
            botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(false);
            awsStartSpy = sinon
                .spy(awsHelpers, "startServer"); 
        });
        afterEach(function() {
            botAuthStub.restore();
            awsStartSpy.restore();
        });

        it('Should not try to start server', async function() {
            await botCommands.tryStartServer(new discord.Message());
            expect(awsStartSpy.callCount).to.be.equal(0);
        });
    });

    describe('When message author is privileged', function() {
        let awsStartStub = null;
        beforeEach(function() {
            botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
        });
        afterEach(function() {
            botAuthStub.restore();
        });

        it('Should try to start server', async function() {
            awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .resolves(null);
            
            await botCommands.tryStartServer(new discord.Message());

            expect(awsStartStub.calledOnce).to.be.true;
            awsStartStub.restore();
        });

        describe('When AWS start returns server in \'starting\' state', function() {
            beforeEach(function() {
                awsStartStub = sinon
                    .stub(awsHelpers, "startServer")
                    .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_STARTING);
            });
            afterEach(function() {
                awsStartStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStartServer(message);
                expect(replyStub.calledOnceWith('Starting server')).to.be.true;
            });
        });

        describe('When AWS start returns server in \'pending\' state', function() {
            beforeEach(function() {
                awsStartStub = sinon
                    .stub(awsHelpers, "startServer")
                    .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_PENDING);
            });
            afterEach(function() {
                awsStartStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStartServer(message);
                expect(replyStub.calledOnceWith('Starting server')).to.be.true;
            });
        });

        describe('When AWS start returns server in \'running\' state', function() {
            beforeEach(function() {
                awsStartStub = sinon
                    .stub(awsHelpers, "startServer")
                    .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_RUNNING);
            });
            afterEach(function() {
                awsStartStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStartServer(message);
                expect(replyStub.calledOnceWith('The server is already running')).to.be.true;
            });
        });

        describe('When AWS start returns unexpected response', function() {
            beforeEach(function() {
                awsStartStub = sinon
                    .stub(awsHelpers, "startServer")
                    .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_UNEXPECTED);
            });
            afterEach(function() {
                awsStartStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStartServer(message);
                expect(replyStub.calledOnceWith('I couldn\'t start the server')).to.be.true;
            });
        });

        describe('When AWS start returns an error', function() {
            beforeEach(function() {
                awsStartStub = sinon
                    .stub(awsHelpers, "startServer")
                    .rejects();
            });
            afterEach(function() {
                awsStartStub.restore();
            });

            it('Should reply with correct message', async function() {
                await botCommands.tryStartServer(message);
                expect(replyStub.calledOnceWith('Technical problem starting the server')).to.be.true;
            });
        });
    });

});