/* This file is for testing an event.
 */

var util = require('../../../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../../../index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var test_data = require('./../../testdata/testdata.json');

var edb;
var eventSub;

describe('TheloniousWebSocketEvents', function () {

    before(function (done) {
              this.timeout(30 * 1000);

        require('../createDb')().spread(function (ipAddress, privateKey) {
            edb = edbModule.createInstance("ws://" + ipAddress + ':1337/socketrpc', true);
            edb.start(function(err){
                if (err){
                    throw new Error(err);
                }
                done();
            });

        })
    });

    describe('.events', function () {

        describe('#subNewBlock', function () {
            it("should subscribe to new block events", function (done) {
                this.timeout(6000);
                edb.events().subNewBlocks(function (err, data) {
                    asrt.ifError(err, "New block subscription error.");
                    eventSub = data;
                    setTimeout(function () {
                        data.stop(function () {
                            throw new Error("No data came in.");
                        })
                    }, 20000);

                }, function(err, data){
                    if(data){
                        eventSub.stop(function(){});
                        done();
                    }
                });
            });
        });

    });
});