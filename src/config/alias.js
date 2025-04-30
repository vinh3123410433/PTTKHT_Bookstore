// src/config/alias.js
import path from "path";
import { fileURLToPath } from "url";

// Lấy __dirname kiểu ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gốc project (trở lên 1 cấp từ /config)
const rootPath = path.resolve(__dirname, "..");

// Tạo object alias
export const paths = {
  root: rootPath,
  models: path.join(rootPath, "app", "models"),
  controllers: path.join(rootPath, "app", "controllers"),
  views: path.join(rootPath, "views"),
};
