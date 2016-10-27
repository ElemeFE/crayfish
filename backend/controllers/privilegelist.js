const authorize = require('../lib/authorize');
const createby = require('../lib/createby.js');
const users = require('../users');

module.exports = class {
  static url = '/privilege/:domain';

  @authorize([ 'ADMIN' ])
  static async get(ctx) {
    let { domain } = ctx.params;
    let result = await ctx.sql('SELECT `id`, `user_id`, `create_at` FROM `privilege` WHERE `domain` = ?', [ domain ]);
    await createby(result);
    ctx.body = JSON.stringify(result);
  }

  @authorize([ 'ADMIN' ])
  static async post(ctx) {
    let { domain } = ctx.params;
    let { name } = ctx.request.body;
    let user = users.find((user) => user.name === name);
    if (!user) throw { status: 400, name: 'EMAIL_NOT_FOUND', message: '用户不存在' };
    try {
      await ctx.sql.commit({
        'INSERT INTO `privilege` (`domain`, `user_id`, `create_by`) VALUES (?)': [ [ domain, user.id, ctx.user.id ] ]
      });
      ctx.body = null;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 400, name: 'DUP', message: '记录已存在' };
      }
    }
  }

};
