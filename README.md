# FIB (First Iraqi Bank)'s payment SDK

A Node.js SDK for First Iraqi Bank's online payment.

[![kurdi-dev - fib-sdk](https://img.shields.io/static/v1?label=kurdi-dev&message=fib-sdk&color=blue&logo=github)](https://github.com/kurdi-dev/fib-sdk 'Go to GitHub repo')
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md 'Go to contributions doc')
[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org 'Go to Node.js homepage')
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://typescriptlang.org 'Go to TypeScript homepage')

## Features

- Authentication: Authentication of the user and the credentials you were given, and giving you a token for your future requests.
- Payment Creation: Used to create a payment and getting QR codes and dynamic links to forward the user to the payment screen.
- Checking payment status: Used to check the status of a payment.
- Payment Cancellation: Used to cancel an active payment that has not been paid yet.

All methods use promise meaning you can either use the `async...await` or `then...catch` or `try...catch`

## Installation

For Yarn

```bash
yarn add fib-sdk
```

For NPM

```bash
npm install fib-sdk --save
```

## Usage

### ES Modules

```ts
import { Fib } from 'fib-sdk';
const fib = new Fib();
```

### CommonJS

```js
const Fib = require('fib-sdk').Fib;
const fib = new Fib();
```

OR

```js
const { Fib } = require('fib-sdk');
const fib = new Fib();
```

## Authentication

Authenticating with FIB using client_id and client_secret that you have received from FIB

```ts
await fib.authenticate(clientId:string, clientSecret:string);
```

You can get `status` and `accessToken` information from the payment instance, for example after successful authentication the Fib instance status field should equal `READY`

```js
let status = fib.status; // PENDING | INITIATED | READY | FAILED
```

### Create a payment instance

After creating a Fib instance and authenticating, you can create a payment instance by calling the `create()` method from the payment instance, this will return the API request's response object, you can create a payment like this:

```js
const payment = fib.payment
const paymentResponse = await payment.create({
  // Payment value and currency
  monetaryValue: {
    // the amount of the payment.
    amount: number,
     //  the currency of the payment; currently only IQD is supported currently.
    currency: 'IQD' | 'USD',
  },
   // The callback url that FIB will send a POST request to when status of the created payment changes.
   // Callback URL should be able to handle POST requests with request body that contains two properties:
   // id : this will be the payment id.
   // status : this will be the payment status.
  statusCallbackUrl?: string,
   // Description of the payment to help your customer to identify it in the FIB app, with the maximum length of 50 characters.
  description?: string,
  })
```

Example of a payment response data:

```js
paymentResponse.data = {

  // A unique identifier of the payment.
  paymentId: string,

  // Expected values are: PAID | UNPAID | DECLINED.
  status: string,

  // an ISO-8601-formatted date-time string, representing a moment in time when the payment expires.
  validUntil: string,

  //a JSON object, containing two key-value pairs; the amount and currency of the payment.
  amount: {
    amount: number,
    currency: string,
  };

   // Expected Values are:
   // SERVER_FAILURE : Payment failure due to some internal error.
   // PAYMENT_EXPIRATION : Payment has expired.
   // PAYMENT_CANCELLATION : Payment canceled by the user.
  decliningReason?: string,

   // an ISO-8601-formatted date-time string, representing a moment in time when the payment is declined.
  declinedAt?: string,

   // a JSON object, containing two key-value pairs; the name and iban of the customer.
  paidBy?: {
    name: string;
    iban: string;
  },
}
```

You can also get the `paymentId`, `qrCode`, `readableCode`, `personalAppLink`, `businessAppLink`, `corporateAppLink`, `validUntil`, `amount`, `currency`, and `status` informations from payment instance:

```js
let paymentId = payment.paymentId;
let paymentStatus = payment.status; // NO_PAYMENT | PAID | UNPAID | DECLINED
```

## Getting payment status

you can fetch fresh information about your payment from the FIB's payment API service by calling the `getStatus()` method, the method returns the API request's response object, which will also updates the payment instance's fields data, for example:

```js
let paymentStatusResponse = await payment.geStatus();
```

Example of payment response data:

```js
paymentStatusResponse.data = {

  // A unique identifier of the payment.
  paymentId: string,

  // Expected values are: PAID | UNPAID | DECLINED.
  status: string,

  // an ISO-8601-formatted date-time string, representing a moment in time when the payment expires.
  validUntil: string,

  // a JSON object, containing two key-value pairs; the amount and currency of the payment.
  amount: {
    amount: number,
    currency: string,
  };

  // Expected Values are:
  // SERVER_FAILURE : Payment failure due to some internal error.
  // PAYMENT_EXPIRATION : Payment has expired.
  // PAYMENT_CANCELLATION : Payment canceled by the user.
  decliningReason?: string,

  // an ISO-8601-formatted date-time string, representing a moment in time when the payment is declined.
  declinedAt?: string,

  // a JSON object, containing two key-value pairs; the name and iban of the customer.
  paidBy?: {
    name: string,
    iban: string,
  }
}
```

## Canceling a payment

To cancel the payment, you can call the `cancel()` method with your payment instance and this will cancel the payment from FIB and change the status of the payment instance to `DECLINED`, the method returns a boolean value, it returns `true` if the cancelation was successful.

```js
let cancelPayment = payment.cancel(); // returns Boolean
```

## Develop and run Locally

Clone the project

```bash
  https://github.com/kurdi-dev/fib-sdk.git
```

Go to the project directory

```bash
  cd fib-sdk
```

Install dependencies

```bash
  npm install # or yarn install
```

to run the project use:

```bash
  npm start # or yarn start
```

This builds to /dist and runs the project in watch mode so any edits you save inside src causes a rebuild to /dist.

To do a one-off build, use:

```bash
npm run build # or yarn build
```

To run tests, use:

```bash
npm test # or yarn test
```

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of this library with `npm run size` and visualize the bundle with `npm run analyze`.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Contributions are always welcome!

## Report & Feedback

If any issues are found or you have any feedback, please reach out to me at [walid@kurdi.dev](mailto://walid@kurdi.dev)
