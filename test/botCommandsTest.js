const sinon = require('sinon');
const discord = require('discord.js');
const botCommands = require('../botCommands.js');
const expect = require('chai').expect;
const botUtilsConstants = require('../botUtilsConstants.js');
const botAuthenticator = require('../botAuthenticator.js');
const awsHelpers = require('../awsHelpers.js');
const awsHelpersTestConstants = require('./awsHelpersTestConstants.js');
const axios = require('axios');
const botUtils = require('../botUtils.js');

describe('giveHelp(msg)', function() {
    it('Should reply with correct message', async function() {
        const message = new discord.Message();
        const replyStub = sinon
            .stub(message, "reply")
            .returns(null);

        await botCommands.giveHelp(message);

        expect(replyStub.calledOnce).to.be.true;
        expect(replyStub.calledWith(botUtilsConstants.HELP_MESSAGE));
        replyStub.restore();
    });
});

describe('tryStartServer(msg)', function() {
    describe('When message author is not privileged', function() {
        it('Should not try to start server', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(false);
            const awsStartSpy = sinon
                .spy(awsHelpers, "startServer");

            await botCommands.tryStartServer(new discord.Message());

            expect(awsStartSpy.callCount).to.be.equal(0);
            botAuthStub.restore();
            awsStartSpy.restore();
        });
    });

    describe('When message author is privileged', function() {
        it('Should try to start server', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .resolves(null);
            
            await botCommands.tryStartServer(new discord.Message());

            expect(awsStartStub.calledOnce).to.be.true;
            botAuthStub.restore();
            awsStartStub.restore();
        });
    });

    describe('When AWS start returns server in \'starting\' state', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_STARTING);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStartServer(message);

            expect(replyStub.calledOnceWith('Starting server')).to.be.true;
            botAuthStub.restore();
            awsStartStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS start returns server in \'pending\' state', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_PENDING);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStartServer(message);

            expect(replyStub.calledOnceWith('Starting server')).to.be.true;
            botAuthStub.restore();
            awsStartStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS start returns server in \'running\' state', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_RUNNING);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStartServer(message);

            expect(replyStub.calledOnceWith('The server is already running')).to.be.true;
            botAuthStub.restore();
            awsStartStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS start returns unexpected response', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .resolves(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_UNEXPECTED);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStartServer(message);

            expect(replyStub.calledOnceWith('I couldn\'t start the server')).to.be.true;
            botAuthStub.restore();
            awsStartStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS start returns error', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStartStub = sinon
                .stub(awsHelpers, "startServer")
                .rejects(null);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStartServer(message);

            expect(replyStub.calledOnceWith('Technical problem starting the server')).to.be.true;
            botAuthStub.restore();
            awsStartStub.restore();
            replyStub.restore();
        });
    });
});

describe('tryStopServer(msg)', function() {
    describe('When message author is not privileged', function() {
        it('Should not try to stop server', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(false);
            const awsStopSpy = sinon
                .spy(awsHelpers, "stopServer");

            await botCommands.tryStopServer(new discord.Message());

            expect(awsStopSpy.callCount).to.be.equal(0);
            botAuthStub.restore();
            awsStopSpy.restore();
        });
    });

    describe('When message author is privileged', function() {
        it('Should try to stop server', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStopStub = sinon
                .stub(awsHelpers, "stopServer")
                .resolves(null);
            
            await botCommands.tryStopServer(new discord.Message());

            expect(awsStopStub.calledOnce).to.be.true;
            botAuthStub.restore();
            awsStopStub.restore();
        });
    });

    describe('When AWS stop returns server in \'stopping\' state', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStopStub = sinon
                .stub(awsHelpers, "stopServer")
                .resolves(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_STOPPING);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStopServer(message);

            expect(replyStub.calledOnceWith('Stopping server')).to.be.true;
            botAuthStub.restore();
            awsStopStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS stop returns server in \'stopped\' state', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStopStub = sinon
                .stub(awsHelpers, "stopServer")
                .resolves(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_STOPPED);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStopServer(message);

            expect(replyStub.calledOnceWith('The server is already stopped')).to.be.true;
            botAuthStub.restore();
            awsStopStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS stop returns unexpected response', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStopStub = sinon
                .stub(awsHelpers, "stopServer")
                .resolves(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_UNEXPECTED);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStopServer(message);

            expect(replyStub.calledOnceWith('I couldn\'t stop the server')).to.be.true;
            botAuthStub.restore();
            awsStopStub.restore();
            replyStub.restore();
        });
    });

    describe('When AWS stop returns error', function() {
        it('Should reply with correct message', async function() {
            const botAuthStub = sinon
                .stub(botAuthenticator, "msgAuthorIsPrivileged")
                .returns(true);
            const awsStopStub = sinon
                .stub(awsHelpers, "stopServer")
                .rejects(null);
            const message = new discord.Message();
            const replyStub = sinon
                .stub(message, "reply")
                .returns(null);
            
            await botCommands.tryStopServer(message);

            expect(replyStub.calledOnceWith('Technical problem stopping the server')).to.be.true;
            botAuthStub.restore();
            awsStopStub.restore();
            replyStub.restore();
        });
    });
});

describe('searchMinecraftWikiForArticles(msg)', function() {
    let apiStub,searchRespStub, replyStub = null;
    let message = new discord.Message();
    message.content = 'msgContent';

    beforeEach(function() {
        replyStub = sinon
            .stub(message, "reply")
            .returns(null);
    });
    afterEach(function() {
        replyStub.restore();
    });

    describe('When Minecraft API returns an error', function() {

        beforeEach(function() {
            apiStub = sinon
                .stub(axios, "get")
                .rejects();
        });
        afterEach(function() {
            apiStub.restore();
        })
        it('Replies with API error message', async function() {
            await botCommands.searchMinecraftWikiForArticles(message);
            expect(apiStub.calledOnce).to.be.true;
            expect(replyStub.calledOnceWith('The wiki returned an error, sorry 😟')).to.be.true;
        });
    });

    describe('When Minecraft wiki API returns data', async function() {
        beforeEach(function() {
            apiStub = sinon
                .stub(axios, "get")
                .returns({data: 'response'});
        });
        afterEach(function() {
            apiStub.restore();
        });
        
        describe('When response builds successfully', async function() {
            beforeEach(function() {
                searchRespStub = sinon
                    .stub(botUtils, "buildSearchResponse")
                    .returns('message');
            });
            afterEach(function() {
                searchRespStub.restore();
            });
            it('Replies with correct message', async function() {
                await botCommands.searchMinecraftWikiForArticles(message);
                expect(apiStub.calledOnce).to.be.true;
                expect(searchRespStub.calledOnce).to.be.true;
                expect(replyStub.calledOnceWith('message')).to.be.true;
            });
        });

        describe('When response fails to build', async function() {
            beforeEach(function() {
                searchRespStub = sinon
                    .stub(botUtils, "buildSearchResponse")
                    .rejects();
            });
            afterEach(function() {
                searchRespStub.restore();
            });
            it('Replies with response not understood message', async function() {
                await botCommands.searchMinecraftWikiForArticles(message);
                expect(apiStub.calledOnce).to.be.true;
                expect(searchRespStub.calledOnce).to.be.true;
                expect(replyStub.calledOnceWith('The wiki responded but I don\'t understand it, sorry 😟')).to.be.true;
            });
        });

    });
});