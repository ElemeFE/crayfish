const authorize = require('../lib/authorize');
const createby = require('../lib/createby.js');

module.exports = class {
  static url = '/changelog/:keyId';

  @authorize([ 'EDIT' ])
  static async get(ctx) {
    let { keyId } = ctx.params;
    let [ key ] = await ctx.sql('SELECT `is_delete` FROM `keys` WHERE `id` = ?', [ keyId ]);
    if (!key || key.is_delete) throw { status: 404, name: 'KEY_NOT_FOUND', message: 'key is not found' };
    let result = await ctx.sql('                                                \
      SELECT value, create_at, create_by                                        \
        FROM `changelog`                                                        \
        WHERE `key_id` = ?                                                      \
        ORDER BY `create_at` DESC                                               \
        LIMIT 30                                                                \
    ', [ keyId ]);

    await createby(result);

    result.forEach(item => {
      try { item.value = JSON.parse(item.value); } catch(error) {};
    });

    ctx.body = result;
  }

};
