import Message from '../models/message.model.js';

export const getChatHistory = async (req, res) => {
    try {
        const user1Id = req.params.user1Id;
        const user2Id = req.params.user2Id;
        const chatHistory = await Message.find({
            $or: [
                {
                    sender: user1Id,
                    receiver: user2Id
                },
                {
                    sender: user2Id,
                    receiver: user1Id
                },
            ],
        }).sort({ createdAt: 1 });
        res.json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};