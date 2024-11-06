import { Request, Response, NextFunction } from 'express';

// Middleware function that checks for admin access
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole === 'admin') {
        // If user role is admin, allow the request to continue
        next(); // Call next() to pass control to the next middleware or route handler
    } else {
        // If user role is not admin, deny access
        res.status(403).json({
            status: 403,
            message: 'Forbidden: Only admins can perform this action.'
        });
    }
};
export default isAdmin