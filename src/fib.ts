import axios, { Axios } from 'axios';
import Payment from './payment/payment';
import * as qs from 'qs';

/**
 * FIB SDK
 * @author Walid R. Rashed <@kurdi-dev>
 */

export class Fib {
  private http: Axios;
  private accessToken: string;
  private refreshToken: string;
  private authUrl: string;
  private paymentsUrl: string;
  public status: string;
  public payment: Payment;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private sandbox: boolean = false,
  ) {
    this.status = 'INITIALIZED';
    this.authUrl = this.sandbox
      ? 'https://fib.stage.fib.iq/auth/realms/fib-online-shop/protocol/openid-connect/token'
      : 'https://fib.prod.fib.iq/auth/realms/fib-online-shop/protocol/openid-connect/token';
    this.paymentsUrl = this.sandbox
      ? 'https://fib.stage.fib.iq/protected/v1/payments'
      : 'https://fib.prod.fib.iq/protected/v1/payments';
  }

  async authenticate(): Promise<boolean> {
    return await axios
      .post(
        this.authUrl,
        qs.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
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
          this.refreshToken = response.data.refresh_token;
          this.http = axios.create({
            baseURL: this.paymentsUrl,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
          this.payment = new Payment(
            this.http,
            this.clientId,
            this.clientSecret,
            this.refreshToken,
            this.authUrl,
            this.paymentsUrl,
          );
          this.status = 'READY';
          return true;
        } else {
          this.status = 'FAILED';
          return false;
        }
      })
      .catch((error) => {
        this.status = 'FAILED';
        throw new Error('FIB Authentication failed!');
      });
  }
}
