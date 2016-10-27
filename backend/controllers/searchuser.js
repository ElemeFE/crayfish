const authorize = require('../lib/authorize');
const users = require('../users'); 

module.exports = class {
  static url = '/searchuser';

  @authorize(['ADMIN'])
  static async get(ctx) {
    ctx.body = users;
  }

};
