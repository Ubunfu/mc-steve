const INSTANCE_ID = 'i-0f1a743341795b94d';

const EC2_START_INSTANCES_RESPONSE_SUCCESS = {
    'StartingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'starting'
            }
        }
    ]
}

const EC2_STOP_INSTANCES_RESPONSE_SUCCESS = {
    'StoppingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'stopping'
            }
        }
    ]
}

exports.INSTANCE_ID = INSTANCE_ID;
exports.EC2_START_INSTANCES_RESPONSE_SUCCESS = EC2_START_INSTANCES_RESPONSE_SUCCESS;
exports.EC2_STOP_INSTANCES_RESPONSE_SUCCESS = EC2_STOP_INSTANCES_RESPONSE_SUCCESS;