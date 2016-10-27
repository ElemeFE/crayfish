const authorize = require('../lib/authorize');

module.exports = class {
  static url = '/user';

  @authorize([
    'EDIT',
    'CHANGE',
    'PUBLISH',
    'ADMIN'
  ])
  static async get(ctx) {
    ctx.body = ctx.user;
  }

};
