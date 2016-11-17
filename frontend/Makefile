############################## Global Definations ##############################

.PHONY: dist

default: help

.help:
	@echo "# common tasks"
	@echo "$$ [35mmake[0m                            # help"
	@echo "$$ [35mmake install[0m                    # install dependencies"
	@echo "$$ [35mmake build[0m                      # build only"
	@echo "$$ [35mmake build as dist[0m              # build as dist"
	@echo "$$ [35mmake dev[0m                        # build and watch"
	@echo "$$ [35mmake lint[0m                       # check coding style"
	@echo ""


# require finite@~1.0.24
include $(shell test -x "$$(which finite)" || sudo npm install finite -g > /dev/null; finite lib)



############################## Dependencies ##############################

install: global-dependencies $(if $(fucking),cache-clean,) node_modules

############################## Unit Loader ##############################

babel := $(abspath ./node_modules/.bin/babel) -e 1

.js.loader := $(babel)
.html.loader := $(wildcard)



############################## Building Tools ##############################

.build-static:
	@echo "[1mBuild[0m static files ... \c"
	@rsync -Laz src/* dist --exclude '*.php' --exclude '.*'
	@echo "[32mOK[0m"

.build-html:
	@echo "[1mBuild[0m html files ... \c"
	@$(wildcard) 'dist/**/*.html'
	@echo "[32m OK[0m"

.build-js:
	@echo "[1mbuild[0m js files ... \c"
	@echo "[35m$$($(babel) src -d dist | wc -l | awk '{print $$1}')[32m files generated[0m"

.dist: usemin rev

.link:
	@cd dist && ln -s index/index.html
	@ln -s '.' dist/dist

build: clean install $(if $(dist),lint,) php .build-static .build-html .build-js $(if $(dist),.dist,) .link

dev: install build watch
