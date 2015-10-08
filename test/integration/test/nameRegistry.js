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
  it("should set and get an entry", function (done) {
    this.timeout(6 * 1000);

    child_process.execAsync('eris chains inspect blockchain NetworkSettings.IPAddress').spread(function (stdout) {
      var
        privateKey, registry, key, value;

      privateKey = require('../blockchain/priv_validator.json').priv_key[1];
      key = "testKey";
      value = "testValue";

      registry = erisDb(stdout.trim(), privateKey).nameRegistry;

      registry.setItem(key, value).then(function () {
        registry.getItem(key).then(function (storedValue) {
          assert.equal(storedValue, value);
          done();
        });
      });
    });
  });
});
