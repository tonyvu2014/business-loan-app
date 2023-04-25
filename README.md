# Description

Business Loan Application App Suite. The suite includes the following app:

- frontend: Frontend app built with ReactJS
- backend: Backend API app built with NestJS
- accounting-app: A simulator of a third-party accounting provider app which is used to fetch balance sheet. This simulator will return a random balance sheet's numbers.
- decision-engine-app: A simulator of a third-party decision engine app which is used to make the final loan application outcome. This simulator will return outcome as random.
- a database (MySQL is used) for storing accounting providers and loan application data.

The app allow business to apply for loan, retrieve company's balance sheet from a third-party accounting provider, review and submit the loan application. It then compute the profit or loss by year summary and a preassessment value based on rules as follows:

- If a business has made a profit in the last 12 months. The final value to be sent with a field "preAssessment": "60" which means the Loan is favored to be approved 60% of the requested value. If the average asset value across 12 months is greater than the loan amount then "preAssessment": "100"
- Default value to be used 20

The preassessment value will be sent to a third-party decision engine for the final outcome. The logic for application summarization and preAssessment value computation is in [AccountingService](/backend/src/accounting/accounting.service.ts)
The third-party decision engine will response with either approving or rejecting the loan.

## Run the apps locally

- To setup and run the backend API: please refer to [this](backend/README.md)
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
- Add e2e tests
