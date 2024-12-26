import fs from "fs";
import https from "https";

import { app } from "./app";
import { SETTINGS } from "./settings";

if (process.env.NODE_ENV === "production") {
  try {
    const privateKey = fs.readFileSync("/path/to/privkey.pem", "utf8");
    const certificate = fs.readFileSync("/path/to/cert.pem", "utf8");
    const ca = fs.readFileSync("/path/to/chain.pem", "utf8");

    const credentials = { key: privateKey, cert: certificate, ca: ca };

    https.createServer(credentials, app).listen(443, () => {
      console.log("Server running on https://localhost:443");
    });
  } catch (error) {
    console.error("Error loading SSL certificates:", error);
    process.exit(1);
  }
} else {
  app.listen(SETTINGS.PORT, () => {
    console.log(
      `Server running in development mode on http://localhost:${SETTINGS.PORT}`
    );
  });
}
