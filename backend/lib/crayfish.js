const send = require('koa-send');
const path = require('path');
const config = require('../config');

module.exports = async (ctx, next) => {
  if (ctx.path.startsWith('/crayfish')) {
    let filePath = ctx.path.replace(/^\/crayfish/, '');
    // console.log(this.response);
    await send(ctx, filePath, { root: config.publishMockRoot });
    ctx.set('Content-Type', 'text/plain');
  } else {
    await next();
  }
};