// app/controllers/sales/CustomerController.js
import Customer from "../../model/admin/customerModel.js";
import phanquyen from "../../model/admin/phanquyenModel.js";
import bcrypt from "bcrypt";

class SalesCustomerController {
    constructor() {
        // Bind the methods to preserve 'this' context
        this.index = this.index.bind(this);
        this.showCreate = this.showCreate.bind(this);
        this.create = this.create.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.showDetails = this.showDetails.bind(this);
    }

    // Helper method to get permissions
    async getPermissions(req) {
        let permissions = [];
        try {
            if (req.session.cachedPermissions) {
                permissions = req.session.cachedPermissions;
            } else if (req.session.user && req.session.user.idNQ) {
                const viewPermissions = await phanquyen.findPAccessIdNhomQuyen(
                    req.session.user.idNQ, 
                    "view"
                );
                
                const allPermissions = await phanquyen.findPAccessIdNhomQuyen(
                    req.session.user.idNQ, 
                    "all"
                );

                permissions = [
                    ...viewPermissions.map(p => p.ChucNang),
                    ...allPermissions.map(p => p.ChucNang)
                ];
                
                // Cache the permissions in the session
                req.session.cachedPermissions = permissions;
            }
        } catch (permError) {
            console.error('Error getting permissions:', permError);
            // Continue with empty permissions if error occurs
        }
        return permissions;
    }

    // Show customer list page
    async index(req, res) {
        try {
            // Check if user is authenticated
            if (!req.session.user) {
                return res.redirect('/admin/sales/login');
            }
            
            const customers = await Customer.getAllCustomers();
            const permissions = await this.getPermissions(req);
            
            // Store flash messages to local variables and clear them before rendering
            const successMsg = req.session.success;
            const errorMsg = req.session.error;
            req.session.success = null;
            req.session.error = null;
            
            return res.render('sales/customers/index', {
                layout: 'sales',
                title: 'Quản lý khách hàng',
                customers,
                user: req.session.user,
                permissions,
                currentPath: req.path,
                success: successMsg,
                error: errorMsg,
                helpers: {
                    formatDate: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toLocaleDateString('vi-VN');
                    },
                    formatDateValue: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toISOString().split('T')[0];
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            return res.redirect('/admin/sales');
        }
    }

    // Show create customer page
    async showCreate(req, res) {
        try {
            // Check if user is authenticated
            if (!req.session.user) {
                return res.redirect('/admin/sales/login');
            }
            
            const permissions = await this.getPermissions(req);
            
            // Store flash messages to local variables and clear them before rendering
            const successMsg = req.session.success;
            const errorMsg = req.session.error;
            req.session.success = null;
            req.session.error = null;
            
            return res.render('sales/customers/create', {
                layout: 'sales',
                title: 'Thêm khách hàng mới',
                user: req.session.user,
                permissions,
                currentPath: req.path,
                success: successMsg,
                error: errorMsg,
                helpers: {
                    formatDate: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toLocaleDateString('vi-VN');
                    },
                    formatDateValue: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toISOString().split('T')[0];
                    }
                }
            });
        } catch (error) {
            console.error('Error rendering create customer page:', error);
            return res.redirect('/admin/sales/khachhang');
        }
    }

