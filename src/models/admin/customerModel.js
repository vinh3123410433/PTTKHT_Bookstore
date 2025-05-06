import db from '../../config/database.js';

class Customer {
    // Get all customers
    async getAllCustomers() {
        try {
            const [rows] = await db.execute('SELECT * FROM KhachHang ORDER BY ID_KH DESC');
            return rows;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    }

    // Get customer by ID
    async getCustomerById(customerId) {
        try {
            const [rows] = await db.execute('SELECT * FROM KhachHang WHERE ID_KH = ?', [customerId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching customer by ID:', error);
            throw error;
        }
    }

    // Get customer by username
    async getCustomerByUsername(username) {
        try {
            const [rows] = await db.execute('SELECT * FROM KhachHang WHERE TenTK = ?', [username]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching customer by username:', error);
            throw error;
        }
    }

    // Create a new customer
    async createCustomer(customerData) {
        try {
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = customerData;
            const query = 'INSERT INTO KhachHang (TenTK, TenKH, SDT, NgaySinh, MatKhau) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [TenTK, TenKH, SDT, NgaySinh, MatKhau]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }

    // Update customer
    async updateCustomer(customerId, customerData) {
        try {
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = customerData;
            
            let query = 'UPDATE KhachHang SET TenTK = ?, TenKH = ?, SDT = ?, NgaySinh = ?';
            let params = [TenTK, TenKH, SDT, NgaySinh];
            
            // Add password to update if provided
            if (MatKhau) {
                query += ', MatKhau = ?';
                params.push(MatKhau);
            }
            
            query += ' WHERE ID_KH = ?';
            params.push(customerId);
            
            const [result] = await db.execute(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    }

    // Delete customer
    async deleteCustomer(customerId) {
        try {
            // You might want to add additional logic here if there are foreign key constraints
            // For example, delete customer addresses first or other related records
            
            const [result] = await db.execute('DELETE FROM KhachHang WHERE ID_KH = ?', [customerId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    }

    // Get customer addresses
    async getCustomerAddresses(customerId) {
        try {
            const [rows] = await db.execute('SELECT * FROM DiaChi WHERE ID_KH = ?', [customerId]);
            return rows;
        } catch (error) {
            console.error('Error fetching customer addresses:', error);
            throw error;
        }
    }
}

export default new Customer();