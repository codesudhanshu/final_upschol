const jwt = require('jsonwebtoken');
const serviceResponse = require('./serviceResponse.js');

const verifyAdminToken = function(req, res, next) {
    const authorization = req.headers['authorization'];
    
    if (!authorization) {
        return res.status(403).send(serviceResponse({ 
            error: { message: 'Token missing, Please login again' } 
        }));
    }

    const tokenBearer = authorization.split(' ');
    if (tokenBearer.length !== 2 || tokenBearer[0] !== 'Bearer') {
        return res.status(403).send(serviceResponse({ 
            error: { message: 'Invalid token format' } 
        }));
    }

    const token = tokenBearer[1];
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).send(serviceResponse({ 
                error: { message: 'Unauthorized' } 
            }));
        }
        
        req.id = decoded.id;
        req.phone = decoded.phone;
        req.email = decoded.email;
        console.log(req)
        next();
    });
};


module.exports = {
    verifyAdminToken,
};