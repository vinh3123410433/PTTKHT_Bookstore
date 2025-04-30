/**
 * @typedef {{
 * id: string,
 * name: string,
 * email: string,
 * password: string,
 * role: string,
 * }} User
 */

import db from "../database/mysql.database.js";

/**
 *
 * @param {string} userId
 * @returns {Promise<User>}
 */
export async function getUserById(userId) {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return rows[0];
}

/**
 *
 * @param {string} userName
 * @param {string} password
 * @returns {Promise<User>}
 */
export async function checkUser(userName, password) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE userName = ? AND password = ?",
    [userName, password]
  );
  return rows[0];
}
