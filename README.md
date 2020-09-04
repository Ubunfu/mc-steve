# Minecraft Steve
[![Latest Release](https://img.shields.io/github/package-json/v/Ubunfu/mc-steve?style=for-the-badge)](https://github.com/Ubunfu/mc-steve/releases)
![CircleCI](https://img.shields.io/circleci/build/github/Ubunfu/mc-steve?logo=circleci&style=for-the-badge)
![Contrubutors](https://img.shields.io/github/contributors/Ubunfu/mc-steve?color=blue&style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/Ubunfu/mc-steve?style=for-the-badge)
![Coveralls github](https://img.shields.io/coveralls/github/Ubunfu/mc-steve?logo=coveralls&style=for-the-badge)

Minecraft Steve is a snarky Discord chat bot hailing from the caves of Moria that hangs out in our Guild and occasionally helps out with things.

## Usage
Minecraft Steve can be called upon for help (or a snappy remark) by mentioning him by name (or nickname) in a message within the Discord Guild in which he is staying.  The message should take the form: `@[ mc-steve | NICKNAME ] COMMAND`.

### Commands
> ***(Privileged)*** denotes that the command is restricted to members invoking it from a configured Guild (PRIV_GUILD), and who have a configured role (i.e. ROLE_START, ROLE_STOP).
* `start`: ***(Privileged)*** Starts a configured AWS-hosted Minecraft server
* `stop`: ***(Privileged)*** Stops a configured AWS-hosted Minecraft server
* `search <search terms>`: Searches the [Minecraft Fandom Wiki](https://minecraft.fandom.com) for articles related `<search terms>`.  The bot will respond to you by mention with a list of search results containing the title of the wiki article, a direct link to it, and a short snippet from the content.
* `help`: Responds with the currently supported list of commands

## Setup
To work properly, Minecraft Steve needs to be configured by injecting some environment variables at runtime.  When working locally, you can keep these variables in a file named `.env` at the project root, with values defined in line-delimited, KV form (e.g. `KEY=VALUE`).  This file is already configured to be ignored in `.gitignore`.

> DO NOT LET YOUR `.env` FILE BE COMMITTED TO VERSION CONTROL

When hosting this application in a container or in the cloud, use that technology / platform's means for injecting such configuration into the runtime.

* `DISCORD_TOKEN`: This is an OAuth token provisioned by Discord.  At a minimum, this token should have scopes [`bot`] and bot permissions: [`Send Messages`, `Read Message History`, `Add Reactions`].
* `ROLE_START`: This is the name of a role defined within the Guild which permits starting the server.
* `ROLE_STOP`: This is the name of a role defined within the Guild which permits stopping the server.
* `PRIV_GUILD`: This is the name of the Guild to which privileged command execution should be restricted.
* `BOT_USERNAME`: This is the bot's username as known by Discord.  It should be set to `mc-steve`.
* `SERVER_REGION`: The region of the AWS hosted Minecraft server (e.g. `us-east-1`)
* `SERVER_INSTANCE_ID`: The instance ID of the AWS hosted Minecraft server (e.g. `i-1g2b854552806c05e`)
* `SERVER_KEY_ID`: Access Key ID of an AWS IAM user with sufficient privileges to start and stop EC2 instances.
* `SERVER_SEC_KEY`: Secret Key ID of an AWS IAM user with sufficient privileges to start and stop EC2 instances.

> If `SERVER_KEY_ID` and `SERVER_SEC_KEY` are not configured, it is assumed that the bot is running in an AWS environment that has been granted the IAM role to execute EC2 API commands programmatically.

## Build and run locally
### With Docker
1. `docker build . -t mc-steve`
2. `docker run --env-file .env mc-steve`

### Without Docker
1. Clone the project
2. Make sure you have Node JS installed
3. Run `npm install`
4. Run `npm run start`