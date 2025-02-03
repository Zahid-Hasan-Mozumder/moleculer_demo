"use strict";

module.exports = {
	name: "health",
	settings: {},
	dependencies: [],
	
	actions: {
		check: {
			async handler() {
				return `Server is up and running on port ${process.env.PORT}`;
			}
		}
	},

	events: {},
	methods: {},
	created() {},
	async started() {},
	async stopped() {}
};
