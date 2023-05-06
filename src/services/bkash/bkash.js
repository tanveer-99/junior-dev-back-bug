/**
 * !! ATTENTION PLEASE !!
 * Please refer to the documentation at https://developer.bka.sh for information on bKash.
 */
import { createPayment, executePayment, status } from './bkash.entity.js';
import Bkash from './bkash.functions.js';

export default async function bkash() {
  const { username, password, appKey, appSecret, isSandbox } = this.config.bkash;
  const bkash = await Bkash.init(username, password, appKey, appSecret, isSandbox);

  // Routes
  this.route.post('/bkash/createPayment', createPayment({ ...this, bkash }));
  this.route.post('/bkash/execute', executePayment({ ...this, bkash }));
  this.route.get('/bkash/status', status({ ...this, bkash }));
}