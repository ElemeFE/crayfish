const koa = new (require('koa'))();

koa.use(require('koa-bodyparser')());
koa.use(require('./lib/errorlog'));
koa.use(require('./lib/crayfish'));
koa.use(require('./lib/api'));
koa.use(require('koa-static')('../frontend/dist'));

koa.listen(8100);