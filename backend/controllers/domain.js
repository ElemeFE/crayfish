const authorize = require('../lib/authorize');

module.exports = class {
  static url = '/domains/:domain';

  static async getKeysByDomain(ctx) {
    let { domain } = ctx.params;
    let result = await ctx.sql('                                                                                                   \
      SELECT `id`, `domain`, `path`, `name`, `comment`, `value`, `type`, `create_by`, `create_at`, `update_at`, `publish_at`       \
        FROM `keys` WHERE `is_delete` = 0 AND `domain` = ?                                                                         \
    ', [domain]);
    result.forEach(item => {
      try { item.value = JSON.parse(item.value); } catch(error) {}
    });
    return result;
  }

  @authorize(['EDIT'])
  static async get(ctx) {
    ctx.body = await this.getKeysByDomain(ctx);
  }

  @authorize(['CHANGE'])
  static async post(ctx) {
    let { domain } = ctx.params;
    let { path = '', name = '', comment = '', value = '', type = 1 } = ctx.request.body;
    path = path.trim();
    name = name.trim();
    if (!path) throw { status: 400, name: 'ERROR_PARAMS', message: 'Path 不能为空' };
    if (path[0] !== '/') throw { status: 400, name: 'ERROR_PARAMS', message: 'Path 必须以「/」开头' };
    if (/\/\.*(\/|$)/.test(path)) throw { status: 400, name: 'ERROR_PARAMS', message: 'Path 的每个部分不能为空或者只有「.」' };
    if (!name) throw { status: 400, name: 'ERROR_PARAMS', message: 'Name 不能为空' };
    value = JSON.stringify(value);
    if (value.length > 10240) throw { status: 400, message: 'Value 不能大于 10240 个字符', name: 'VALUE_TOO_LONG' };

    await ctx.sql.commit(async () => {

      let keys = await ctx.sql(
        'SELECT 1 FROM `keys` WHERE `is_delete` = 0 AND `domain` = ? AND `path` = ? AND `name` = ? FOR UPDATE',
        [ domain, path, name ]
      );
      if (keys.length) throw { status: 400, name: 'DUP', message: '记录已存在' };

      await ctx.sql(
        'INSERT INTO `keys` (`domain`, `path`, `name`, `comment`, `value`, `type`, `create_by`) VALUES (?)',
        [ [ domain, path, name, comment, value, type, ctx.user.id ] ]
      );
      await ctx.sql(
        'INSERT INTO `changelog` (`key_id`, `value`, `create_by`) VALUES (LAST_INSERT_ID(), ?, ?)', 
        [ value, ctx.user.id ]
      );

    });

    ctx.status = 204;
    ctx.body = '';
  }

  @authorize(['ADMIN'])
  static async delete(ctx) {
    let { domain } = ctx.params;
    let list = await this.getKeysByDomain(ctx);
    if (list.length) throw { status: 400, name: 'NOT_NULL', message: '请先删除该域名下的所有数据后再删除域名' };
    try {
      await ctx.sql.commit('DELETE FROM `domains` WHERE `domain` = ?', [ domain ]);
      ctx.status = 204;
      ctx.body = '';
    } catch (error) {
      throw error;
    }
  }

};
