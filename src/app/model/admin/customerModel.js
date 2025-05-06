// customerModel.js - Model for customer management
import db from "../../../config/db.js";

class CustomerModel {
    /**
     * Get all customers from the database
     * @returns {Promise<Array>} List of all customers
     */
    async getAllCustomers() {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM KhachHang ORDER BY ID_KH DESC
            `);
            return rows;
        } catch (error) {
            console.error("Error fetching all customers:", error);
            throw error;
        }
    }

    /**
     * Get a customer by ID
     * @param {number} id - Customer ID
     * @returns {Promise<Object>} Customer data
     */
    async getCustomerById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM KhachHang WHERE ID_KH = ?
            `, [id]);
            
            return rows[0];
        } catch (error) {
            console.error(`Error fetching customer with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Get a customer by username
     * @param {string} username - Customer username
     * @returns {Promise<Object>} Customer data
     */
    async getCustomerByUsername(username) {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM KhachHang WHERE TenTK = ?
            `, [username]);
            
            return rows[0];
        } catch (error) {
            console.error(`Error fetching customer with username ${username}:`, error);
            throw error;
        }
    }
    
    /**
     * Create a new customer
     * @param {Object} customerData - Customer data
     * @returns {Promise<Object>} Result of the insertion
     */
    async createCustomer(customerData) {
        try {
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = customerData;
            
            const [result] = await db.execute(`
                INSERT INTO KhachHang (TenTK, TenKH, SDT, NgaySinh, MatKhau)
                VALUES (?, ?, ?, ?, ?)
            `, [TenTK, TenKH, SDT, NgaySinh, MatKhau]);
            
            return result;
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    }
    
    /**
     * Update an existing customer
     * @param {number} id - Customer ID
     * @param {Object} customerData - Updated customer data
     * @returns {Promise<Object>} Result of the update
     */
    async updateCustomer(id, customerData) {
        try {
            // Generate dynamic query based on provided data
            const keys = Object.keys(customerData);
            const values = Object.values(customerData);
            
            if (keys.length === 0) return null;
            
            const setClause = keys.map(key => `${key} = ?`).join(', ');
            
            const [result] = await db.execute(`
                UPDATE KhachHang SET ${setClause} WHERE ID_KH = ?
            `, [...values, id]);
            
            return result;
        } catch (error) {
            console.error(`Error updating customer with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Delete a customer
     * @param {number} id - Customer ID
     * @returns {Promise<Object>} Result of the deletion
     */
    async deleteCustomer(id) {
        try {
            const [result] = await db.execute(`
                DELETE FROM KhachHang WHERE ID_KH = ?
            `, [id]);
            
            return result;
        } catch (error) {
            console.error(`Error deleting customer with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Get customer addresses
     * @param {number} customerId - Customer ID
     * @returns {Promise<Array>} Customer addresses
     */
    async getCustomerAddresses(customerId) {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM DiaChi WHERE ID_KH = ?
            `, [customerId]);
            
            return rows;
        } catch (error) {
            console.error(`Error fetching addresses for customer with ID ${customerId}:`, error);
            throw error;
        }
    }
}

export default new CustomerModel();