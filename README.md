# FIB (First Iraqi Bank)'s payment SDK

A Node.js SDK for First Iraqi Bank's online payment.

[![kurdi-dev - fib-sdk](https://img.shields.io/static/v1?label=kurdi-dev&message=fib-sdk&color=blue&logo=github)](https://github.com/kurdi-dev/fib-sdk 'Go to GitHub repo')
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md 'Go to contributions doc')
[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org 'Go to Node.js homepage')
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://typescriptlang.org 'Go to TypeScript homepage')

![fib-banner](https://github.com/kurdi-dev/fib-sdk/blob/main/fib-banner.png?raw=true)

## Features

- Authentication: Authentication of the user and the credentials you were given, and giving you a token for your future requests.
- Payment Creation: Used to create a payment and getting QR codes and dynamic links to forward the user to the payment screen.
- Checking payment status: Used to check the status of a payment.
- Payment Cancellation: Used to cancel an active payment that has not been paid yet.
- Payment Refund: Used to refund a paid payment.

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
const fib = new Fib(clientId:string, clientSecret:string, sandbox?:boolean);
```

### CommonJS

```ts
const Fib = require('fib-sdk').Fib;
const fib = new Fib(clientId:string, clientSecret:string, sandbox?:boolean);
```

OR

```ts
const { Fib } = require('fib-sdk');
const fib = new Fib(clientId:string, clientSecret:string, sandbox?:boolean);
```

PS: If you're in a development environment or testing the package make sure to set the `sandbox` parameter to `true` while initializing the Fib instance, incase of production environment, you can set it to `false` or leave it since it's defaulted to `false`.

## Authentication

Authenticating with FIB using your `client_id` and `client_secret` that you have provided while creating the Fib instance, simply call the `authenticate()` method, it will return `true` if successfull.

```ts
await fib.authenticate(); // returns boolean
```

You can get `status` information from the fib instance, for example after successful authentication the Fib instance status field should equal `READY`

```js
let status = fib.status; // INITIALIZED | READY | FAILED
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
let paymentStatus = payment.status; // NO_PAYMENT | PAID | UNPAID | AUTH_FAILD | DECLINED
```

## Getting payment status

you can fetch fresh information about your payment from the FIB's payment API service by calling the `getStatus()` method, the method returns the API request's response object, which will also updates the payment instance's fields data, for example:

```js
let paymentStatusResponse = await payment.getStatus();
```

Example of payment response data:

```js
paymentStatusResponse.data = {

  // A unique identifier of the payment.
  paymentId: string,

  // Expected values are: PAID | UNPAID | DECLINED | REFUND_REQUESTED | REFUNDED.
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

## Payment Status By ID

You can also get status information of your previous payments by their paymentId, you can call `getStatusById()` method as it follows:

```js
const paymentStatusByIdResponse = await payment.getStatusById(paymentId:number);
console.log(paymentStatusByIdResponse.data);
```

## Canceling a payment

To cancel a created payment, you can call the `cancel()` method with your payment instance and this will cancel the payment from FIB and change the status of the payment instance to `DECLINED`, the method returns a boolean value, it returns `true` if the cancelation was successful.

```js
let cancelPayment = await payment.cancel(); // returns boolean
```

## Refunding a payment
To refund a created payment, you can call the `refund()` method with your payment instance and this will refund the payment from FIB and change the status of the payment instance to `REFUND_REQUESTED`, after a short of time status will change to `REFUNDED` and the amount will be refunded, The method returns a boolean value, it returns `true` if the refund was susccessful, if payment is not paid it will return `false`.

### Notes
- Only Payments with `PAID` status can be refunded.
- Only payments that was paid in the last 24 hours can be refunded.

```js
let refundPayment = await payment.refund(); // returns boolean
```

## Refunding a payment by ID
You can also refund previous payments by their paymentId, you can call `refundById()` method as it follows:

```js
const refundPayment = await payment.refundById(paymentId:string);
console.log(refundPayment); // returns boolean
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

To do a one-off build, use:

```bash
npm run build # or yarn build
```

To run tests, use:

```bash
npm run test # or yarn test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Contributions are always welcome!

## Report & Feedback

If any issues are found or you have any feedback, please reach out to me at [walid@kurdi.dev](mailto://walid@kurdi.dev)
