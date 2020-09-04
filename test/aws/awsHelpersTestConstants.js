const INSTANCE_ID = 'i-0f1a743341795b94d';

const EC2_START_INSTANCES_RESPONSE_STARTING = {
    'StartingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'starting'
            }
        }
    ]
}

const EC2_START_INSTANCES_RESPONSE_PENDING = {
    'StartingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'pending'
            }
        }
    ]
}

const EC2_START_INSTANCES_RESPONSE_RUNNING = {
    'StartingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'running'
            }
        }
    ]
}

const EC2_START_INSTANCES_RESPONSE_UNEXPECTED = {
    'StartingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': '?'
            }
        }
    ]
}

const EC2_STOP_INSTANCES_RESPONSE_STOPPING = {
    'StoppingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'stopping'
            }
        }
    ]
}

const EC2_STOP_INSTANCES_RESPONSE_STOPPED = {
    'StoppingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': 'stopped'
            }
        }
    ]
}

const EC2_STOP_INSTANCES_RESPONSE_UNEXPECTED = {
    'StoppingInstances': [
        {
            'InstanceId': INSTANCE_ID,
            'CurrentState': {
                'Name': '?'
            }
        }
    ]
}

exports.INSTANCE_ID = INSTANCE_ID;
exports.EC2_START_INSTANCES_RESPONSE_STARTING = EC2_START_INSTANCES_RESPONSE_STARTING;
exports.EC2_START_INSTANCES_RESPONSE_PENDING = EC2_START_INSTANCES_RESPONSE_PENDING;
exports.EC2_START_INSTANCES_RESPONSE_RUNNING = EC2_START_INSTANCES_RESPONSE_RUNNING;
exports.EC2_START_INSTANCES_RESPONSE_UNEXPECTED = EC2_START_INSTANCES_RESPONSE_UNEXPECTED;
exports.EC2_STOP_INSTANCES_RESPONSE_STOPPING = EC2_STOP_INSTANCES_RESPONSE_STOPPING;
exports.EC2_STOP_INSTANCES_RESPONSE_STOPPED = EC2_STOP_INSTANCES_RESPONSE_STOPPED;
exports.EC2_STOP_INSTANCES_RESPONSE_UNEXPECTED = EC2_STOP_INSTANCES_RESPONSE_UNEXPECTED;