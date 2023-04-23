import axios, { Axios } from 'axios';
import Payment from './payment/payment';
import * as qs from 'qs';

/**
 * FIB SDK
 * @author Walid R. Rashed <@kurdi-dev>
 */

export class Fib {
  private http: Axios;
  public accessToken: string;
  public status: string;
  public payment: Payment;

  constructor() {
    this.status = 'INITIATED';
  }

  async authenticate(clientId: string, clientSecret: string): Promise<void> {
    await axios
      .post(
        'https://fib.stage.fib.iq/auth/realms/fib-online-shop/protocol/openid-connect/token',
        qs.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => {
        if (response.data?.access_token) {
          this.accessToken = response.data.access_token;
          this.http = axios.create({
            baseURL: 'https://fib.stage.fib.iq/protected/v1/payments',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
          this.payment = new Payment(this.http);
          this.status = 'READY';
        } else {
          this.status = 'FAILED';
          throw new Error('FIB Authentication failed!');
        }
      })
      .catch((error) => {
        this.status = 'FAILED';
        throw new Error('FIB Authentication failed!');
      });
  }
}
