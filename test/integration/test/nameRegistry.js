'use strict';

var
  assert = require('assert'),
  child_process = require('child_process'),
  edbModule = require('../../../index'),
  Promise = require('bluebird');

Promise.promisifyAll(child_process);

function erisDb(ipAddress, privateKey) {
  var
    edb, namereg;

  edb = edbModule.createInstance('http://' + ipAddress + ':1337/rpc');
  namereg = Promise.promisifyAll(edb.namereg());

  return {
    nameRegistry: {
      getItem: function (key) {
        return namereg.getEntryAsync(key).then(function (entry) {
          return entry.data;
        });
      },

      setItem: function (key, value, numberOfBlocks) {
        return namereg.setEntryAsync(privateKey, key, value,
          numberOfBlocks === undefined ? 250 : numberOfBlocks);
      }
    }
  };
}

describe("name registry", function () {
  var
    registry;

  this.timeout(60 * 1000);

  before(function () {
    return require('../before')().then(function (ipAddress) {
      var
        privateKey;

      console.log("ipaddress", ipAddress);

      privateKey = require('../blockchain/priv_validator.json').priv_key[1];
      registry = erisDb(ipAddress, privateKey).nameRegistry;
    });
  });

  it("should set and get an entry", function (done) {
    var
      key, value;

    key = "testKey";
    value = "testValue";

    registry.setItem(key, value).then(function () {
      registry.getItem(key).then(function (storedValue) {
        assert.equal(storedValue, value);
        done();
      });
    });
  });
});
