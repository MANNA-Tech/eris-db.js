/**
 * @file index.js
 * @fileOverview Index file for the eris-db javascript API. This file contains a factory method
 * for creating a new <tt>ErisDB</tt> instance.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module index
 */
'use strict';

var erisdb = require('./erisdb'),
  Promise = require('bluebird');

var validation = require('./validation');
var WebSocketClient = require('./rpc/websocket');
var HTTPClient = require('./rpc/http');
var clients = require('./rpc/clients');
var url = require('url');

/**
 * A function which takes the IP address of an ErisDB server and returns an object for communicating with it.
 *
 * @param {string} ipAddress the IP address of the ErisDB server
 * @param {Object} [options]
 * @param {string} options.privateKey a private key for signing transactions
 * @returns {Promise<module:erisdb-ErisDB>}
 */
module.exports = function (ipAddress, options) {
  var
    client, validator, db;

  options = options || {};
  client = options.client || new WebSocketClient('http://' + ipAddress + ':1337/socketrpc');
  Promise.promisifyAll(client);
  validator = new validation.SinglePolicyValidator(true);
  db = erisdb.createInstance(client, validator, options.privateKey);
  Promise.promisifyAll(db);
  return db.startAsync();
};

module.exports.clients = clients;
