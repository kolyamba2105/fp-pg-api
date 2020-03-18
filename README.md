## fp-pg-api
A simple project for learning purposes only.

### Prerequisites
- Install [Docker](https://www.docker.com/products/docker-desktop)

### `Docker` development environment setup
- In `docker-compose.yml` file set environment variables for `app` and `postgres` services.
- Run `docker-compose up` command to run this project.
- Docker will restart `app` container whenever you make changes to any files in `src` directory.
- To store data from database, create directory somewhere on your computer and specify it's path in `postgres -> volumes` as `path/on/your/computer`:`/var/lib/postgresql/data`.

### `Local` development environment setup
- You can run this project directly on your machine, if you have `Node.js 12.x` and `Postgres` installed.
- Start `Postgres` service.
- Create `.env` file in the root of the project directory and set corresponding environment variables (such as in `docker-compose.yml -> services -> app -> environment`).
- Run `yarn start`.
