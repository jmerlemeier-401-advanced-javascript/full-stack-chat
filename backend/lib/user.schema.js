'use strict';

const uuid = require('uuid/v4');

/**
 * Creates a message object for in memory storage
 * @param {String} text - message contents
 */

class Message {
  constructor (text) {
    this.id = uuid();
    this.text = text;
    this.created_at = new Date();
  }
}

module.exports = Message;