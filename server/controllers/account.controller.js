import mongoose from 'mongoose';
import { Account } from '../models/account.model.js';
import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';
import { userLog } from '../models/userLog.model.js';
import { Notification } from '../models/notifications.model.js';
import { v4 as uuidv4 } from 'uuid';
import DeviceDetector from 'node-device-detector';

const detector = new DeviceDetector();

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

      const notification = new Notification({
        userId: to,
        title: "Money Transfer Received",
        message: `You have received $${amount} from ${req.userId}.`,
        type: "transfer",
      });
  
      await notification.save({ session });

      const userAgent = req.headers['user-agent'];
      const detectedDevice = detector.detect(userAgent);  

      await userLog.create([{
        userId: req.userId,
        activityType: 'Money Transfer',
        transactionId: transaction.transactionId,
        os: detectedDevice.os ? detectedDevice.os.name : 'Unknown OS',
        browser: detectedDevice.client ? detectedDevice.client.name : 'Unknown Browser',
        device: detectedDevice.device ? detectedDevice.device.type : 'Unknown Device',
      }], { session });
      
      await session.commitTransaction();

      const updatedAccount = await Account.findOne({ userId: req.userId });

      return res.json({
          message: 'Transfer successful',
          balance: updatedAccount.balance,
      });

  } catch (error) {
      // console.error('Transfer Error:', error);
      await session.abortTransaction();
      return res.status(500).json({ message: 'Server Error', error: error.message });

  } finally {
      session.endSession();
  }
};

export const getLatestTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { userId: req.userId },
        { recipientId: req.userId }
      ]
    }).sort({ createdAt: -1 });

    const allTransactions = await Promise.all(transactions.map(async (transaction) => {
      const isSent = transaction.userId.toString() === req.userId.toString();
      const counterpartId = isSent ? transaction.recipientId : transaction.userId;

      const counterpartUser = await User.findById(counterpartId).select('firstName lastName email');

      return {
        ...transaction._doc,
        counterpartName: counterpartUser ? `${counterpartUser.firstName} ${counterpartUser.lastName}` : 'Unknown',
        counterpartEmail: counterpartUser ? counterpartUser.email : 'Unknown',
        counterpartAvatar: counterpartUser ? counterpartUser.avatar : '',
        transactionType: isSent ? 'Sent' : 'Received',
        amount: transaction.transaction,
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