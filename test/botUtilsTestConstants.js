const GUILD_NO_ADMIN_ROLE = {
    'roles': {
        'cache': [
            {
                'name': 'bullshitRole'
            }
        ]
    }
};

const GUILD_AUTHOR_HAS_ROLE = {
    'roles': {
        'cache': [
            {
                'name': 'AdminRole',
                'members': [
                    {
                        'user': {
                            'username': 'msgAuthorUsername'
                        }
                    }
                ]
            }
        ]
    }
};

const GUILD_ADMIN_ROLE_NO_MEMBERS = {
    'roles': {
        'cache': [
            {
                'name': 'AdminRole',
                'members': []
            }
        ]
    }
};

exports.GUILD_NO_ADMIN_ROLE = GUILD_NO_ADMIN_ROLE;
exports.GUILD_AUTHOR_HAS_ROLE = GUILD_AUTHOR_HAS_ROLE;
exports.GUILD_ADMIN_ROLE_NO_MEMBERS = GUILD_ADMIN_ROLE_NO_MEMBERS;
