'use strict';

const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const { mode, clientId, clientSecret, returnUrl, cancelUrl } = require('../config');

paypal.configure({
    mode,
    client_id: clientId,
    client_secret: clientSecret
});

router.get('/', (req, res, next) => {
    res.render('index');  
});

router.get('/return', (req, res, next) => {
    if(req.session.amount) {

    const { paymentId, PayerID } = req.query;
    const { amount } = req.session;

    const executePaymentData = {
        payer_id: PayerID,
        transactions: [{
            amount: {
                currency: 'EUR',
                total: amount
            }
        }]
    };

    paypal.payment.execute(paymentId, executePaymentData, (error, payment) => {
        
        delete req.session.amount;

        if (error) {
            res.redirect('/?status=error'); 
        } else {
            res.redirect('/?status=success');
        }
    });
  } else {
      res.redirect('/');
  }
});

router.get('/cancel', (req, res, next) => {
    res.redirect('/');
});

router.post('/checkout', (req, res, next) => {
    const { amount } = req.body;
    const item = {
        name: 'Sample product',
        sku: 'sample',
        price: amount,
        currency: 'EUR',
        quantity: 1
    };
    const paymentData = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: returnUrl,
            cancel_url: cancelUrl
        },
        transactions: [{
            item_list: {
                items: [ item ]
            },
            amount: {
                currency: 'EUR',
                total: amount
            },
            description: 'Sample payment.'
        }]
    };

    paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
            res.json({ status: false, info: error });
        } else {
            let url = '';
            payment.links.forEach(link => {
                if (link.rel === 'approval_url') {
                    url = link.href;
                }
            });
            req.session.amount = amount;
            res.json({ url });
        }
    });
});

module.exports = router;