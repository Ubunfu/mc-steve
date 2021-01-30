# Minecraft Steve
[![Latest Release](https://img.shields.io/github/package-json/v/Ubunfu/mc-steve?style=for-the-badge)](https://github.com/Ubunfu/mc-steve/releases)
[![CircleCI](https://img.shields.io/circleci/build/github/Ubunfu/mc-steve?logo=circleci&style=for-the-badge)](https://app.circleci.com/pipelines/github/Ubunfu/mc-steve)
![Contrubutors](https://img.shields.io/github/contributors/Ubunfu/mc-steve?color=blue&style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/Ubunfu/mc-steve?style=for-the-badge)
[![Coveralls github](https://img.shields.io/coveralls/github/Ubunfu/mc-steve?logo=coveralls&style=for-the-badge)](https://coveralls.io/github/Ubunfu/mc-steve)

Minecraft Steve is a snarky Discord chat bot that hangs out in your Discord guild and helps out with adminstration of your AWS-hosted Minecraft server, and other Minecraft-related things. 

## Setup
Steve must be deployed to a persistent environment (usually a cloud of your choice) and configured in order to work properly.  It is not currently offered as a service.

### Discord Setup & Authorization
In order to participate in your Discord Guild, Steve must be registered and configured with a Discord API token.  Register a new application in the [Discord Developer Portal](https://discord.com/developers/applications) to generate an API token.  Create a bot-user as well, and select OAuth2 scopes and permissions to create a link you can use to invite your bot to your guild.  Select ***only*** the [`bot`] scope, and at least the following permissions: [`Send Messages`, `Read Message History`, `Add Reactions`].

Open the generated link to invite your bot to your guild.

Once you've invited your bot to your guild, create the following roles:
* A role for starting the server
* A role for stopping your server
* A role for running server commands

These roles allow you to restrict access to certain potentially dangerous operations to specific members of your guild.  These roles don't need to have any Discord permissions associated with them - you can safely clear them all out.

### Deployment
Once the Discord API token is generated, you should be able to deploy the app as a Docker container wherever you like.  A free-plan Heroku worker dyno, a free-tier AWS EC2 instance, or a similar alternative are probably good options.

There are pre-built Docker images hosted in our [GitHub Packages](https://github.com/Ubunfu/mc-steve/packages) that you can run, or you can build this project yourself with Docker and deploy the image.
 
### Configuration
To work properly, Minecraft Steve needs to be configured with the following environment variables:

* `DISCORD_TOKEN`: This OAuth token provisioned by Discord.  
* `ROLE_START`: This is the name of a role defined within the Guild which permits starting the server.
* `ROLE_STOP`: This is the name of a role defined within the Guild which permits stopping the server.
* `ROLE_RCON`: This is the name of a role definied within the Guild which permits running RCON commands on the server.
* `PRIV_GUILD`: This is the name of the Guild to which Steve is invited.  Privileged command execution will be restricted to this guild.
* `BOT_USERNAME`: This is the name you assigned to the bot-user you generated in the [Discord Developer Portal](https://discord.com/developers/applications).
* `SERVER_HOST`: The hostname resolving to the the game server.  It can be a DNS name.
* `SERVER_REGION`: The region of the AWS hosted Minecraft server (e.g. `us-east-1`)
* `SERVER_INSTANCE_ID`: The instance ID of the AWS hosted Minecraft server (e.g. `i-1g2b854552806c05e`)
* `SERVER_KEY_ID`: Access Key ID of an AWS IAM user with sufficient privileges to start and stop EC2 instances.
* `SERVER_SEC_KEY`: Secret Key ID of an AWS IAM user with sufficient privileges to start and stop EC2 instances.
* `SERVER_RCON_PORT`: This is the port which the RCON service on the game server is listening on.
* `SERVER_RCON_PASS`: This is the password used to authenticate with the RCON service running on the game server.
* `SERVER_RCON_CONNECT_DELAY_MS`: A configurable number of milliseconds to wait after successfully connecting to the RCON service before sending the actual command.  500ms is probably fine, but it may need to be tweaked based on network latency.
* `SERVICE_SHOP_GET_ITEM_URL`: The URL of the [Mc-Shop](https://github.com/Ubunfu/mc-shop) Get Item service.
* `SERVICE_SHOP_BUY_ITEM_URL`: The URL of the [Mc-Shop](https://github.com/Ubunfu/mc-shop) Buy Item service.
* `SERVICE_SHOP_SELL_ITEM_URL`: The URL of the [Mc-Shop](https://github.com/Ubunfu/mc-shop) Sell Item service.
* `SERVICE_WALLET_GET_WALLET_URL`: The URL of the [Mc-Wallet](https://github.com/Ubunfu/mc-wallet) Get Wallet service.
* `SERVICE_WALLET_PAY_URL`: The URL of the [Mc-Wallet](https://github.com/Ubunfu/mc-wallet) pay service.
* `SERVICE_WALLET_CHARGE_URL`: The URL of the [Mc-Wallet](https://github.com/Ubunfu/mc-wallet) charge service.
* `SERVICE_USERS_GET_USER_URL`: The URL of the [Mc-User](https://github.com/Ubunfu/mc-user) Get User service.
* `SERVICE_XP_QUERY_URL`: The URL of the [mc-xp-bank](https://github.com/Ubunfu/mc-xp-bank) Query XP service.

> If `SERVER_KEY_ID` and `SERVER_SEC_KEY` are not configured, it is assumed that the bot is running in an AWS environment that has been granted the IAM role to execute EC2 API commands programmatically.

## Usage
Minecraft Steve can be called upon for help (or a snappy remark) by @mentioning them by name (or nickname) in a message within the Discord Guild in which they are staying.  The message should take the form: `@[ mc-steve | NICKNAME ] COMMAND`.

> Use Discord's tab-completion to reduce chance of typos when invoking Steve by @mention.

### Commands
> ***(Privileged)*** denotes that the command is restricted to members invoking it from a configured Guild (PRIV_GUILD), and who have a configured role (i.e. ROLE_START, ROLE_STOP).
* `start`: ***(Privileged)*** Starts a configured AWS-hosted Minecraft server
* `stop`: ***(Privileged)*** Stops a configured AWS-hosted Minecraft server
* `search <search terms>`: Searches the [Minecraft Fandom Wiki](https://minecraft.fandom.com) for articles related to `<search terms>`.  Steve will respond with a few of the top search results containing the title of the wiki article, a direct link to it, and a short snippet from the content.
* `run <command>`: ***(Privileged)*** Runs a command on the server via the RCON protocol
* `wallet <username>`: Checks the balance of a player's wallet
* `price <itemName>`: Checks the purchase price of an item in the Shop
* `buy <quantity> <itemName>`: Purchase items for a player by charging their wallet and adding the item(s) to their in-game inventory
* `sell <quantity> <itemName>`: Sell items for a player by attempting to remove the item(s) from their in-game inventory and charging their wallet for the items which were removed
* `pay <username> <amount>`: Pay another player money from your wallet 
* `xp query <username>`: Check the instantaneous quantity of XP points held by a logged-in player
* `xp balance <username>`: Check how many XP points a player has in their XP bank 
* `xp deposit <points>`: Deposit a quantity of your held XP points into your XP bank
* `xp withdraw <points>`: Withdraw a quantity of XP points from your XP bank to your player
* `xp transfer <username> <points>`: Transfer a quantity of XP points from your XP bank to another player's XP bank 
* `help`: Responds with the currently supported list of commands

## Build and run locally
When running locally, you can keep environment variables in a file named `.env` at the project root, with values defined in line-delimited, KV form (e.g. `KEY=VALUE`).  This file is already configured to be ignored in `.gitignore`.

> DO NOT LET YOUR `.env` FILE BE COMMITTED TO VERSION CONTROL

### With Docker
1. `docker build . -t mc-steve`
2. `docker run --env-file .env mc-steve`

### Without Docker
1. Clone the project
2. Make sure you have Node JS installed
3. Run `npm install`
4. Run `npm run start`