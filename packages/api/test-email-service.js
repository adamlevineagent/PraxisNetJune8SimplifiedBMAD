#!/usr/bin/env node

/**
 * Direct test of email service functionality
 * Tests the email sending without needing the API server
 */

require('dotenv').config();

// Mock the ConfigService
class MockConfigService {
  get(key) {
    return process.env[key];
  }
}

// Import the email service class directly
const { EmailService } = require('./dist/email/email.service');

async function testEmailService() {
  console.log('\n📧 Direct Email Service Test for Issue #8');
  console.log('='.repeat(50));

  // Create email service instance
  const configService = new MockConfigService();
  const emailService = new EmailService(configService);

  console.log('\nConfiguration:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`- SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? 'Set ✅' : 'Not set ⚠️'}`);
  console.log(`- EMAIL_FROM: ${process.env.EMAIL_FROM || 'noreply@praxisnetwork.ai'}`);

  // Test data
  const testUser = {
    email: 'test@example.com',
    handle: 'testuser'
  };

  try {
    console.log('\n1. Testing sendWelcomeEmail()...');
    await emailService.sendWelcomeEmail(testUser);
    console.log('✅ Welcome email sent/logged successfully');

    console.log('\n2. Testing sendNeedsInfoEmail()...');
    const feedback = 'Please provide more details about your current projects and collaboration goals.';
    await emailService.sendNeedsInfoEmail(testUser, feedback);
    console.log('✅ Needs info email sent/logged successfully');

    console.log('\n3. Testing sendMorningReport()...');
    const opportunities = [
      {
        targetUser: 'alice',
        summary: 'Working on AI projects, looking for ML engineers',
        matchScore: 0.85
      },
      {
        targetUser: 'bob',
        summary: 'Building a startup, needs technical co-founder',
        matchScore: 0.72
      }
    ];
    await emailService.sendMorningReport(testUser, opportunities);
    console.log('✅ Morning report email sent/logged successfully');

    console.log('\n✅ All email templates tested successfully!');
    console.log('\nNote: In development mode, emails are logged to console.');
    console.log('Set SENDGRID_API_KEY and NODE_ENV=production for actual sending.');

  } catch (error) {
    console.error('\n❌ Error testing email service:', error.message);
    console.error(error.stack);
  }
}

// Check if the compiled email service exists
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist/email/email.service.js');
if (!fs.existsSync(distPath)) {
  console.error('❌ Email service not compiled. Run "npm run build" first.');
  process.exit(1);
}

testEmailService();