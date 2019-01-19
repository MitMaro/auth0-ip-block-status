'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);

global.chai = chai;
global.expect = chai.expect;
