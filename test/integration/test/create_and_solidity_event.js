var util = require('../../../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../../../lib/index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var test_data = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 40
};

var edb;

var privKey = test_data.chain_data.priv_validator.priv_key[1];
var compiled = "6060604052608f8060116000396000f30060606040523615600d57600d565b608d5b7f68616861000000000000000000000000000000000000000000000000000000007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f88c4f556fdc50387ec6b6fc4e8250fecc56ff50e873df06dadeeb84c0287ca9060016040518082815260200191505060405180910390a35b565b00";
var input = "";
var address;

var serverServerURL = "http://localhost:1337/server";

describe('HttpCreateAndSolidityEvent', function () {

    // Not ideal, we just deploy the contract and go.
    before(function (done) {
        util.getNewErisServer(serverServerURL, requestData, function (error, port) {
            edb = edbModule.createInstance("http://localhost:" + port + '/rpc');
            done();
        });
    });

    it("should subscribe to a solidity event", function (done) {
        this.timeout(8000);

        var expected = {
            address: '0000000000000000000000009FC1ECFCAE2A554D4D1A000D0D80F748E66359E3',
            topics: ['88C4F556FDC50387EC6B6FC4E8250FECC56FF50E873DF06DADEEB84C0287CA90',
                'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
                '6861686100000000000000000000000000000000000000000000000000000000'],
            data: '0000000000000000000000000000000000000000000000000000000000000001',
            height: 1
        };

        edb.txs().transactAndHold(privKey, "", compiled, 1000000, 0, null, function (error, data) {
                asrt.ifError(error);
                address = data.call_data.callee;

                edb.events().subLogEvent(address, function (error, event) {
                    asrt.deepEqual(event, expected, "Event data does not match expected.");
                    done();
                });

                edb.txs().call("", address, input, function (error, data) {
                    asrt.ifError(error);
                });
            }
        );

    });

});