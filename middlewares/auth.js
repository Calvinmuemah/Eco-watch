export const protect = async (req, res, next) => {
    try {
        let token

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'not authorized. please log in to access this resource'
            })

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'user not found. token invalid.'
            })
        }

        if (!req.user.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'your account has been deactivated.'
            });
        }

        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'invalid token. please log in'
            })
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'token expired. please log in again.'
            });
        }

        return res.status(401).json({
            status: 'error',
            message: 'not authorized to access this resource.'
        });
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated'
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Role '${req.user.role}' is not authorized to access this resource. Required roles: ${roles.join(', ')}`
            });
        }

        next()
    }
}