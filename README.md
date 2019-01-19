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

## Endpoints

### GET `/###.###.###.###`

Returns if the provided IPv4 address is blocked.

#### Response

For a blocked address, the `blocked` status will be `true` and the `source` property will return a list of block lists
that have the IP address blocked.

```
{
    "blocked": true,
    "source": ["firehol_level1"]
}
```

For a allowed address, the `blocked` status will be `false`.

```
{
    "blocked":false
}
```

### GET `/healthcheck`

Returns some status information on the micro-service. The `time` is the current server time, `filterListCount` is the
number of IPv4 ranges in the filter list, and `lastUpdate` is the time that the filter list was last updated.

```
{
    "time": 1547872250341,
    "filterListCount": 33685,
    "lastUpdate": 1547872249578
}
```

## Configuration

The service can be configured using environment variables.

| Environment Variable          | Default  | Description |
|-------------------------------|----------|-------------|
| `PORT`                        | `3000`   | The port the HTTP server is listening |
| `FILTER_LIST_UPDATE_INTERVAL` | `300000` | How often that the filter lists are checked for an update, in milliseconds |

## Debugging

This library uses [debug](https://github.com/visionmedia/debug) to produce debugging output. To enable add
`DEBUG=auth0` before your run command.


## Testing

The project has a full test suite that can be run with:

    npm run test

## License

This project is released under the ISC license. See [LICENSE](LICENSE).
