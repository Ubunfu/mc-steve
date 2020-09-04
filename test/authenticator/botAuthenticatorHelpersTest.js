const botUtilsTestConstants = require('../utils/botUtilsTestConstants.js');
const expect = require('chai').expect;
const botAuthenticatorHelpers = require('../../src/authenticator/botAuthenticatorHelpers.js');

describe('msgAuthorInPrivGuild(msg, privGuild)', function() {
    describe('When author is messaging from the privileged Guild', function() {
        it('Should return true', async function() {
             const privGuild = 'Priv Guild';
             const msg = {
                 'guild': {
                     'name': 'Priv Guild'
                 }
             };
             const result = await botAuthenticatorHelpers.msgAuthorInPrivGuild(msg, privGuild);
             expect(result).to.be.equal(true);
        });
    });
    describe('When author is not messaging from a non-privileged Guild', function() {
         it('Should return false', async function() {
             const privGuild = 'Priv Guild';
             const msg = {
                 'guild': {
                     'name': 'Random Guild'
                 }
             };
             const result = await botAuthenticatorHelpers.msgAuthorInPrivGuild(msg, privGuild);
             expect(result).to.be.equal(false);
         });
    });
    describe('When author is not messaging from any Guild', function() {
         it('Should return false', async function() {
             const privGuild = 'Priv Guild';
             const msg = { };
             const result = await botAuthenticatorHelpers.msgAuthorInPrivGuild(msg, privGuild);
             expect(result).to.be.equal(false);
         });
    });
 });
 
 describe('msgAuthorHasPrivRole(msg, privRole)', function() {
     describe('When required role does not exist in guild', function() {
         it('Should return false', async function() {
             const msg = {
                 'guild': botUtilsTestConstants.GUILD_NO_ADMIN_ROLE
             };
             const result = await botAuthenticatorHelpers.msgAuthorHasPrivRole(msg, 'AdminRole');
             expect(result).to.be.equal(false);
         });
     });
     describe('When message author has the required role', function() {
         it('Should return true', async function() {
             const msg = {
                 'author': {
                     'username': 'msgAuthorUsername'
                 }, 
                 'guild': botUtilsTestConstants.GUILD_AUTHOR_HAS_ROLE
             };
             const result = await botAuthenticatorHelpers.msgAuthorHasPrivRole(msg, 'AdminRole');
             expect(result).to.be.equal(true);
         });
     });
     describe('When message author does not have the required role', function() {
         it('Should return false', async function() {
             const msg = {
                 'author': {
                     'username': 'msgAutherUsername'
                 }, 
                 'guild': botUtilsTestConstants.GUILD_ADMIN_ROLE_NO_MEMBERS
             };
             const result = await botAuthenticatorHelpers.msgAuthorHasPrivRole(msg, 'AdminRole');
             expect(result).to.be.equal(false);
         });
     });
 });