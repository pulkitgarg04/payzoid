import express from 'express';
import { Message } from '../models/message.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { senderId, recipientId, text } = req.body;
        // console.log("senderId: ", senderId, "recipientId", recipientId, "text", text);
        if (!senderId || !recipientId || !text) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const message = new Message({ senderId, recipientId, text });
        await message.save();

        res.status(201).json({ message: 'Message sent successfully.', data: message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message.' });
        console.log(error);
    }
});

router.get('/:userId1/:userId2', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId1, recipientId: userId2 },
                { senderId: userId2, recipientId: userId1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

export default router;