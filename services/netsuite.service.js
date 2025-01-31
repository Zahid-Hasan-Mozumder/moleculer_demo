"use strict";

module.exports = {
    name: "netsuite",
    settings: {},
    dependencies: [],

    actions: {
        notify: {
            params: {
                response: {
                    type: "array",
                    items: "any",
                    optional: true
                },
                status: {
                    type: "string",
                    optional: true
                }
            },
            async handler(ctx) {
                console.log(ctx.params);
                return ctx.params;
            }
        }
    },

    events: {},
    methods: {},
    created() { },
    async started() { },
    async stopped() { }
};
