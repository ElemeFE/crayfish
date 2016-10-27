const authorize = require('../lib/authorize');

const PublishController = require('./publish');

module.exports = class {
  static url = '/publishlog/:domain/:id/republish';

  @authorize(['PUBLISH'])
  static async post(ctx) {
    let { id } = ctx.params;
    let publishlog = await ctx.sql('SELECT `domain` FROM `publishlog` WHERE `id` = ?', [ id ]);
    if (!publishlog.length) throw { status: 404, name: 'NOT_FOUND', message: '无效的发布 id' };
    let { domain } = ctx.params;
    if (publishlog[0].domain !== domain) throw { status: 400, name: 'DOMAIN_NOT_MATCH', message: '域名不匹配' };
    let list = await ctx.sql('SELECT `path`, `name`, `value` FROM `publishdata` WHERE `publish_id` = ?', [ id ]);
    console.log(list);
    ctx.body = await PublishController.publish(ctx, domain, list);
  }

};