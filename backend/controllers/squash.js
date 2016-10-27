const authorize = require('../lib/authorize');

module.exports = class {
  static url = '/squash/:domain';

  static squash(list) {
    // Build result map
    let result = Object.create(null);
    list.forEach(({ path, name, value, publish_at, update_at }) => {
      if (!(path in result)) result[path] = { path, value: {}, updateAt: new Date(0), publishAt: new Date(0) };
      let obj = result[path];
      if (update_at > obj.updateAt) obj.updateAt = update_at;
      if (publish_at > obj.publishAt) obj.publishAt = publish_at;
      try {
        obj.value[name] = JSON.parse(value);
      } catch (error) {
        obj.value[name] = value;
      }
    });
    return Object.keys(result).reduce((reciever, path) => {
      reciever.push(result[path]);
      return reciever;
    }, []);
  }

  @authorize([])
  static async get(ctx) {
    let { domain } = ctx.params;
    let list = await ctx.sql('                                                                  \
      SELECT `path`, `name`, `value`, `publish_at`, `update_at` FROM `keys` WHERE `is_delete` = 0 AND `domain` = ?         \
    ', [ domain ]);
    ctx.body = this.squash(list);
  }

};
