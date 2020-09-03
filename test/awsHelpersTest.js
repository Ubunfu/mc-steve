const expect = require('chai').expect;
const awsHelpers = require('../awsHelpers.js');
const AWS = require('aws-sdk-mock');
const AWSSDK = require('aws-sdk');
const sinon = require('sinon');
const awsHelpersTestConstants = require('./awsHelpersTestConstants.js');

describe('startServer(serverRegion, credsKeyId, credsSecretKey, serverId)', function() {
    describe('When EC2 returns data', function() {
        beforeEach(function() {
            AWS.mock('EC2', 'startInstances', function(params, callback) {
                callback(null, awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_STARTING);
            });
        });
        afterEach(function () {
            AWS.restore();
          });
        it('Resolved response should include data', async function() {
            const resp = await awsHelpers.startServer('', '', '', awsHelpersTestConstants.INSTANCE_ID);
            expect(resp).to.be.equal(awsHelpersTestConstants.EC2_START_INSTANCES_RESPONSE_STARTING);
        });
    });

    describe('When AccessKeyID and SecretKey are passed', function() {
        beforeEach(function() {
            AWS.mock('EC2', 'startInstances', function(params, callback) {
                callback(null, {});
            });
        });
        afterEach(function () {
            AWS.restore();
        });
        it('Should call aws.config.update() with credentials', async function() {
            const awsConfigSpy = sinon.spy(AWSSDK.config, 'update');
            const expectedParams = {
                accessKeyId: 'credsKeyId', 
                secretAccessKey: 'credsSecretKey'
            };
            await awsHelpers.startServer('', 'credsKeyId', 'credsSecretKey', '');
            expect(awsConfigSpy.calledTwice).to.be.true;
            expect(awsConfigSpy.calledWithExactly(expectedParams)).to.be.true;
            awsConfigSpy.restore();
        });
    });

    describe('When AccessKeyID and SecretKey are not passed', function() {
        beforeEach(function() {
            AWS.mock('EC2', 'startInstances', function(params, callback) {
                callback(null, {});
            });
        });
        afterEach(function () {
            AWS.restore();
          });
        it('Should not call aws.config.update() with credentials', async function() {
            const awsConfigSpy = sinon.spy(AWSSDK.config, 'update');
            await awsHelpers.startServer('', '', '', '');
            expect(awsConfigSpy.calledOnce).to.be.true;
            awsConfigSpy.restore();
        });
    });


});

describe('stopServer(serverRegion, credsKeyId, credsSecretKey, serverId)', function() {
    describe('When EC2 returns data', function() {
        beforeEach(function() {
            AWS.mock('EC2', 'stopInstances', function(params, callback) {
                callback(null, awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_STOPPING);
            });
        });
        afterEach(function () {
            AWS.restore();
          });
        it('Resolved response should include data', async function() {
            const resp = await awsHelpers.stopServer('', '', '', awsHelpersTestConstants.INSTANCE_ID);
            expect(resp).to.be.equal(awsHelpersTestConstants.EC2_STOP_INSTANCES_RESPONSE_STOPPING);
        });
    });

    describe('When AccessKeyID and SecretKey are passed', function() {
        beforeEach(function() {
            AWS.mock('EC2', 'stopInstances', function(params, callback) {
                callback(null, {});
            });
        });
        afterEach(function () {
            AWS.restore();
        });
        it('Should call aws.config.update() with credentials', async function() {
            const awsConfigSpy = sinon.spy(AWSSDK.config, 'update');
            const expectedParams = {
                accessKeyId: 'credsKeyId', 
                secretAccessKey: 'credsSecretKey'
            };
            await awsHelpers.stopServer('', 'credsKeyId', 'credsSecretKey', '');
            expect(awsConfigSpy.calledTwice).to.be.true;
            expect(awsConfigSpy.calledWithExactly(expectedParams)).to.be.true;
            awsConfigSpy.restore();
        });
    });

    describe('When AccessKeyID and SecretKey are not passed', function() {
        beforeEach(function() {
            AWS.mock('EC2', 'stopInstances', function(params, callback) {
                callback(null, {});
            });
        });
        afterEach(function () {
            AWS.restore();
          });
        it('Should not call aws.config.update() with credentials', async function() {
            const awsConfigSpy = sinon.spy(AWSSDK.config, 'update');
            await awsHelpers.stopServer('', '', '', '');
            expect(awsConfigSpy.calledOnce).to.be.true;
            awsConfigSpy.restore();
        });
    });
});