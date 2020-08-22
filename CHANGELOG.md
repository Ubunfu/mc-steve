# Changelog
This project attempts to conform to [SemVer](https://semver.org/) guidelines whenever possible.

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