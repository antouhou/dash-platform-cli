# Dash Platform CLI

This is a simple cli with a couple of commands that can be useful when debugging/developing for the [Dash Platform](https://dashplatform.readme.io/docs/introduction-what-is-dash-platform).

## Installation

#### Prerequisites:
Have node.js installed

Clone this repo and run `npm ci`

## Configuration

By default, the cli will try to connect to the evonet. To change this behaviour, pass
DAPI_SEEDS environment variable. It can contain multiple addresses separated by a comma:
`DAPI_SEEDS=127.0.0.1,192.168.0.1 ./bin/dash transition parse %transition_hex_here%` 

## Usage

`./bin/dash --help` - see all available commands and their options

`./bin/dash transition parse [st_hex]` - parse a serialized state transition binary

`./bin/dash identity get [identity_id]` - get an identity by its base58-encoded id

`./bin/dash wallet send [privateKey] [addressTo] [amount]` - send funds from a private key to an address

If you need more commands, please post an issue to this repo.
