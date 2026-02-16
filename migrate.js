import fs from "fs";
import mysql from "mysql2/promise";

async function migrate() {
  try {
    // 1️⃣ Read JSON file
    const rawData = fs.readFileSync("../ca_yps.inuery.json", "utf-8");
    const records = JSON.parse(rawData);

    // 2️⃣ Connect to MariaDB
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // put your password
      database: "ca_yps",
    });

    console.log("Connected to DB");

    // 3️⃣ Loop through records
    for (const item of records) {
      // Find MySQL career id using mongoId

      await connection.execute(
        `INSERT INTO inquiries
  (name, email, phone, message, subject)
  VALUES (?, ?, ?, ?, ?)`,
        [
          item.name,
          item.email,
          item.phone,
          item.message,
          item.subject
        ]
      );



    }

    await connection.end();
    console.log("Migration Completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

migrate();
