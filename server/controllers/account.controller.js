import mongoose from 'mongoose';
import { Account } from '../models/account.model.js';
import { Transaction } from '../models/transactions.model.js';

export const balance = async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    res.json({
      balance: account.balance,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};

export const transfer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { amount, to } = req.body;

    if (amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Invalid transfer amount',
      });
    }

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Insufficient balance',
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Invalid account',
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    const transaction = new Transaction({
      date: new Date(),
      transactionId: mongoose.Types.ObjectId(),
      name: account.firstName + `${account.lastName ? ' ' + account.lastName : ''}`,
      email: account.email,
      transaction: amount,
      balance: account.balance - amount,
      userId: req.userId,
      recipientId: to,
    });

    await transaction.save({ session });

    await session.commitTransaction();

    const updatedAccount = await Account.findOne({ userId: req.userId });
    return res.json({
      message: 'Transfer successful',
      balance: updatedAccount.balance,
    });

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Server Error', error: error.message });

  } finally {
    session.endSession();
  }
};

const getLatestTransactions = async (userId, limit = 10) => {
  try {
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return transactions;
  } catch (error) {
    throw new Error('Error fetching transactions: ' + error.message);
  }
};