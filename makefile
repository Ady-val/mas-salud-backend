PROJECT_NAME=mas_salud
DB_CONTAINER_NAME=mas_salud_postgres
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=mas_salud

.PHONY: up down logs

up:
	docker run --name $(DB_CONTAINER_NAME) \
	-e POSTGRES_USER=$(DB_USER) \
	-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
	-e POSTGRES_DB=$(DB_NAME) \
	-p $(DB_PORT):5432 \
	-v "$(PWD)/docker/postgres:/docker-entrypoint-initdb.d" \
	-d postgres:15

down:
	docker stop $(DB_CONTAINER_NAME) && docker rm $(DB_CONTAINER_NAME)

logs:
	docker logs -f $(DB_CONTAINER_NAME)
