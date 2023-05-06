/**
 * !! ATTENTION PLEASE !!
 * Please refer to the documentation at https://developer.bka.sh for information on bKash.
 */
import fs from 'fs';
import path from 'path';

export const createPayment = ({ bkash }) => async (req, res) => {
  try {
    const createAgreement = await bkash.createAgreement({
      payerReference: req.body.phone,
      email: req.body.email,
      totalPrice: req.body.totalPrice,
    });


    res.status(200).send(createAgreement?.paymentID);
  } catch (error) {

    res.status(500).send('something went wrong');
  }
};

export const executePayment = ({ bkash, mail, config }) => async (req, res) => {
  let email = req.query.email;
  let paymentID = req.query.paymentID;
  const execute = await bkash.executeAgreement(paymentID);
  console.log('execute status: ',execute);

  if (Number(execute.statusCode) === 2054) {
    const crtPayment = await bkash.createPayment({
      mode: '0001', merchantAssociationInfo: 'MI05MID54RF09123456One',
      merchantInvoiceNumber: 'Inv0121', amount: req.query.totalPrice, agreementID: execute?.agreementID,
      baseURL: config.api + '/api/bkash/status?email=' + email
    });
    console.log('crtPayment', crtPayment);
    let createPay = await bkash.executePayment({ paymentID: crtPayment.paymentID });
    // Send a Confirmation Email
    if (createPay.statusCode === '0000') {
      await mail({
        receiver: req.query.email,
        subject: 'Coding test',
        body: fs.readFileSync(path.resolve(__dirname, 'templates', 'emailTemplate.html')),
        type: 'html'
      });
    }
    // Redirect to webpage to show a modal
    return await res.redirect(crtPayment.bkashURL);
  }
  await res.redirect(config.base);
};

export const status = ({ config }) => async (req, res) => {
  let email = req.query.email;
  res.redirect(config.base + '?buy=success&email=' + email);
};
