import prisma from '../utils/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import DeviceDetector from 'node-device-detector';

const detector = new DeviceDetector();

export const balance = async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        userId: req.userId,
      },
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
      balance: parseFloat(account.balance),
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const transfer = async (req, res) => {
  try {
    const { amount, to, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer amount' });
    }

    const account = await prisma.account.findUnique({
      where: { userId: req.userId },
    });

    if (!account) {
      console.error('Sender account not found for userId:', req.userId);
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const toAccount = await prisma.account.findUnique({
      where: { userId: to },
    });

    if (!toAccount) {
      console.error('Recipient account not found for userId:', to);
      return res.status(404).json({ message: 'Recipient account not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newBalance = account.balance - parseFloat(amount);

      await tx.account.update({
        where: { userId: req.userId },
        data: { balance: newBalance },
      });

      await tx.account.update({
        where: { userId: to },
        data: { balance: toAccount.balance + parseFloat(amount) },
      });

      const transaction = await tx.transaction.create({
        data: {
          transactionId: uuidv4(),
          transaction: parseFloat(amount),
          balance: newBalance,
          userId: req.userId,
          recipientId: to,
          note: note || '',
        },
      });

      const sender = await tx.user.findUnique({
        where: { id: req.userId },
        select: { firstName: true, lastName: true },
      });

      const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown';

      const notificationMessage = note
        ? `You have received Rs. ${amount} from ${senderName}. Note: "${note}"`
        : `You have received Rs. ${amount} from ${senderName}.`;

      await tx.notification.create({
        data: {
          userId: to,
          title: 'Money Transfer Received',
          message: notificationMessage,
          type: 'transfer',
        },
      });

      const userAgent = req.headers['user-agent'];
      const detectedDevice = detector.detect(userAgent);

      await tx.userLog.create({
        data: {
          userId: req.userId,
          activityType: 'Money Transfer',
          transactionId: transaction.transactionId,
          os: detectedDevice.os ? detectedDevice.os.name : 'Unknown OS',
          browser: detectedDevice.client ? detectedDevice.client.name : 'Unknown Browser',
          device: detectedDevice.device ? detectedDevice.device.type : 'Unknown Device',
        },
      });

      return transaction;
    });

    const updatedAccount = await prisma.account.findUnique({
      where: { userId: req.userId },
    });

    return res.json({
      message: 'Transfer successful',
      balance: parseFloat(updatedAccount.balance),
    });
  } catch (error) {
    console.error('Transfer Error:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getLatestTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ userId: req.userId }, { recipientId: req.userId }],
      },
      orderBy: { createdAt: 'desc' },
    });

    const allTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const isSent = transaction.userId === req.userId;
        const counterpartId = isSent ? transaction.recipientId : transaction.userId;

        const counterpartUser = await prisma.user.findUnique({
          where: { id: counterpartId },
          select: { firstName: true, lastName: true, email: true, avatar: true },
        });

        return {
          ...transaction,
          transaction: parseFloat(transaction.transaction),
          balance: parseFloat(transaction.balance),
          counterpartName: counterpartUser
            ? `${counterpartUser.firstName} ${counterpartUser.lastName}`
            : 'Unknown',
          counterpartEmail: counterpartUser ? counterpartUser.email : 'Unknown',
          counterpartAvatar: counterpartUser ? counterpartUser.avatar : '',
          transactionType: isSent ? 'Sent' : 'Received',
          amount: parseFloat(transaction.transaction),
        };
      })
    );

    return res.json({
      transactions: allTransactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    return res.status(500).json({ message: 'Error fetching transactions: ' + error.message });
  }
};