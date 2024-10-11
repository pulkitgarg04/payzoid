import mongoose from 'mongoose';

const TransactionSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    transaction: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);