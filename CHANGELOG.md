# Changelog
This project attempts to conform to [SemVer](https://semver.org/) guidelines whenever possible.

## [v2.5.0]
* [Adding XP transfer command](https://github.com/Ubunfu/mc-steve/pull/58)

## [v2.4.0]
* [Adding XP withdraw command](https://github.com/Ubunfu/mc-steve/pull/55)
* [Adding XP balance check command](https://github.com/Ubunfu/mc-steve/pull/56)

## [v2.3.0]
* [Adding XP deposit command](https://github.com/Ubunfu/mc-steve/pull/53)

## [v2.2.0]
* [Adding UML sequence diagrams](https://github.com/Ubunfu/mc-steve/pull/50)
* [Adding XP query command](https://github.com/Ubunfu/mc-steve/pull/51)

## [v2.1.0]
* [Allow player2player payments](https://github.com/Ubunfu/mc-steve/pull/48)

## [v2.0.0]
* [Looking up Minecraft usernames for the Shop commands](https://github.com/Ubunfu/mc-steve/pull/46)

## [v1.11.0]
* [Modularly including purchase and/or sell price in get item response](https://github.com/Ubunfu/mc-steve/pull/44)
## [v1.10.0]
* [Adding item sell command](https://github.com/Ubunfu/mc-steve/pull/42)

## [v1.9.0]
* [Adding wallet balance check command](https://github.com/Ubunfu/mc-steve/pull/40)

## [v1.8.0]
* [Adding price check command](https://github.com/Ubunfu/mc-steve/pull/38)

## [v1.7.0]
* [Adding PlantUML component diagrams](https://github.com/Ubunfu/mc-steve/pull/33)
* [Adding standard GitHub bug report and feature request templates](https://github.com/Ubunfu/mc-steve/pull/32)
* [Adding support for buying items](https://github.com/Ubunfu/mc-steve/pull/34)
* [Updating help command menu with buy command](https://github.com/Ubunfu/mc-steve/pull/36)

## [v1.6.1]
* [Updating readme with better setup docs](https://github.com/Ubunfu/mc-steve/pull/29)
* [Fixing app crashes if RCON commands fail](https://github.com/Ubunfu/mc-steve/pull/30)

## [v1.6.0]
* [Adding support for running RCON commands on server](https://github.com/Ubunfu/mc-steve/pull/26)

## [v1.5.0]
* [Switching base docker image to node:14-slim](https://github.com/Ubunfu/mc-steve/pull/23)

## [v1.4.0]
* [Adding integration tests and restructuring project files](https://github.com/Ubunfu/mc-steve/pull/19)
* [Adding Coveralls code-coverage support!](https://github.com/Ubunfu/mc-steve/pull/20)

## [v1.3.1]
* Restoring missing aws-sdk dependency

## [v1.3.0]
* Adding support for starting and stopping an AWS server by instance ID. [Fixes #10](https://github.com/Ubunfu/mc-steve/issues/10)

## [v1.2.0]
* Adding Docker support.  [Fixes #6](https://github.com/Ubunfu/mc-steve/issues/6)

## [v1.1.2]
* Fixing error handling bug that breaks Steve when DM-ing a privileged command.  [Fixes #3](https://github.com/Ubunfu/mc-steve/issues/3)
* Changing `OP_ROLE` environment variable to `PRIV_ROLE`.
* Steve responds with a special message if a privilege command is invoked from outside the privileged Guild
* Adding `PRIV_GUILD` environment variable
* Adding Circle CI build configuration

## [1.1.1]
* Fixing bug in command parsing RegEx patterns. [Fixes #2](https://github.com/Ubunfu/mc-steve/issues/2)

## [1.1.0]
* Added a bunch of tests
* Added `search` command using Wikia API
* Added changelog

## [v1.0.0]
* Added role based access control on commands
* Added `start` and `stop` commands with hooks to HTTP endpoints to do the work
* Added help command
* Added GPLv3 license