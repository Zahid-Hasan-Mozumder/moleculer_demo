const mongoose = require("mongoose");
let connectionString = "mongodb://localhost:27017/zhm";
console.log("Connection string : ", connectionString);

mongoose.Promise = Promise;
	
mongoose.connection.on("connected", () => {
	console.log("Connection Established");
});
	
mongoose.connection.on("reconnected", () => {
	console.log("Connection Reestablished");
});
	
mongoose.connection.on("disconnected", () => {
	console.log("Connection Disconnected");
});
	
mongoose.connection.on("close", () => {
	console.log("Connection Closed");
});
	
mongoose.connection.on("error", (error) => {
	console.log("ERROR: " + error);
});
	
const run = async () => {
	await mongoose.connect(connectionString, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
		// useFindAndModify: false,
		// useCreateIndex: true
	});
};

const close = async () => {
	await mongoose.connection.close();
};

module.exports = { connect: run, close: close };