import {
  CreatePaymentQueryParams,
  CreatePaymentQueryResponse,
  PaymentStatusQueryResponse,
} from './interfaces';
import { BadRequest } from '../interface';
import { Axios } from 'axios';

export default class Payment {
  private readonly http: Axios;
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

  constructor(http: Axios) {
    this.http = http;
  }

  async create(
    payload: CreatePaymentQueryParams,
  ): Promise<CreatePaymentQueryResponse | BadRequest> {
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

  async geStatus(): Promise<PaymentStatusQueryResponse | BadRequest> {
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
