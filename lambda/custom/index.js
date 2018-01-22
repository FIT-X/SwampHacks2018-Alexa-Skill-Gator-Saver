/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/


const SERVICE_HOST = '1718034b.ngrok.io';
const PORT = 80;

'use strict';

const Alexa = require('alexa-sdk');
const http = require('http');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Gator Saver',
            WELCOME_MESSAGE: "Welcome to %s. Gator Saver tries to help you spend safer ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "What can I help you with?",
            HELP_REPROMPT: "What can I help you with?",
            STOP_MESSAGE: 'Goodbye!'
        }
    },
    'en-US': {
    }
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'atms': function () {
        this.attributes.speechOutput = `Here they are`;

        this.response.speak(this.attributes.speechOutput);
        this.emit(':responseReady');
    },
    'setbal': function () {
        const amount = this.event.request.intent.slots.Amount.value;
        this.attributes.speechOutput = `Now depositing ${amount} dollars. Please scan your mobile device.`;

        this.response.speak(this.attributes.speechOutput);
        this.emit(':responseReady');

        var options = {
            host: SERVICE_HOST,
            port: PORT,
            path: '/api/setBalance',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            _this.response.speak('I\'m sorry. There was an request error.');
            _this.emit(':responseReady');
        });

        // write data to request body
        req.write(JSON.stringify({
            amount: amount
        }));
        req.end();
    },
    'checkbal': function () {
        var _this = this;
        var options = {
            host: SERVICE_HOST,
            port: PORT,
            path: '/api/getBalance',
            method: 'GET'
        };

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                try {
                    const body = JSON.parse(chunk);
                    _this.attributes.speechOutput = `You have ${body.amount ? body.amount : 'no'} dollars.`;
                    _this.response.speak(_this.attributes.speechOutput);
                    _this.emit(':responseReady');
                } catch (err) {
                    console.log(err);
                    _this.response.speak('I\'m sorry. The body could not be parsed.');
                    _this.emit(':responseReady');
                }
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            _this.response.speak('I\'m sorry. There was an request error.');
            _this.emit(':responseReady');
        });

        // write data to request body
        // req.write('data\n');
        // req.write('data\n');
        req.end();
    },
    'paybill': function () {
        const bill = this.event.request.intent.slots.BillType.value;
        console.log(bill);

        var _this = this;
        

        var options = {
            host: SERVICE_HOST,
            port: PORT,
            path: '/api/payBill',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                try {
                    const body = JSON.parse(chunk);
                    _this.attributes.speechOutput = `${bill} bill payed. You now have ${body.amount ? body.amount : 'no'} dollars.`;
                    _this.response.speak(_this.attributes.speechOutput);
                    _this.emit(':responseReady');
                } catch (err) {
                    console.log(err);
                    _this.response.speak('I\'m sorry. The body could not be parsed.');
                    _this.emit(':responseReady');
                }
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            _this.response.speak('I\'m sorry. There was an request error.');
            _this.emit(':responseReady');
        });

        // write data to request body
        req.write(JSON.stringify({
            bill: bill
        }));
        req.end();
    },
    'buystuff': function () {
        const item = this.event.request.intent.slots.Item.value;
        console.log(item);
        this.attributes.speechOutput = `Starting transaction ${item}`;

        this.response.speak(this.attributes.speechOutput);
        this.emit(':responseReady');

        var options = {
            host: SERVICE_HOST,
            port: PORT,
            path: '/api/buy',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            _this.response.speak('I\'m sorry. There was an request error.');
            _this.emit(':responseReady');
        });

        // write data to request body
        req.write(JSON.stringify({
            item: item
        }));
        req.end()        
    },
    'convertcrypto': function () {
        this.attributes.speechOutput = `Balance converted to crypto`;

        this.response.speak(this.attributes.speechOutput);
        this.emit(':responseReady');


        var options = {
            host: SERVICE_HOST,
            port: PORT,
            path: '/api/convertcrypto',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            _this.response.speak('I\'m sorry. There was an request error.');
            _this.emit(':responseReady');
        });

        // write data to request body
        // req.write();
        req.end()
    },
    // 'CashOut': function () {
    //     const amount = this.event.request.intent.slots.Amount.value;
    //     this.attributes.speechOutput = `Starting transaction to sell ${amount} bitcoin. Please scan your mobile device, finger print and smile for a picture`;

    //     this.response.speak(this.attributes.speechOutput);
    //     this.emit(':responseReady');
    //     var options = {
    //         host: SERVICE_HOST,
    //         port: PORT,
    //         path: '/api/sellbtc',
    //         method: 'PUT'
    //     };

    //     var req = http.request(options, function (res) {
    //         console.log('STATUS: ' + res.statusCode);
    //     });

    //     req.on('error', function (e) {
    //         console.log('problem with request: ' + e.message);
    //         _this.response.speak('I\'m sorry. There was an request error.');
    //         _this.emit(':responseReady');
    //     });

    //     // write data to request body
    //     req.write(JSON.stringify({
    //         amount: amount
    //     }));
    //     req.end();
    // },
    // 'GetWalletBalance': function () {
    //     var _this = this;

    //     var usd = 0;
    //     var https = require('https');
    //     var req = https.get("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=ETH,USD", function (res) {
    //         console.log('STATUS: ' + res.statusCode);
    //         // console.log('HEADERS: ' + JSON.stringify(res.headers));
    //         res.on('data', function (chunk) {
    //             console.log('BODY: ' + chunk);
    //             try {
    //                 const body = JSON.parse(chunk);
    //                 usd = body.USD;
    //                 requestWallet();
    //             } catch (err) {
    //                 console.log(err);
    //                 _this.response.speak('I\'m sorry. The body could not be parsed.');
    //                 _this.emit(':responseReady');
    //             }
    //         });
    //     });
    //     req.end();

    //     function requestWallet() {
    //         var options = {
    //             host: SERVICE_HOST,
    //             port: PORT,
    //             path: '/api/getWallet',
    //             method: 'GET'
    //         };

    //         var req = http.request(options, function (res) {
    //             console.log('STATUS: ' + res.statusCode);
    //             // console.log('HEADERS: ' + JSON.stringify(res.headers));
    //             res.setEncoding('utf8');
    //             res.on('data', function (chunk) {
    //                 console.log('BODY: ' + chunk);
    //                 try {
    //                     const body = JSON.parse(chunk);
    //                     _this.attributes.speechOutput = `You have ${body.bitcoin ? body.bitcoin : 'no'} bitcoin, which is ${usd * body.bitcoin} USD.`;
    //                     _this.response.speak(_this.attributes.speechOutput);
    //                     _this.emit(':responseReady');
    //                 } catch (err) {
    //                     console.log(err);
    //                     _this.response.speak('I\'m sorry. The body could not be parsed.');
    //                     _this.emit(':responseReady');
    //                 }
    //             });
    //         });

    //         req.on('error', function (e) {
    //             console.log('problem with request: ' + e.message);
    //             _this.response.speak('I\'m sorry. There was an request error.');
    //             _this.emit(':responseReady');
    //         });

    //         // write data to request body
    //         // req.write('data\n');
    //         // req.write('data\n');
    //         req.end();
    //     }

    // },
    // 'PurchaseEth': function () {
    //     const amount = this.event.request.intent.slots.Amount.value;
    //     this.attributes.speechOutput = `You have bought ${amount} ether.`;
    //     this.response.speak(this.attributes.speechOutput);
    //     this.emit(':responseReady');
    // },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
