const users = require('../users');
const _ = require('lodash');

const getUserByCtx = ctx => {
  let access_token = ctx.cookies.get('COFFEE_TOKEN');
  return users[0]
};

const decorator = (permissions) => {
  return function(base, name, desc) {
    let value = desc.value;
    desc.value = function(ctx, next) {
      let user = ctx.user = getUserByCtx(ctx);
      if (permissions && permissions.length && _.intersection(permissions, user.permissions).length < 0) {
        throw { status: 403, message: '并没有相应的权限', name: 'PERMISSION_FORBIDDEN' };
      }
      let isAdmin = user.permissions.indexOf('ADMIN') >= 0;
      if (isAdmin) {
        ctx.user.hasDomain = (domain) => true;
      } else {
        let myDomains = user.domains
        ctx.user.hasDomain = (domain) => user.permissions.indexOf('ADMIN') >= 0 || user.domains.indexOf(domain) >= 0;
      }
      if (ctx.params.domain && !ctx.user.hasDomain(ctx.params.domain)) {
        throw { status: 403, message: '并没有该域名的权限', name: 'DOMAIN_FORBIDDEN' };
      }
      return value.call(this, ctx, next);
    };
  };
};

module.exports = decorator;
