import createError from "../utils/createError.js";
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return next(createError(401, 'You are not authenticated!'))

    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.JWT_KEY, async (err, payload) => {
        if (err) return next(createError(403, 'Token is not valid!'))

        req.userId = payload.id
        req.isSeller = payload.isSeller
        next()
    })
}