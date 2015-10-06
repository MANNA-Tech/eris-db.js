var
  assert = require('assert');

var util = require('../../../lib/util');
var edbModule;

edbModule = require("../../../index");

var test_data = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 40
};

var edb;

var privKey = test_data.chain_data.priv_validator.priv_key[1];
var input = "";
var address;

var serverServerURL = "http://localhost:1337/server";

describe('TestNameReg', function () {

    before(function (done) {
        util.getNewErisServer(serverServerURL, requestData, function (error, port) {
            edb = edbModule.createInstance("http://localhost:" + port + '/rpc');
            done();
        });
    });

    it("should register an entry in the namereg", function (done) {
        this.timeout(6000);
        var input = test_data.SetEntry.input;
        var privKey = input.priv_key;
        var name = input.name;
        var data = input.data;
        var numBlocks = input.numBlocks;

        var output = test_data.SetEntry.output;
        edb.namereg().setEntry(privKey, name, data, numBlocks, function(error){
            assert.ifError(error);

            edb.namereg().getEntry(name, function (error, entry) {
              assert.ifError(error);
              assert.equal(entry.data, data);
              done();
            });
        });

    });

});

