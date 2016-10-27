node_modules: package.json
	@npm install

init-database:
	@cat schemes.sql | mysql -uroot crayfish

run:
	@                                                                       \
	lsof -i:8100 -sTCP:LISTEN | awk 'NR>1{print $$2}' | xargs kill -9;      \
        babel-node app.js -r 0;                                                 \

dev: node_modules
	@nodemon --exec make run