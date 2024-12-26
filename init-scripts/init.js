db = db.getSiblingDB("policeBot"); // Создаем или выбираем базу данных

// Создание пользователя
db.createUser({
  user: "mark",
  pwd: "ff",
  roles: [
    { role: "readWrite", db: "policeBot" }, // Даем пользователю права на базу данных "policeBot"
  ],
});
