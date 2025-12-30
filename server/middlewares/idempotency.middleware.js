import prisma from '../utils/prisma.js';

const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';
const IDEMPOTENCY_TTL_HOURS = 24;

export const idempotencyMiddleware = async (req, res, next) => {
  const idempotencyKey = req.headers[IDEMPOTENCY_KEY_HEADER];

  if (!idempotencyKey) {
    return res.status(400).json({
      message: 'Idempotency-Key header is required for this operation',
    });
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(idempotencyKey)) {
    return res.status(400).json({
      message: 'Invalid Idempotency-Key format. Use UUID v4.',
    });
  }

  try {
    await prisma.idempotencyKey.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    const existingKey = await prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });

    if (existingKey) {
      if (existingKey.userId !== req.userId) {
        return res.status(403).json({
          message: 'Idempotency-Key belongs to a different user',
        });
      }

      return res.status(200).json(existingKey.response);
    }

    const originalJson = res.json.bind(res);

    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + IDEMPOTENCY_TTL_HOURS);

        prisma.idempotencyKey
          .create({
            data: {
              key: idempotencyKey,
              userId: req.userId,
              response: data,
              expiresAt,
            },
          })
          .catch((error) => {
            console.error('Error storing idempotency key:', error);
          });
      }

      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Idempotency middleware error:', error);
    return res.status(500).json({
      message: 'Error processing idempotency key',
    });
  }
};
