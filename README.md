# Minecraft Steve
Minecraft Steve is a snarky Discord chat bot hailing from the caves of Moria that hangs out in our Guild and occasionally helps out with things.

## Usage
Minecraft Steve can be called upon for help (or a snappy remark) by mentioning him by name (or nickname) in a message within the Discord Guild in which he is staying.  The message should take the form: `@[ mc-steve | NICKNAME ] COMMAND`.

### Commands
* `start`: Starts the Minecraft server by making an HTTP request to the endpoint supplied by the configured `URL_SERVER_START` environment variable
* `stop`: Stops the Minecraft server by making an HTTP request to the endpoint supplied by the configured `URL_SERVER_STOP` environment variable
* `search <search terms>`: Searches the [Minecraft Fandom Wiki](https://minecraft.fandom.com) for articles related `<search terms>`.  The bot will respond to you by mention with a list of search results containing the title of the wiki article, a direct link to it, and a short snippet from the content.
* `help`: Responds with the currently supported list of commands

## Setup
To work properly, Minecraft Steve needs to be configured by injecting some environment variables at runtime.  When working locally, you can keep these variables in a file named `.env` at the project root, with values defined in line-delimited, KV form (e.g. `KEY=VALUE`).  This file is already configured to be ignored in `.gitignore`.

> DO NOT LET YOUR `.env` FILE BE COMMITTED TO VERSION CONTROL

When hosting this application in a container or in the cloud, use that technology / platform's means for injecting such configuration into the runtime.

* `DISCORD_TOKEN`: This is an OAuth token provisioned by Discord.  At a minimum, this token should have scopes [`bot`] and bot permissions: [`Send Messages`, `Read Message History`, `Add Reactions`].
* `PRIV_ROLE`: This is the name of a role defined within the Guild which protects the execution of privileged operations, like `start` and `stop`.
* `PRIV_GUILD`: This is the name of the Guild to which privileged command execution should be restricted.
* `BOT_USERNAME`: This is the bot's username as known by Discord.  It should be set to `mc-steve`.
* `URL_SERVER_START`: The URL of an API that can start the Minecraft server.
* `URL_SERVER_STOP`: The URL of an API that can stop the Minecraft server.

## Run Locally
1. Clone the project
2. Make sure you have Node JS installed
3. Run `npm install`
4. Run `npm run start`