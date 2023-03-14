import createError from "../utils/createError.js"
import Gig from '../models/gig.model.js'

export const createGig = async (req, res, next) => {

    // if(!req.isSeller) return next(createError(403, 'Only sellers can create a gig'))

    try {
        const newGig = new Gig({
            userId: req.userId,
            ...req.body
        })
        const saveGig = await newGig.save();
        res.status(200).json(saveGig)
    } catch (error) {
        next(error)
    }
}

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if(gig.userId !== req.userId) return next(createError(403, 'You can delete only your gig!'));

        await Gig.findByIdAndDelete(req.params.id)
        res.status(200).send('Gig has been deleted!')
    } catch (error) {
        next(error)
    }
}

export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('userId')
        if(!gig) return next(createError(404, 'Gig not found'))

        res.status(200).send(gig)
    } catch (error) {
        next(error)
    }
}

export const getGigs = async (req, res, next) => {
    const q = req.query
    const filter = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {
            price: { ...(q.min && { $gte: q.min }), ...(q.max && { $lte: q.max })}
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" }})
    }
    try {
        const gigs = await Gig.find(filter)
        res.status(200).send(gigs)
    } catch (error) {
        next(error)
    }
}
