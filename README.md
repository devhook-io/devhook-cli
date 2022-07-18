# devhook

Devhook CLI Tool to proxy webhook data via devhook.io

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/devhook.svg)](https://npmjs.org/package/devhook)
[![Downloads/week](https://img.shields.io/npm/dw/devhook.svg)](https://npmjs.org/package/devhook)
[![License](https://img.shields.io/npm/l/devhook.svg)](https://github.com/devhook-io/devhook-cli-js/blob/master/package.json)

<!-- toc -->
* [devhook](#devhook)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g devhook-cli
$ devhook COMMAND
running command...
$ devhook (-v|--version|version)
devhook-cli/2.1.2 darwin-x64 node-v14.15.0
$ devhook --help [COMMAND]
USAGE
  $ devhook COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`devhook help [COMMAND]`](#devhook-help-command)
* [`devhook login`](#devhook-login)
* [`devhook monitor`](#devhook-monitor)

## `devhook help [COMMAND]`

display help for devhook

```
USAGE
  $ devhook help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `devhook login`

Authenticate your machine with Devhook. Will need an existing Devhook account

```
USAGE
  $ devhook login
```

_See code: [src/commands/login.js](https://github.com/devhook-io/devhook-cli/blob/v2.1.2/src/commands/login.js)_

## `devhook monitor`

Receive and forward webhook events for the webhook you select

```
USAGE
  $ devhook monitor

DESCRIPTION
  ...
  You will need to create your webhooks in the Web UI (https://app.devhook.io)
```

_See code: [src/commands/monitor.js](https://github.com/devhook-io/devhook-cli/blob/v2.1.2/src/commands/monitor.js)_
<!-- commandsstop -->
