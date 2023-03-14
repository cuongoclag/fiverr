import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createError from '../utils/createError.js'

export const register = async (req, res, next) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10)
        const newUser = new User({
            ...req.body,
            password: hash
        })
        
        await newUser.save();
        res.status(201).send('User has been created')
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({username : req.body.username})
        if(!user) return next(createError(404, 'User not found'))
        const correctPass = bcrypt.compareSync(req.body.password, user.password)
        if(!correctPass) next(createError(404, 'Wrong password or username'))
        
        const accessToken = jwt.sign({
            id: user._id,
            isSeller: user.isSeller
        }, process.env.JWT_KEY,
        { expiresIn: '7d'}
        )

        const {password, ...info} = user._doc
        res.status(200).send({...info, accessToken})
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    res.clearCookie('accessToken', {
        sameSite: 'none',
        secure: true
    }).status(200).send('User has been logged out')
}
