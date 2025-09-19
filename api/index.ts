import serverless from "serverless-http";
import app from "../src/api/server.js";

export default serverless(app);
