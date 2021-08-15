const express = require("express");
const app = express();

const http = require('http').Server(app);
let PORT = 1338;

app.use((_, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
	next();
});

app.use(express.urlencoded({
	extended: false
}));

app.use(express.json());

//////////////////////////////////////////////////////////////////////////////////

const initRoutes = require("./routes/web");
app.use(express.urlencoded({ extended: true }));
initRoutes(app);




http.listen( PORT, () => {
	console.log(`Backend app running 🔥 at port: ${PORT}`);
})


