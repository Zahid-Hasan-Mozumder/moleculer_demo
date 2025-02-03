"use strict";

const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require("crypto");

module.exports = {
    name: "customer",
    settings: {},
    dependencies: [],

    actions: {

        getAll: {
            async handler(ctx) {
                var { page, limit } = ctx.params;
                if(!page) page = 1;
                if(!limit) limit = 10;
                
                const start = ((page - 1) * limit) + 1;
                const end = page * limit;

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

                const oauthHeaderObj = oauth.toHeader(oauth.authorize(requestData, token));
                const realm = `${process.env.ACCOUNT_ID}`;
                const authHeaderValue = oauthHeaderObj.Authorization.replace(
                    "OAuth",
                    `OAuth realm="${realm}",`
                );
                const requestBody = { "q": `SELECT * FROM (SELECT ROWNUM AS RN, * FROM (SELECT * FROM customer ORDER BY id)) WHERE (rn BETWEEN ${start} AND ${end}) ORDER BY rn` };
                console.log("Request Data : ", requestData);
                try {
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
                    return response.data;
                } catch (error) {
                    this.logger.error("Error fetching data from netsuite", error);
                    throw error;
                }
            }
        }
    },

    events: {},
    methods: {},
    created() {},
    async started() {},
    async stopped() {}
};
