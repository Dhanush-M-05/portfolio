import prisma from '../config/database.js';
import emailService from '../services/emailService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Submit Contact Message
 * POST /api/contact
 */
export const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return errorResponse(res, 400, 'Name, email, and message are required');
  }

  // 1. Save message to MySQL
  const contactRecord = await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      isRead: false,
    },
  });

  // 2. Send notification email asynchronously via Resend
  emailService.sendContactNotificationEmail({
    name: contactRecord.name,
    email: contactRecord.email,
    subject: contactRecord.subject,
    message: contactRecord.message,
    createdAt: contactRecord.createdAt,
  }).catch((err) => {
    console.error('Email dispatch error (message saved safely in database):', err);
  });

  return successResponse(res, 201, 'Thank you! Your message has been sent successfully.', {
    id: contactRecord.id,
    name: contactRecord.name,
    email: contactRecord.email,
  });
};

/**
 * Get Contact Messages (Admin)
 * GET /api/contact
 */
export const getMessages = async (req, res) => {
  const { isRead, page, limit } = req.query;

  const where = {};
  if (isRead !== undefined) {
    where.isRead = isRead === 'true';
  }

  const take = limit ? parseInt(limit, 10) : undefined;
  const skip = page && limit ? (parseInt(page, 10) - 1) * take : undefined;

  const [messages, total, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Messages retrieved',
    data: messages,
    messages,
    total,
    unreadCount,
    page: page ? parseInt(page, 10) : 1,
  });
};

/**
 * Get Message by ID (Admin)
 * GET /api/contact/:id
 */
export const getMessageById = async (req, res) => {
  const { id } = req.params;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    return errorResponse(res, 404, 'Message not found');
  }

  return successResponse(res, 200, 'Message retrieved', message);
};

/**
 * Mark Message as Read/Unread (Admin)
 * PATCH /api/contact/:id/read
 */
export const markMessageRead = async (req, res) => {
  const { id } = req.params;
  const isRead = req.body.isRead !== undefined ? Boolean(req.body.isRead) : true;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Message not found');
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });

  return successResponse(res, 200, `Message marked as ${isRead ? 'read' : 'unread'}`, updated);
};

/**
 * Delete Contact Message (Admin)
 * DELETE /api/contact/:id
 */
export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Message not found');
  }

  await prisma.contactMessage.delete({ where: { id } });

  return successResponse(res, 200, 'Message deleted successfully');
};

export default {
  submitContact,
  getMessages,
  getMessageById,
  markMessageRead,
  deleteMessage,
};
