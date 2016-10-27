const authorize = require('../lib/authorize');

module.exports = class {
  static url = '/domains';

  @authorize()
  static async get(ctx) {
    let result = await ctx.sql('SELECT `id`, `domain`, `create_by`, `update_at`, `create_at` FROM `domains`');
    result = result.filter(item => ctx.user.hasDomain(item.domain));
    ctx.body = JSON.stringify(result);
  }

  @authorize(['ADMIN'])
  static async post(ctx) {
    console.log('dddd');
    let { domain } = ctx.request.body;
    try {
      await ctx.sql.commit({
        'INSERT INTO `domains` (`domain`, `create_by`) VALUES (?)': [ [ domain, ctx.user.id ] ]
      });
      ctx.status = 204;
      ctx.body = '';
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 400, name: 'DUP', message: '记录已存在' };
      }
    }
  }

};
