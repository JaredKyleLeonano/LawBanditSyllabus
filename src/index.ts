import serverless from "serverless-http";
import app from "./api/index.js";

export default serverless(app);
