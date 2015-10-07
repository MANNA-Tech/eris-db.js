var
  assert = require('assert'),
  child_process = require('child_process'),
  edbModule = require('../../../index'),
  testData = require('../../testdata/testdata.json');

describe("name registry", function () {
  it("should set and get an entry", function (done) {
    var
      requestData;

    this.timeout(6 * 1000);

    requestData = {
      priv_validator: testData.chain_data.priv_validator,
      genesis: testData.chain_data.genesis,
      max_duration: 40
    };

    child_process.exec('eris chains inspect blockchain NetworkSettings.IPAddress', function (error, stdout) {
      var
        edb, privateKey, key, value, numberOfBlocks;

      edb = edbModule.createInstance('http://' + stdout.trim() + ':1337/rpc');
      privateKey = require('../blockchain/priv_validator.json').priv_key[1];
      key = "testKey";
      value = "testData";
      numberOfBlocks = 250;

      edb.namereg().setEntry(privateKey, key, value, numberOfBlocks, function (error) {
        assert.ifError(error);

        edb.namereg().getEntry(key, function (error, entry) {
          assert.ifError(error);
          assert.equal(entry.data, value);
          done();
        });
      });
    });
  });
});
