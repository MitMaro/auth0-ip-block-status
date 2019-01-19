/* eslint-disable no-console */
'use strict';

const path = require('path');
const {promisify} = require('util');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const gRPCServiceHandler = require('./lib/grpc-service-handler');

const PROTO_PATH = path.join(__dirname, 'protos', 'ip-address.proto');

module.exports = (config, checkIpAddressBlocked) => {
	let server;
	return {
		async setup() {
			const packageDefinition = await protoLoader.load(PROTO_PATH);

			const ipAddressProto = grpc.loadPackageDefinition(packageDefinition).com.auth0;

			server = new grpc.Server();
			server.addService(ipAddressProto.IpV4AddressBlockSearch.service, gRPCServiceHandler(checkIpAddressBlocked));
		},
		async start() {
			if (server === undefined) {
				throw new Error('Attempted to call `start` before `setup` was called.');
			}
			const bind = promisify(server.bindAsync.bind(server));
			await bind(`0.0.0.0:${config.gRPCServer.port}`, grpc.ServerCredentials.createInsecure());
			server.start();
			console.log(`gRPC server listening on port ${config.gRPCServer.port}`);
		},
		async end() {
			await promisify(server.tryShutdown.bind(server))();
		},
	};
};
