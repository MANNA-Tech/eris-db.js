/* This file is for testing RPC methods using a mock client.
 */
var asrt;

if (typeof(window) === "undefined") {
    asrt = require('assert');
} else {
    asrt = assert;
}

var testData = require('./testdata/testdata_mock.json');
var template = require('./mock/test_template');
var MockTwcClient = require('./mock/mock_twc_client');
var erisdbFactory = require('../lib/index');


var handlers = template.getHandlers(testData);
var client = new MockTwcClient(handlers);

describe('eris-db', function () {

    describe("tests with mock rpc two-way client", function () {
      erisdbFactory.open(null, {client: client}).then(function (edb) {
        var tests = template.getTests(edb, testData);

        tests.forEach(function (test) {
            it("should call " + test[0] + " succesfully.", function (done) {
              var
                data, expected;

                var f = test[1];
                data = testData[test[0]];
                expected = data.expected === undefined ? data.output : data.expected;
                if (test.length > 2) {
                    var args = test.slice(2);
                    args.push(check(expected, done));
                    f.apply(this, args);
                } else {
                    f(check(expected, done));
                }
            });
        });
      });

      it("should trick Mocha into not quitting before the dynamic tests are defined.", function () {});
    });

});

// Expected is the expected data. done is the mocha done-function, modifiers are
// used to overwrite fields in the return-data that should not be included in the
// tests (like certain timestamps for example).
function check(expected, done) {
    return function (error, data) {
        if (error) {
            console.log(error);
        }
        try {
          asrt.ifError(error, "Failed to call rpc method.");
          asrt.deepEqual(data, expected);
          done();
        }
        catch (exception) {
          done(exception);
        }
    };
}