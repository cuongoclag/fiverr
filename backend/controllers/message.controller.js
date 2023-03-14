import Messages from '../models/message.model.js'
import Conversation from '../models/conversation.model.js'
export const createMessage = async (req, res, next) => {
    try {
        const newMessage = new Messages({
            conversationId: req.body.conversationId,
            userId: req.userId,
            desc: req.body.desc
        })

        const savedMessage = await newMessage.save()
        await Conversation.findOneAndUpdate(
            { id: req.body.conversationId },
            {
                $set: {
                    readBySeller: req.isSeller,
                    readByBuyer: !req.isSeller,
                    lastMessage: req.body.desc
                }
            },
            {
                new: true
            }
        )

        res.status(201).send(savedMessage)
    } catch (error) {
        next(error)
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const messages = await Messages.find({ conversationId: req.params.id })

        res.status(200).send(messages)
    } catch (error) {
        next(error)
    }
}