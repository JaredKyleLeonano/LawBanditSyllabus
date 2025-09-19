import serverless from "serverless-http";
import app from "./server.js";

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
