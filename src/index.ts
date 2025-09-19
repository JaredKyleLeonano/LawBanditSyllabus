import serverless from "serverless-http";
import express from "express";
import app from "./api/index.js";

export default serverless(app);
