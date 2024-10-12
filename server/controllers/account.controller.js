import mongoose from 'mongoose';
import { Account } from '../models/account.model.js';
import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';
import { userLog } from '../models/userLog.model.js';
import { v4 as uuidv4 } from 'uuid';

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

      const { amount, to, note } = req.body;

      if (!amount || amount <= 0) {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Invalid transfer amount' });
      }

      const account = await Account.findOne({ userId: req.userId }).session(session);
      if (!account) {
          console.error('Sender account not found for userId:', req.userId);
          await session.abortTransaction();
          return res.status(404).json({ message: 'Account not found' });
      }

      if (account.balance < amount) {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Insufficient balance' });
      }

      const toAccount = await Account.findOne({ userId: to }).session(session);
      if (!toAccount) {
          console.error('Recipient account not found for userId:', to);
          await session.abortTransaction();
          return res.status(404).json({ message: 'Recipient account not found' });
      }

      const newBalance = account.balance - amount;

      await Account.updateOne(
          { userId: req.userId },
          { $inc: { balance: -amount } }
      ).session(session);

      await Account.updateOne(
          { userId: to },
          { $inc: { balance: amount } }
      ).session(session);

      const transaction = new Transaction({
          transactionId: uuidv4(),
          date: new Date(),
          transaction: -amount,
          balance: newBalance,
          userId: req.userId,
          recipientId: to,
          note,
      });

      await transaction.save({ session });
      await session.commitTransaction();

      const updatedAccount = await Account.findOne({ userId: req.userId });

      return res.json({
          message: 'Transfer successful',
          balance: updatedAccount.balance,
      });

  } catch (error) {
      console.error('Transfer Error:', error);
      await session.abortTransaction();
      return res.status(500).json({ message: 'Server Error', error: error.message });

  } finally {
      session.endSession();
  }
};

export const getLatestTransactions = async (req, res) => {
  try {
    // Find transactions where the user is either the sender or the recipient
    const transactions = await Transaction.find({
      $or: [
        { userId: req.userId },          // Transactions sent by the user
        { recipientId: req.userId }      // Transactions received by the user
      ]
    }).sort({ createdAt: -1 });

    const allTransactions = await Promise.all(transactions.map(async (transaction) => {
      // Get recipient details
      const recipient = await User.findById(transaction.recipientId).select('firstName lastName email');

      // Determine if the transaction was sent or received
      const isSent = transaction.userId.toString() === req.userId.toString();

      return {
        ...transaction._doc,
        recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown',
        recipientEmail: recipient ? recipient.email : 'Unknown',
        transactionType: isSent ? 'Sent' : 'Received',
        amount: isSent ? -transaction.transaction : transaction.transaction, // Negative for sent, positive for received
      };
    }));

    return res.json({
      transactions: allTransactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    return res.status(500).json({ message: 'Error fetching transactions: ' + error.message });
  }
};
