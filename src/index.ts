import serverless from "serverless-http";
import app from "./api/index.js";
console.log("start");

export default serverless(app);
