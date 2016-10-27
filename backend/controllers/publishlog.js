const authorize = require('../lib/authorize');
const createby = require('../lib/createby.js');

module.exports = class {

  static url = '/publishlog/:domain';

  @authorize(['EDIT'])
  static async get(ctx) {
    let { domain } = ctx.params;
    let result = await ctx.sql('                                                \
      SELECT `id`, `domain`, `create_by`, `create_at`                           \
      FROM `publishlog`                                                         \
      WHERE `domain` = ?                                                        \
      ORDER BY `create_at` DESC                                                 \
      LIMIT 20                                                                  \
    ', [ domain ]);
    await createby(result);
    ctx.body = result;
  }

};
