# fp-pg-api
A simple project for learning purposes only.

## Development environment setup
- `touch .env.local`
- `cp .env .env.local`
- Set all environment variables
- `yarn start`

If you want to run this app with `Docker`, then run `docker build -t your-image-name .` -> `docker run -it -p 3000:3000 -v $(pwd):/app  your-image-name`.

## CI/CD

Basic CI/CD pipeline is set in this project.
- `yarn test`, `yarn lint` and `yarn build` are run by GitHub Actions whenever a new `pull request` comes into `master` branch (check [this workflow](./.github/workflows/integrate.yml))
- app is deployed to `AWS Lambda` every time a new commit is pushed into master branch (check [this workflow](./.github/workflows/deploy.yml)). It uses a predefined [Serverless action](https://github.com/marketplace/actions/serverless)

## Slack integration

Whenever someting changes in this repo, a `Slack Notification` will be sent.
