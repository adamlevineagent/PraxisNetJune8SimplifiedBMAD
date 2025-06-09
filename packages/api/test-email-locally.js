#!/usr/bin/env node

/**
 * Local test for email service - runs directly without API server
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEmailLocally() {
  console.log('Testing email service locally...\n');

  try {
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if we have any admin users
    const adminCount = await prisma.adminUser.count();
    console.log(`✅ Found ${adminCount} admin users`);

    // Check if we have any pending users
    const pendingUsers = await prisma.user.count({
      where: { status: 'PENDING_APPROVAL' }
    });
    console.log(`✅ Found ${pendingUsers} pending approval users`);

    // Create a test user if needed
    if (pendingUsers === 0) {
      console.log('\n📝 Creating test user for email verification...');
      const testUser = await prisma.user.create({
        data: {
          username: 'emailtest',
          email: 'emailtest@example.com',
          passwordHash: '$2b$10$dummy', // Dummy hash
          handle: 'emailtest',
          status: 'PENDING_APPROVAL',
          onboardingStage: 'COMPLETED'
        }
      });
      console.log(`✅ Created test user: ${testUser.handle} (${testUser.id})`);
    }

    // Get a pending user
    const user = await prisma.user.findFirst({
      where: { status: 'PENDING_APPROVAL' }
    });

    if (user) {
      console.log(`\n📧 Test user ready: ${user.handle} (${user.email})`);
      console.log('\nEmail service would send to this user when approved.');
      console.log('Run the API server and use the verification script to test actual email sending.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailLocally();