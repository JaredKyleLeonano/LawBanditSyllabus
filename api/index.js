import serverless from "serverless-http";

let handler = null;

export default async function (req, res) {
  console.log("wrapper invoked");
  try {
    if (!handler) {
      console.log("dynamic import starting");
      const mod = await import("../dist/api/index.js");
      const app = mod.default || mod.app || mod;
      handler = serverless(app);
      console.log("handler created");
    }
    return handler(req, res);
  } catch (err) {
    console.error("INIT ERROR", err);
    res.statusCode = 500;
    return res.end("init error");
  }
}
