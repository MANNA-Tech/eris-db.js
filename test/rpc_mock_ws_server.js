/* This file is for testing RPC methods.
 */

var util = require('../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../lib/index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var testData = require('./testdata/testdata_mock.json');
var template = require('./mock/test_template');

var handlers = template.getHandlers(testData);
var port = 1337;
var MockWebsocketServer = require('./mock/mock_ws_server');
var server = new MockWebsocketServer(port, handlers);

var tests;

describe("eris-db", function () {

    edbModule.open("localhost").then(function (edb) {
        describe("tests with mock rpc server over websocket", function () {
            tests = template.getTests(edb, testData);

            tests.forEach(function (test) {
                it("should call " + test[0] + " successfully.", function (done) {
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
    });

    it("should trick Mocha into not quitting before the dynamic tests are defined.", function () {});
});

// Expected is the expected data. done is the mocha done-function.
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