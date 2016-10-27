##### node

sudo yum install npm
sudo npm install npm -g
sudo n 5.5.0
sudo ln -fs $(n bin 5.5.0) $(which node)

##### babel

sudo npm install babel@5.8.38 -g --registry=https://registry.npm.taobao.org
sudo ln -fs $(sudo npm bin -g 2>/dev/null)/babel-node /usr/bin/babel-node

##### supervisor

sudo echo '[program:crayfish]
command=babel-node --stage 1 /data/fe.crayfish/backend/app.js
directory=/data/fe.crayfish/backend
autostart=true
autorestart=true
stderr_logfile=/data/log/supervisor/fe.crayfish-error.log
stdout_logfile=/data/log/supervisor/fe.crayfish-out.log
environment=BABEL_CACHE_PATH=/tmp/babel-cache
stopasgroup=true
killasgroup=true
user=www-data
' > /etc/supervisord.d/crayfish.ini

sudo supervisorctl reread
sudo supervisorctl update

##### nginx

sudo yum install nginx

sudo echo 'server {
    listen crayfish.alpha.elenet.me:80;
    location / {
        proxy_pass http://127.0.0.1:8100;
    }
}
' > /etc/nginx/conf.d/crayfish.conf

sudo nginx -s reload
