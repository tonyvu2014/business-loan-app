# Description

Business Loan Application App Suite. The suite includes the following app:

- frontend: Frontend app built with ReactJS
- backend: Backend API app built with NestJS
- accounting-app: A simulator of a third-party accounting provider app which is used to fetch balance sheet. This simulator will return a random balance sheet's numbers.
- decision-engine-app: A simulator of a third-party decision engine app which is used to make the final loan application outcome. This simulator will return outcome as random.

The app allow business to apply for loan, retrieve company's balance sheet from a third-party accounting provider, review and submit the loan application. A third-party decision engine will response with either approving or rejecting the loan.

## Run the apps locally

- To setup run the backend API: please refer to [this](backend/README.md)
- To setup and run frontend app: please refer to [this](frontend/README.md)

## Run with docker-compose

Make sure that the folder ./mysql does not exist before running this command. If it exists, please delete first.

```bash
$ docker-compose up
```

Then access the frontend app from `http://localhost`

## Termination of apps

```bash
$ docker-compose down
```

## Add a new accounting provider

- Add the new accounting provider name to the database table `accounting_provider`
- Add in the integration for the new accounting provider in the folder [backend/src/accounting/providers](backend/src/accounting/providers/)
- Modify the [AccoutingService](backend/src/accounting/accounting.service.ts) `getProviderExecutor` method to include the executor for the new accounting provider

## View Swagger API documentation

To view the Swagger API documentation, go to `http://localhost:5000`

## Production build

In order to build the backend and frontend for production. Make sure to set the correct environment variables. The backend's environment variables should point to the production DB, production accounting providers' urls and production decision engine's url.

## Areas for improvement

- Add authentication for all API endpoints
- Loan application form should usually include more business information like address, industry,...
- Validation of ABN number
