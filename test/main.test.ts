import { Fib } from '../src/fib';

// your fib cleint
const client_id: string = 'client_id';
// your fib secret
const client_secret: string = 'client_secret';

describe('Tetsing payment process', () => {
  const fib = new Fib();

  it('creating an Fib class instance, authenticating and creating a payment', async () => {
    await fib.authenticate(client_id, client_secret);
    expect(fib.status).toEqual('READY');

    const payment = fib.payment;
    expect(payment.status).toEqual('NO_PAYMENT');

    // creating payment
    await payment.create({
      monetaryValue: { amount: 5000, currency: 'IQD' },
      description: 'test payment',
    });

    console.log('payemnt id: ', payment.paymentId);
    console.log('payemnt status: ', payment.status);
    expect(payment.status).toEqual('UNPAID');

    // getting payment status
    const paymentStatusResponse = await payment.geStatus();
    console.log('payment status data: ', paymentStatusResponse.data);

    // canceling payment
    let isCanceled = await payment.cancel();
    expect(isCanceled).toEqual(true);
  });
});
