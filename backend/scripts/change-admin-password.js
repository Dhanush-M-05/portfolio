import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function changePassword() {
  const newPassword = process.argv[2] || process.env.ADMIN_PASSWORD;
  const newEmail = process.argv[3] || process.env.ADMIN_EMAIL;

  if (!newPassword) {
    console.log('\n❌ Please provide a new password or set ADMIN_PASSWORD in .env:');
    console.log('   node scripts/change-admin-password.js <new_password> [optional_new_email]\n');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.log('\n❌ Password must be at least 6 characters long.\n');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.adminUser.findFirst();

  if (!admin) {
    console.log('❌ No admin user found in database. Run `npm run prisma:seed` first.');
    process.exit(1);
  }

  const updated = await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      passwordHash: hashedPassword,
      ...(newEmail ? { email: newEmail } : {}),
    },
  });

  console.log('\n🎉 Admin credentials updated successfully!');
  console.log(`   Email / Username: ${updated.email} (or ${updated.username})`);
  console.log(`   New Password:     ${newPassword}\n`);
}

changePassword()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
