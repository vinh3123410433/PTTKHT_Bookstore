import db from "../../../config/db.js";
export class BaseModel {
  constructor(tableName, primaryKey) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  async findAll() {
    try {
      const [rows] = await db.query(`SELECT * FROM ${this.tableName}`);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  /**
   *
   * @param {string | number} id
   * @returns {Promise<QueryResult>}
   */
  async findById(id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
        [id]
      );
      return rows[0];
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  /**
   *
   * @param {Object} data
   * @returns {Promise<QueryResult>}
   */
  async create(data) {
    try {
      const columns = Object.keys(data).join(", ");
      const placeholders = Object.keys(data)
        .map(() => "?")
        .join(", ");
      const values = Object.values(data);
      const [result] = await db.query(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );
      return result;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  /**
   *
   * @param {string | number} id
   * @param {Object} data
   * @returns {Promise<Boolean>}
   */
  async update(id, data) {
    try {
      const setClause = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(data), id];
      const [result] = await db.query(
        `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`,
        values
      );
      return (
        /** @type {import('mysql2').ResultSetHeader} */ (result).affectedRows >
        0
      );
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  /**
   *
   * @param {string | number} id
   * @returns {Promise<QueryResult>}
   */
  async delete(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
        [id]
      );
      return result;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  /**
   *
   * @param {string} sql
   * @param {Array} params
   * @returns {Promise<QueryResult>}
   */
  async query(sql, params) {
    try {
      const [result] = await db.query(sql, params);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}
