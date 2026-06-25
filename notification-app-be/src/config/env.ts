import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3001,
  BEARER_TOKEN: process.env.BEARER_TOKEN || "",
  // ✅ reads from .env — no hardcoded IP
  TEST_SERVER: process.env.TEST_SERVER || "http://20.244.56.144/evaluation-service",
};