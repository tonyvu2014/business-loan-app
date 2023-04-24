## Description

Business Loan Application API buit with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Prerequisites

- node v18
- npm
- mysql v5.7
- docker
- docker-compose

## Setup the database locally

- Create a new database and new user who has all privileges on the database.
- Initilize the database by running the 2 scripts: `ddl.sql` and `seed.sql` in the the [database](database) folder in that order.

## Set environment variables for local

- Create a `.env` in the project root folder
- Copy the content of `.env.example` to `.env` file
- Add the values for the environment variables

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Add a new accounting provider

- Add the new accounting provider name to the database table `accounting_provider`
- Add in the integration for the new accounting provider in the folder [src/accounting/providers](src/accounting/providers/)
- Modify the [AccoutingService](src/accounting/accounting.service.ts) `getProviderExecutor` method to include the executor for the new accounting provider

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
