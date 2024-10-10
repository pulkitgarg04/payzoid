import mongoose from 'mongoose';
import { Account } from '../db.js';

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

    // Validate input
    if (amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Invalid transfer amount',
      });
    }

    // Fetch the accounts within the transaction
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

    // Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Commit the transaction
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