'use strict';

var
  assert = require('assert'),
  erisDb = require('../../../lib/index');

describe("blockchain", function () {
  it("should get blockchain info", function (done) {
    this.timeout(30 * 1000);

    require('../createDb')().spread(function (ipAddress) {
      erisDb.open(ipAddress).then(function (db) {
        db.blockchain.getInfo().then(function (info) {
          assert.equal(info.chain_id, 'blockchain');
          db.close().then(done);
        });
      });
    });
  });
});
