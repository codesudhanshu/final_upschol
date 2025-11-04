const moment = require('moment')
const jwt = require('jsonwebtoken')

const AdminLoginToken = (userData) => {
    const token = jwt.sign(
        {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role_id: userData.role_id,
            login_time: moment().format()
        }, 
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );

    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role_id: userData.role_id,
        token,
        login_time: moment().format()
    };
};


module.exports = AdminLoginToken