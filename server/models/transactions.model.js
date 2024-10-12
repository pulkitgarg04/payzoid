import mongoose from 'mongoose';

const TransactionSchema = mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
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
    },
    userType: {
        type: String,
        default: 'send',
        required: true,
    },
    recipientType: {
        type: String,
        default: 'receive',
        required: true,
    },
    note: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);