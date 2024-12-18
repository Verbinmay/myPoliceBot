import fs from "fs";
import https from "https";

import { app } from "./app";
import { SETTINGS } from "./settings"; // Получаем настройки (например, PORT)

// Читаем SSL сертификаты только в продакшн-режиме
if (process.env.NODE_ENV === "production") {
  // В продакшн-режиме используем HTTPS
  try {
    const privateKey = fs.readFileSync("/path/to/privkey.pem", "utf8");
    const certificate = fs.readFileSync("/path/to/cert.pem", "utf8");
    const ca = fs.readFileSync("/path/to/chain.pem", "utf8");

    // Создаем HTTPS сервер с SSL-сертификатами
    const credentials = { key: privateKey, cert: certificate, ca: ca };

    // Создаем и запускаем HTTPS сервер
    https.createServer(credentials, app).listen(443, () => {
      console.log("Server running on https://localhost:443");
    });
  } catch (error) {
    console.error("Error loading SSL certificates:", error);
    process.exit(1); // Завершаем приложение, если не удалось загрузить сертификаты
  }
} else {
  // В режиме разработки используем обычный HTTP
  app.listen(SETTINGS.PORT, () => {
    console.log(
      `Server running in development mode on http://localhost:${SETTINGS.PORT}`
    );
  });
}
