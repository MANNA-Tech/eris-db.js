/**
 * @file namereg.js
 * @fileOverview Factory module for the NameReg class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module namereg
 */

'use strict';

var
  Promise = require('bluebird');

var util = require('./util');
var nUtil = require('util');
var rpc = require('./rpc/rpc');

var COST_PER_BLOCK = 1;
var COST_PER_BYTE = 1;

/**
 * Create a new instance of the NameReg class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @param {module:events~Events} events - The events object.
 * @returns {NameReg} - A new instance of the NameReg class.
 */
exports.createInstance = function (client, unsafe, events, privateKey) {
    return new NameReg(client, unsafe, events, privateKey);
};

/**
 * NameReg is used to work with the name registry.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @param {module:events~Events} events - The events object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function NameReg(client, unsafe, events, privateKey) {
    util.UnsafeComponentBase.call(this, client, unsafe);
    this._events = events;
    this.privateKey = privateKey;
}

nUtil.inherits(NameReg, util.UnsafeComponentBase);

/**
 * Get a list of entries.
 *
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.getEntries = function (filter, callback) {
    var f, c;
    if(typeof(filter) === "function"){
        f = [];
        c = filter;
    } else if (!filter && typeof(callback) == "function") {
        f = [];
        c = callback;
    } else {
        if(!(filter instanceof Array)){
            f = [filter];
        } else {
            f = filter;
        }
        c = callback;
    }
    this._client.send(rpc.methodName("getNameRegEntries"), rpc.filtersParam(f), c);
};

/**
 * Get a list of all entries added from the given account.
 *
 * @param {string} accountAddress - the public address of the account.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
/* TODO put this in when tests has been made.
NameReg.prototype.getEntriesByAccount = function (accountAddress, callback) {
    var f = rpc.filterParam("owner", "==", accountAddress);
    this._client.send(rpc.methodName("getNameRegEntries"), rpc.filtersParam(f), callback);
};
*/

/**
 * Get an entry from its key.
 *
 * @param {string} key - The key of the entry.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.getItem = function (key) {
    if(!key || typeof(key) !== "string"){
        callback(new Error("'key' is not a non-empty string."));
        return;
    }

    return this._client.sendAsync(rpc.methodName("getNameRegEntry"), rpc.nameRegNameParam(key)).get('data');
};

/**
 * Transact to the name registry. The name registry is essentially a distributed key-value store that comes
 * with the client.
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} name - The key, or name.
 * @param {string} data - The data that should be stored.
 * @param {Object} [options]
 * @param {number} options.expiration - The amount of blocks until the data expires.
 */
NameReg.prototype.setItem = function (key, value, options) {
    var that = this,
      cost;

    options = options || {};

    // Temp solution.
    this._events.subNewBlocks(function(error){
        if(error){
            callback(error);
            return;
        }
    });

    cost = this.calculateCost(options.expiration === undefined ? 250 : options.expiration, value);
    return Promise.promisify(this._unsafe.transactNameReg, this._unsafe)(this.privateKey, key, value, cost, 0, null);
};

NameReg.prototype.calculateCost = function(numBlocks, data){
    return COST_PER_BLOCK*COST_PER_BYTE*(data.length + 32)*numBlocks;
};