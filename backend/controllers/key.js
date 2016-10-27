const authorize = require('../lib/authorize');

module.exports = class {
  static url = '/domains/:domain/:id';

  @authorize([ 'CHANGE' ])
  static async delete(ctx) {
    let { id, domain } = ctx.params;
    await ctx.sql.commit('UPDATE `keys` SET `is_delete` = 1 WHERE `id` = ?', [ id ]);
    ctx.status = 204;
    ctx.body = '';
  }

  @authorize([ 'EDIT' ])
  static async get(ctx) {
    let { id } = ctx.params;
    let result = await ctx.sql('                                                                                \
      SELECT `id`, `domain`, `path`, `name`, `comment`, `value`, `type`, `create_by`, `create_at`               \
        FROM `keys` WHERE `id` = ? AND `is_delete` = 0                                                          \
    ', [ id ]);
    let key = result[0];
    if (!key) throw { status: 404, name: 'KEY_NOT_FOUND', message: 'key is not found' };
    try { key.value = JSON.parse(key.value); } catch(error) {};
    ctx.body = key;
  }

  @authorize([ 'EDIT' ])
  static async patch(ctx) {
    let { id } = ctx.params;
    let { body } = ctx.request;
    let change = Object.create(null);
    let count = [ 'value', 'comment' ].reduce((count, name) => {
      if (!(name in body)) return count;
      change[name] = body[name];
      return count + 1;
    }, 0);
    if (count === 0) throw { status: 400, name: 'ERR', message: 'require `value` or/and `comment` in request body' };
    if ('value' in change) {
      change.value = JSON.stringify(change.value);
      if (change.value.length > 10240) throw {
        status: 400,
        message: 'Value 不能大于 10240 个字符',
        name: 'VALUE_TOO_LONG'
      };
    }
    await ctx.sql.commit(async () => {
      let [ key ] = await ctx.sql('SELECT `is_delete`, `value` FROM `keys` WHERE `id` = ?', [ id ]);
      if (!key || key.is_delete) throw { status: 404, name: 'KEY_NOT_FOUND', message: 'key is not found' };
      await ctx.sql('UPDATE `keys` SET ? WHERE `id` = ?', [ change, id ]);
      if (key.value !== change.value) {
        await ctx.sql(
          'INSERT INTO `changelog` (`key_id`, `value`, `create_by`) VALUES (?)',
          [ [ id, change.value, ctx.user.id ] ]
        );
      }
    });
    ctx.status = 204;
    ctx.body = '';
  }

};
