const qiniu = require('qiniu');

Object.assign(qiniu.conf, require('../config.js').qiniu);
qiniu.conf.ACCESS_KEY = 'your qiniu access key';
qiniu.conf.SECRET_KEY = 'your qiniu secret key';

exports.put = (key, data, mime) => {
  let extra = new qiniu.io.PutExtra();
  extra.mimeType = mime;
  let token = new qiniu.rs.PutPolicy('your bucket' + ':' + key).token();
  return new Promise((resolve, reject) => {
    qiniu.io.put(token, key, data, extra, (err, ret) => err ? reject(err) : resolve(ret));
  }).catch(({ error }) => {
    throw { status: 500, message: error };
  });
};
