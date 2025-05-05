// controllers/admin/CustomerController.js
import Customer from '../../models/Customer.js';

class CustomerController {
    // Show customer list page
    async index(req, res) {
        try {
            const customers = await Customer.getAllCustomers();
            res.render('admin/customers/index', {
                layout: 'admin',
                title: 'Quản lý khách hàng',
                customers,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            req.session.error = 'Có lỗi xảy ra khi tải danh sách khách hàng';
            res.redirect('/admin/dashboard');
        }
    }

    // Show create customer page
    showCreate(req, res) {
        res.render('admin/customers/create', {
            layout: 'admin',
            title: 'Thêm khách hàng mới',
            user: req.session.user
        });
    }

    // Handle create customer
    async create(req, res) {
        try {
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = req.body;
            
            // Generate a new ID (should match your ID generation logic)
            const nextId = Math.floor(Math.random() * 10000) + 1;
            
            const newCustomer = {
                ID_KH: nextId,
                TenTK,
                TenKH,
                SDT,
                NgaySinh: NgaySinh || null,
                MatKhau
            };
            
            await Customer.createCustomer(newCustomer);
            
            req.session.success = 'Thêm khách hàng thành công';
            res.redirect('/admin/customers');
        } catch (error) {
            console.error('Error creating customer:', error);
            req.session.error = 'Có lỗi xảy ra khi thêm khách hàng';
            res.redirect('/admin/customers/create');
        }
    }

    // Show edit customer page
    async showEdit(req, res) {
        try {
            const customerId = req.params.id;
            const customer = await Customer.getCustomerById(customerId);
            
            if (!customer) {
                req.session.error = 'Không tìm thấy khách hàng';
                return res.redirect('/admin/customers');
            }
            
            res.render('admin/customers/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa khách hàng',
                customer,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error fetching customer for edit:', error);
            req.session.error = 'Có lỗi xảy ra khi tải thông tin khách hàng';
            res.redirect('/admin/customers');
        }
    }

    // Handle update customer
    async update(req, res) {
        try {
            const customerId = req.params.id;
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = req.body;
            
            const updatedCustomer = {
                TenTK,
                TenKH,
                SDT,
                NgaySinh: NgaySinh || null
            };
            
            // Only update password if it's provided
            if (MatKhau && MatKhau.trim() !== '') {
                updatedCustomer.MatKhau = MatKhau;
            }
            
            const success = await Customer.updateCustomer(customerId, updatedCustomer);
            
            if (!success) {
                req.session.error = 'Không thể cập nhật khách hàng';
                return res.redirect(`/admin/customers/edit/${customerId}`);
            }
            
            req.session.success = 'Cập nhật khách hàng thành công';
            res.redirect('/admin/customers');
        } catch (error) {
            console.error('Error updating customer:', error);
            req.session.error = 'Có lỗi xảy ra khi cập nhật khách hàng';
            res.redirect(`/admin/customers/edit/${req.params.id}`);
        }
    }

    // Handle delete customer
    async delete(req, res) {
        try {
            const customerId = req.params.id;
            const success = await Customer.deleteCustomer(customerId);
            
            if (!success) {
                req.session.error = 'Không thể xóa khách hàng';
            } else {
                req.session.success = 'Xóa khách hàng thành công';
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            req.session.error = 'Có lỗi xảy ra khi xóa khách hàng';
        }
        
        res.redirect('/admin/customers');
    }

    // Show customer details page
    async showDetails(req, res) {
        try {
            const customerId = req.params.id;
            const customer = await Customer.getCustomerById(customerId);
            
            if (!customer) {
                req.session.error = 'Không tìm thấy khách hàng';
                return res.redirect('/admin/customers');
            }
            
            // Get customer addresses
            const addresses = await Customer.getCustomerAddresses(customerId);
            
            res.render('admin/customers/details', {
                layout: 'admin',
                title: 'Chi tiết khách hàng',
                customer,
                addresses,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error fetching customer details:', error);
            req.session.error = 'Có lỗi xảy ra khi tải chi tiết khách hàng';
            res.redirect('/admin/customers');
        }
    }
}

export default new CustomerController();