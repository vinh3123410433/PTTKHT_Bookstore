const UserModel = require('../model/userModel');

const renderAccountPage = async (req, res, next) => {
    try {
        const data = await UserModel.getInforUser(req.session.user_id);
        const fullName = data[0].TenKH || "";
        const [firstName, ...rest] = fullName.split(" ");
        const user_name = firstName;
        const user_lastname = rest.join(" ");
        const phone = data[0].SDT;

        let rawDate = data[0].NgaySinh;
        if (rawDate instanceof Date) {
            rawDate = rawDate.toISOString().split("T")[0]; // yyyy-mm-dd
        }

        const [yearOfBirth, monthOfBirth, dateOfBirth] = rawDate.split("-");

        res.render('account', {
            user_name,
            user_lastname,
            dateOfBirth,
            monthOfBirth,
            yearOfBirth,
            user: data[0],
            session: req.session
            
        });
    } catch (err) {
        console.error("Lỗi tại renderAccountPage:", err);
        next(err);
    }
};

const changeUserInfo = async (req, res, next) => {
    const { dateOfBirth, monthOfBirth, yearOfBirth, user_name, user_lastname, user_telephone } = req.body;
    const userfullName = user_lastname.trim() +" "+  user_name.trim() ;
    const isValidDate = /^(0?[1-9]|[12][0-9]|3[01])$/.test(dateOfBirth);
    const isValidMonth = /^(0?[1-9]|1[0-2])$/.test(monthOfBirth);
    const isValidYear = parseInt(yearOfBirth) < new Date().getFullYear();
    const isValidPhone = !user_telephone || /^0\d{9}$/.test(user_telephone);

    if (!dateOfBirth || !monthOfBirth || !yearOfBirth || !user_name || !user_lastname) {
        return res.redirect(`/user/errorPage?error=${encodeURIComponent("nhập không đủ thông tin")}`);
    }

    if (!isValidDate || !isValidMonth || !isValidYear) {
        return res.redirect(`/user/errorPage?error=${encodeURIComponent("nhập sai giá trị")}`);
    }

    try {
        console.log(req.session.user_id)
        const user = await UserModel.getUserById(req.session.user_id);
        if (!user) {
            return res.redirect('/user/errorPage?error=' + encodeURIComponent("lỗi phiên làm việc"));
        }

        const birthDateStr = `${yearOfBirth}-${monthOfBirth}-${dateOfBirth}`;
        if(!user_telephone){
            await UserModel.updateUserInfoNoPhone(user.ID_KH, { TenKH : userfullName, NgaySinh: birthDateStr });
        }else if(isValidPhone){
            await UserModel.updateUserInfo(req.session.user_id, {
                SDT: user_telephone,
                TenKH : userfullName,
                NgaySinh: birthDateStr
            });
        }

        res.send('Đã cập nhật thành công');
    } catch (error) {
        console.error(error);
        next(error);
    }
};


const errorPage=async (req,res)=>{
    const errorMessage=req.query.error
    res.render('errorPage',{errorMessage:errorMessage})
}

const login = async (req, res, next) => {
    const { user_telephone, user_password } = req.body;

    if (!user_telephone || !user_password) {
        return res.redirect('/account?error=missing_fields');
    }

    try {
        const user = await UserModel.findUserByPhone(user_telephone);
        if (!user) {
            console.log("Không tìm thấy user với số điện thoại:", user_telephone);
            return res.redirect('/user/account?error=telephone_not_found');
        }
        
        console.log("User tìm được:", user);
        console.log("Mật khẩu của user là:", user.MatKhau);
        
        if (!user) {
            return res.redirect('/user/account?error=telephone_not_found');
        }

        if (user.MatKhau !== user_password) {
            return res.redirect('/user/account?error=incorrect_password');
        }
        
        req.session.user_id = user.ID_KH;
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

const changePasswordUser = async (req, res, next) => {
    const { user_old_password, user_new_password, user_confirm_new_password } = req.body;

    if (!user_old_password || !user_new_password || !user_confirm_new_password) {
        return res.redirect('/user/account?error=' + encodeURIComponent('Thiếu thông tin'));
    }

    if (user_new_password !== user_confirm_new_password) {
        return res.redirect('/user/account?error=' + encodeURIComponent('Mật khẩu xác nhận không khớp'));
    }

    try {
        
        const user = await UserModel.findUserByIdAndPassword(req.session.user_id, user_old_password);


        if (!user) {
            return res.redirect('/user/account?error=' + encodeURIComponent('Mật khẩu cũ không đúng'));
        }

        await UserModel.updatePassword(req.session.user_id, user_new_password);

        res.redirect('/user/account?success=' + encodeURIComponent('Đổi mật khẩu thành công'));
    } catch (error) {
        next(error);
    }
};
const registerUser = async (req, res, next) => {
    try {
        const { user_telephone, user_password, user_confirm_password, user_name, user_account_name } = req.body;

        if (!user_telephone) {
            return res.redirect('user/errorPage?error=' + encodeURIComponent('Chưa nhập số điện thoại'));
        }

        const existingUser = await UserModel.findUserByPhone(user_telephone);
        
        if (existingUser) {
            return res.redirect('user/errorPage?error=' + encodeURIComponent('Số điện thoại đã tồn tại'));
        }

        if (!user_password || !user_account_name || !user_name) {
            return res.redirect('user/errorPage?error=' + encodeURIComponent('Chưa nhập đủ thông tin'));
        }

        if (user_password !== user_confirm_password) {
            return res.redirect('user/errorPage?error=' + encodeURIComponent('Mật khẩu xác nhận không khớp'));
        }

        await UserModel.createUser({ user_account_name, user_name, user_telephone, user_password });
        return res.redirect('/');
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        return res.redirect('user/errorPage?error=' + encodeURIComponent('Đã xảy ra lỗi, vui lòng thử lại'));
    }
};

const logoutUser = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

module.exports = { 
    renderAccountPage,
    changeUserInfo,
    errorPage,
    login,
    changePasswordUser,
    registerUser,
    logoutUser,
};
