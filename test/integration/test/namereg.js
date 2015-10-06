var
  assert = require('assert'),
  edbModule = require('../../../index'),
  testData = require('../../testdata/testdata.json'),
  util = require('../../../lib/util');

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

    util.getNewErisServer('http://localhost:1337/server', requestData, function (error, port) {
      var
        edb, privateKey, key, value, numberOfBlocks;

      edb = edbModule.createInstance('http://localhost:' + port + '/rpc');
      privateKey = '6B72D45EB65F619F11CE580C8CAED9E0BADC774E9C9C334687A65DCBAD2C4151CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906';
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
