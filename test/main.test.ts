import { Fib } from '../src/index';

// your fib cleint
const client_id = 'your_client_id';
// your fib secret
const client_secret = 'your_client_secret';

describe('Testing payment process', () => {
  const fib = new Fib(client_id, client_secret, true);

  it('creating an Fib class instance, authenticating, creating a payment, getting status and canceling the payment', async () => {
    await fib.authenticate();
    expect(fib.status).toEqual('READY');

    const payment = fib.payment;
    expect(payment.status).toEqual('NO_PAYMENT');

    // creating payment
    await payment.create({
      monetaryValue: { amount: 5000, currency: 'IQD' },
      description: 'test payment',
    });

    console.log('payment id: ', payment.paymentId);
    console.log('payment status: ', payment.status);
    expect(payment.status).toEqual('UNPAID');

    // getting payment status
    const paymentStatusResponse = await payment.getStatus();
    console.log('payment status data: ', paymentStatusResponse.data);

    // getting a payment status by ID
    const paymentStatusByIdResponse = await payment.getStatusById(
      payment.paymentId,
    );
    console.log('payment status by id data: ', paymentStatusByIdResponse.data);

    // canceling payment
    const isCanceled = await payment.cancel();
    expect(isCanceled).toEqual(true);
  });
});
