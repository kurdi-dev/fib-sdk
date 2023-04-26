import axios, { Axios } from 'axios';
import Payment from './payment/payment';
import * as qs from 'qs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

/**
 * FIB SDK
 * @author Walid R. Rashed <@kurdi-dev>
 */

export class Fib {
  private http: Axios;
  private accessToken: string;
  private refreshToken: string;
  public status: string;
  public payment: Payment;

  constructor() {
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = fs.readFileSync('/path/to/secret/file', 'utf8');
    this.status = 'INITIALIZED';
  }

  async authenticate(): Promise<boolean> {
    return await axios
      .post(
        'https://fib.stage.fib.iq/auth/realms/fib-online-shop/protocol/openid-connect/token',
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
            baseURL: 'https://fib.stage.fib.iq/protected/v1/payments',
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
