'use strict';

require('setimmediate');

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');

chai.use(sinonChai);

global.TEST = true;
global.expect = chai.expect;
global.sinon = sinon;
