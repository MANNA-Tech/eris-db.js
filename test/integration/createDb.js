'use strict';

var
  child_process = require('child_process')
  Promise = require('bluebird');

Promise.promisifyAll(child_process);

// Create a fresh chain for each integration test and return its IP address.
module.exports = function () {
  return child_process.execAsync('\
    eris chains stop blockchain; \
    eris chains rm blockchain; \
    eris chains new --genesis=blockchain/genesis.json \
      --priv=blockchain/priv_validator.json --api --publish blockchain \
    && eris chains start blockchain \
    && sleep 3 \
    && eris chains inspect blockchain NetworkSettings.IPAddress')
    .spread(function (stdout) {
      var
        ipAddress, privateKey;

      ipAddress = /.*\n(.*)\n/.exec(stdout)[1];
      console.log("Created ErisDB test server at " + ipAddress + ".");
      privateKey = require('./blockchain/priv_validator.json').priv_key[1];
      return [ipAddress, privateKey];
    });
};
