import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import ENV from '../config/environment.js';

/**
 * Synchronizes admin credentials from .env to the database on server start
 * so changing ADMIN_PASSWORD in .env immediately updates database auth.
 */
export const syncAdminCredentials = async () => {
  if (!ENV.ADMIN_PASSWORD) return;

  try {
    const admin = await prisma.adminUser.findFirst();
    if (!admin) return;

    const isMatch = await bcrypt.compare(ENV.ADMIN_PASSWORD, admin.passwordHash);
    const emailMatches = !ENV.ADMIN_EMAIL || admin.email === ENV.ADMIN_EMAIL;

    if (!isMatch || !emailMatches) {
      const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD, 10);
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          passwordHash: hashedPassword,
          ...(ENV.ADMIN_EMAIL ? { email: ENV.ADMIN_EMAIL } : {}),
        },
      });
      console.log(`🔐 Admin credentials updated from .env (${ENV.ADMIN_EMAIL || admin.email})`);
    }
  } catch (error) {
    console.warn('⚠️ Could not sync admin credentials from .env:', error.message);
  }
};

export default syncAdminCredentials;
