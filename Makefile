build:
	@cd frontend && make install && make build as dist
	@cd backend && make node_modules && make init-database
