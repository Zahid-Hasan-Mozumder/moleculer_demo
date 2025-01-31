"use strict";

module.exports = {
	name: "messages",
	settings: {},
	dependencies: [],
	
	actions: {
		weekend: {
			async handler() {
				return "Lets talk about how we can spend the weekend";
			}
		}
	},

	events: {},
	methods: {},
	created() {},
	async started() {},
	async stopped() {}
};
