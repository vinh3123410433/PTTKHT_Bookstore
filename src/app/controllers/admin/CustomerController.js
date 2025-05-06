// app/controllers/admin/CustomerController.js
import Customer from "../../model/admin/customerModel.js";
import phanquyen from "../../model/admin/phanquyenModel.js";
import bcrypt from "bcrypt";

class CustomerController {
    // Show customer list page
    async index(req, res) {
        try {
            const customers = await Customer.getAllCustomers();
            
            // Get user permissions
            let permissions;
            if (req.session.cachedPermissions) {
                permissions = req.session.cachedPermissions;
            } else {
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
            
            res.render('admin/customers/index', {
                layout: 'admin',
                title: 'Quản lý khách hàng',
                customers,
                user: req.session.user,
                permissions
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            req.session.error = 'Có lỗi xảy ra khi tải danh sách khách hàng';
            res.redirect('/admin/dashboard');
        }
    }

    // Show create customer page
    async showCreate(req, res) {
        try {
            // Get user permissions
            let permissions;
            if (req.session.cachedPermissions) {
                permissions = req.session.cachedPermissions;
            } else {
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
            
            res.render('admin/customers/create', {
                layout: 'admin',
                title: 'Thêm khách hàng mới',
                user: req.session.user,
                permissions
            });
        } catch (error) {
            console.error('Error rendering create customer page:', error);
            req.session.error = 'Có lỗi xảy ra khi hiển thị trang tạo khách hàng';
            res.redirect('/admin/customers');
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
                return res.redirect('/admin/customers/create');
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
            res.redirect('/admin/customers');
        } catch (error) {
            console.error('Error creating customer:', error);
            req.session.error = 'Có lỗi xảy ra khi tạo khách hàng';
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
            
            // Get user permissions
            let permissions;
            if (req.session.cachedPermissions) {
                permissions = req.session.cachedPermissions;
            } else {
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
            
            res.render('admin/customers/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa khách hàng',
                customer,
                user: req.session.user,
                permissions
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
            
            // Get the original customer
            const originalCustomer = await Customer.getCustomerById(customerId);
            if (!originalCustomer) {
                req.session.error = 'Không tìm thấy khách hàng';
                return res.redirect('/admin/customers');
            }
            
            // Check if username is being changed and already exists
            if (TenTK !== originalCustomer.TenTK) {
                const existingCustomer = await Customer.getCustomerByUsername(TenTK);
                if (existingCustomer) {
                    req.session.error = 'Tên tài khoản đã tồn tại';
                    return res.redirect(`/admin/customers/edit/${customerId}`);
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
            res.redirect('/admin/customers');
        } catch (error) {
            console.error('Error updating customer:', error);
            req.session.error = 'Có lỗi xảy ra khi cập nhật thông tin khách hàng';
            res.redirect(`/admin/customers/edit/${req.params.id}`);
        }
    }

    // Handle delete customer
    async delete(req, res) {
        try {
            const customerId = req.params.id;
            await Customer.deleteCustomer(customerId);
            
            req.session.success = 'Xóa khách hàng thành công';
            res.redirect('/admin/customers');
        } catch (error) {
            console.error('Error deleting customer:', error);
            req.session.error = 'Có lỗi xảy ra khi xóa khách hàng';
            res.redirect('/admin/customers');
        }
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
            
            // Get user permissions
            let permissions;
            if (req.session.cachedPermissions) {
                permissions = req.session.cachedPermissions;
            } else {
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
            
            res.render('admin/customers/details', {
                layout: 'admin',
                title: 'Chi tiết khách hàng',
                customer,
                addresses,
                user: req.session.user,
                permissions
            });
        } catch (error) {
            console.error('Error fetching customer details:', error);
            req.session.error = 'Có lỗi xảy ra khi tải chi tiết khách hàng';
            res.redirect('/admin/customers');
        }
    }
}

export default new CustomerController();