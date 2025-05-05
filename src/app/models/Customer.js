// models/Customer.js
import db from '../../config/db.js';

class Customer {
    constructor() {}

    // Get all customers
    async getAllCustomers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM KhachHang';
            db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    // Get customer by ID
    async getCustomerById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM KhachHang WHERE ID_KH = ?';
            db.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0]);
            });
        });
    }

    // Create new customer
    async createCustomer(customer) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO KhachHang SET ?';
            db.query(query, customer, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results.insertId);
            });
        });
    }

    // Update customer
    async updateCustomer(id, customer) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE KhachHang SET ? WHERE ID_KH = ?';
            db.query(query, [customer, id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results.affectedRows > 0);
            });
        });
    }

    // Delete customer
    async deleteCustomer(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM KhachHang WHERE ID_KH = ?';
            db.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results.affectedRows > 0);
            });
        });
    }

    // Get addresses for customer
    async getCustomerAddresses(customerId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM DiaChi_KH WHERE ID_KH = ?';
            db.query(query, [customerId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }
}

export default new Customer();