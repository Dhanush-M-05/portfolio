const { prisma } = require('../config/database');
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require('../utils/apiResponse');
const { sendContactNotification } = require('../services/emailService');

/**
 * Public endpoint to submit a contact message
 * POST /api/contact
 */
async function submitContactMessage(req, res) {
  const { name, email, subject, message } = req.body;

  // Step 2: Save the message into MySQL ContactMessage table
  const newMessage = await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      isRead: false,
    },
  });

  // Step 3: Send an email notification to CONTACT_RECEIVER_EMAIL
  let emailDelivery = { delivered: false };
  try {
    emailDelivery = await sendContactNotification({
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject,
      message: newMessage.message,
      createdAt: newMessage.createdAt,
    });
  } catch (emailError) {
    // Safely log error without leaking credentials or internal details
    console.error('[ContactController] Email delivery exception:', emailError.message);
  }

  // Step 4: Return response indicating message status
  // Database save is preserved regardless of SMTP delivery status
  const responseMessage = emailDelivery.delivered
    ? 'Message sent successfully'
    : 'Your message was received and saved successfully, but the email notification could not be delivered at this time.';

  return successResponse(
    res,
    {
      id: newMessage.id,
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject,
      createdAt: newMessage.createdAt,
      emailDelivered: Boolean(emailDelivery.delivered),
    },
    responseMessage,
    201
  );
}

/**
 * Admin: Get all contact messages with pagination & filter
 * GET /api/contact
 */
async function getContactMessages(req, res) {
  const { page, limit, isRead } = req.query;

  const where = {};
  if (isRead !== undefined) {
    where.isRead = isRead === 'true';
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [total, messages] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
  ]);

  return paginatedResponse(
    res,
    messages,
    total,
    pageNum,
    limitNum,
    'Contact messages retrieved successfully'
  );
}

/**
 * Admin: Get single contact message by ID
 * GET /api/contact/:id
 */
async function getContactMessageById(req, res) {
  const { id } = req.params;

  const message = await prisma.contactMessage.findUnique({
    where: { id: Number(id) },
  });

  if (!message) {
    return errorResponse(res, 'Contact message not found', 404);
  }

  return successResponse(res, message, 'Contact message retrieved successfully');
}

/**
 * Admin: Mark message as read/unread
 * PATCH /api/contact/:id/read
 */
async function markMessageAsRead(req, res) {
  const { id } = req.params;
  const { isRead } = req.body;

  const updatedMessage = await prisma.contactMessage.update({
    where: { id: Number(id) },
    data: {
      isRead: isRead !== undefined ? Boolean(isRead) : true,
    },
  });

  return successResponse(
    res,
    updatedMessage,
    `Message marked as ${updatedMessage.isRead ? 'read' : 'unread'}`
  );
}

/**
 * Admin: Delete contact message
 * DELETE /api/contact/:id
 */
async function deleteContactMessage(req, res) {
  const { id } = req.params;

  await prisma.contactMessage.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Contact message deleted successfully');
}

module.exports = {
  submitContactMessage,
  getContactMessages,
  getContactMessageById,
  markMessageAsRead,
  deleteContactMessage,
};
