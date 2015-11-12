'use strict';

var
  assert = require('assert'),
  erisDb = require('../../../lib/index');

describe("name registry", function () {
  it("should set and get an item", function (done) {
    this.timeout(30 * 1000);

    require('../createDb')().spread(function (ipAddress, privateKey) {
      erisDb.open(ipAddress, {privateKey: privateKey}).then(function (db) {
        // Wait 2 seconds for the value to be set before getting it.
        db.nameRegistry.setItem("key", "value").delay(2000).then(function () {
          db.nameRegistry.getItem("key").then(function (storedValue) {
            assert.equal(storedValue, "value");
            db.close().then(done);
          });
        });
      });
    });
  });
});
