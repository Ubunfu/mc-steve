const sinon = require('sinon');
const discord = require('discord.js');
const botCommands = require('../../src/commands/botCommands.js');
const expect = require('chai').expect;
const axios = require('axios');
const botUtils = require('../../src/utils/botUtils.js');

describe('botCommands.searchMinecraftWikiForArticles(msg)', function() {
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