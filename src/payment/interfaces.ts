import { Response } from '../interface';

export interface CreatePaymentQueryParams {
  /**
   * Payment value and currency
   */
  monetaryValue: {
    /**
     * the amount of the payment.
     */
    amount: number;

    /**
     *  the currency of the payment; currently only IQD is supported.
     */
    currency: 'IQD' | 'USD';
  };

  /**
   * The callback url that we will send a POST request to when status of the created payment changes.
   * Callback URL should be able to handle POST requests with request body that contains two properties:
   * id : this will be the payment id.
   * status : this will be the payment status.
   */
  statusCallbackUrl?: string;

  /**
   * Description of the payment to help your customer to identify it in the FIB app, with the maximum length of 50 characters.
   */
  description?: string;
}

export interface PaymentResponseData {
  /**
   * A unique identifier of the payment, used later to check the status.
   */
  paymentId: string;

  /**
   * A base64-encoded data URL of the QR code image that the user can scan with the FIB mobile app.
   */
  qrCode: string;

  /**
   * A payment code that the user can enter manually in case he cannot scan the QR code.
   */
  readableCode: string;

  /**
   * A link that the user can tap on his mobile phone to go to the corresponding payment screen in the FIB Personal app.
   */
  personalAppLink: string;

  /**
   * A link that the user can tap on his mobile phone to go to the corresponding payment screen in the FIB Business app.
   */
  businessAppLink: string;

  /**
   * A link that the user can tap on his mobile phone to go to the corresponding payment screen in the FIB Corporate app.
   */
  corporateAppLink: string;

  /**
   * An ISO-8601-formatted date-time string, representing a moment in time when the payment expires.
   */
  validUntil: string;
}

export interface PaymentStatusResponseData {
  /**
   * A unique identifier of the payment.
   */
  paymentId: string;

  /**
   * Expected values are: PAID | UNPAID | DECLINED.
   */
  status: string;

  /**
   * an ISO-8601-formatted date-time string, representing a moment in time when the payment expires.
   */
  validUntil: string;

  /**
   * a JSON object, containing two key-value pairs; the amount and currency of the payment.
   */
  amount: {
    amount: number;
    currency: string;
  };

  /**
   * Expected Values are:
   * SERVER_FAILURE : Payment failure due to some internal error.
   * PAYMENT_EXPIRATION : Payment has expired.
   * PAYMENT_CANCELLATION : Payment canceled by the user.
   */
  decliningReason?: string;

  /**
   * an ISO-8601-formatted date-time string, representing a moment in time when the payment is declined.
   */
  declinedAt?: string;

  /**
   * a JSON object, containing two key-value pairs; the name and iban of the customer.
   */
  paidBy?: {
    name: string;
    iban: string;
  };
}

export interface CreatePaymentQueryResponse extends Response {
  data: PaymentResponseData;
}
export interface PaymentStatusQueryResponse extends Response {
  data: PaymentStatusResponseData;
}
