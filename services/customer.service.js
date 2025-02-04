"use strict";

const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require("crypto");
const Customer = require("../model/customer.model");

module.exports = {
    name: "customer",
    settings: {},
    dependencies: [],
    model: Customer,

    actions: {

        getAll: {
            async handler() {
                const oauth = OAuth({
                    consumer: {
                        key: `${process.env.CONSUMER_KEY}`,
                        secret: `${process.env.CONSUMER_SECRET}`
                    },
                    signature_method: "HMAC-SHA256",
                    hash_function(baseString, key) {
                        return crypto.createHmac("sha256", key).update(baseString).digest("base64");
                    }
                });

                const token = {
                    key: `${process.env.USER_TOKEN}`,
                    secret: `${process.env.USER_SECRET}`
                };

                const requestData = {
                    url: `${process.env.SUITEQL_URL}`,
                    method: "POST"
                };

                try {
                    const oauthHeaderObj = oauth.toHeader(oauth.authorize(requestData, token));
                    const realm = `${process.env.ACCOUNT_ID}`;
                    const authHeaderValue = oauthHeaderObj.Authorization.replace(
                        "OAuth",
                        `OAuth realm="${realm}",`
                    );

                    var requestBody = { "q": "SELECT COUNT(*) FROM customer" };
                    var response = await axios.post(
                        requestData.url,
                        requestBody,
                        {
                            headers: {
                                Authorization: authHeaderValue,
                                Prefer: "transient"
                            }
                        }
                    );
                    console.log(response.data);

                    var totalCustomer = Number(response.data.items[0].expr1);
                    var limit = 10;
                    var iteration = (totalCustomer + (limit - 1)) / limit;

                    for (var i = 1; i <= iteration; i++) {
                        const oauthHeaderObj = oauth.toHeader(oauth.authorize(requestData, token));
                        const realm = `${process.env.ACCOUNT_ID}`;
                        const authHeaderValue = oauthHeaderObj.Authorization.replace(
                            "OAuth",
                            `OAuth realm="${realm}",`
                        );

                        var start = ((i - 1) * limit) + 1;
                        var end = i * limit;

                        const requestBody = { "q": `SELECT * FROM (SELECT ROWNUM AS RN, * FROM (SELECT * FROM customer ORDER BY id)) WHERE (rn BETWEEN ${start} AND ${end}) ORDER BY rn` };
                        const response = await axios.post(
                            requestData.url,
                            requestBody,
                            {
                                headers: {
                                    Authorization: authHeaderValue,
                                    Prefer: "transient"
                                }
                            }
                        );
                        console.log(response.data);
                        await new Promise(resolve => setTimeout(resolve, 860)); // Delay .86 seconds
                    }

                } catch (error) {
                    this.logger.error("Error fetching data from netsuite", error);
                    throw error;
                }
            }
        }
    },

    events: {},
    methods: {},
    created() { },
    async started() { },
    async stopped() { }
};
