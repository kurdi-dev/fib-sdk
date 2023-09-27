import {
  CreatePaymentQueryParams,
  CreatePaymentQueryResponse,
  PaymentStatusQueryResponse,
} from './interfaces';
import { BadRequest } from '../interface';
import axios, { Axios } from 'axios';
import * as qs from 'qs';

export default class Payment {
  private http: Axios;
  public paymentId = '';
  public qrCode = '';
  public readableCode = '';
  public personalAppLink = '';
  public businessAppLink = '';
  public corporateAppLink = '';
  public validUntil = '';
  public amount = 0;
  public currency: 'IQD' | 'USD' = 'IQD';
  public status = 'NO_PAYMENT';

  constructor(
    http: Axios,
    private clientId: string,
    private clientSecret: string,
    private refreshToken: string,
    private authUrl: string,
    private paymentsUrl: string,
  ) {
    this.http = http;
  }

  async create(
    payload: CreatePaymentQueryParams,
  ): Promise<CreatePaymentQueryResponse | BadRequest> {
    await this.refreshRequestTokens();
    return await this.http
      .post('/', JSON.stringify(payload))
      .then((response) => {
        this.paymentId = response.data.paymentId;
        this.qrCode = response.data.qrCode;
        this.readableCode = response.data.readableCode;
        this.personalAppLink = response.data.personalAppLink;
        this.businessAppLink = response.data.businessAppLink;
        this.corporateAppLink = response.data.corporateAppLink;
        this.validUntil = response.data.validUntil;
        this.amount = payload.monetaryValue.amount;
        this.currency = payload.monetaryValue.currency;
        this.status = 'UNPAID';
        return response;
      })
      .catch((err) => {
        return err;
      });
  }
  async getStatusById(
    paymentId: string,
  ): Promise<PaymentStatusQueryResponse | BadRequest> {
    await this.refreshRequestTokens();
    return await this.http
      .get(`/${paymentId}/status`)
      .then(async (response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  async getStatus(): Promise<PaymentStatusQueryResponse | BadRequest> {
    await this.refreshRequestTokens();
    return await this.http
      .get(`/${this.paymentId}/status`)
      .then((response) => {
        this.status = response.data.status;
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  async cancel(): Promise<boolean | BadRequest> {
    await this.refreshRequestTokens();
    return await this.http
      .post(`/${this.paymentId}/cancel`)
      .then((response) => {
        if (response.status === 204) {
          this.reset();
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => err);
  }

  async refund(): Promise<boolean | BadRequest> {
    await this.refreshRequestTokens();
    return await this.http
      .post(`/${this.paymentId}/refund`)
      .then((response) => {
        if (response.status === 202) {
          this.reset();
          return true;
        } 
        return false;
      })
      .catch((err) => {
        if (err?.response?.data?.errors[0]?.code == 'TRANSACTION_STATUS_IS_NOT_PAID') {
            return false;
        }
        return err;
      });
  }

  async refundById(paymentId: string): Promise<boolean | BadRequest> {
    await this.refreshRequestTokens();
    return await this.http
      .post(`/${paymentId}/refund`)
      .then((response) => {
        if (response.status === 202) {
          this.reset();
          return true;
        } 
        return false;
      })
      .catch((err) => {
        if (err?.response?.data?.errors[0]?.code == 'TRANSACTION_STATUS_IS_NOT_PAID') {
            return false;
        }
        return err;
      });
  }

  async refreshRequestTokens() {
    await axios
      .post(
        this.authUrl,
        qs.stringify({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => {
        if (response.data?.access_token) {
          this.refreshToken = response.data.refresh_token;
          this.http = axios.create({
            baseURL: this.paymentsUrl,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${response.data?.access_token}`,
            },
          });
        } else {
          this.status = 'AUTH_FAILED';
          throw new Error('FIB re-authentication failed!');
        }
      })
      .catch((error) => {
        this.status = 'AUTH_FAILED';
        throw new Error('FIB re-authentication failed!');
      });
  }

  async reset() {
    this.paymentId = '';
    this.qrCode = '';
    this.readableCode = '';
    this.personalAppLink = '';
    this.businessAppLink = '';
    this.corporateAppLink = '';
    this.validUntil = '';
    this.amount = 0;
    this.currency = 'IQD';
    this.status = 'NO_PAYMENT';
  }
}
