import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

interface EmailTemplate {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      console.log('✅ SendGrid configured with API key');
    } else {
      console.log('⚠️  SendGrid API key not set - emails will be logged only');
    }
  }

  async sendEmail(template: EmailTemplate): Promise<void> {
    const from = this.configService.get<string>('EMAIL_FROM') || 'noreply@praxisnetwork.ai';
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    const hasApiKey = !!this.configService.get<string>('SENDGRID_API_KEY');

    if (isDevelopment || !hasApiKey) {
      // In development or without API key, just log the email
      console.log('📧 Email would be sent:', {
        to: template.to,
        from,
        subject: template.subject,
        preview: template.text.substring(0, 100) + '...',
      });
      if (!isDevelopment && !hasApiKey) {
        console.warn('⚠️  Production mode but no SendGrid API key - email not sent!');
      }
      return;
    }

    const msg = {
      to: template.to,
      from,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${template.to}`);
    } catch (error) {
      console.error('Email send failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user: { email: string; handle: string }): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: 'Welcome to Praxis Network - Your Account is Approved!',
      text: `
        Welcome to Praxis Network, ${user.handle}!
        
        Your account has been approved and you're now part of our community of builders and innovators.
        
        What happens next?
        - Your AI agent will participate in nightly conversations starting tonight
        - You'll receive morning reports with potential collaboration opportunities
        - You can update your Professional Essence anytime from your profile
        
        Tips for success:
        - Keep your Professional Essence up to date with your current projects
        - Be specific about what you're seeking and offering
        - Check your morning reports for interesting connections
        
        Questions? Reply to this email and we'll help you out.
        
        Happy networking!
        The Praxis Network Team
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00ff00; font-family: 'Courier New', monospace;">Welcome to Praxis Network</h1>
          <p>Hi ${user.handle},</p>
          <p>Your account has been <strong>approved</strong> and you're now part of our community of builders and innovators.</p>
          
          <h2 style="color: #333; font-size: 18px;">What happens next?</h2>
          <ul>
            <li>Your AI agent will participate in nightly conversations starting tonight</li>
            <li>You'll receive morning reports with potential collaboration opportunities</li>
            <li>You can update your Professional Essence anytime from your profile</li>
          </ul>
          
          <h2 style="color: #333; font-size: 18px;">Tips for success</h2>
          <ul>
            <li>Keep your Professional Essence up to date with your current projects</li>
            <li>Be specific about what you're seeking and offering</li>
            <li>Check your morning reports for interesting connections</li>
          </ul>
          
          <p style="margin-top: 30px; color: #666;">Questions? Reply to this email and we'll help you out.</p>
          
          <p style="margin-top: 20px;">Happy networking!<br>The Praxis Network Team</p>
        </div>
      `,
    };

    await this.sendEmail(template);
  }

  async sendNeedsInfoEmail(
    user: { email: string; handle: string },
    feedback: string
  ): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: 'Praxis Network - Additional Information Needed',
      text: `
        Hi ${user.handle},
        
        Thank you for completing your Praxis Network profile. Our admin team has reviewed your Professional Essence and would like some additional information to ensure the best networking experience.
        
        Feedback from our team:
        ${feedback}
        
        To update your Professional Essence:
        1. Log in to your account
        2. Go to your profile
        3. Click "Edit Professional Essence"
        4. Make the requested updates
        5. Save your changes
        
        Your profile will be automatically re-submitted for review once you make these updates.
        
        If you have any questions, please don't hesitate to reach out.
        
        Best regards,
        The Praxis Network Team
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00ff00; font-family: 'Courier New', monospace;">Additional Information Needed</h1>
          <p>Hi ${user.handle},</p>
          <p>Thank you for completing your Praxis Network profile. Our admin team has reviewed your Professional Essence and would like some additional information to ensure the best networking experience.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Feedback from our team:</h3>
            <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
          </div>
          
          <h2 style="color: #333; font-size: 18px;">To update your Professional Essence:</h2>
          <ol>
            <li>Log in to your account</li>
            <li>Go to your profile</li>
            <li>Click "Edit Professional Essence"</li>
            <li>Make the requested updates</li>
            <li>Save your changes</li>
          </ol>
          
          <p>Your profile will be automatically re-submitted for review once you make these updates.</p>
          
          <p style="margin-top: 30px; color: #666;">If you have any questions, please don't hesitate to reach out.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>The Praxis Network Team</p>
        </div>
      `,
    };

    await this.sendEmail(template);
  }

  async sendMorningReport(
    user: { email: string; handle: string },
    opportunities: Array<{
      targetUser: string;
      summary: string;
      matchScore: number;
    }>
  ): Promise<void> {
    const opportunitiesList = opportunities
      .map((opp, index) => 
        `${index + 1}. ${opp.targetUser} (${Math.round(opp.matchScore * 100)}% match)\n   ${opp.summary}`
      )
      .join('\n\n');

    const template: EmailTemplate = {
      to: user.email,
      subject: `Morning Report: ${opportunities.length} New Opportunities`,
      text: `
        Good morning ${user.handle}!
        
        Your Praxis agent discovered ${opportunities.length} potential collaboration opportunities last night.
        
        ${opportunitiesList}
        
        To express interest in any of these opportunities, click the links in the HTML version of this email or log in to your dashboard.
        
        Have a productive day!
        Your Praxis Agent
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00ff00; font-family: 'Courier New', monospace;">Morning Report</h1>
          <p>Good morning ${user.handle}!</p>
          <p>Your Praxis agent discovered <strong>${opportunities.length}</strong> potential collaboration opportunities last night.</p>
          
          ${opportunities.map((opp, index) => `
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${index + 1}. ${opp.targetUser}</h3>
              <div style="display: inline-block; background: #00ff00; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 10px;">
                ${Math.round(opp.matchScore * 100)}% match
              </div>
              <p style="margin: 10px 0;">${opp.summary}</p>
              <a href="${process.env.FRONTEND_URL}/opportunities" style="display: inline-block; background: #000; color: #00ff00; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: 'Courier New', monospace;">
                Express Interest →
              </a>
            </div>
          `).join('')}
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Have a productive day!<br>
            Your Praxis Agent
          </p>
        </div>
      `,
    };

    await this.sendEmail(template);
  }

  async sendIntroductionEmail(
    user1: { email: string; handle: string },
    user2: { email: string; handle: string },
    context: string
  ): Promise<void> {
    const template: EmailTemplate = {
      to: user1.email,
      subject: `Introduction: Meet ${user2.handle}`,
      text: `
        Hi ${user1.handle},
        
        Great news! You and ${user2.handle} have expressed mutual interest in connecting.
        
        Context from your AI agents' conversation:
        ${context}
        
        ${user2.handle}'s email: ${user2.email}
        
        We'll let you take it from here. Happy collaborating!
        
        Best,
        The Praxis Network Team
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00ff00; font-family: 'Courier New', monospace;">Introduction: Meet ${user2.handle}</h1>
          <p>Hi ${user1.handle},</p>
          <p>Great news! You and <strong>${user2.handle}</strong> have expressed mutual interest in connecting.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Context from your AI agents' conversation:</h3>
            <p style="margin: 0;">${context}</p>
          </div>
          
          <div style="background: #000; color: #00ff00; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: 'Courier New', monospace;">
            <strong>${user2.handle}'s email:</strong> ${user2.email}
          </div>
          
          <p>We'll let you take it from here. Happy collaborating!</p>
          
          <p style="margin-top: 30px;">Best,<br>The Praxis Network Team</p>
        </div>
      `,
    };

    await this.sendEmail(template);
  }
}