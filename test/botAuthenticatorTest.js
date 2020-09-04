const expect = require('chai').expect;
const sinon = require('sinon');
const discord = require('discord.js');
const botAuthenticator = require('../botAuthenticator.js');
const botAuthenticatorHelpers = require('../botAuthenticatorHelpers.js');

describe('msgAuthorIsPrivileged(msg, privRole)', function() {
    let replyStub, privGuildStub, privileged = null;
    process.env.PRIV_GUILD = 'privGuild';
    const privRole = 'privRole';
    const message = new discord.Message();
    beforeEach(function() {
        replyStub = sinon
            .stub(message, "reply")
            .returns(null);
    });
    afterEach(function() {
       replyStub.restore();
       privileged = null;
    });

    describe('When user not in privileged guild', function() {
        beforeEach(async function() {
            privGuildStub = sinon
                .stub(botAuthenticatorHelpers, "msgAuthorInPrivGuild")
                .returns(false);
            privileged = await botAuthenticator.msgAuthorIsPrivileged(message, privRole);
        });
        afterEach(function() {
            privGuildStub.restore();
        });

        it('Should return false', function() {
            expect(privileged).to.be.false;
        });
        it('Should reply with correct message', function() {
            expect(replyStub.calledOnceWith(`Message me from the \'${process.env.PRIV_GUILD}\' Guild to do that.'`)).to.be.true;
        })
    });

    describe('When user is in privileged guild', function() {
        let privRoleStub = null;
        beforeEach(function() {
            privGuildStub = sinon
                .stub(botAuthenticatorHelpers, "msgAuthorInPrivGuild")
                .returns(true);
        });
        afterEach(function() {
            privGuildStub.restore();
        });

        describe('When user has privileged role', function() {
            beforeEach(async function() {
                privRoleStub = sinon
                    .stub(botAuthenticatorHelpers, "msgAuthorHasPrivRole")
                    .returns(true);
                privileged = await botAuthenticator.msgAuthorIsPrivileged(message, privRole);
            });
            afterEach(function() {
                privRoleStub.restore();
            });

            it('Should return true', function() {
                expect(privileged).to.be.true;
            });
            it('Should not reply', function() {
                expect(replyStub.callCount).to.be.equal(0);
            });
        });

        describe('When user does not have priveleged role', function() {
            beforeEach(async function() {
                privRoleStub = sinon
                    .stub(botAuthenticatorHelpers, "msgAuthorHasPrivRole")
                    .returns(false);
                privileged = await botAuthenticator.msgAuthorIsPrivileged(message, privRole);
            });
            afterEach(function() {
                privRoleStub.restore();
            });

            it('Should return false', function() {
                expect(privileged).to.be.false;
            });
            it('Should reply with correct message', function() {
                expect(replyStub.calledOnceWith(`You need to have the \'${privRole}\' role to do that.`)).to.be.true;
            });
        });
    });
});
