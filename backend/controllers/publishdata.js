const authorize = require('../lib/authorize');

module.exports = class {

  static url = '/publishdata/:id';

  @authorize(['EDIT'])
  static async get(ctx) {
    let { id } = ctx.params;
    let result = await ctx.sql('SELECT `path`, `name`, `value` FROM `publishdata` WHERE `publish_id` = ?', [ id ]);
    ctx.body = result;
  }

};
