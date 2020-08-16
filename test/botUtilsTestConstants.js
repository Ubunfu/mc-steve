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

const SEARCH_RESULTS_ONE_ITEM = [
    {
        "id": 4332,
        "title": "Brewing",
        "snippet": "A <span class=\"searchmatch\">Brewing</span> Stand is a craftable utility block in Minecraft used in the <span class=\"searchmatch\">brewing</span> process to make potions, splash potions, and lingering potions. The collision box of the <span class=\"searchmatch\">brewing</span> stand involves the bottle holders and",
        "url": "https://minecraft.fandom.com/wiki/Brewing",
        "ns": 0
    }
];

const SNIPPET_NO_SPANS = 'Snippet contains no spans!';
const SNIPPET_SPANS = '<span class=\"searchmatch\">Snippet</span> contains <span class=\"searchmatch\">no</span> spans!';

exports.GUILD_NO_ADMIN_ROLE = GUILD_NO_ADMIN_ROLE;
exports.GUILD_AUTHOR_HAS_ROLE = GUILD_AUTHOR_HAS_ROLE;
exports.GUILD_ADMIN_ROLE_NO_MEMBERS = GUILD_ADMIN_ROLE_NO_MEMBERS;
exports.SEARCH_RESULTS_ONE_ITEM = SEARCH_RESULTS_ONE_ITEM;
exports.SNIPPET_NO_SPANS = SNIPPET_NO_SPANS;
exports.SNIPPET_SPANS = SNIPPET_SPANS;