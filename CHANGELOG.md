# Changelog
This project attempts to conform to [SemVer](https://semver.org/) guidelines whenever possible.

## [v1.7.0]
* [Adding PlantUML component diagrams](https://github.com/Ubunfu/mc-steve/pull/33)
* [Adding standard GitHub bug report and feature request templates](https://github.com/Ubunfu/mc-steve/pull/32)
* [Adding support for buying items]()

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