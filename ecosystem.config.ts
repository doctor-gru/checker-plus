import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
} else {
  console.error(".env file not found.");
}

export default {
  apps: [
    {
      name: "Pinlink",
      script: "./app.ts",
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
