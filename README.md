# Description

Business Loan Application App Suite. The suite includes the following app:

- frontend: Frontend app built with ReactJS
- backend: Backend API app built with NestJS

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
