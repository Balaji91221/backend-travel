// Import dependencies
const jwt = require('jsonwebtoken');

// Middleware for Authentication and Role-Based Access Control
const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Check for token in headers
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Check role authorization
            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token.', error });
        }
    };
};

module.exports = authMiddleware;
