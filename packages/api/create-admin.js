const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creating new admin user...');
    
    const email = 'adamlevinemobile@gmail.com';
    const password = 'password';
    const role = 'ADMIN';
    
    // Check if admin user already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });
    
    if (existingAdmin) {
      console.log(`⚠️  Admin user with email ${email} already exists.`);
      console.log('Updating password for existing admin...');
      
      // Hash the new password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Update existing admin
      const updatedAdmin = await prisma.adminUser.update({
        where: { email },
        data: { passwordHash }
      });
      
      console.log('✅ Admin user password updated successfully!');
      console.log(`📧 Email: ${updatedAdmin.email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`👤 Role: ${updatedAdmin.role}`);
      console.log(`🆔 ID: ${updatedAdmin.id}`);
      
    } else {
      // Hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Create new admin user
      const newAdmin = await prisma.adminUser.create({
        data: {
          email,
          passwordHash,
          role
        }
      });
      
      console.log('✅ New admin user created successfully!');
      console.log(`📧 Email: ${newAdmin.email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`👤 Role: ${newAdmin.role}`);
      console.log(`🆔 ID: ${newAdmin.id}`);
    }
    
    // List all admin users
    console.log('\n📋 All admin users in database:');
    const allAdmins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (${admin.role}) - Created: ${admin.createdAt.toISOString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Test password hashing
async function testPasswordHash() {
  const password = 'password';
  const hash = await bcrypt.hash(password, 10);
  const isValid = await bcrypt.compare(password, hash);
  
  console.log('\n🧪 Password hashing test:');
  console.log(`Original password: ${password}`);
  console.log(`Generated hash: ${hash}`);
  console.log(`Hash validation: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
}

if (require.main === module) {
  createAdminUser()
    .then(() => testPasswordHash())
    .then(() => {
      console.log('\n🎉 Admin user creation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to create admin user:', error);
      process.exit(1);
    });
}

module.exports = { createAdminUser };