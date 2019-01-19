# Auth0 Exercise - IP Address Filter List Downloader and Blocker

## Requirements

- Node 8+ ([nvm use](https://github.com/creationix/nvm) or [Nodejs.org](https://nodejs.org/en/)
- Bash 4+ (see below or MacOS instructions)

### MacOS Setup

The Bash scripts in the project require Bash 4+ and Apple only bundles Bash 3 on MacOS. The project can work without a
newer version of Bash by using different commands.

- For tests run `./node_modules/.bin/nyc ./node_modules/.bin/mocha`
- For linting run `./node_modules/.bin/eslint`
- For starting run `node src/start`

You can also install a newer version of Bash with [homebrew](https://brew.sh/).

## Getting Started

The project can only be downloaded from GitHub.

    git clone git@github.com:MitMaro/auth0-ip-block-status.git

Once downloaded you will need to install the project's dependencies.

    npm install

To start the project

    npm run start

## Debugging

This library uses [debug](https://github.com/visionmedia/debug) to produce debugging output. To enable add
`DEBUG=auth0` before your run command.


## Testing

The project has a full test suite that can be run with:

    npm run test

## License

This project is released under the ISC license. See [LICENSE](LICENSE).
