const aws = require('aws-sdk');

async function startServer(serverRegion, credsKeyId, credsSecretKey, serverId) {
    if (credsKeyId && credsSecretKey) {
        aws.config.update({
            accessKeyId: credsKeyId, 
            secretAccessKey: credsSecretKey});
    }
    aws.config.update({region: serverRegion});
    let ec2 = new aws.EC2();
    const startParams = {
        InstanceIds: [serverId],
        DryRun: false
    };
    return new Promise((resolve, reject) => {
        ec2.startInstances(startParams, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(data);
        });
    });
}

async function stopServer(serverRegion, credsKeyId, credsSecretKey, serverId) {
    if (credsKeyId && credsSecretKey) {
        aws.config.update({
            accessKeyId: credsKeyId, 
            secretAccessKey: credsSecretKey});
    }
    aws.config.update({region: serverRegion});
    let ec2 = new aws.EC2();
    const stopParams = {
        InstanceIds: [serverId],
        DryRun: false
    };
    return new Promise((resolve, reject) => {
        ec2.stopInstances(stopParams, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(data);
        });
    });
}

exports.startServer = startServer;
exports.stopServer = stopServer;