    // Handle create customer
    async create(req, res) {
        try {
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = req.body;
            
            // Check if username already exists
            const existingCustomer = await Customer.getCustomerByUsername(TenTK);
            if (existingCustomer) {
                req.session.error = 'Tên tài khoản đã tồn tại';
                return res.redirect('/admin/sales/khachhang/create');
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(MatKhau, 10);
            
            // Create customer
            await Customer.createCustomer({
                TenTK,
                TenKH,
                SDT,
                NgaySinh: NgaySinh || null,
                MatKhau: hashedPassword
            });
            
            req.session.success = 'Tạo khách hàng thành công';
            return res.redirect('/admin/sales/khachhang');
        } catch (error) {
            console.error('Error creating customer:', error);
            req.session.error = 'Có lỗi xảy ra khi tạo khách hàng';
            return res.redirect('/admin/sales/khachhang/create');
        }
    }

    // Show edit customer page
    async showEdit(req, res) {
        try {
            // Check if user is authenticated
            if (!req.session.user) {
                return res.redirect('/admin/sales/login');
            }
            
            const customerId = req.params.id;
            const customer = await Customer.getCustomerById(customerId);
            
            if (!customer) {
                req.session.error = 'Không tìm thấy khách hàng';
                return res.redirect('/admin/sales/khachhang');
            }
            
            const permissions = await this.getPermissions(req);
            
            // Store flash messages to local variables and clear them before rendering
            const successMsg = req.session.success;
            const errorMsg = req.session.error;
            req.session.success = null;
            req.session.error = null;
            
            return res.render('sales/customers/edit', {
                layout: 'sales',
                title: 'Chỉnh sửa khách hàng',
                customer,
                user: req.session.user,
                permissions,
                currentPath: req.path,
                success: successMsg,
                error: errorMsg,
                helpers: {
                    formatDate: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toLocaleDateString('vi-VN');
                    },
                    formatDateValue: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toISOString().split('T')[0];
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching customer for edit:', error);
            req.session.error = 'Có lỗi xảy ra khi tải thông tin khách hàng';
            return res.redirect('/admin/sales/khachhang');
        }
    }

    // Handle update customer
    async update(req, res) {
        try {
            const customerId = req.params.id;
            const { TenTK, TenKH, SDT, NgaySinh, MatKhau } = req.body;
            
            // Get the original customer
            const originalCustomer = await Customer.getCustomerById(customerId);
            if (!originalCustomer) {
                req.session.error = 'Không tìm thấy khách hàng';
                return res.redirect('/admin/sales/khachhang');
            }
            
            // Check if username is being changed and already exists
            if (TenTK !== originalCustomer.TenTK) {
                const existingCustomer = await Customer.getCustomerByUsername(TenTK);
                if (existingCustomer) {
                    req.session.error = 'Tên tài khoản đã tồn tại';
                    return res.redirect(`/admin/sales/khachhang/edit/${customerId}`);
                }
            }
            
            // Prepare updated customer data
            const updatedCustomer = {
                TenTK,
                TenKH,
                SDT,
                NgaySinh: NgaySinh || null
            };
            
            // Update password if provided
            if (MatKhau && MatKhau.trim() !== '') {
                updatedCustomer.MatKhau = await bcrypt.hash(MatKhau, 10);
            }
            
            // Update customer
            await Customer.updateCustomer(customerId, updatedCustomer);
            
            req.session.success = 'Cập nhật thông tin khách hàng thành công';
            return res.redirect('/admin/sales/khachhang');
        } catch (error) {
            console.error('Error updating customer:', error);
            req.session.error = 'Có lỗi xảy ra khi cập nhật thông tin khách hàng';
            return res.redirect(`/admin/sales/khachhang/edit/${req.params.id}`);
        }
    }

    // Handle delete customer
    async delete(req, res) {
        try {
            const customerId = req.params.id;
            await Customer.deleteCustomer(customerId);
            
            req.session.success = 'Xóa khách hàng thành công';
            return res.redirect('/admin/sales/khachhang');
        } catch (error) {
            console.error('Error deleting customer:', error);
            req.session.error = 'Có lỗi xảy ra khi xóa khách hàng';
            return res.redirect('/admin/sales/khachhang');
        }
    }

    // Show customer details page
    async showDetails(req, res) {
        try {
            // Check if user is authenticated
            if (!req.session.user) {
                return res.redirect('/admin/sales/login');
            }
            
            const customerId = req.params.id;
            const customer = await Customer.getCustomerById(customerId);
            
            if (!customer) {
                req.session.error = 'Không tìm thấy khách hàng';
                return res.redirect('/admin/sales/khachhang');
            }
            
            // Get customer addresses
            const addresses = await Customer.getCustomerAddresses(customerId);
            const permissions = await this.getPermissions(req);
            
            // Store flash messages to local variables and clear them before rendering
            const successMsg = req.session.success;
            const errorMsg = req.session.error;
            req.session.success = null;
            req.session.error = null;
            
            return res.render('sales/customers/details', {
                layout: 'sales',
                title: 'Chi tiết khách hàng',
                customer,
                addresses,
                user: req.session.user,
                permissions,
                currentPath: req.path,
                success: successMsg,
                error: errorMsg,
                helpers: {
                    formatDate: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toLocaleDateString('vi-VN');
                    },
                    formatDateValue: function(date) {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toISOString().split('T')[0];
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching customer details:', error);
            req.session.error = 'Có lỗi xảy ra khi tải chi tiết khách hàng';
            return res.redirect('/admin/sales/khachhang');
        }
    }
}

export default new SalesCustomerController();