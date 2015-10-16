'use strict';

var
  assert = require('assert'),
  erisDb = require('../../../lib/index'),
  Promise = require('bluebird');

describe("name registry", function () {
  it("should set and get an item", function (done) {
    this.timeout(30 * 1000);

    require('../createDb')().spread(function (ipAddress, privateKey) {
      erisDb(ipAddress, {privateKey: privateKey}).then(function (db) {
        db.nameRegistry.setItem("key", "value").then(function () {
          db.nameRegistry.getItem("key").then(function (storedValue) {
            assert.equal(storedValue, "value");
            done();
          });
        });
      });
    });
  });
});
