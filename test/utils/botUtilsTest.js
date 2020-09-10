const expect = require('chai').expect;
const botUtils = require('../../src/utils/botUtils.js');
const mathUtils = require('../../src/utils/mathUtils.js');
const botUtilsConstants = require('../../src/utils/botUtilsConstants.js');
const botUtilsTestConstants = require('./botUtilsTestConstants.js');
const sinon = require('sinon');

describe('botUtils.removeSpans(snippet)', function() {
   describe('When snippet contains no spans', function() {
        it('Should return the original message', async function() {
            const cleanedSnippet = await botUtils.removeSpans(botUtilsTestConstants.SNIPPET_NO_SPANS);
            expect(cleanedSnippet).to.be.equal(botUtilsTestConstants.SNIPPET_NO_SPANS);
        });
   });
   describe('Snippet contains spans', function() {
        it('Removes all spans', async function() {
           const cleanedSnippet = await botUtils.removeSpans(botUtilsTestConstants.SNIPPET_SPANS);
           expect(cleanedSnippet).to.be.equal(botUtilsTestConstants.SNIPPET_NO_SPANS);
        });
   });
});

describe('botUtils.buildSearchResponse(items)', function() {
   describe('When search results contain no items', function() {
       it('Should return empty results message', async function() {
          const respMsg = await botUtils.buildSearchResponse([]);
          expect(respMsg).to.be.equal(botUtilsConstants.EMPTY_SEARCH_RESULTS_MESSAGE);
       });
    });
    describe('When search results contain one item', function() {
        it('Should return one suggestion', async function() {
            const respMsg = await botUtils.buildSearchResponse(botUtilsTestConstants.SEARCH_RESULTS_ONE_ITEM);
            expect(respMsg).to.be.equal('\n* **Brewing**: <https://minecraft.fandom.com/wiki/Brewing>\nA Brewing Stand is a craftable utility block in Minecraft used in the brewing process to make potions, splash potions, and lingering potions. The collision box of the brewing stand involves the bottle holders and\n');
        });
    });
});

describe('botUtils.getUnknownCommandReply()', function () {
    for (let index = 0; index < botUtilsConstants.UNKNOWN_COMMAND_REPLIES.length; index++) {
        describe(`When message number ${index} should be returned`, function () {
            const msg = botUtilsConstants.UNKNOWN_COMMAND_REPLIES[index];
            it(`Returns \'${msg}\'`, async function() {
                const getRandIntStub = sinon.stub(mathUtils, 'getRandomInt')
                    .resolves(index);
                const result = await botUtils.getUnknownCommandReply();
                getRandIntStub.restore();
                expect(result).to.be.equal(msg);
            });
        });
    }
});

describe('botUtils.stripMentions(msg)', function () {
    describe('When the message does not contain mentions', function () {
        it('Should return the same message', async function() {
            const originalMsg = 'steve help me';
            const result = await botUtils.stripMentions(originalMsg);
            expect(result).to.be.equal(originalMsg);
        });
    });
    describe('When the message contains one mention at the beginning', function() {
        it('Should remove only the mention and surrounding white space', async function() {
            const originalMsg = '<@!0000000000> help steve!';
            const expectedResult = 'help steve!';
            const result = await botUtils.stripMentions(originalMsg);
            expect(result).to.equal(expectedResult)
        });
    });
    describe('When the message contains multiple mentions at the beginning', function() {
        it('Should remove all mentions and surrounding white space', async function() {
            const originalMsg = '<@!00000000> <@!00000000> do stuff!';
            const expectedResult = 'do stuff!';
            const result = await botUtils.stripMentions(originalMsg);
            expect(result).to.equal(expectedResult);
        });
    });
    describe('When the message contains multiple mentions scattered throughout', function() {
        it('Should remove all mentions and white space surrounding the result', async function()  {
            const originalMsg = '<@!000000> hey Steve do something! <@!00000> watch this!';
            const expectedResult = 'hey Steve do something!  watch this!';
            const result = await botUtils.stripMentions(originalMsg);
            expect(result).to.equal(expectedResult);
        });
    });
    describe('When the message contains only mentions', function() {
        it('Should return an empty message', async function() {
            const originalMsg = '<@!000000> <@!000000>';
            const expectedResult = '';
            const result = await botUtils.stripMentions(originalMsg);
            expect(result).to.be.equal(expectedResult);
        });
    });
    describe('When the message contains mentions without \'!\'', function() {
        it('Should remove the mention', async function() {
            const originalMsg = '<@0000000000> help steve!';
            const expectedResult = 'help steve!';
            const result = await botUtils.stripMentions(originalMsg);
            expect(result).to.equal(expectedResult) 
        });
    });
});