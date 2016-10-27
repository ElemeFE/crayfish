const authorize = require('../lib/authorize');

module.exports = class {
  static url = '/privilege/:domain/:id';

  @authorize([ 'ADMIN' ])
  static async delete(ctx) {
    let { domain, id } = ctx.params;
    await ctx.sql.commit({ 'DELETE FROM `privilege` WHERE `id` = ?': [ id ] });
    ctx.body = null;
  }

};
