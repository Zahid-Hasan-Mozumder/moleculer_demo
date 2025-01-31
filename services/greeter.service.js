"use strict";

module.exports = {
	name: "greeter",
	settings: {},
	dependencies: [],
	
	actions: {
		hello: {
			async handler() {
				return "Hello Moleculer";
			}
		},
		welcome: {
			params: {
				name: "string"
			},
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		}
	},

	events: {},
	methods: {},
	created() {},
	async started() {},
	async stopped() {}
};
