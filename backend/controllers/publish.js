const authorize = require('../lib/authorize');
const storage = require('../lib/storage');
const squash = require('./squash').squash;

const publishProviders = [storage];

module.exports = class {
  static url = '/cdn/:domain/publish';

  static escape(str) {
    return str.replace(/\u2028/g, '\\u2028')
              .replace(/\u2029/g, '\\u2029')
              .replace(/<\/script>/g, '<\\/script>');
  }

  static log(ctx, list) {
    // Save to publishlog, Ignore publishing error
    return ctx.sql.commit(async () => {
      let { insertId: publishId } = await ctx.sql(
        'INSERT INTO `publishlog` (`domain`, `create_by`) VALUES (?)',
        [ [ ctx.params.domain, ctx.user.id ] ]
      );
      let publishedData = list.map(({ path, name, value }) => [ publishId, path, name, value ]);
      await ctx.sql('INSERT INTO `publishdata` (`publish_id`, `path`, `name`, `value`) VALUES ?', [ publishedData ]);
    });
  }

  static async pushToCDN(domain, squashedList) {
    let contents = [
      // JS format
      ...squashedList.map(({ path, value }) => {
        let key = domain + path;
        let contents = this.escape(JSON.stringify(value));
        contents = `var crayfish=${contents};`;
        let mime = 'application/javascript; charset=utf-8';
        return { key, contents, mime };
      }),
      // JS format with ref support
      ...squashedList.map(({ path, value }) => {
        let key = domain + '@ref' + path;
        let contents = this.escape(JSON.stringify(value));
        contents = `!function(){var t,e=document.currentScript||function(){var t=document.getElementsByTagName("script");return t.length?t[t.length-1]:void 0}();e&&(t=e.getAttribute("data-ref")),window[t||"crayfish"]=${contents}}();`;
        let mime = 'application/javascript; charset=utf-8';
        return { key, contents, mime };
      }),
      // JSON format
      ...squashedList.map(({ path, value }) => {
        let key = domain + '@json' + path;
        let contents = JSON.stringify(value);
        let mime = 'application/json';
        return { key, contents, mime };
      })
    ];
    let tasks = contents.map(({ key, contents, mime }) =>
      Promise.all(publishProviders.map(provider => provider.put(key, contents, mime))));
    let responses = await Promise.all(tasks);
  }

  static async publish(ctx, domain, list) {
    let $log = this.log(ctx, list);
    let result = ctx.sql.commit(async () => {
      let result = await this.pushToCDN(domain, squash(list));
      await ctx.sql('                                                   \
        UPDATE `keys` SET `publish_at` = CURRENT_TIMESTAMP              \
        WHERE `is_delete` = 0 AND `domain` = ? AND `path` IN (?)        \
      ', [ domain, ctx.request.body ]);
      return result;
    });
    await $log;
    return result;
  }

  @authorize([ 'PUBLISH' ])
  static async post(ctx) {
    let { domain } = ctx.params;
    if (!(ctx.request.body instanceof Array)) throw { status: 400, message: '需要一个数组' };
    if (ctx.request.body.length === 0) throw { status: 400, message: '请选择要发布的路径' };
    let list = await ctx.sql('                                                                                  \
      SELECT `path`, `name`, `value` FROM `keys` WHERE `is_delete` = 0 AND `domain` = ? AND `path` IN (?)       \
    ', [ domain, ctx.request.body ]);
    ctx.body = await this.publish(ctx, domain, list);
  }

};
